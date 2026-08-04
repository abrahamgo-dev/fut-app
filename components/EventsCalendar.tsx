"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

export type CalendarEvent = {
  id: string;
  title: string;
  startsAt: string; // ISO instant
  levelLabel: string | null;
  sedeName: string;
  trainerName: string;
  isReserved?: boolean;
  price?: string | null;
  spotsLeft?: number | null;
};

const WEEKDAY_LABELS = ["LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB", "DOM"];

// One accent color (volt) for anything bookable, one neutral (bone) for
// anything in the past — no more per-level rainbow.
const VOLT_RGB = "182,255,59";
const BONE_RGB = "243,243,239";

function cellStyle(
  dayEvents: CalendarEvent[],
  isSelected: boolean,
  isPastDay: boolean,
): React.CSSProperties {
  if (dayEvents.length === 0) return {};

  const rgb = isPastDay ? BONE_RGB : VOLT_RGB;
  const fillAlpha = isSelected ? (isPastDay ? 0.16 : 0.48) : isPastDay ? 0.08 : 0.24;
  const background = `rgba(${rgb}, ${fillAlpha})`;
  const shadows = [`inset 0 0 0 1px rgba(${rgb}, ${isPastDay ? 0.35 : 0.75})`];
  if (isSelected) shadows.push(`0 0 0 2px rgba(${rgb}, ${isPastDay ? 0.35 : 0.7})`);

  return { background, boxShadow: shadows.join(", ") };
}

const MONTH_FORMAT = new Intl.DateTimeFormat("es-MX", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});
const LOCAL_DAY_KEY_FORMAT = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Mexico_City",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});
const TIME_FORMAT = new Intl.DateTimeFormat("es-MX", {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
  timeZone: "America/Mexico_City",
});

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function dayKey(year: number, month: number, day: number) {
  return `${year}-${pad(month + 1)}-${pad(day)}`;
}

function localDayKey(date: Date) {
  return LOCAL_DAY_KEY_FORMAT.format(date); // already "YYYY-MM-DD"
}

export default function EventsCalendar({
  events,
}: {
  events: CalendarEvent[];
}) {
  const eventsByDay = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const event of events) {
      const key = localDayKey(new Date(event.startsAt));
      const list = map.get(key) ?? [];
      list.push(event);
      map.set(key, list);
    }
    Array.from(map.values()).forEach((list) => {
      list.sort((a, b) => a.startsAt.localeCompare(b.startsAt));
    });
    return map;
  }, [events]);

  const todayKey = localDayKey(new Date());

  // Navigation is capped to the current calendar year — see clampToCurrentYear.
  const currentYear = useMemo(() => new Date().getUTCFullYear(), []);

  function clampToCurrentYear(year: number, month: number) {
    if (year < currentYear) return { year: currentYear, month: 0 };
    if (year > currentYear) return { year: currentYear, month: 11 };
    return { year, month };
  }

  const initial = useMemo(() => {
    // Past events are included so players can look back, but the calendar
    // should still default to the nearest upcoming day — not the earliest
    // day overall, which would land on a bygone January once history is in
    // the mix. Falls back to the most recent past day, then today.
    const sortedKeys = Array.from(eventsByDay.keys()).sort();
    const upcomingKey = sortedKeys.find((key) => key >= todayKey);
    const firstKey = upcomingKey ?? sortedKeys[sortedKeys.length - 1] ?? todayKey;
    const [year, month] = firstKey.split("-").map(Number);
    return { year, month: month - 1, selectedKey: firstKey };
  }, [eventsByDay, todayKey]);

  const fallbackCursor = useMemo(() => {
    const now = new Date();
    return { year: now.getUTCFullYear(), month: now.getUTCMonth() };
  }, []);
  const initialCursor =
    initial.year && initial.month >= 0
      ? clampToCurrentYear(initial.year, initial.month)
      : fallbackCursor;

  const [cursor, setCursor] = useState({
    year: initialCursor.year,
    month: initialCursor.month,
  });
  const [selectedKey, setSelectedKey] = useState(initial.selectedKey);

  const isAtEarliestMonth = cursor.year <= currentYear && cursor.month <= 0;
  const isAtLatestMonth = cursor.year >= currentYear && cursor.month >= 11;

  const monthAnchor = new Date(Date.UTC(cursor.year, cursor.month, 1));
  const firstWeekday = monthAnchor.getUTCDay(); // 0=Sun..6=Sat
  const leading = (firstWeekday + 6) % 7; // Monday-start offset
  const daysInMonth = new Date(
    Date.UTC(cursor.year, cursor.month + 1, 0),
  ).getUTCDate();

  const cells: {
    year: number;
    month: number;
    day: number;
    inMonth: boolean;
  }[] = [];
  const prevMonth = new Date(Date.UTC(cursor.year, cursor.month, 0));
  const daysInPrevMonth = prevMonth.getUTCDate();
  for (let i = leading - 1; i >= 0; i--) {
    cells.push({
      year: prevMonth.getUTCFullYear(),
      month: prevMonth.getUTCMonth(),
      day: daysInPrevMonth - i,
      inMonth: false,
    });
  }
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({ year: cursor.year, month: cursor.month, day, inMonth: true });
  }
  while (cells.length % 7 !== 0 || cells.length < 42) {
    const last = cells[cells.length - 1];
    const next = new Date(Date.UTC(last.year, last.month, last.day + 1));
    cells.push({
      year: next.getUTCFullYear(),
      month: next.getUTCMonth(),
      day: next.getUTCDate(),
      inMonth: false,
    });
    if (cells.length >= 42) break;
  }

  const selectedEvents = eventsByDay.get(selectedKey) ?? [];

  function goToMonth(delta: number) {
    const next = new Date(Date.UTC(cursor.year, cursor.month + delta, 1));
    setCursor(clampToCurrentYear(next.getUTCFullYear(), next.getUTCMonth()));
  }

  return (
    <div className="rounded-sm border border-bone/10">
      <div className="flex items-center justify-between border-b border-bone/10 px-5 py-4">
        <p className="font-display text-xl capitalize text-bone">
          {MONTH_FORMAT.format(monthAnchor)}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => goToMonth(-1)}
            disabled={isAtEarliestMonth}
            aria-label="Mes anterior"
            className="flex h-8 w-8 items-center justify-center rounded-sm border border-bone/20 text-bone/70 transition hover:border-volt hover:text-volt disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-bone/20 disabled:hover:text-bone/70"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => goToMonth(1)}
            disabled={isAtLatestMonth}
            aria-label="Mes siguiente"
            className="flex h-8 w-8 items-center justify-center rounded-sm border border-bone/20 text-bone/70 transition hover:border-volt hover:text-volt disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-bone/20 disabled:hover:text-bone/70"
          >
            →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 border-b border-bone/10 px-2 pt-3 sm:px-4">
        {WEEKDAY_LABELS.map((label) => (
          <div
            key={label}
            className="pb-2 text-center font-mono text-[10px] uppercase tracking-widest text-bone/40"
          >
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 px-2 pb-4 sm:px-4">
        {cells.map((cell) => {
          const key = dayKey(cell.year, cell.month, cell.day);
          const dayEvents = eventsByDay.get(key) ?? [];
          const isToday = key === todayKey;
          const isSelected = key === selectedKey;
          const isPastDay = key < todayKey;

          return (
            <button
              type="button"
              key={key}
              disabled={dayEvents.length === 0}
              onClick={() => setSelectedKey(key)}
              style={cellStyle(dayEvents, isSelected, isPastDay)}
              className={`flex h-16 flex-col items-center justify-center gap-1 rounded-sm py-1.5 transition sm:h-20 ${
                cell.inMonth ? "text-bone" : "text-bone/25"
              } ${dayEvents.length === 0 ? "cursor-default hover:bg-bone/5" : "cursor-pointer hover:brightness-125"}`}
            >
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full font-mono text-xs font-semibold ${
                  dayEvents.length > 0
                    ? isPastDay
                      ? "bg-coal-deep text-bone/50 ring-1 ring-bone/30"
                      : "bg-coal-deep text-volt ring-1 ring-volt/70"
                    : isToday
                      ? "bg-bone text-coal-deep"
                      : ""
                }`}
              >
                {cell.day}
              </span>
              {dayEvents.length > 0 ? (
                <span
                  className={`rounded-full border bg-coal-deep/85 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] ${
                    isPastDay ? "border-bone/30 text-bone/50" : "border-volt/60 text-volt"
                  }`}
                >
                  {dayEvents.length}{" "}
                  {dayEvents.length === 1 ? "sesión" : "sesiones"}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      <div className="border-t border-bone/10 px-5 py-5">
        {selectedEvents.length === 0 ? (
          <p className="text-sm text-bone/50">
            No hay entrenamientos este día.
          </p>
        ) : (
          <ul className="space-y-3">
            {selectedEvents.map((event) => {
              const isPast = new Date(event.startsAt).getTime() < Date.now();

              return (
                <li key={event.id}>
                  <Link
                    href={`/eventos/${event.id}`}
                    className={`flex flex-wrap items-center justify-between gap-4 rounded-sm border border-l-4 px-5 py-4 transition ${
                      isPast
                        ? "border-bone/10 border-l-bone/20 opacity-60 hover:opacity-80"
                        : "border-bone/10 border-l-volt/50 bg-bone/5 hover:border-volt/40 hover:bg-volt/5"
                    }`}
                  >
                    <div className="min-w-0">
                      <p
                        className={`truncate font-display text-lg ${isPast ? "text-bone/50" : "text-bone"}`}
                      >
                        {event.title}
                      </p>
                      <p
                        className={`mt-1 truncate text-sm ${isPast ? "text-bone/30" : "text-bone/60"}`}
                      >
                        {event.trainerName} · {event.sedeName}
                        {event.price ? ` · ${event.price}` : ""}
                      </p>
                    </div>
                    <div className="flex flex-shrink-0 items-center gap-3">
                      {isPast ? (
                        <span className="rounded-sm border border-bone/15 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-bone/40">
                          Finalizada
                        </span>
                      ) : event.isReserved ? (
                        <span className="rounded-sm border border-volt/60 bg-volt/15 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-volt">
                          Reservado
                        </span>
                      ) : event.spotsLeft != null && event.spotsLeft > 0 && event.spotsLeft <= 3 ? (
                        <span className="rounded-sm border border-volt/60 bg-volt/15 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-volt">
                          Quedan {event.spotsLeft}
                        </span>
                      ) : null}
                      {event.levelLabel ? (
                        <span
                          className={`rounded-sm border px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest ${
                            isPast ? "border-bone/15 text-bone/30" : "border-bone/20 text-bone/60"
                          }`}
                        >
                          {event.levelLabel}
                        </span>
                      ) : null}
                      <span
                        className={`font-mono scoreboard-num text-base ${isPast ? "text-bone/40" : "text-bone"}`}
                      >
                        {TIME_FORMAT.format(new Date(event.startsAt))}
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
