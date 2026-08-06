"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-guards";
import { getStripe } from "@/lib/stripe";
import { getCancelRefundDeadline } from "./refund-deadline";

const PHONE_PATTERN = /^[0-9+()\-\s]{7,20}$/;

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
  const phone = String(formData.get("phone") ?? "").trim();
  const municipio = String(formData.get("municipio") ?? "").trim();
  const paymentMethod = String(formData.get("paymentMethod") ?? "").trim();
  const amountRaw = String(formData.get("amount") ?? "").trim();

  if (!sesionId || !paymentMethod) return;

  let userId = existingUserId;
  if (!userId) {
    // A brand-new player registered here never goes through the mandatory
    // profile step (/panel/cuenta/perfil), so require the same fields here
    // too — otherwise they end up "subscribed" with no phone/municipio,
    // same bug as the Stripe checkout bypass this mirrors.
    if (!name || !phone || !municipio || !PHONE_PATTERN.test(phone)) return;
    const user = email
      ? await prisma.user.upsert({
          where: { email },
          update: { name, phone, municipio },
          create: { email, name, phone, municipio, role: "USER" },
        })
      : await prisma.user.create({ data: { name, phone, municipio, role: "USER" } });
    userId = user.id;
  }

  const parsedAmount = Number(amountRaw);
  const amountCents =
    amountRaw && Number.isFinite(parsedAmount) && parsedAmount >= 0
      ? Math.round(parsedAmount * 100)
      : 0;

  try {
    await prisma.reserva.create({
      data: {
        userId,
        sesionId,
        status: "PAID",
        amountCents,
        paymentMethod,
      },
    });
  } catch (err) {
    // That user already has an active (PENDING/PAID) reserva for this sesion
    // — the DB's partial unique index rejects the insert. Nothing to do:
    // they're already booked, so there's no manual payment left to register.
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      revalidatePath("/panel/admin/entrenamientos", "layout");
      return;
    }
    throw err;
  }

  revalidatePath("/panel/admin/entrenamientos", "layout");
}

export type CancelSesionRefundResult = {
  error?: string;
  refunded?: number;
  failed?: number;
  failures?: { reservaId: string; userLabel: string; message: string }[];
};

// Cancels an entrenamiento and refunds every participant who paid through
// Stripe, in full. Safe to re-run: it only ever acts on rows still in
// PENDING/PAID, so retrying after a partial failure (e.g. one refund call
// timed out) just sweeps up whatever's left.
export async function cancelSesionAndRefund(
  _prevState: CancelSesionRefundResult,
  formData: FormData,
): Promise<CancelSesionRefundResult> {
  await requireRole(["ADMIN"]);

  const sesionId = String(formData.get("sesionId") ?? "").trim();
  const sesion = sesionId ? await prisma.sesion.findUnique({ where: { id: sesionId } }) : null;
  if (!sesion) return { error: "Entrenamiento no encontrado." };

  if (new Date() > getCancelRefundDeadline(sesion.startsAt)) {
    return {
      error:
        "Ya pasó el plazo de 7 días desde este entrenamiento para cancelar y reembolsar automáticamente. Hazlo manualmente desde el dashboard de Stripe.",
    };
  }

  await prisma.sesion.update({
    where: { id: sesion.id },
    data: { cancelledAt: sesion.cancelledAt ?? new Date(), active: false },
  });

  const stripe = getStripe();

  // Anyone mid-checkout for a class that's now cancelled: void their live
  // Stripe Checkout Session so they can't pay for a class that no longer
  // happens, and drop their reserva.
  const pendingReservas = await prisma.reserva.findMany({
    where: { sesionId: sesion.id, status: "PENDING" },
  });
  for (const reserva of pendingReservas) {
    if (reserva.stripeCheckoutSessionId) {
      await stripe.checkout.sessions
        .expire(reserva.stripeCheckoutSessionId)
        .catch(() => {});
    }
  }
  await prisma.reserva.updateMany({
    where: { sesionId: sesion.id, status: "PENDING" },
    data: { status: "CANCELLED" },
  });

  const paidReservas = await prisma.reserva.findMany({
    where: { sesionId: sesion.id, status: "PAID" },
    include: { user: { select: { name: true, email: true } } },
  });

  let refunded = 0;
  const failures: { reservaId: string; userLabel: string; message: string }[] = [];

  for (const reserva of paidReservas) {
    const userLabel = reserva.user.name ?? reserva.user.email ?? reserva.userId;

    if (!reserva.stripePaymentIntentId) {
      // Never actually went through Stripe (a manual/offline payment
      // recorded via "Agregar inscripción manual") — nothing to refund
      // through Stripe. Refund/settle that one directly with the player.
      failures.push({
        reservaId: reserva.id,
        userLabel,
        message:
          reserva.paymentMethod === "STRIPE"
            ? "No tiene payment_intent registrado — revísalo manualmente en Stripe."
            : `Pago manual (${reserva.paymentMethod}) — no hay cargo de Stripe que reembolsar, arréglalo directo con el jugador.`,
      });
      continue;
    }

    try {
      const refund = await stripe.refunds.create({
        payment_intent: reserva.stripePaymentIntentId,
      });
      await prisma.reserva.update({
        where: { id: reserva.id },
        data: { status: "REFUNDED", stripeRefundId: refund.id, refundedAt: new Date() },
      });
      refunded += 1;
    } catch (err) {
      failures.push({
        reservaId: reserva.id,
        userLabel,
        message: err instanceof Error ? err.message : "Error desconocido de Stripe.",
      });
    }
  }

  revalidatePath("/panel/admin/entrenamientos", "layout");
  revalidatePath(`/eventos/${sesion.id}`);

  return { refunded, failed: failures.length, failures };
}
