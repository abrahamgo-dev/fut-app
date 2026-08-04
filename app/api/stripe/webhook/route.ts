import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: "STRIPE_WEBHOOK_SECRET no configurado." }, { status: 500 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Falta la firma de Stripe." }, { status: 400 });
  }

  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Firma inválida." }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded": {
      const session = event.data.object as Stripe.Checkout.Session;
      const reservaId = session.metadata?.reservaId;
      if (reservaId) {
        // Capture the payment_intent id now — refunding later needs it, and
        // it's only available once payment actually completes.
        const paymentIntentId =
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : (session.payment_intent?.id ?? null);

        // Only PENDING -> PAID. updateMany instead of update so a stale/unknown
        // reservaId (replayed webhook, wiped dev DB) is a no-op instead of a
        // throw — an uncaught throw here returns 500, and Stripe retrying a
        // permanently-failing webhook for days can end with it auto-disabling
        // the endpoint, silently breaking every future payment confirmation.
        // Restricting to `status: "PENDING"` also stops a delayed webhook from
        // resurrecting a reserva an admin already cancelled in the meantime.
        await prisma.reserva.updateMany({
          where: { id: reservaId, status: "PENDING" },
          data: { status: "PAID", stripePaymentIntentId: paymentIntentId },
        });
      }
      break;
    }
    case "checkout.session.expired":
    case "checkout.session.async_payment_failed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const reservaId = session.metadata?.reservaId;
      if (reservaId) {
        // Only PENDING -> EXPIRED, so an out-of-order/duplicate delivery can
        // never downgrade an already-PAID reserva.
        await prisma.reserva.updateMany({
          where: { id: reservaId, status: "PENDING" },
          data: { status: "EXPIRED" },
        });
      }
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
