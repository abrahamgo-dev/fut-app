import type { BookingStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getActiveCities, getCityBySlug } from "@/data/cities";
import { cancelBookingAsAdmin } from "./actions";

export default async function AdminReservasPage({
  searchParams,
}: {
  searchParams: { citySlug?: string; status?: string };
}) {
  const where: Prisma.BookingWhereInput = {};
  if (searchParams.citySlug) where.citySlug = searchParams.citySlug;
  if (searchParams.status) where.status = searchParams.status as BookingStatus;

  const bookings = await prisma.booking.findMany({
    where,
    include: {
      user: { select: { name: true, email: true } },
      trainer: { select: { name: true, email: true } },
    },
    orderBy: { startsAt: "desc" },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl text-bone">Todas las reservas</h1>

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
            <option value="CONFIRMED">Confirmada</option>
            <option value="CANCELLED">Cancelada</option>
          </select>
        </label>
        <button
          type="submit"
          className="rounded-sm border border-bone/20 px-4 py-2 text-sm font-medium text-bone/80 transition hover:border-volt hover:text-volt"
        >
          Filtrar
        </button>
      </form>

      {bookings.length === 0 ? (
        <p className="text-sm text-bone/60">No hay reservas con estos filtros.</p>
      ) : (
        <ul className="divide-y divide-bone/10 rounded-sm border border-bone/10">
          {bookings.map((booking) => (
            <li
              key={booking.id}
              className="flex flex-wrap items-center justify-between gap-4 px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium text-bone">
                  {booking.user.name ?? booking.user.email} con{" "}
                  {booking.trainer.name ?? booking.trainer.email}
                </p>
                <p className="text-xs text-bone/50">
                  {getCityBySlug(booking.citySlug)?.name ?? booking.citySlug} ·{" "}
                  {booking.startsAt.toLocaleString("es-MX", {
                    dateStyle: "medium",
                    timeStyle: "short",
                    timeZone: "America/Mexico_City",
                  })}{" "}
                  <span className="uppercase text-bone/40">{booking.status}</span>
                </p>
              </div>
              {booking.status === "CONFIRMED" ? (
                <form
                  action={async () => {
                    "use server";
                    await cancelBookingAsAdmin(booking.id);
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
    </div>
  );
}
