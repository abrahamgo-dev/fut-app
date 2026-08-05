"use client";

import { useAdminTheme } from "@/components/AdminThemeProvider";

export default function AdminThemeShell({
  nav,
  children,
}: {
  nav: React.ReactNode;
  children: React.ReactNode;
}) {
  const { theme } = useAdminTheme();

  return (
    <div
      data-admin-theme={theme}
      // Breaks out of the shared /panel layout's `max-w-5xl mx-auto` column —
      // the admin panel is data-dense and wants the full viewport width,
      // unlike the player-facing cuenta/entrenador pages that layout also
      // serves. margin: calc(50% - 50vw) is the standard full-bleed trick:
      // it re-centers on the viewport regardless of the parent's own width.
      className="ml-[calc(50%-50vw)] mr-[calc(50%-50vw)] min-h-[calc(100vh-6rem)] w-screen space-y-8 bg-coal-deep px-6 pt-6 pb-16 text-bone transition-colors sm:px-10 lg:px-16"
    >
      <div className="border-b border-bone/10 pb-4">{nav}</div>
      {children}
    </div>
  );
}
