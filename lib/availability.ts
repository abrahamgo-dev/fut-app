import { prisma } from "@/lib/prisma";

export type AvailableSlot = {
  trainerId: string;
  trainerName: string | null;
  citySlug: string;
  startsAt: Date;
  endsAt: Date;
};

// Fixed UTC offset for America/Mexico_City. Mexico's 2022 reform abolished DST
// for the central-time regions the club currently operates in (Monterrey,
// Guadalajara, CDMX). Revisit with a real timezone library if a city outside
// this zone is ever added.
const APP_TIMEZONE_OFFSET_MINUTES = -6 * 60;

function localToUtc(date: Date, hhmm: string): Date {
  const [hours, minutes] = hhmm.split(":").map(Number);
  const utcMidnight = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  return new Date(
    utcMidnight + (hours * 60 + minutes - APP_TIMEZONE_OFFSET_MINUTES) * 60_000
  );
}

export async function getAvailableSlots(opts: {
  citySlug: string;
  trainerId?: string;
  daysAhead?: number;
  now?: Date;
}): Promise<AvailableSlot[]> {
  const daysAhead = opts.daysAhead ?? 21;
  const now = opts.now ?? new Date();
  const windowEnd = new Date(now.getTime() + daysAhead * 24 * 60 * 60_000);

  const rules = await prisma.trainerAvailability.findMany({
    where: {
      citySlug: opts.citySlug,
      ...(opts.trainerId ? { trainerId: opts.trainerId } : {}),
    },
    include: { trainer: { select: { id: true, name: true } } },
  });

  if (rules.length === 0) return [];

  const trainerIds = Array.from(new Set(rules.map((rule) => rule.trainerId)));

  const bookings = await prisma.booking.findMany({
    where: {
      status: "CONFIRMED",
      trainerId: { in: trainerIds },
      startsAt: { gte: now, lte: windowEnd },
    },
    select: { trainerId: true, startsAt: true },
  });

  const booked = new Set(
    bookings.map((booking) => `${booking.trainerId}|${booking.startsAt.toISOString()}`)
  );

  const slots: AvailableSlot[] = [];

  for (let dayOffset = 0; dayOffset <= daysAhead; dayOffset++) {
    const day = new Date(now.getTime() + dayOffset * 24 * 60 * 60_000);
    const dayOfWeek = day.getUTCDay();

    for (const rule of rules) {
      if (rule.dayOfWeek !== dayOfWeek) continue;

      const [startHour, startMinute] = rule.startTime.split(":").map(Number);
      const [endHour, endMinute] = rule.endTime.split(":").map(Number);
      const startMinutes = startHour * 60 + startMinute;
      const endMinutes = endHour * 60 + endMinute;

      for (
        let minutes = startMinutes;
        minutes + rule.slotDurationMinutes <= endMinutes;
        minutes += rule.slotDurationMinutes
      ) {
        const hhmm = `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(
          minutes % 60
        ).padStart(2, "0")}`;
        const startsAt = localToUtc(day, hhmm);

        if (startsAt <= now || startsAt > windowEnd) continue;
        if (booked.has(`${rule.trainerId}|${startsAt.toISOString()}`)) continue;

        slots.push({
          trainerId: rule.trainerId,
          trainerName: rule.trainer.name,
          citySlug: rule.citySlug,
          startsAt,
          endsAt: new Date(startsAt.getTime() + rule.slotDurationMinutes * 60_000),
        });
      }
    }
  }

  return slots.sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime());
}
