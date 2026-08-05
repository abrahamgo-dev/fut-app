import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

function toGoogleCalendarDate(date: Date): string {
  return date
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z");
}

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

  const googleCalendarUrl = reserva
    ? (() => {
        const startsAt = reserva.sesion.startsAt;
        const endsAt = new Date(
          startsAt.getTime() +
            Math.max(reserva.sesion.durationMinutes ?? 60, 1) * 60_000,
        );

        const params = new URLSearchParams({
          action: "TEMPLATE",
          text: `Entrenamiento Once FC: ${reserva.sesion.title}`,
          dates: `${toGoogleCalendarDate(startsAt)}/${toGoogleCalendarDate(endsAt)}`,
          details: [
            `Sesión: ${reserva.sesion.title}`,
            reserva.sesion.description
              ? `Detalles: ${reserva.sesion.description}`
              : null,
            "Nos vemos en cancha. Llega 10 minutos antes.",
          ]
            .filter(Boolean)
            .join("\n"),
          location: `${reserva.sesion.sede.name} - ${reserva.sesion.sede.address}`,
        });

        return `https://calendar.google.com/calendar/render?${params.toString()}`;
      })()
    : null;

  const icsUrl = sessionId
    ? reserva?.status === "PAID"
      ? `/api/calendar/ics?session_id=${encodeURIComponent(sessionId)}`
      : null
    : null;

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-coal-deep px-6 py-16 text-bone">
      <div
        className="pointer-events-none absolute inset-0 bg-grid-lines"
        aria-hidden="true"
      />
      <div className="relative max-w-md text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-volt">
          Pago recibido
        </p>
        <h1 className="mt-3 font-display text-4xl">¡Reserva en camino!</h1>
        <p className="mt-4 font-body text-sm text-bone/70">
          {reserva
            ? `Tu lugar en "${reserva.sesion.title}" (${reserva.sesion.sede.name}) se confirma en cuanto Stripe termine de procesar el pago.`
            : "Tu pago se está procesando. Te avisaremos en cuanto se confirme tu lugar."}
        </p>
        {googleCalendarUrl ? (
          <a
            href={googleCalendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block rounded-sm border border-bone/30 px-6 py-3 font-body text-sm font-semibold text-bone transition hover:border-volt hover:text-volt"
          >
            Agregar a Google Calendar
          </a>
        ) : null}
        {icsUrl ? (
          <a
            href={icsUrl}
            className="mt-3 inline-block rounded-sm border border-bone/30 px-6 py-3 font-body text-sm font-semibold text-bone transition hover:border-volt hover:text-volt"
          >
            Descargar .ics
          </a>
        ) : null}
        {reserva?.status && reserva.status !== "PAID" ? (
          <p className="mt-3 font-body text-xs text-bone/60">
            Cuando el pago se confirme, podrás descargar tu archivo de
            calendario (.ics).
          </p>
        ) : null}
        <a
          href="/panel/cuenta"
          className="mt-4 inline-block rounded-sm bg-volt px-6 py-3 font-body text-sm font-semibold text-coal-deep transition hover:brightness-95"
        >
          Ir a mi cuenta
        </a>
      </div>
    </div>
  );
}
