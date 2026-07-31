import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";
import { getCityBySlug } from "@/data/cities";

type Props = {
  params: { id: string };
};

const FULL_DATE_FORMAT = new Intl.DateTimeFormat("es-MX", {
  weekday: "long",
  day: "numeric",
  month: "long",
  timeZone: "America/Mexico_City",
});
const TIME_FORMAT = new Intl.DateTimeFormat("es-MX", {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
  timeZone: "America/Mexico_City",
});

async function getSesion(id: string) {
  return prisma.sesion.findUnique({
    where: { id },
    include: { sede: true, trainer: { select: { name: true, image: true, bio: true } } },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const sesion = await getSesion(params.id);
  if (!sesion) return {};

  return {
    title: `${sesion.title} — Once FC`,
    description: `${sesion.title} en ${sesion.sede.name}. ${FULL_DATE_FORMAT.format(sesion.startsAt)} a las ${TIME_FORMAT.format(sesion.startsAt)}.`,
    robots: { index: false, follow: false },
  };
}

export default async function EventoPage({ params }: Props) {
  const sesion = await getSesion(params.id);
  if (!sesion || !sesion.active) notFound();

  const city = getCityBySlug(sesion.sede.citySlug);
  const trainerName = sesion.trainer.name ?? "Entrenador Once FC";
  const isPast = sesion.startsAt < new Date();
  const price =
    sesion.priceCents && sesion.priceCents > 0
      ? (sesion.priceCents / 100).toLocaleString("es-MX", {
          style: "currency",
          currency: "MXN",
        })
      : null;

  return (
    <main id="main">
      <Nav cityName={city?.name} citySlug={city?.slug} />

      <section className="relative overflow-hidden bg-coal-deep pt-32 pb-16 text-bone">
        <div className="pointer-events-none absolute inset-0 bg-grid-lines" aria-hidden="true" />
        <div className="relative mx-auto max-w-3xl px-6">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-volt">
            {city ? `Sesión en ${city.name}` : "Sesión"}
            {isPast ? " · Finalizada" : ""}
          </p>

          <h1 className="mt-3 max-w-2xl font-display text-4xl leading-tight sm:text-5xl">
            {sesion.title}
          </h1>

          {sesion.levelLabel ? (
            <span className="mt-4 inline-block rounded-sm border border-volt-dim/50 px-2 py-1 font-mono text-xs uppercase tracking-widest text-volt-dim">
              {sesion.levelLabel}
            </span>
          ) : null}

          <div className="mt-8 grid gap-6 border-t border-bone/15 pt-8 sm:grid-cols-2">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-widest text-bone/50">
                Cuándo
              </p>
              <p className="mt-2 font-display text-xl capitalize">
                {FULL_DATE_FORMAT.format(sesion.startsAt)}
              </p>
              <p className="font-body text-sm text-bone/70">
                {TIME_FORMAT.format(sesion.startsAt)} · {sesion.durationMinutes} min
              </p>
            </div>

            <div>
              <p className="font-mono text-[11px] uppercase tracking-widest text-bone/50">
                Dónde
              </p>
              <p className="mt-2 font-display text-xl">{sesion.sede.name}</p>
              <p className="font-body text-sm text-bone/70">
                {sesion.sede.address}
                {city ? `, ${city.name}` : ""}
              </p>
            </div>

            {sesion.capacity ? (
              <div>
                <p className="font-mono text-[11px] uppercase tracking-widest text-bone/50">
                  Cupo
                </p>
                <p className="mt-2 font-display text-xl">{sesion.capacity} jugadores</p>
              </div>
            ) : null}

            {price ? (
              <div>
                <p className="font-mono text-[11px] uppercase tracking-widest text-bone/50">
                  Precio
                </p>
                <p className="mt-2 font-display text-xl">{price}</p>
              </div>
            ) : null}

            <div>
              <p className="font-mono text-[11px] uppercase tracking-widest text-bone/50">
                Entrenador
              </p>
              <div className="mt-2 flex items-center gap-3">
                <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-full bg-bone/5">
                  {sesion.trainer.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={sesion.trainer.image}
                      alt={trainerName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center font-mono text-xs uppercase text-bone/30">
                      {trainerName.slice(0, 1)}
                    </div>
                  )}
                </div>
                <p className="font-display text-xl">{trainerName}</p>
              </div>
            </div>
          </div>

          {sesion.description ? (
            <p className="mt-8 max-w-xl font-body text-sm text-bone/70">{sesion.description}</p>
          ) : null}

          {sesion.trainer.bio ? (
            <p className="mt-4 max-w-xl font-body text-sm text-bone/50">{sesion.trainer.bio}</p>
          ) : null}

          {!isPast ? (
            price ? (
              <a
                href={`/checkout/${sesion.id}`}
                className="mt-10 inline-block rounded-sm bg-volt px-6 py-3 text-center font-body text-sm font-semibold text-coal-deep transition hover:brightness-95"
              >
                Reserva
              </a>
            ) : (
              <p className="mt-10 font-mono text-xs uppercase tracking-widest text-bone/40">
                Precio por confirmar
              </p>
            )
          ) : null}
        </div>
      </section>

      <Footer
        zoneLabel={city?.zoneLabel}
        scheduleNote={city?.scheduleNote}
        contactEmail={city?.contactEmail}
      />
    </main>
  );
}
