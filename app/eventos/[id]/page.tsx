import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getCityBySlug } from "@/data/cities";

type Props = {
  params: { id: string };
  searchParams: { reserva?: string };
};

const RESERVA_REDIRECT_MESSAGES: Record<string, string> = {
  full: "Este entrenamiento se llenó justo antes de que completaras tu reserva.",
  existing: "Ya tienes una reserva activa para este entrenamiento.",
  retry: "Hubo mucha demanda por este horario. Intenta reservar de nuevo.",
  error: "No se pudo iniciar el pago con Stripe. Intenta de nuevo.",
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
    include: {
      sede: true,
      trainer: { select: { name: true, image: true, bio: true } },
    },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const sesion = await getSesion(params.id);
  if (!sesion) return {};

  const isIndexable = sesion.active && sesion.startsAt >= new Date();

  return {
    title: `${sesion.title} — Once FC`,
    description: `${sesion.title} en ${sesion.sede.name}. ${FULL_DATE_FORMAT.format(sesion.startsAt)} a las ${TIME_FORMAT.format(sesion.startsAt)}.`,
    alternates: { canonical: `/eventos/${sesion.id}` },
    robots: { index: isIndexable, follow: isIndexable },
  };
}

export default async function EventoPage({ params, searchParams }: Props) {
  const sesion = await getSesion(params.id);
  if (!sesion || !sesion.active) notFound();

  const session = await auth();
  const city = getCityBySlug(sesion.sede.citySlug);
  const trainerName = sesion.trainer.name ?? "Entrenador Once FC";
  const isPast = sesion.startsAt < new Date();
  const [existingReserva, reservationCount] = await Promise.all([
    session?.user?.id
      ? prisma.reserva.findFirst({
          where: {
            userId: session.user.id,
            sesionId: sesion.id,
            status: { in: ["PENDING", "PAID"] },
          },
        })
      : null,
    sesion.capacity != null
      ? prisma.reserva.count({
          where: { sesionId: sesion.id, status: { in: ["PENDING", "PAID"] } },
        })
      : null,
  ]);
  const isFull =
    sesion.capacity != null &&
    reservationCount != null &&
    reservationCount >= sesion.capacity;
  const spotsLeft =
    sesion.capacity != null && reservationCount != null
      ? Math.max(sesion.capacity - reservationCount, 0)
      : null;
  const isLowAvailability = spotsLeft != null && spotsLeft > 0 && spotsLeft <= 3;
  const redirectMessage = searchParams.reserva
    ? RESERVA_REDIRECT_MESSAGES[searchParams.reserva]
    : null;
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
        <div
          className="pointer-events-none absolute inset-0 bg-grid-lines"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-3xl px-6">
          {redirectMessage ? (
            <p className="mb-4 rounded-sm border border-bone/20 bg-bone/5 px-4 py-2 text-sm text-bone/80">
              {redirectMessage}
            </p>
          ) : null}

          <p className="font-mono text-xs uppercase tracking-[0.3em] text-volt">
            {city ? `Entrenamiento en ${city.name}` : "Entrenamiento"}
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
                {TIME_FORMAT.format(sesion.startsAt)} · {sesion.durationMinutes}{" "}
                min
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
                <p
                  className={`mt-2 font-display text-xl ${isLowAvailability ? "text-volt" : ""}`}
                >
                  {spotsLeft} de {sesion.capacity} lugares disponibles
                </p>
                {isLowAvailability ? (
                  <p className="font-mono text-xs uppercase tracking-widest text-volt">
                    ¡Quedan pocos lugares!
                  </p>
                ) : null}
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
            <p className="mt-8 max-w-xl font-body text-sm text-bone/70">
              {sesion.description}
            </p>
          ) : null}

          {sesion.trainer.bio ? (
            <p className="mt-4 max-w-xl font-body text-sm text-bone/50">
              {sesion.trainer.bio}
            </p>
          ) : null}

          {!isPast ? (
            price ? (
              existingReserva ? (
                <div className="mt-10">
                  <p className="text-sm text-bone/60">
                    Ya tienes una reserva activa para este entrenamiento.
                  </p>
                </div>
              ) : isFull ? (
                <div className="mt-10">
                  <p className="text-sm text-bone/60">
                    Cupo lleno para este entrenamiento.
                  </p>
                </div>
              ) : (
                <div className="mt-10 rounded-sm border border-volt/30 bg-volt/5 p-6">
                  <a
                    href={`/checkout/${sesion.id}`}
                    className="block rounded-sm bg-volt px-6 py-3 text-center font-body text-sm font-semibold text-coal-deep transition hover:brightness-95"
                  >
                    Reservar mi lugar — {price}
                  </a>
                  <div className="mt-3 flex items-center justify-center gap-1.5 text-bone/50">
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="h-3.5 w-3.5 flex-shrink-0"
                    >
                      <rect
                        x="5"
                        y="11"
                        width="14"
                        height="9"
                        rx="1.5"
                        stroke="currentColor"
                        strokeWidth="1.6"
                      />
                      <path
                        d="M8 11V7.5a4 4 0 0 1 8 0V11"
                        stroke="currentColor"
                        strokeWidth="1.6"
                      />
                    </svg>
                    <span className="font-mono text-[11px] uppercase tracking-widest">
                      Pago seguro procesado por Stripe
                    </span>
                  </div>
                  {isLowAvailability ? (
                    <p className="mt-2 text-center font-mono text-xs uppercase tracking-widest text-volt">
                      Quedan {spotsLeft} lugares
                    </p>
                  ) : null}

                  <dl className="mt-6 grid gap-4 border-t border-bone/10 pt-5 sm:grid-cols-2">
                    <div>
                      <dt className="font-mono text-[11px] uppercase tracking-widest text-bone/50">
                        Qué llevar
                      </dt>
                      <dd className="mt-1.5 font-body text-sm text-bone/70">
                        Ropa deportiva, tenis o tachones y espinilleras. Nosotros
                        ponemos los balones y el material de entrenamiento.
                      </dd>
                    </div>
                    <div>
                      <dt className="font-mono text-[11px] uppercase tracking-widest text-bone/50">
                        Pago y devoluciones
                      </dt>
                      <dd className="mt-1.5 font-body text-sm text-bone/70">
                        Pago seguro en línea con Stripe. Devolución solo si se
                        cancela la clase —{" "}
                        <Link
                          href="/terminos"
                          className="underline decoration-bone/30 underline-offset-2 hover:text-volt hover:decoration-volt"
                        >
                          ver política completa
                        </Link>
                        .
                      </dd>
                    </div>
                  </dl>
                  <Link
                    href="/preguntas-frecuentes"
                    className="mt-4 inline-block font-body text-xs text-bone/50 underline decoration-bone/30 underline-offset-2 transition hover:text-volt hover:decoration-volt"
                  >
                    Ver todas las preguntas frecuentes
                  </Link>
                </div>
              )
            ) : (
              <p className="mt-10 font-mono text-xs uppercase tracking-widest text-bone/40">
                Precio por confirmar
              </p>
            )
          ) : null}
        </div>
      </section>

      <Footer
        cityLabel={city?.name}
        scheduleNote={city?.scheduleNote}
        contactEmail={city?.contactEmail}
      />
    </main>
  );
}
