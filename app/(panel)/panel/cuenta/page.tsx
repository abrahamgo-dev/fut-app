import type { ReservaStatus } from "@prisma/client";
import { requireSession } from "@/lib/auth-guards";
import { prisma } from "@/lib/prisma";
import ReservasActivasList from "@/components/panel/ReservasActivasList";
import HistorialList from "@/components/panel/HistorialList";
import { RESERVAS_PAGE_SIZE } from "@/lib/reservaPagination";
import { USE_TEST_DATA } from "@/lib/launchFlags";
import type { ReservaListItem } from "./actions";

type HistorialHighlight = "PAID" | "CANCELLED" | "EXPIRED" | null;

function parseHistorialHighlight(
  value: string | string[] | undefined,
): HistorialHighlight {
  const normalized = Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
  if (normalized === "paid") return "PAID";
  if (normalized === "cancelled") return "CANCELLED";
  if (normalized === "expired") return "EXPIRED";
  return null;
}

function toListItem(reserva: {
  id: string;
  sesionId: string;
  amountCents: number;
  status: ReservaStatus;
  sesion: {
    title: string;
    description: string | null;
    durationMinutes: number;
    startsAt: Date;
    sede: { name: string; address: string };
  };
}): ReservaListItem {
  return {
    id: reserva.id,
    sesionId: reserva.sesionId,
    title: reserva.sesion.title,
    sedeName: reserva.sesion.sede.name,
    sedeAddress: reserva.sesion.sede.address,
    startsAtISO: reserva.sesion.startsAt.toISOString(),
    durationMinutes: reserva.sesion.durationMinutes,
    description: reserva.sesion.description,
    amountCents: reserva.amountCents,
    status: reserva.status,
  };
}

export default async function CuentaPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const session = await requireSession();
  const historialHighlight = parseHistorialHighlight(searchParams?.historial);

  const shouldCreateMockData = USE_TEST_DATA;

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

  // Fetch PAGE_SIZE + 1 so hasMore can be read off the result length instead
  // of a separate count() query — see loadMoreReservasActivas/loadMoreHistorial
  // in ./actions, which the client-side "Cargar más" buttons call for
  // subsequent pages.
  const [primaryReservas, primaryHistorialReservas, nextUpcomingReserva] =
    await Promise.all([
      prisma.reserva.findMany({
        where: {
          userId: session.user.id,
          status: "PAID",
          sesion: { startsAt: { gte: new Date() } },
        },
        include: { sesion: { include: { sede: true } } },
        orderBy: { createdAt: "desc" },
        take: RESERVAS_PAGE_SIZE + 1,
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
        take: RESERVAS_PAGE_SIZE + 1,
      }),
      prisma.reserva.findFirst({
        where: {
          userId: session.user.id,
          status: "PAID",
          sesion: { startsAt: { gte: new Date() } },
        },
        include: { sesion: { include: { sede: true } } },
        orderBy: { sesion: { startsAt: "asc" } },
      }),
    ]);

  const reservasHasMore = primaryReservas.length > RESERVAS_PAGE_SIZE;
  const reservas = primaryReservas.slice(0, RESERVAS_PAGE_SIZE).map(toListItem);
  const historialHasMore = primaryHistorialReservas.length > RESERVAS_PAGE_SIZE;
  const historialReservas = primaryHistorialReservas
    .slice(0, RESERVAS_PAGE_SIZE)
    .map(toListItem);

  const [upcomingCount, historyCount, cancelledCount] = await Promise.all([
    prisma.reserva.count({
      where: {
        userId: session.user.id,
        status: "PAID",
        sesion: { startsAt: { gte: new Date() } },
      },
    }),
    prisma.reserva.count({
      where: {
        userId: session.user.id,
        OR: [
          { status: "PAID" },
          { status: "CANCELLED" },
          { status: "EXPIRED" },
        ],
        sesion: { startsAt: { lt: new Date() } },
      },
    }),
    prisma.reserva.count({
      where: {
        userId: session.user.id,
        status: "CANCELLED",
      },
    }),
  ]);

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4 rounded-sm border border-bone/10 bg-bone/5 p-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-2xl text-bone">Mis reservas</h1>
          <p className="mt-1 text-sm text-bone/70">
            Revisa tus proximas clases, agrega recordatorios y consulta tu
            historial.
          </p>
        </div>
        <a
          href="/reservar"
          className="inline-flex items-center justify-center rounded-sm bg-volt px-4 py-2 text-sm font-semibold text-coal-deep transition hover:bg-bone"
        >
          Reservar otra clase
        </a>
      </div>

      <section className="grid gap-3 sm:grid-cols-3">
        <a
          href="#proximas-clases"
          className="rounded-sm border border-bone/10 bg-coal-deep/40 px-4 py-3 transition hover:border-volt/40 hover:bg-volt/5"
        >
          <p className="text-xs uppercase tracking-wider text-bone/50">
            Proximas
          </p>
          <p className="mt-1 font-display text-2xl text-bone">
            {upcomingCount}
          </p>
        </a>
        <a
          href="/panel/cuenta#clases-anteriores"
          className="rounded-sm border border-bone/10 bg-coal-deep/40 px-4 py-3 transition hover:border-volt/40 hover:bg-volt/5"
        >
          <p className="text-xs uppercase tracking-wider text-bone/50">
            Anteriores
          </p>
          <p className="mt-1 font-display text-2xl text-bone">{historyCount}</p>
        </a>
        <a
          href="/panel/cuenta?historial=cancelled#clases-anteriores"
          className="rounded-sm border border-bone/10 bg-coal-deep/40 px-4 py-3 transition hover:border-volt/40 hover:bg-volt/5"
        >
          <p className="text-xs uppercase tracking-wider text-bone/50">
            Canceladas
          </p>
          <p className="mt-1 font-display text-2xl text-bone">
            {cancelledCount}
          </p>
        </a>
      </section>

      {nextUpcomingReserva ? (
        <section className="rounded-sm border border-volt/30 bg-volt/10 p-4">
          <p className="text-xs uppercase tracking-wider text-volt">
            Tu proxima clase
          </p>
          <p className="mt-1 font-display text-xl text-bone">
            {nextUpcomingReserva.sesion.title}
          </p>
          <p className="mt-1 text-sm text-bone/80">
            {nextUpcomingReserva.sesion.sede.name} ·{" "}
            {nextUpcomingReserva.sesion.startsAt.toLocaleString("es-MX", {
              dateStyle: "full",
              timeStyle: "short",
              timeZone: "America/Mexico_City",
            })}
          </p>
          <a
            href={`/eventos/${nextUpcomingReserva.sesionId}`}
            className="mt-3 inline-flex rounded-sm border border-bone/25 px-3 py-1.5 text-xs font-semibold text-bone/85 transition hover:border-volt hover:text-volt"
          >
            Ver detalle de la clase
          </a>
        </section>
      ) : null}

      <section className="rounded-sm border border-bone/10 bg-bone/5 p-4">
        <p className="text-sm text-bone/80">
          ¿Necesitas ayuda con un cambio o una cancelacion? Escribenos y te
          ayudamos rapido.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <a
            href="/#footer"
            className="rounded-sm border border-bone/25 px-3 py-1.5 text-xs font-semibold text-bone/85 transition hover:border-volt hover:text-volt"
          >
            Contacto
          </a>
          <a
            href="/preguntas-frecuentes"
            className="rounded-sm border border-bone/25 px-3 py-1.5 text-xs font-semibold text-bone/85 transition hover:border-volt hover:text-volt"
          >
            Preguntas frecuentes
          </a>
        </div>
      </section>

      <section id="proximas-clases">
        <h2 className="mb-1 font-display text-lg text-bone">Proximas clases</h2>
        <p className="mb-4 text-sm text-bone/60">
          Aqui veras tus entrenamientos confirmados y accesos rapidos para
          agendarlos.
        </p>
        <ReservasActivasList
          initialItems={reservas}
          initialHasMore={reservasHasMore}
        />
      </section>

      <section id="clases-anteriores">
        <h2 className="mb-1 font-display text-lg text-bone">
          Clases anteriores
        </h2>
        <p className="mb-4 text-sm text-bone/60">
          Consulta tus reservas pasadas y el estado en el que quedaron.
        </p>
        <HistorialList
          initialItems={historialReservas}
          initialHasMore={historialHasMore}
          initialHighlight={historialHighlight}
        />
      </section>
    </div>
  );
}
