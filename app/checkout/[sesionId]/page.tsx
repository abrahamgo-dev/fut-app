import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  requireSession,
  isProfileComplete,
  PROFILE_COMPLETION_PATH,
} from "@/lib/auth-guards";
import { getStripe } from "@/lib/stripe";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

type Props = {
  params: { sesionId: string };
};

class ReservationConflictError extends Error {
  constructor(public reason: "EXISTING" | "FULL") {
    super(reason);
  }
}

// Fails loudly in production instead of silently pointing Stripe's
// success/cancel redirects at localhost if AUTH_URL is ever missing.
function getCheckoutOrigin(): string {
  if (process.env.AUTH_URL) return process.env.AUTH_URL;
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "AUTH_URL no está configurado en producción — no se puede armar la URL de éxito/cancelación de Stripe.",
    );
  }
  return "http://localhost:3000";
}

// GET route (not a form action) so it can be used as a login callbackUrl:
// unauthenticated visitors land here after signing in and immediately
// continue into Stripe Checkout, instead of bouncing back to the event page.
export default async function CheckoutPage({ params }: Props) {
  const session = await requireSession(`/checkout/${params.sesionId}`);

  // Checkout lives outside the (panel) route group, so it doesn't get the
  // mandatory-profile gate from app/(panel)/layout.tsx for free — enforce it
  // here too, otherwise someone can pay without ever giving us phone/municipio.
  if (!(await isProfileComplete(session.user.id))) {
    redirect(
      `${PROFILE_COMPLETION_PATH}?onboarding=1&callbackUrl=${encodeURIComponent(
        `/checkout/${params.sesionId}`,
      )}`,
    );
  }

  const sesion = await prisma.sesion.findUnique({
    where: { id: params.sesionId },
    include: { sede: true },
  });

  if (!sesion || !sesion.active || sesion.startsAt < new Date()) {
    redirect(`/eventos/${params.sesionId}`);
  }

  const amountCents = sesion.priceCents ?? 0;
  if (amountCents <= 0) {
    redirect(`/eventos/${params.sesionId}`);
  }

  // Fail before writing anything if Stripe isn't configured, or AUTH_URL is
  // missing in production.
  const stripe = getStripe();
  const origin = getCheckoutOrigin();

  // A GET page like this one can be hit more than once for the same user —
  // link prefetching, a bot fetching the URL, a double click, hitting back
  // and revisiting. The transaction below re-checks for an existing
  // reservation and re-checks capacity atomically (Serializable isolation)
  // right before creating the row, so two concurrent requests for the last
  // spot can't both succeed.
  let reserva;
  try {
    reserva = await prisma.$transaction(
      async (tx) => {
        const existing = await tx.reserva.findFirst({
          where: {
            sesionId: sesion.id,
            userId: session.user.id,
            status: { in: ["PENDING", "PAID"] },
          },
        });
        if (existing) throw new ReservationConflictError("EXISTING");

        if (sesion.capacity != null) {
          const takenCount = await tx.reserva.count({
            where: { sesionId: sesion.id, status: { in: ["PENDING", "PAID"] } },
          });
          if (takenCount >= sesion.capacity) {
            throw new ReservationConflictError("FULL");
          }
        }

        return tx.reserva.create({
          data: {
            userId: session.user.id,
            sesionId: sesion.id,
            amountCents,
            status: "PENDING",
          },
        });
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );
  } catch (err) {
    if (err instanceof ReservationConflictError) {
      redirect(
        `/eventos/${sesion.id}?reserva=${err.reason === "FULL" ? "full" : "existing"}`,
      );
    }
    // Most likely a serialization write-conflict from a concurrent checkout
    // for the same session — ask the user to retry rather than crashing.
    redirect(`/eventos/${sesion.id}?reserva=retry`);
  }

  let checkoutUrl: string;
  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: session.user.email ?? undefined,
      line_items: [
        {
          price_data: {
            currency: "mxn",
            product_data: {
              name: sesion.title,
              description: `${sesion.sede.name} · ${sesion.startsAt.toLocaleString(
                "es-MX",
                {
                  timeZone: "America/Mexico_City",
                  dateStyle: "medium",
                  timeStyle: "short",
                },
              )}`,
            },
            unit_amount: amountCents,
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/checkout/exito?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/eventos/${sesion.id}`,
      metadata: {
        reservaId: reserva.id,
        sesionId: sesion.id,
        userId: session.user.id,
      },
    });

    if (!checkoutSession.url) {
      throw new Error("Stripe no devolvió una URL de checkout.");
    }

    await prisma.reserva.update({
      where: { id: reserva.id },
      data: { stripeCheckoutSessionId: checkoutSession.id },
    });

    checkoutUrl = checkoutSession.url;
  } catch {
    // Nothing was ever charged — don't leave an orphaned PENDING reserva
    // occupying a capacity slot with no Stripe session to expire it.
    await prisma.reserva.delete({ where: { id: reserva.id } }).catch(() => {});
    redirect(`/eventos/${sesion.id}?reserva=error`);
  }

  redirect(checkoutUrl);
}
