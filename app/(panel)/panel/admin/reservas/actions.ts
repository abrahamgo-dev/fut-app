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

  revalidatePath("/panel/admin/reservas");
}
