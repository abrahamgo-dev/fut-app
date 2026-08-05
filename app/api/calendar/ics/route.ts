import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

function toIcsDate(date: Date): string {
  return date
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z");
}

function escapeIcsText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\r\n|\r|\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  }

  const reservaId = req.nextUrl.searchParams.get("reserva_id");
  const sessionId = req.nextUrl.searchParams.get("session_id");
  if (!reservaId && !sessionId) {
    return NextResponse.json(
      { error: "Falta reserva_id o session_id." },
      { status: 400 },
    );
  }

  const reserva = reservaId
    ? await prisma.reserva.findUnique({
        where: { id: reservaId },
        include: { sesion: { include: { sede: true } } },
      })
    : await prisma.reserva.findUnique({
        where: { stripeCheckoutSessionId: sessionId! },
        include: { sesion: { include: { sede: true } } },
      });

  if (!reserva || reserva.userId !== session.user.id) {
    return NextResponse.json(
      { error: "Reserva no encontrada." },
      { status: 404 },
    );
  }

  if (reserva.status !== "PAID") {
    return NextResponse.json(
      { error: "La reserva aún no está confirmada." },
      { status: 409 },
    );
  }

  const startsAt = reserva.sesion.startsAt;
  const endsAt = new Date(
    startsAt.getTime() +
      Math.max(reserva.sesion.durationMinutes ?? 60, 1) * 60_000,
  );

  const title = `Entrenamiento Once FC: ${reserva.sesion.title}`;
  const descriptionLines = [
    `Sesión: ${reserva.sesion.title}`,
    reserva.sesion.description
      ? `Detalles: ${reserva.sesion.description}`
      : null,
    "Nos vemos en cancha. Llega 10 minutos antes.",
  ].filter(Boolean) as string[];
  const location = `${reserva.sesion.sede.name} - ${reserva.sesion.sede.address}`;

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Once FC//Reserva//ES",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${reserva.id}@oncefc.app`,
    `DTSTAMP:${toIcsDate(new Date())}`,
    `DTSTART:${toIcsDate(startsAt)}`,
    `DTEND:${toIcsDate(endsAt)}`,
    `SUMMARY:${escapeIcsText(title)}`,
    `DESCRIPTION:${escapeIcsText(descriptionLines.join("\n"))}`,
    `LOCATION:${escapeIcsText(location)}`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ].join("\r\n");

  const filename = `entrenamiento-once-fc-${reserva.id}.ics`;

  return new NextResponse(ics, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename=\"${filename}\"`,
      "Cache-Control": "private, no-store",
    },
  });
}
