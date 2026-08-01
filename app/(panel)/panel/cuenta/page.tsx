import { requireSession } from "@/lib/auth-guards";
import { prisma } from "@/lib/prisma";
import { getCityBySlug } from "@/data/cities";
import { cancelMyBooking } from "./actions";

export default async function CuentaPage() {
  const session = await requireSession();

  const [upcoming, past, reservas] = await Promise.all([
    prisma.booking.findMany({
      where: { userId: session.user.id, status: "CONFIRMED", startsAt: { gte: new Date() } },
      include: { trainer: { select: { name: true, email: true } } },
      orderBy: { startsAt: "asc" },
    }),
    prisma.booking.findMany({
      where: {
        userId: session.user.id,
        OR: [{ status: "CANCELLED" }, { startsAt: { lt: new Date() } }],
      },
      include: { trainer: { select: { name: true, email: true } } },
      orderBy: { startsAt: "desc" },
      take: 10,
    }),
    prisma.reserva.findMany({
      where: { userId: session.user.id },
      include: { sesion: { include: { sede: true } } },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  const RESERVA_STATUS_LABEL: Record<string, string> = {
    PENDING: "Pago pendiente",
    PAID: "Pagada",
    CANCELLED: "Cancelada",
    EXPIRED: "Expirada",
  };

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-bone">Mi cuenta</h1>
        <a
          href="/reservar"
          className="rounded-sm bg-volt px-4 py-2 text-sm font-semibold text-coal-deep transition hover:bg-bone"
        >
          Reservar sesión
        </a>
      </div>

      <section>
        <h2 className="mb-4 font-display text-lg text-bone">Tus reservas de eventos</h2>
        {reservas.length === 0 ? (
          <p className="text-sm text-bone/60">Todavía no has reservado ninguna sesión pagada.</p>
        ) : (
          <ul className="divide-y divide-bone/10 rounded-sm border border-bone/10">
            {reservas.map((reserva) => (
              <li
                key={reserva.id}
                className="flex flex-wrap items-center justify-between gap-4 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-bone">{reserva.sesion.title}</p>
                  <p className="text-xs text-bone/50">
                    {reserva.sesion.sede.name} ·{" "}
                    {reserva.sesion.startsAt.toLocaleString("es-MX", {
                      dateStyle: "medium",
                      timeStyle: "short",
                      timeZone: "America/Mexico_City",
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-bone/80">
                    {(reserva.amountCents / 100).toLocaleString("es-MX", {
                      style: "currency",
                      currency: "MXN",
                    })}
                  </p>
                  <p className="font-mono text-[11px] uppercase tracking-widest text-bone/40">
                    {RESERVA_STATUS_LABEL[reserva.status] ?? reserva.status}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="mb-4 font-display text-lg text-bone">Próximas sesiones 1 a 1</h2>
        {upcoming.length === 0 ? (
          <p className="text-sm text-bone/60">No tienes sesiones reservadas.</p>
        ) : (
          <ul className="divide-y divide-bone/10 rounded-sm border border-bone/10">
            {upcoming.map((booking) => (
              <li
                key={booking.id}
                className="flex flex-wrap items-center justify-between gap-4 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-bone">
                    {booking.trainer.name ?? booking.trainer.email}
                  </p>
                  <p className="text-xs text-bone/50">
                    {getCityBySlug(booking.citySlug)?.name ?? booking.citySlug} ·{" "}
                    {booking.startsAt.toLocaleString("es-MX", {
                      dateStyle: "medium",
                      timeStyle: "short",
                      timeZone: "America/Mexico_City",
                    })}
                  </p>
                </div>
                <form
                  action={async () => {
                    "use server";
                    await cancelMyBooking(booking.id);
                  }}
                >
                  <button
                    type="submit"
                    className="rounded-sm border border-bone/20 px-3 py-1.5 text-xs font-medium text-bone/70 transition hover:border-red-400 hover:text-red-400"
                  >
                    Cancelar
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="mb-4 font-display text-lg text-bone">Historial</h2>
        {past.length === 0 ? (
          <p className="text-sm text-bone/60">Sin historial todavía.</p>
        ) : (
          <ul className="divide-y divide-bone/10 rounded-sm border border-bone/10">
            {past.map((booking) => (
              <li key={booking.id} className="px-4 py-3">
                <p className="text-sm text-bone/70">
                  {booking.trainer.name ?? booking.trainer.email} ·{" "}
                  {getCityBySlug(booking.citySlug)?.name ?? booking.citySlug} ·{" "}
                  {booking.startsAt.toLocaleString("es-MX", {
                    dateStyle: "medium",
                    timeStyle: "short",
                    timeZone: "America/Mexico_City",
                  })}{" "}
                  <span className="text-xs uppercase text-bone/40">
                    {booking.status === "CANCELLED" ? "Cancelada" : "Realizada"}
                  </span>
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
