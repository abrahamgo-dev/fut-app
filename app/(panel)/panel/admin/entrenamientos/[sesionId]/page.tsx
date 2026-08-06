import { notFound } from "next/navigation";
import type { ReservaStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getCityBySlug } from "@/data/cities";
import { cancelReservaAsAdmin } from "../actions";
import { getCancelRefundDeadline } from "../refund-deadline";
import CancelSesionForm from "./CancelSesionForm";
import ManualReservaForm from "./ManualReservaForm";

const STATUS_LABEL: Record<ReservaStatus, string> = {
  PENDING: "Pago pendiente",
  PAID: "Pagada",
  CANCELLED: "Cancelada",
  EXPIRED: "Expirada",
  REFUNDED: "Reembolsada",
};

const PAYMENT_METHOD_LABEL: Record<string, string> = {
  STRIPE: "Tarjeta (Stripe)",
  Efectivo: "Efectivo",
  Transferencia: "Transferencia",
  Tarjeta: "Tarjeta (en cancha)",
  Otro: "Otro",
};

export default async function AdminEntrenamientoDetailPage({
  params,
}: {
  params: { sesionId: string };
}) {
  const sesion = await prisma.sesion.findUnique({
    where: { id: params.sesionId },
    include: {
      sede: true,
      trainer: { select: { name: true, email: true } },
    },
  });
  if (!sesion) notFound();

  const [reservas, users] = await Promise.all([
    prisma.reserva.findMany({
      where: { sesionId: sesion.id },
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: "asc" },
    }),
    prisma.user.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, email: true },
    }),
  ]);

  const city = getCityBySlug(sesion.sede.citySlug);
  const paidCount = reservas.filter((r) => r.status === "PAID").length;
  const stripeRefundablePaidCount = reservas.filter(
    (r) => r.status === "PAID" && !!r.stripePaymentIntentId,
  ).length;
  const nonStripeRefundablePaidCount = paidCount - stripeRefundablePaidCount;
  const refundedCount = reservas.filter((r) => r.status === "REFUNDED").length;
  const defaultAmount = sesion.priceCents ? sesion.priceCents / 100 : 0;
  const isCancelled = sesion.cancelledAt != null;
  const isPastRefundDeadline =
    new Date() > getCancelRefundDeadline(sesion.startsAt);

  return (
    <div className="space-y-8">
      <div>
        <a
          href="/panel/admin/entrenamientos"
          className="text-xs text-bone/50 transition hover:text-volt"
        >
          ← Entrenamientos
        </a>
        <h1 className="mt-2 font-display text-2xl text-bone">{sesion.title}</h1>
        <p className="mt-1 text-sm text-bone/60">
          {sesion.trainer.name ?? sesion.trainer.email} · {sesion.sede.name}
          {city ? `, ${city.name}` : ""} ·{" "}
          {sesion.startsAt.toLocaleString("es-MX", {
            dateStyle: "medium",
            timeStyle: "short",
            timeZone: "America/Mexico_City",
          })}
        </p>
        <p className="mt-1 text-sm text-bone/60">
          {paidCount}
          {sesion.capacity ? ` / ${sesion.capacity}` : ""} pagadas ·{" "}
          {sesion.priceCents
            ? (sesion.priceCents / 100).toLocaleString("es-MX", {
                style: "currency",
                currency: "MXN",
              })
            : "Sin precio"}
        </p>
        {isCancelled ? (
          <p className="mt-1 font-mono text-xs uppercase tracking-widest text-red-400">
            Cancelado ·{" "}
            {sesion.cancelledAt!.toLocaleString("es-MX", {
              dateStyle: "medium",
              timeStyle: "short",
              timeZone: "America/Mexico_City",
            })}{" "}
            · {refundedCount} reembolsado{refundedCount === 1 ? "" : "s"}
          </p>
        ) : null}
      </div>

      <section>
        <h2 className="mb-4 font-display text-lg text-bone">
          {isCancelled ? "Cancelar y reembolsar" : "Cancelar entrenamiento"}
        </h2>
        {isPastRefundDeadline ? (
          <p className="max-w-lg rounded-sm border border-bone/20 bg-bone/5 px-4 py-3 text-sm text-bone/60">
            Ya pasó el plazo de 7 días desde este entrenamiento para cancelar y
            reembolsar automáticamente desde aquí. Hazlo manualmente desde el
            dashboard de Stripe.
          </p>
        ) : !isCancelled ? (
          <CancelSesionForm
            sesionId={sesion.id}
            paidCount={paidCount}
            isRetry={false}
          />
        ) : stripeRefundablePaidCount > 0 ? (
          <CancelSesionForm
            sesionId={sesion.id}
            paidCount={stripeRefundablePaidCount}
            isRetry
          />
        ) : (
          <p className="text-sm text-bone/60">
            {nonStripeRefundablePaidCount > 0
              ? `No hay reembolsos automáticos pendientes en Stripe. Quedan ${nonStripeRefundablePaidCount} pago${
                  nonStripeRefundablePaidCount === 1 ? "" : "s"
                } manual${nonStripeRefundablePaidCount === 1 ? "" : "es"} o de prueba (sin payment_intent).`
              : "Todos los pagos de este entrenamiento ya fueron reembolsados."}
          </p>
        )}
      </section>

      <section>
        <h2 className="mb-4 font-display text-lg text-bone">
          Jugadores anotados ({reservas.length})
        </h2>

        {reservas.length === 0 ? (
          <p className="text-sm text-bone/60">
            Todavía nadie se ha anotado a este entrenamiento.
          </p>
        ) : (
          <ul className="divide-y divide-bone/10 rounded-sm border border-bone/10">
            {reservas.map((reserva) => (
              <li
                key={reserva.id}
                className="flex flex-wrap items-center justify-between gap-4 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-bone">
                    {reserva.user.name ?? reserva.user.email ?? "Sin nombre"}
                  </p>
                  <p className="text-xs text-bone/50">
                    {reserva.user.email} ·{" "}
                    {(reserva.amountCents / 100).toLocaleString("es-MX", {
                      style: "currency",
                      currency: "MXN",
                    })}{" "}
                    ·{" "}
                    {PAYMENT_METHOD_LABEL[reserva.paymentMethod] ??
                      reserva.paymentMethod}{" "}
                    ·{" "}
                    <span className="uppercase text-bone/40">
                      {STATUS_LABEL[reserva.status]}
                    </span>
                  </p>
                  {reserva.status === "PAID" &&
                  !reserva.stripePaymentIntentId ? (
                    <p className="mt-1 text-[11px] text-amber-300">
                      Manual / prueba: sin payment_intent de Stripe
                    </p>
                  ) : null}
                </div>
                {reserva.status === "PENDING" || reserva.status === "PAID" ? (
                  <form
                    action={async () => {
                      "use server";
                      await cancelReservaAsAdmin(reserva.id);
                    }}
                  >
                    <button
                      type="submit"
                      className="rounded-sm border border-bone/20 px-3 py-1.5 text-xs font-medium text-bone/70 transition hover:border-red-400 hover:text-red-400"
                    >
                      Cancelar
                    </button>
                  </form>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="mb-4 font-display text-lg text-bone">
          Agregar inscripción manual
        </h2>
        {isCancelled ? (
          <p className="max-w-lg text-sm text-bone/60">
            Este entrenamiento está cancelado — no se pueden agregar más
            inscripciones.
          </p>
        ) : (
          <>
            <p className="mb-4 max-w-lg text-sm text-bone/60">
              Para pagos que recibiste fuera de Stripe (efectivo, transferencia,
              en cancha). Se registra directamente como pagada.
            </p>

            <ManualReservaForm
              sesionId={sesion.id}
              users={users}
              defaultAmount={defaultAmount}
            />
          </>
        )}
      </section>
    </div>
  );
}
