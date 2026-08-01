import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Reserva confirmada — Once FC",
  robots: { index: false, follow: false },
};

export default async function CheckoutExitoPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  const sessionId = searchParams.session_id;

  const reserva = sessionId
    ? await prisma.reserva.findUnique({
        where: { stripeCheckoutSessionId: sessionId },
        include: { sesion: { include: { sede: true } } },
      })
    : null;

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-coal-deep px-6 py-16 text-bone">
      <div className="pointer-events-none absolute inset-0 bg-grid-lines" aria-hidden="true" />
      <div className="relative max-w-md text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-volt">Pago recibido</p>
        <h1 className="mt-3 font-display text-4xl">¡Reserva en camino!</h1>
        <p className="mt-4 font-body text-sm text-bone/70">
          {reserva
            ? `Tu lugar en "${reserva.sesion.title}" (${reserva.sesion.sede.name}) se confirma en cuanto Stripe termine de procesar el pago.`
            : "Tu pago se está procesando. Te avisaremos en cuanto se confirme tu lugar."}
        </p>
        <a
          href="/panel/cuenta"
          className="mt-8 inline-block rounded-sm bg-volt px-6 py-3 font-body text-sm font-semibold text-coal-deep transition hover:brightness-95"
        >
          Ir a mi cuenta
        </a>
      </div>
    </div>
  );
}
