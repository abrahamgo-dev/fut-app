import type { Prisma, ReservaStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getActiveCities, getCityBySlug } from "@/data/cities";
import { cancelReservaAsAdmin } from "./actions";

const STATUS_LABEL: Record<ReservaStatus, string> = {
  PENDING: "Pago pendiente",
  PAID: "Pagada",
  CANCELLED: "Cancelada",
  EXPIRED: "Expirada",
};

export default async function AdminReservasPage({
  searchParams,
}: {
  searchParams: { citySlug?: string; status?: string };
}) {
  const where: Prisma.ReservaWhereInput = {};
  if (searchParams.citySlug) where.sesion = { sede: { citySlug: searchParams.citySlug } };
  if (searchParams.status) where.status = searchParams.status as ReservaStatus;

  const reservas = await prisma.reserva.findMany({
    where,
    include: {
      user: { select: { name: true, email: true } },
      sesion: { include: { sede: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl text-bone">Todas las reservas</h1>
      <p className="text-sm text-bone/60">
        Reservas de sesiones pagadas por jugadores vía Stripe Checkout.
      </p>

      <form className="flex flex-wrap items-end gap-4">
        <label className="flex flex-col gap-1 text-sm text-bone/80">
          Ciudad
          <select
            name="citySlug"
            defaultValue={searchParams.citySlug ?? ""}
            className="rounded-sm border border-bone/20 bg-coal-deep px-3 py-2 text-bone"
          >
            <option value="">Todas</option>
            {getActiveCities().map((city) => (
              <option key={city.slug} value={city.slug}>
                {city.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm text-bone/80">
          Estado
          <select
            name="status"
            defaultValue={searchParams.status ?? ""}
            className="rounded-sm border border-bone/20 bg-coal-deep px-3 py-2 text-bone"
          >
            <option value="">Todos</option>
            <option value="PENDING">Pago pendiente</option>
            <option value="PAID">Pagada</option>
            <option value="CANCELLED">Cancelada</option>
            <option value="EXPIRED">Expirada</option>
          </select>
        </label>
        <button
          type="submit"
          className="rounded-sm border border-bone/20 px-4 py-2 text-sm font-medium text-bone/80 transition hover:border-volt hover:text-volt"
        >
          Filtrar
        </button>
      </form>

      {reservas.length === 0 ? (
        <p className="text-sm text-bone/60">No hay reservas con estos filtros.</p>
      ) : (
        <ul className="divide-y divide-bone/10 rounded-sm border border-bone/10">
          {reservas.map((reserva) => {
            const city = getCityBySlug(reserva.sesion.sede.citySlug);
            return (
              <li
                key={reserva.id}
                className="flex flex-wrap items-center justify-between gap-4 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-bone">
                    {reserva.user.name ?? reserva.user.email} · {reserva.sesion.title}
                  </p>
                  <p className="text-xs text-bone/50">
                    {reserva.sesion.sede.name}
                    {city ? `, ${city.name}` : ""} ·{" "}
                    {reserva.sesion.startsAt.toLocaleString("es-MX", {
                      dateStyle: "medium",
                      timeStyle: "short",
                      timeZone: "America/Mexico_City",
                    })}{" "}
                    ·{" "}
                    {(reserva.amountCents / 100).toLocaleString("es-MX", {
                      style: "currency",
                      currency: "MXN",
                    })}{" "}
                    · <span className="uppercase text-bone/40">{STATUS_LABEL[reserva.status]}</span>
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
            );
          })}
        </ul>
      )}
    </div>
  );
}
