"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "admin-theme";
type Theme = "dark" | "light";

export default function AdminThemeShell({
  nav,
  children,
}: {
  nav: React.ReactNode;
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") setTheme(stored);
  }, []);

  function toggleTheme() {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      window.localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }

  return (
    <div
      data-admin-theme={theme}
      // Breaks out of the shared /panel layout's `max-w-5xl mx-auto` column —
      // the admin panel is data-dense and wants the full viewport width,
      // unlike the player-facing cuenta/entrenador pages that layout also
      // serves. margin: calc(50% - 50vw) is the standard full-bleed trick:
      // it re-centers on the viewport regardless of the parent's own width.
      className="ml-[calc(50%-50vw)] mr-[calc(50%-50vw)] min-h-[calc(100vh-6rem)] w-screen space-y-8 bg-coal-deep px-6 pt-6 text-bone transition-colors sm:px-10 lg:px-16"
    >
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-bone/10 pb-4">
        {nav}
        <button
          type="button"
          onClick={toggleTheme}
          className="rounded-sm border border-bone/20 px-3 py-1.5 font-mono text-xs uppercase tracking-widest text-bone/70 transition hover:border-volt hover:text-volt"
        >
          {theme === "dark" ? "Modo claro" : "Modo oscuro"}
        </button>
      </div>
      {children}
    </div>
  );
}
