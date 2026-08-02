import type { ReservaStatus } from "@prisma/client";
import { requireSession } from "@/lib/auth-guards";
import { prisma } from "@/lib/prisma";
import { PRELAUNCH_MODE } from "@/lib/launchFlags";

function toGoogleCalendarDate(date: Date): string {
  return date
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z");
}

export default async function CuentaPage() {
  const session = await requireSession();

  const shouldCreateMockData = process.env.NODE_ENV !== "production";

  async function ensureMockReservationsForCurrentUser(userId: string) {
    const existingActiveReservations = await prisma.reserva.findMany({
      where: {
        userId,
        status: "PAID",
        sesion: { startsAt: { gte: new Date() } },
      },
      select: { sesionId: true },
    });

    const existingHistoryReservations = await prisma.reserva.findMany({
      where: {
        userId,
        OR: [
          { status: "PAID" },
          { status: "CANCELLED" },
          { status: "EXPIRED" },
        ],
        sesion: { startsAt: { lt: new Date() } },
      },
      select: { sesionId: true },
    });

    const DESIRED_ACTIVE_RESERVATIONS = 30;

    if (
      existingActiveReservations.length >= DESIRED_ACTIVE_RESERVATIONS &&
      existingHistoryReservations.length >= 20
    ) {
      return;
    }

    const futureSessions = await prisma.sesion.findMany({
      where: { startsAt: { gte: new Date() } },
      orderBy: { startsAt: "asc" },
      select: { id: true, priceCents: true },
    });

    const activeSessionIds = new Set(
      existingActiveReservations.map((reservation) => reservation.sesionId),
    );

    // Stride through the whole range (instead of just taking the soonest N)
    // so reservations land throughout August and September, not only in the
    // first couple of weeks.
    const reservationStride = Math.max(
      1,
      Math.floor(futureSessions.length / DESIRED_ACTIVE_RESERVATIONS),
    );

    for (
      let index = 0;
      index < futureSessions.length &&
      activeSessionIds.size < DESIRED_ACTIVE_RESERVATIONS;
      index += reservationStride
    ) {
      const sesion = futureSessions[index];
      if (activeSessionIds.has(sesion.id)) continue;

      await prisma.reserva.create({
        data: {
          userId,
          sesionId: sesion.id,
          status: "PAID",
          amountCents: sesion.priceCents ?? 12000,
        },
      });
      activeSessionIds.add(sesion.id);
    }

    const sedes = await prisma.sede.findMany({
      select: { id: true },
      orderBy: { createdAt: "asc" },
    });
    const trainers = await prisma.user.findMany({
      where: { role: "TRAINER" },
      select: { id: true },
      orderBy: { createdAt: "asc" },
    });

    const historySessionIds = new Set(
      existingHistoryReservations.map((reservation) => reservation.sesionId),
    );
    const historicalStatuses: ReservaStatus[] = [
      "PAID",
      "CANCELLED",
      "EXPIRED",
    ];

    for (let index = 0; index < 20; index += 1) {
      const startsAt = new Date();
      startsAt.setDate(startsAt.getDate() - (8 + index));
      startsAt.setHours([7, 10, 17, 19][index % 4], 0, 0, 0);
      const title = `Historial mock ${index + 1}`;

      let sesionRecord = await prisma.sesion.findFirst({
        where: { title, startsAt },
        select: { id: true },
      });

      if (!sesionRecord) {
        const sede = sedes[index % sedes.length];
        const trainer = trainers[index % trainers.length];

        if (!sede || !trainer) break;

        sesionRecord = await prisma.sesion.create({
          data: {
            title,
            levelLabel: "Historial",
            capacity: 12,
            priceCents: 9000 + index * 200,
            startsAt,
            sedeId: sede.id,
            trainerId: trainer.id,
          },
        });
      }

      if (historySessionIds.has(sesionRecord.id)) continue;

      await prisma.reserva.create({
        data: {
          userId,
          sesionId: sesionRecord.id,
          status: historicalStatuses[index % historicalStatuses.length],
          amountCents: 9000 + index * 200,
        },
      });
      historySessionIds.add(sesionRecord.id);
    }
  }

  if (shouldCreateMockData) {
    await ensureMockReservationsForCurrentUser(session.user.id);
  }

  const [primaryReservas, primaryHistorialReservas] = await Promise.all([
    prisma.reserva.findMany({
      where: {
        userId: session.user.id,
        status: "PAID",
        sesion: { startsAt: { gte: new Date() } },
      },
      include: { sesion: { include: { sede: true } } },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    prisma.reserva.findMany({
      where: {
        userId: session.user.id,
        OR: [
          { status: "PAID" },
          { status: "CANCELLED" },
          { status: "EXPIRED" },
        ],
        sesion: { startsAt: { lt: new Date() } },
      },
      include: { sesion: { include: { sede: true } } },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  const reservas = primaryReservas;
  const historialReservas = primaryHistorialReservas;

  const RESERVA_STATUS_LABEL: Record<string, string> = {
    PENDING: "Pago pendiente",
    PAID: "Pagada",
    CANCELLED: "Cancelada",
    EXPIRED: "Expirada",
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4 rounded-sm border border-bone/10 bg-bone/5 p-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-2xl text-bone">Mi cuenta</h1>
          <p className="mt-1 text-sm text-bone/70">
            Gestiona tus reservas y revisa tu historial de entrenamientos.
          </p>
        </div>
        <a
          href="/reservar"
          className="inline-flex items-center justify-center rounded-sm bg-volt px-4 py-2 text-sm font-semibold text-coal-deep transition hover:bg-bone"
        >
          Ver calendario
        </a>
      </div>

      <section>
        <h2 className="mb-4 font-display text-lg text-bone">Tus reservas</h2>
        {reservas.length === 0 ? (
          <p className="text-sm text-bone/60">
            Todavía no tienes reservas activas para entrenamientos.
          </p>
        ) : (
          <ul className="divide-y divide-bone/10 rounded-sm border border-bone/10">
            {reservas.map((reserva) => (
              <li
                key={reserva.id}
                className="rounded-sm border border-transparent px-4 py-3 transition duration-200 hover:border-volt hover:bg-volt/5"
              >
                {(() => {
                  const startsAt = reserva.sesion.startsAt;
                  const endsAt = new Date(
                    startsAt.getTime() +
                      Math.max(reserva.sesion.durationMinutes ?? 60, 1) *
                        60_000,
                  );
                  const params = new URLSearchParams({
                    action: "TEMPLATE",
                    text: `Entrenamiento Once FC: ${reserva.sesion.title}`,
                    dates: `${toGoogleCalendarDate(startsAt)}/${toGoogleCalendarDate(endsAt)}`,
                    details: [
                      `Sesion: ${reserva.sesion.title}`,
                      reserva.sesion.description
                        ? `Detalles: ${reserva.sesion.description}`
                        : null,
                      "Nos vemos en cancha. Llega 10 minutos antes.",
                    ]
                      .filter(Boolean)
                      .join("\n"),
                    location: `${reserva.sesion.sede.name} - ${reserva.sesion.sede.address}`,
                  });
                  const googleCalendarUrl = `https://calendar.google.com/calendar/render?${params.toString()}`;
                  const icsUrl = `/api/calendar/ics?reserva_id=${encodeURIComponent(reserva.id)}`;

                  return (
                    <>
                      <a
                        href={`/eventos/${reserva.sesionId}`}
                        className="flex flex-wrap items-center justify-between gap-4"
                      >
                        <div>
                          <p className="text-sm font-medium text-bone">
                            {reserva.sesion.title}
                          </p>
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
                            {(reserva.amountCents / 100).toLocaleString(
                              "es-MX",
                              {
                                style: "currency",
                                currency: "MXN",
                              },
                            )}
                          </p>
                          <p className="font-mono text-[11px] uppercase tracking-widest text-bone/40">
                            {RESERVA_STATUS_LABEL[reserva.status] ??
                              reserva.status}
                          </p>
                        </div>
                      </a>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {PRELAUNCH_MODE ? (
                          <a
                            href="/#footer"
                            className="rounded-sm border border-bone/25 px-3 py-1.5 text-xs font-semibold text-bone/85 transition hover:border-volt hover:text-volt"
                          >
                            Contacto
                          </a>
                        ) : (
                          <>
                            <a
                              href={googleCalendarUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-sm border border-bone/25 px-3 py-1.5 text-xs font-semibold text-bone/85 transition hover:border-volt hover:text-volt"
                            >
                              Google Calendar
                            </a>
                            <a
                              href={icsUrl}
                              className="rounded-sm border border-bone/25 px-3 py-1.5 text-xs font-semibold text-bone/85 transition hover:border-volt hover:text-volt"
                            >
                              Descargar .ics
                            </a>
                          </>
                        )}
                      </div>
                    </>
                  );
                })()}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="mb-4 font-display text-lg text-bone">
          Historial de entrenamientos
        </h2>
        {historialReservas.length === 0 ? (
          <p className="text-sm text-bone/60">
            Todavía no hay entrenamientos en tu historial.
          </p>
        ) : (
          <ul className="divide-y divide-bone/10 rounded-sm border border-bone/10">
            {historialReservas.map((reserva) => (
              <li
                key={reserva.id}
                className="flex flex-wrap items-center justify-between gap-4 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-bone">
                    {reserva.sesion.title}
                  </p>
                  <p className="text-xs text-bone/50">
                    {reserva.sesion.sede.name} ·{" "}
                    {reserva.sesion.startsAt.toLocaleString("es-MX", {
                      dateStyle: "medium",
                      timeStyle: "short",
                      timeZone: "America/Mexico_City",
                    })}
                  </p>
                </div>
                <p className="font-mono text-[11px] uppercase tracking-widest text-bone/40">
                  {RESERVA_STATUS_LABEL[reserva.status] ?? reserva.status}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
