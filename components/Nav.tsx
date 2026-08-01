"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import CityDropdown from "@/components/CityDropdown";
import { getActiveCities } from "@/data/cities";
import { PRELAUNCH_MODE } from "@/lib/launchFlags";

export default function Nav({
  cityName,
  citySlug,
}: {
  cityName?: string;
  citySlug?: string;
}) {
  const [open, setOpen] = useState(false);
  const cities = getActiveCities();
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated" && !!session?.user;
  const userLabel = session?.user?.name ?? session?.user?.email ?? "";
  const userInitial = userLabel.slice(0, 1).toUpperCase() || "?";
  const pathname = usePathname();

  // "Niveles" and "Método" are sections that only live on the home page and
  // on city pages — everywhere else we need to navigate home first, then
  // scroll to the section, instead of linking to a hash that doesn't exist
  // on the current page.
  const hasPageSections =
    pathname === "/" || /^\/ciudades\/[^/]+$/.test(pathname);
  const sectionHref = (id: string) => (hasPageSections ? `#${id}` : `/#${id}`);

  const links = [
    // Hidden pre-launch: the events list is still seed/mock data — see
    // lib/launchFlags.ts.
    ...(PRELAUNCH_MODE ? [] : [{ href: sectionHref("sesiones"), label: "Eventos" }]),
    { href: sectionHref("metodo"), label: "Método" },
    { href: "/preguntas-frecuentes", label: "Preguntas" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 border-b border-bone/10 bg-coal-deep/90 backdrop-blur ${
        open ? "h-dvh overflow-y-auto md:h-auto md:overflow-visible" : ""
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="flex items-center gap-2"
          onClick={() => setOpen(false)}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="14" cy="14" r="13" stroke="#B6FF3B" strokeWidth="1.5" />
            <path d="M14 5 L18 9 L16.5 14 L11.5 14 L10 9 Z" fill="#B6FF3B" />
            <path
              d="M14 5 V1.5 M14 27 V23 M2 14 H5.5 M22.5 14 H26"
              stroke="#B6FF3B"
              strokeWidth="1.2"
            />
          </svg>
          <span className="font-display text-xl tracking-wide text-bone">
            ONCE<span className="text-volt">FC</span>
          </span>
          {cityName ? (
            <span className="ml-1 font-mono text-xs uppercase tracking-widest text-bone/50">
              {cityName}
            </span>
          ) : null}
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="font-body text-sm font-medium text-bone/80 transition hover:text-volt"
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <CityDropdown cities={cities} currentSlug={citySlug} />
          </li>
        </ul>

        <div className="flex items-center gap-3">
          {/* Hidden pre-launch: accounts aren't ready for public sign-in yet
              — see lib/launchFlags.ts. */}
          {!PRELAUNCH_MODE ? (
            isAuthenticated ? (
              <a
                href="/panel/cuenta"
                aria-label="Mi cuenta"
                className="hidden h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-bone/10 font-mono text-xs font-semibold text-bone transition hover:ring-2 hover:ring-volt md:flex"
              >
                {session?.user?.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={session.user.image}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  userInitial
                )}
              </a>
            ) : (
              <a
                href="/login"
                className="hidden font-body text-sm font-medium text-bone/80 transition hover:text-volt md:inline-block"
              >
                Iniciar sesión
              </a>
            )
          ) : null}

          <a
            href={cityName ? "#prueba" : "/ciudades"}
            className="hidden rounded-sm bg-volt px-4 py-2 font-body text-sm font-semibold text-coal-deep transition hover:bg-bone md:inline-block"
          >
            Reserva tu sesión
          </a>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            className="flex h-9 w-9 items-center justify-center text-bone md:hidden"
          >
            {open ? (
              <svg
                width="20"
                height="20"
                viewBox="0 0 22 22"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M2 2L20 20M20 2L2 20"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 22 22"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M2 5H20M2 11H20M2 17H20"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {open ? (
        <div
          id="mobile-menu"
          className="border-t border-bone/10 bg-coal-deep px-6 py-6 md:hidden"
        >
          <ul className="flex flex-col gap-4">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block font-body text-base font-medium text-bone/80 transition hover:text-volt"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-6 border-t border-bone/10 pt-6">
            <p className="font-mono text-xs uppercase tracking-widest text-bone/50">
              Ciudades
            </p>
            <ul className="mt-3 flex flex-col gap-3">
              {cities.map((city) => (
                <li key={city.slug}>
                  <Link
                    href={`/ciudades/${city.slug}`}
                    onClick={() => setOpen(false)}
                    className={`block font-body text-base transition hover:text-volt ${
                      city.slug === citySlug ? "text-volt" : "text-bone/80"
                    }`}
                  >
                    {city.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <a
            href={cityName ? "#prueba" : "/ciudades"}
            onClick={() => setOpen(false)}
            className="mt-6 block rounded-sm bg-volt px-4 py-3 text-center font-body text-sm font-semibold text-coal-deep transition hover:bg-bone"
          >
            Reserva tu sesión
          </a>
          {!PRELAUNCH_MODE ? (
            isAuthenticated ? (
              <a
                href="/panel/cuenta"
                onClick={() => setOpen(false)}
                className="mt-3 flex items-center justify-center gap-2 rounded-sm border border-bone/20 px-4 py-3 text-center font-body text-sm font-semibold text-bone/80 transition hover:border-volt hover:text-volt"
              >
                <span className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full bg-bone/10 font-mono text-[10px] font-semibold text-bone">
                  {session?.user?.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={session.user.image}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    userInitial
                  )}
                </span>
                Mi cuenta
              </a>
            ) : (
              <a
                href="/login"
                onClick={() => setOpen(false)}
                className="mt-3 block rounded-sm border border-bone/20 px-4 py-3 text-center font-body text-sm font-semibold text-bone/80 transition hover:border-volt hover:text-volt"
              >
                Iniciar sesión
              </a>
            )
          ) : null}
        </div>
      ) : null}
    </header>
  );
}
