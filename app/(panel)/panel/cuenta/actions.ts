"use server";

import { revalidatePath } from "next/cache";
import type { Prisma, Reserva, Sede, Sesion } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth-guards";
import { RESERVAS_PAGE_SIZE } from "@/lib/reservaPagination";

export async function cancelMyBooking(bookingId: string) {
  const session = await requireSession();

  await prisma.booking.updateMany({
    where: { id: bookingId, userId: session.user.id, status: "CONFIRMED" },
    data: { status: "CANCELLED", cancelledAt: new Date() },
  });

  revalidatePath("/panel/cuenta");
}

export type ReservaListItem = {
  id: string;
  sesionId: string;
  title: string;
  sedeName: string;
  sedeAddress: string;
  startsAtISO: string;
  durationMinutes: number;
  description: string | null;
  amountCents: number;
  status: string;
};

type ReservaWithSesion = Reserva & { sesion: Sesion & { sede: Sede } };

function toListItem(reserva: ReservaWithSesion): ReservaListItem {
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

// Fetches PAGE_SIZE + 1 rows so hasMore can be read off the response instead
// of running a separate count() query — page.length > PAGE_SIZE is enough to
// know whether another page exists.
async function fetchReservaPage(
  where: Prisma.ReservaWhereInput,
  skip: number,
): Promise<{ items: ReservaListItem[]; hasMore: boolean }> {
  const rows = await prisma.reserva.findMany({
    where,
    include: { sesion: { include: { sede: true } } },
    orderBy: { createdAt: "desc" },
    skip,
    take: RESERVAS_PAGE_SIZE + 1,
  });

  const hasMore = rows.length > RESERVAS_PAGE_SIZE;
  return { items: rows.slice(0, RESERVAS_PAGE_SIZE).map(toListItem), hasMore };
}

export async function loadMoreReservasActivas(skip: number) {
  const session = await requireSession();
  return fetchReservaPage(
    {
      userId: session.user.id,
      status: "PAID",
      sesion: { startsAt: { gte: new Date() } },
    },
    skip,
  );
}

export async function loadMoreHistorial(skip: number) {
  const session = await requireSession();
  return fetchReservaPage(
    {
      userId: session.user.id,
      OR: [{ status: "PAID" }, { status: "CANCELLED" }, { status: "EXPIRED" }],
      sesion: { startsAt: { lt: new Date() } },
    },
    skip,
  );
}
