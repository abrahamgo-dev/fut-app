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
};

const WEEKDAY_LABELS = ["LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB", "DOM"];

// rgb triplets (not hex) so they can be composed into rgba() fills/borders at
// different opacities for the calendar squares and agenda cards below.
const LEVEL_COLORS: Record<string, { rgb: string }> = {
  Mañanero: { rgb: "251,191,36" }, // amber-400
  Iniciación: { rgb: "56,189,248" }, // sky-400
  Intermedio: { rgb: "182,255,59" }, // brand volt
  Competitivo: { rgb: "251,113,133" }, // rose-400
  "Liga libre": { rgb: "167,139,250" }, // violet-400
};
const DEFAULT_COLOR = { rgb: "243,243,239" }; // bone

function colorFor(level: string | null) {
  if (!level) return DEFAULT_COLOR;
  return LEVEL_COLORS[level] ?? DEFAULT_COLOR;
}

function cellStyle(dayEvents: CalendarEvent[], isSelected: boolean): React.CSSProperties {
  if (dayEvents.length === 0) return {};

  const rgbs = Array.from(new Set(dayEvents.map((e) => colorFor(e.levelLabel).rgb)));
  const fillAlpha = isSelected ? 0.42 : 0.28;

  const background =
    rgbs.length === 1
      ? `rgba(${rgbs[0]}, ${fillAlpha})`
      : `linear-gradient(90deg, ${rgbs
          .map((rgb, i) => {
            const step = 100 / rgbs.length;
            return `rgba(${rgb}, ${fillAlpha}) ${i * step}%, rgba(${rgb}, ${fillAlpha}) ${(i + 1) * step}%`;
          })
          .join(", ")})`;

  const shadows = [`inset 0 0 0 1px rgba(${rgbs[0]}, 0.6)`];
  if (isSelected) shadows.push("0 0 0 2px #B6FF3B");

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

export default function EventsCalendar({ events }: { events: CalendarEvent[] }) {
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

  const initial = useMemo(() => {
    const firstKey = Array.from(eventsByDay.keys()).sort()[0] ?? todayKey;
    const [year, month] = firstKey.split("-").map(Number);
    return { year, month: month - 1, selectedKey: firstKey };
  }, [eventsByDay, todayKey]);

  const [cursor, setCursor] = useState({ year: initial.year, month: initial.month });
  const [selectedKey, setSelectedKey] = useState(initial.selectedKey);

  const monthAnchor = new Date(Date.UTC(cursor.year, cursor.month, 1));
  const firstWeekday = monthAnchor.getUTCDay(); // 0=Sun..6=Sat
  const leading = (firstWeekday + 6) % 7; // Monday-start offset
  const daysInMonth = new Date(Date.UTC(cursor.year, cursor.month + 1, 0)).getUTCDate();

  const cells: { year: number; month: number; day: number; inMonth: boolean }[] = [];
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
    setCursor({ year: next.getUTCFullYear(), month: next.getUTCMonth() });
  }

  const activeLevels = useMemo(() => {
    const set = new Set<string>();
    for (const event of events) {
      if (event.levelLabel) set.add(event.levelLabel);
    }
    return Array.from(set);
  }, [events]);

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
            aria-label="Mes anterior"
            className="flex h-8 w-8 items-center justify-center rounded-sm border border-bone/20 text-bone/70 transition hover:border-volt hover:text-volt"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => goToMonth(1)}
            aria-label="Mes siguiente"
            className="flex h-8 w-8 items-center justify-center rounded-sm border border-bone/20 text-bone/70 transition hover:border-volt hover:text-volt"
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

          return (
            <button
              type="button"
              key={key}
              disabled={dayEvents.length === 0}
              onClick={() => setSelectedKey(key)}
              style={cellStyle(dayEvents, isSelected)}
              className={`flex h-16 flex-col items-center justify-center gap-1 rounded-sm py-1.5 transition sm:h-20 ${
                cell.inMonth ? "text-bone" : "text-bone/25"
              } ${dayEvents.length === 0 ? "cursor-default hover:bg-bone/5" : "cursor-pointer hover:brightness-125"}`}
            >
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full font-mono text-xs ${
                  isToday ? "bg-bone text-coal-deep" : ""
                }`}
              >
                {cell.day}
              </span>
              {dayEvents.length > 1 ? (
                <span className="font-mono text-[10px] text-bone/70">{dayEvents.length}</span>
              ) : null}
            </button>
          );
        })}
      </div>

      {activeLevels.length > 0 ? (
        <div className="flex flex-wrap gap-x-4 gap-y-2 border-t border-bone/10 px-5 py-4">
          {activeLevels.map((level) => (
            <span key={level} className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-bone/50">
              <span
                className="h-2.5 w-2.5 rounded-[2px]"
                style={{ backgroundColor: `rgb(${colorFor(level).rgb})` }}
              />
              {level}
            </span>
          ))}
        </div>
      ) : null}

      <div className="border-t border-bone/10 px-5 py-5">
        {selectedEvents.length === 0 ? (
          <p className="text-sm text-bone/50">No hay sesiones este día.</p>
        ) : (
          <ul className="space-y-3">
            {selectedEvents.map((event) => {
              const color = colorFor(event.levelLabel);
              return (
                <li key={event.id}>
                  <Link
                    href={`/eventos/${event.id}`}
                    style={{
                      borderLeftColor: `rgb(${color.rgb})`,
                      background: `linear-gradient(90deg, rgba(${color.rgb}, 0.1), rgba(${color.rgb}, 0.02) 70%)`,
                    }}
                    className="flex flex-wrap items-center justify-between gap-4 rounded-sm border border-l-4 border-bone/10 px-5 py-4 transition hover:brightness-125"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-display text-lg text-bone">{event.title}</p>
                      <p className="mt-1 truncate text-sm text-bone/60">
                        {event.trainerName} · {event.sedeName}
                      </p>
                    </div>
                    <div className="flex flex-shrink-0 items-center gap-3">
                      {event.levelLabel ? (
                        <span
                          className="rounded-sm px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest"
                          style={{
                            backgroundColor: `rgba(${color.rgb}, 0.18)`,
                            color: `rgb(${color.rgb})`,
                          }}
                        >
                          {event.levelLabel}
                        </span>
                      ) : null}
                      <span className="font-mono scoreboard-num text-base text-bone">
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
