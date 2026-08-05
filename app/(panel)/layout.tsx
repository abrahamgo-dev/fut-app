import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  requireSession,
  isProfileComplete,
  PROFILE_COMPLETION_PATH,
} from "@/lib/auth-guards";
import LogoutButton from "@/components/LogoutButton";
import { AdminThemeProvider } from "@/components/AdminThemeProvider";
import AdminThemeToggle from "@/components/AdminThemeToggle";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireSession();
  const role = session.user.role;

  // Block every /panel and /reservar route behind the mandatory profile
  // step (name + phone + municipio) until it's filled in — for brand-new
  // accounts on their first login, and for existing accounts that predate
  // this field on their next one. The pathname header comes from
  // middleware.ts; without it we'd redirect the completion page to itself.
  const pathname = headers().get("x-pathname") ?? "";
  if (
    pathname !== PROFILE_COMPLETION_PATH &&
    !(await isProfileComplete(session.user.id))
  ) {
    redirect(`${PROFILE_COMPLETION_PATH}?onboarding=1`);
  }

  const links = [
    ...(role === "TRAINER" || role === "ADMIN"
      ? [{ href: "/panel/cuenta", label: "Mis reservas" }]
      : []),
    ...(role === "TRAINER" || role === "ADMIN"
      ? [{ href: "/panel/entrenador", label: "Panel entrenador" }]
      : []),
  ];
  const isAdminSection = pathname.startsWith("/panel/admin");

  return (
    <AdminThemeProvider>
      <div className="min-h-screen bg-coal-deep font-body text-bone">
        <header className="border-b border-bone/10 bg-coal-deep/95">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-4">
            <nav className="flex flex-wrap items-center gap-6">
              <a
                href="/"
                className="font-display text-lg tracking-wide text-bone"
              >
                ONCE<span className="text-volt">FC</span>
              </a>
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-bone/80 transition hover:text-volt"
                >
                  {link.label}
                </a>
              ))}
              {role === "ADMIN" && (
                <span className="flex items-center gap-2">
                  <a
                    href="/panel/admin"
                    className="text-sm font-medium text-bone/80 transition hover:text-volt"
                  >
                    Panel admin
                  </a>
                  {isAdminSection && <AdminThemeToggle />}
                </span>
              )}
            </nav>
            <div className="flex items-center gap-4">
              <span className="text-xs text-bone/50">{session.user.email}</span>
              <LogoutButton className="rounded-sm border border-bone/20 px-3 py-1.5 text-xs font-medium text-bone/80 transition hover:border-volt hover:text-volt" />
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
      </div>
    </AdminThemeProvider>
  );
}
