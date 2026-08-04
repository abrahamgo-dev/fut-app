"use client";

import { useSession } from "next-auth/react";

type FooterProps = {
  cityLabel?: string;
  scheduleNote?: string;
  contactEmail?: string;
};

export default function Footer({
  cityLabel = "Disponible por ciudad",
  scheduleNote = "Sesiones de 7:00 a 21:00 (según disponibilidad)",
  contactEmail = "hola@once-fc.com",
}: FooterProps) {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  return (
    <footer id="footer" className="scroll-mt-20 bg-coal-deep py-14 text-bone">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 sm:flex-row sm:justify-between">
        <div>
          <span className="font-display text-2xl">
            ONCE<span className="text-volt">FC</span>
          </span>
          <p className="mt-3 max-w-xs font-body text-sm text-bone/60">
            Reserva sesiones de entrenamiento de fútbol para adultos en canchas
            de calidad.
          </p>

          <div className="mt-6">
            <p className="font-mono text-xs uppercase tracking-widest text-volt">
              Síguenos
            </p>
            <div className="mt-3 flex items-center gap-3">
              <a
                href="https://www.instagram.com/oncefcmx"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram de Once FC"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-bone/10 text-bone transition hover:bg-volt hover:text-coal-deep"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-6 w-6"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://www.facebook.com/share/19E8odoKHS/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook de Once FC"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-bone/10 text-bone transition hover:bg-volt hover:text-coal-deep"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-6 w-6"
                >
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.891h-2.33v6.987C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-10 sm:flex sm:gap-16">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-volt">
              Contacto
            </p>
            <ul className="mt-3 space-y-1 font-body text-sm text-bone/70">
              <li>{contactEmail}</li>
            </ul>
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-volt">
              Sedes y horarios
            </p>
            <ul className="mt-3 space-y-1 font-body text-sm text-bone/70">
              <li>{cityLabel}</li>
              <li>{scheduleNote}</li>
            </ul>
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-volt">
              Ayuda
            </p>
            <ul className="mt-3 space-y-1 font-body text-sm text-bone/70">
              <li>
                <a href="/preguntas-frecuentes" className="hover:text-volt">
                  Preguntas frecuentes
                </a>
              </li>
              <li>
                <a href="/ciudades" className="hover:text-volt">
                  Todas las ciudades
                </a>
              </li>
              <li>
                <a
                  href={isAuthenticated ? "/panel/cuenta" : "/login"}
                  className="hover:text-volt"
                >
                  {isAuthenticated ? "Mis reservas" : "Iniciar sesión"}
                </a>
              </li>
              <li>
                <a href="/bolsa-de-trabajo" className="hover:text-volt">
                  Bolsa de trabajo
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-6xl flex-col-reverse items-center gap-6 border-t border-bone/10 px-6 pt-6 sm:flex-row sm:justify-between">
        <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-6">
          <p className="font-mono text-xs text-bone/60">
            © {new Date().getFullYear()} Once FC. Todos los derechos
            reservados.
          </p>
          <div className="flex items-center gap-4 font-mono text-xs text-bone/60">
            <a href="/terminos" className="hover:text-volt">
              Términos y condiciones
            </a>
            <a href="/privacidad" className="hover:text-volt">
              Aviso de privacidad
            </a>
          </div>
        </div>

        <a
          href="https://fenwebstudio.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 font-mono text-xs text-bone/40 transition hover:text-bone/70"
        >
          Hecho por
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/fen-webstudio-mark.png"
            alt="Fen Webstudio"
            className="h-3.5 w-auto opacity-80"
          />
          Fen Webstudio
        </a>
      </div>
    </footer>
  );
}
