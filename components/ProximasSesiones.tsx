import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCityBySlug } from "@/data/cities";

const WEEKDAY_FORMAT = new Intl.DateTimeFormat("es-MX", {
  weekday: "short",
  timeZone: "America/Mexico_City",
});
const DAY_NUM_FORMAT = new Intl.DateTimeFormat("es-MX", {
  day: "numeric",
  timeZone: "America/Mexico_City",
});
const MONTH_FORMAT = new Intl.DateTimeFormat("es-MX", {
  month: "short",
  timeZone: "America/Mexico_City",
});
const TIME_FORMAT = new Intl.DateTimeFormat("es-MX", {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
  timeZone: "America/Mexico_City",
});

export default async function ProximasSesiones({
  citySlug,
  limit = 6,
}: {
  citySlug?: string;
  limit?: number;
}) {
  const sesiones = await prisma.sesion.findMany({
    where: {
      active: true,
      startsAt: { gte: new Date() },
      ...(citySlug ? { sede: { citySlug } } : {}),
    },
    include: { sede: true, trainer: { select: { name: true, image: true } } },
    orderBy: { startsAt: "asc" },
    take: limit,
  });

  if (sesiones.length === 0) return null;

  const city = citySlug ? getCityBySlug(citySlug) : undefined;
  const headingText = city
    ? `Próximos entrenamientos en ${city.name}`
    : "Próximos entrenamientos";
  const calendarHref = citySlug ? `/reservar/${citySlug}` : "/reservar";

  return (
    <section id="sesiones" className="bg-bone py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-ink/70">
                Agenda
              </p>
              <h2 className="mt-3 font-display text-4xl text-ink sm:text-5xl">
                {headingText}
              </h2>
            </div>
            <Link
              href={calendarHref}
              className="inline-flex w-fit items-center gap-2 rounded-sm bg-ink px-4 py-3 text-sm font-semibold text-bone shadow-sm transition hover:bg-ink/90"
            >
              Ver calendario
              {city ? ` · ${city.name}` : ""}
              <span aria-hidden="true">→</span>
            </Link>
          </div>
          <p className="max-w-2xl font-body text-sm text-ink/60">
            Entrenamientos confirmados con cancha y entrenador asignado. Reserva
            tu lugar antes de que se llene.
          </p>
        </div>

        <ul className="mt-12 divide-y divide-ink/10 rounded-sm border border-ink/10">
          {sesiones.map((sesion) => {
            const city = getCityBySlug(sesion.sede.citySlug);
            const trainerName = sesion.trainer.name ?? "Entrenador Once FC";

            return (
              <li key={sesion.id}>
                <Link
                  href={`/eventos/${sesion.id}`}
                  className="flex flex-wrap items-center gap-5 px-5 py-5 transition hover:bg-ink/5 sm:px-6"
                >
                  <div className="flex w-14 flex-shrink-0 flex-col items-center rounded-sm bg-ink py-2 text-bone">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-volt">
                      {WEEKDAY_FORMAT.format(sesion.startsAt)}
                    </span>
                    <span className="font-mono scoreboard-num text-xl">
                      {DAY_NUM_FORMAT.format(sesion.startsAt)}
                    </span>
                    <span className="font-mono text-[10px] uppercase text-bone/50">
                      {MONTH_FORMAT.format(sesion.startsAt)}
                    </span>
                  </div>

                  <div className="h-11 w-11 flex-shrink-0 overflow-hidden rounded-full bg-ink/5">
                    {sesion.trainer.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={sesion.trainer.image}
                        alt={trainerName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center font-mono text-xs uppercase text-ink/30">
                        {trainerName.slice(0, 1)}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">
                      {sesion.title}
                      {sesion.levelLabel ? (
                        <span className="ml-2 rounded-sm border border-volt-dim/50 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-volt-dim">
                          {sesion.levelLabel}
                        </span>
                      ) : null}
                    </p>
                    <p className="truncate text-xs text-ink/50">
                      {trainerName} · {sesion.sede.name}
                      {city ? `, ${city.name}` : ""}
                    </p>
                  </div>

                  <p className="flex-shrink-0 font-mono text-sm text-ink/70">
                    {TIME_FORMAT.format(sesion.startsAt)}
                  </p>
                  <span
                    className="flex-shrink-0 font-mono text-sm text-ink/30"
                    aria-hidden="true"
                  >
                    →
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
