import { requireRole } from "@/lib/auth-guards";
import { prisma } from "@/lib/prisma";
import { getCityBySlug } from "@/data/cities";

const DATE_FORMAT = new Intl.DateTimeFormat("es-MX", {
  weekday: "short",
  day: "numeric",
  month: "short",
  timeZone: "America/Mexico_City",
});
const TIME_FORMAT = new Intl.DateTimeFormat("es-MX", {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
  timeZone: "America/Mexico_City",
});

export default async function TrainerDashboardPage() {
  const session = await requireRole(["TRAINER", "ADMIN"]);

  const sesiones = await prisma.sesion.findMany({
    where: { trainerId: session.user.id, active: true, startsAt: { gte: new Date() } },
    include: { sede: { select: { name: true, citySlug: true } } },
    orderBy: { startsAt: "asc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl text-bone">Panel de entrenador</h1>
        <p className="mt-1 text-sm text-bone/60">
          Tus próximas sesiones asignadas. El club define horario y sede — aquí solo las
          consultas.
        </p>
      </div>

      <section>
        <h2 className="mb-4 font-display text-lg text-bone">Próximas sesiones</h2>
        {sesiones.length === 0 ? (
          <p className="text-sm text-bone/60">No tienes sesiones asignadas todavía.</p>
        ) : (
          <ul className="divide-y divide-bone/10 rounded-sm border border-bone/10">
            {sesiones.map((sesion) => (
              <li
                key={sesion.id}
                className="flex flex-wrap items-center justify-between gap-4 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-bone">
                    {sesion.title}
                    {sesion.levelLabel ? (
                      <span className="ml-2 font-mono text-[10px] uppercase tracking-widest text-volt-dim">
                        {sesion.levelLabel}
                      </span>
                    ) : null}
                  </p>
                  <p className="text-xs text-bone/50">
                    {sesion.sede.name}
                    {getCityBySlug(sesion.sede.citySlug)
                      ? `, ${getCityBySlug(sesion.sede.citySlug)?.name}`
                      : ""}{" "}
                    · {DATE_FORMAT.format(sesion.startsAt)} · {TIME_FORMAT.format(sesion.startsAt)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
