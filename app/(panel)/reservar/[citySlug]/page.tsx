import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { requireSession } from "@/lib/auth-guards";
import { prisma } from "@/lib/prisma";
import { getCityBySlug } from "@/data/cities";
import EventsCalendar from "@/components/EventsCalendar";

export default async function ReservarCiudadPage({
  params,
}: {
  params: { citySlug: string };
}) {
  await requireSession();

  const city = getCityBySlug(params.citySlug);
  if (!city) notFound();

  const session = await auth();
  const reservedSesionIds = session?.user?.id
    ? (
        await prisma.reserva.findMany({
          where: {
            userId: session.user.id,
            status: "PAID",
            sesion: { startsAt: { gte: new Date() } },
          },
          select: { sesionId: true },
        })
      ).map((reserva) => reserva.sesionId)
    : [];

  const sesiones = await prisma.sesion.findMany({
    where: {
      active: true,
      startsAt: { gte: new Date() },
      sede: { citySlug: city.slug },
    },
    include: {
      sede: { select: { name: true } },
      trainer: { select: { name: true, email: true } },
    },
    orderBy: { startsAt: "asc" },
    take: 200,
  });

  const events = sesiones.map((sesion) => ({
    id: sesion.id,
    title: sesion.title,
    startsAt: sesion.startsAt.toISOString(),
    levelLabel: sesion.levelLabel,
    sedeName: sesion.sede.name,
    trainerName:
      sesion.trainer.name ?? sesion.trainer.email ?? "Entrenador Once FC",
    isReserved: reservedSesionIds.includes(sesion.id),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-bone">
          Entrenamientos en {city.name}
        </h1>
        <p className="mt-1 text-sm text-bone/60">
          Elige un día con entrenamientos marcados para ver el detalle y apartar
          tu lugar.
        </p>
      </div>

      {events.length === 0 ? (
        <p className="text-sm text-bone/60">
          Todavía no hay entrenamientos publicados en {city.name}. Vuelve
          pronto.
        </p>
      ) : (
        <EventsCalendar events={events} />
      )}
    </div>
  );
}
