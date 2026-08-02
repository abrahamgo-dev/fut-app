"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "admin-stats-view";
type ViewMode = "grid" | "list";

export type StatItem = { label: string; value: number; href: string };
export type StatGroup = { label: string; items: StatItem[] };

function GridIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <rect x="1" y="1" width="5" height="5" rx="0.5" fill="currentColor" />
      <rect x="8" y="1" width="5" height="5" rx="0.5" fill="currentColor" />
      <rect x="1" y="8" width="5" height="5" rx="0.5" fill="currentColor" />
      <rect x="8" y="8" width="5" height="5" rx="0.5" fill="currentColor" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <rect x="1" y="1.5" width="12" height="2" rx="0.5" fill="currentColor" />
      <rect x="1" y="6" width="12" height="2" rx="0.5" fill="currentColor" />
      <rect x="1" y="10.5" width="12" height="2" rx="0.5" fill="currentColor" />
    </svg>
  );
}

export default function AdminStatsPanel({ groups }: { groups: StatGroup[] }) {
  const [view, setView] = useState<ViewMode>("grid");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "grid" || stored === "list") setView(stored);
  }, []);

  function changeView(next: ViewMode) {
    setView(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <p className="font-mono text-xs uppercase tracking-widest text-bone/40">Resumen</p>
        <div className="inline-flex rounded-sm border border-bone/20 p-0.5">
          <button
            type="button"
            onClick={() => changeView("grid")}
            aria-label="Vista de cuadrícula"
            aria-pressed={view === "grid"}
            className={`flex h-7 w-7 items-center justify-center rounded-sm transition ${
              view === "grid" ? "bg-volt text-coal-deep" : "text-bone/50 hover:text-volt"
            }`}
          >
            <GridIcon />
          </button>
          <button
            type="button"
            onClick={() => changeView("list")}
            aria-label="Vista de lista"
            aria-pressed={view === "list"}
            className={`flex h-7 w-7 items-center justify-center rounded-sm transition ${
              view === "list" ? "bg-volt text-coal-deep" : "text-bone/50 hover:text-volt"
            }`}
          >
            <ListIcon />
          </button>
        </div>
      </div>

      {groups.map((group) => (
        <div key={group.label}>
          <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-bone/40">
            {group.label}
          </p>
          {view === "grid" ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {group.items.map((stat) => (
                <a
                  key={stat.label}
                  href={stat.href}
                  className="rounded-sm border border-bone/10 px-4 py-5 transition hover:border-volt"
                >
                  <p className="font-mono text-3xl text-volt">{stat.value}</p>
                  <p className="mt-1 text-sm text-bone/60">{stat.label}</p>
                </a>
              ))}
            </div>
          ) : (
            <ul className="divide-y divide-bone/10 rounded-sm border border-bone/10">
              {group.items.map((stat) => (
                <li key={stat.label}>
                  <a
                    href={stat.href}
                    className="flex items-center justify-between gap-4 px-4 py-3 transition hover:bg-volt/5"
                  >
                    <p className="text-sm text-bone/70">{stat.label}</p>
                    <p className="font-mono text-lg text-volt">{stat.value}</p>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
