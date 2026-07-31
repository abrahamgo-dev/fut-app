import { requireRole } from "@/lib/auth-guards";
import { prisma } from "@/lib/prisma";
import { getCityBySlug } from "@/data/cities";
import { cancelBookingAsTrainer } from "./actions";

export default async function TrainerDashboardPage() {
  const session = await requireRole(["TRAINER", "ADMIN"]);

  const bookings = await prisma.booking.findMany({
    where: { trainerId: session.user.id, status: "CONFIRMED", startsAt: { gte: new Date() } },
    include: { user: { select: { name: true, email: true } } },
    orderBy: { startsAt: "asc" },
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-bone">Panel de entrenador</h1>
        <a
          href="/panel/entrenador/disponibilidad"
          className="rounded-sm bg-volt px-4 py-2 text-sm font-semibold text-coal-deep transition hover:bg-bone"
        >
          Configurar disponibilidad
        </a>
      </div>

      <section>
        <h2 className="mb-4 font-display text-lg text-bone">Próximas sesiones</h2>
        {bookings.length === 0 ? (
          <p className="text-sm text-bone/60">No tienes sesiones reservadas todavía.</p>
        ) : (
          <ul className="divide-y divide-bone/10 rounded-sm border border-bone/10">
            {bookings.map((booking) => (
              <li
                key={booking.id}
                className="flex flex-wrap items-center justify-between gap-4 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-bone">
                    {booking.user.name ?? booking.user.email}
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
                    await cancelBookingAsTrainer(booking.id);
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
    </div>
  );
}
