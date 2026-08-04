export function toGoogleCalendarDate(date: Date): string {
  return date
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z");
}

export function buildGoogleCalendarUrl({
  title,
  description,
  location,
  startsAt,
  durationMinutes,
}: {
  title: string;
  description: string | null;
  location: string;
  startsAt: Date;
  durationMinutes: number;
}): string {
  const endsAt = new Date(
    startsAt.getTime() + Math.max(durationMinutes, 1) * 60_000,
  );

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `Entrenamiento Once FC: ${title}`,
    dates: `${toGoogleCalendarDate(startsAt)}/${toGoogleCalendarDate(endsAt)}`,
    details: [
      `Sesion: ${title}`,
      description ? `Detalles: ${description}` : null,
      "Nos vemos en cancha. Llega 10 minutos antes.",
    ]
      .filter(Boolean)
      .join("\n"),
    location,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
