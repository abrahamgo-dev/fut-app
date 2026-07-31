import type { Metadata } from "next";
import { requireSession } from "@/lib/auth-guards";
import { signOut } from "@/auth";

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

  const links = [
    { href: "/reservar", label: "Reservar" },
    { href: "/panel/cuenta", label: "Mi cuenta" },
    ...(role === "TRAINER" || role === "ADMIN"
      ? [{ href: "/panel/entrenador", label: "Panel entrenador" }]
      : []),
    ...(role === "ADMIN" ? [{ href: "/panel/admin", label: "Panel admin" }] : []),
  ];

  return (
    <div className="min-h-screen bg-coal-deep font-body text-bone">
      <header className="border-b border-bone/10 bg-coal-deep/95">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <nav className="flex flex-wrap items-center gap-6">
            <a href="/" className="font-display text-lg tracking-wide text-bone">
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
          </nav>
          <div className="flex items-center gap-4">
            <span className="text-xs text-bone/50">{session.user.email}</span>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button
                type="submit"
                className="rounded-sm border border-bone/20 px-3 py-1.5 text-xs font-medium text-bone/80 transition hover:border-volt hover:text-volt"
              >
                Cerrar sesión
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
    </div>
  );
}
