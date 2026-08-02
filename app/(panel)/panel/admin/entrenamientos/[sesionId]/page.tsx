import { notFound } from "next/navigation";
import type { ReservaStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getCityBySlug } from "@/data/cities";
import { cancelReservaAsAdmin, createManualReserva } from "../actions";

const STATUS_LABEL: Record<ReservaStatus, string> = {
  PENDING: "Pago pendiente",
  PAID: "Pagada",
  CANCELLED: "Cancelada",
  EXPIRED: "Expirada",
};

const PAYMENT_METHOD_LABEL: Record<string, string> = {
  STRIPE: "Tarjeta (Stripe)",
  Efectivo: "Efectivo",
  Transferencia: "Transferencia",
  Tarjeta: "Tarjeta (en cancha)",
  Otro: "Otro",
};

const MANUAL_PAYMENT_METHODS = ["Efectivo", "Transferencia", "Tarjeta", "Otro"];

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
  const defaultAmount = sesion.priceCents ? sesion.priceCents / 100 : 0;

  return (
    <div className="space-y-8">
      <div>
        <a
          href="/panel/admin/entrenamientos"
          className="text-xs text-bone/50 transition hover:text-volt"
        >
          ← Sesiones
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
      </div>

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
                    {PAYMENT_METHOD_LABEL[reserva.paymentMethod] ?? reserva.paymentMethod} ·{" "}
                    <span className="uppercase text-bone/40">{STATUS_LABEL[reserva.status]}</span>
                  </p>
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
        <h2 className="mb-4 font-display text-lg text-bone">Agregar inscripción manual</h2>
        <p className="mb-4 max-w-lg text-sm text-bone/60">
          Para pagos que recibiste fuera de Stripe (efectivo, transferencia, en cancha). Se
          registra directamente como pagada.
        </p>

        <form action={createManualReserva} className="grid max-w-md gap-4">
          <input type="hidden" name="sesionId" value={sesion.id} />

          <label className="flex flex-col gap-1 text-sm text-bone/80">
            Jugador existente (opcional)
            <select
              name="userId"
              defaultValue=""
              className="rounded-sm border border-bone/20 bg-coal-deep px-3 py-2 text-bone"
            >
              <option value="">— Nuevo jugador —</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name ?? user.email ?? user.id}
                  {user.email ? ` (${user.email})` : ""}
                </option>
              ))}
            </select>
          </label>

          <p className="text-xs text-bone/40">
            Si el jugador no tiene cuenta todavía, déjalo en “Nuevo jugador” y llena su nombre
            (y correo, si lo tienes) abajo.
          </p>

          <div className="flex gap-4">
            <label className="flex flex-1 flex-col gap-1 text-sm text-bone/80">
              Nombre (nuevo jugador)
              <input
                type="text"
                name="name"
                placeholder="Nombre y apellido"
                className="rounded-sm border border-bone/20 bg-coal-deep px-3 py-2 text-bone placeholder:text-bone/30"
              />
            </label>
            <label className="flex flex-1 flex-col gap-1 text-sm text-bone/80">
              Correo (opcional)
              <input
                type="email"
                name="email"
                placeholder="jugador@correo.com"
                className="rounded-sm border border-bone/20 bg-coal-deep px-3 py-2 text-bone placeholder:text-bone/30"
              />
            </label>
          </div>

          <div className="flex gap-4">
            <label className="flex flex-1 flex-col gap-1 text-sm text-bone/80">
              Método de pago
              <select
                name="paymentMethod"
                required
                defaultValue=""
                className="rounded-sm border border-bone/20 bg-coal-deep px-3 py-2 text-bone"
              >
                <option value="" disabled>
                  Elige uno
                </option>
                {MANUAL_PAYMENT_METHODS.map((method) => (
                  <option key={method} value={method}>
                    {PAYMENT_METHOD_LABEL[method] ?? method}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-1 flex-col gap-1 text-sm text-bone/80">
              Monto pagado (MXN)
              <input
                type="number"
                name="amount"
                min={0}
                step={0.01}
                defaultValue={defaultAmount || undefined}
                className="rounded-sm border border-bone/20 bg-coal-deep px-3 py-2 text-bone"
              />
            </label>
          </div>

          <button
            type="submit"
            className="rounded-sm bg-volt px-4 py-2 text-sm font-semibold text-coal-deep transition hover:bg-bone"
          >
            Registrar inscripción
          </button>
        </form>
      </section>
    </div>
  );
}
