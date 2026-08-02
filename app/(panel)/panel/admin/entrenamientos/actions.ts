"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-guards";

export async function cancelReservaAsAdmin(reservaId: string) {
  await requireRole(["ADMIN"]);

  // Marks our record as cancelled — doesn't issue a Stripe refund automatically.
  // Do that from the Stripe dashboard if the reserva was PAID.
  await prisma.reserva.updateMany({
    where: { id: reservaId, status: { in: ["PENDING", "PAID"] } },
    data: { status: "CANCELLED" },
  });

  revalidatePath("/panel/admin/entrenamientos", "layout");
}

// Registers an offline/manual payment (cash, transfer, etc.) an admin took
// outside Stripe — e.g. a walk-in player at the field. Marked PAID directly
// since the money already changed hands by the time this form is submitted.
export async function createManualReserva(formData: FormData) {
  await requireRole(["ADMIN"]);

  const sesionId = String(formData.get("sesionId") ?? "").trim();
  const existingUserId = String(formData.get("userId") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const paymentMethod = String(formData.get("paymentMethod") ?? "").trim();
  const amountRaw = String(formData.get("amount") ?? "").trim();

  if (!sesionId || !paymentMethod) return;

  let userId = existingUserId;
  if (!userId) {
    if (!name) return;
    const user = email
      ? await prisma.user.upsert({
          where: { email },
          update: { name },
          create: { email, name, role: "USER" },
        })
      : await prisma.user.create({ data: { name, role: "USER" } });
    userId = user.id;
  }

  const parsedAmount = Number(amountRaw);
  const amountCents =
    amountRaw && Number.isFinite(parsedAmount) && parsedAmount >= 0
      ? Math.round(parsedAmount * 100)
      : 0;

  await prisma.reserva.create({
    data: {
      userId,
      sesionId,
      status: "PAID",
      amountCents,
      paymentMethod,
    },
  });

  revalidatePath("/panel/admin/entrenamientos", "layout");
}
