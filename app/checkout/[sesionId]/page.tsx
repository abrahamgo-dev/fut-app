import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth-guards";
import { getStripe } from "@/lib/stripe";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

type Props = {
  params: { sesionId: string };
};

// GET route (not a form action) so it can be used as a login callbackUrl:
// unauthenticated visitors land here after signing in and immediately
// continue into Stripe Checkout, instead of bouncing back to the event page.
export default async function CheckoutPage({ params }: Props) {
  const session = await requireSession(`/checkout/${params.sesionId}`);

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

  // Fail before writing anything if Stripe isn't configured yet.
  const stripe = getStripe();

  const origin = process.env.AUTH_URL ?? "http://localhost:3000";

  const reserva = await prisma.reserva.create({
    data: {
      userId: session.user.id,
      sesionId: sesion.id,
      amountCents,
      status: "PENDING",
    },
  });

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

  await prisma.reserva.update({
    where: { id: reserva.id },
    data: { stripeCheckoutSessionId: checkoutSession.id },
  });

  redirect(checkoutSession.url!);
}
