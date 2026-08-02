"use client";

import { useState } from "react";
import Image from "next/image";
import { getLiveCities } from "@/data/cities";
import { PRELAUNCH_MODE } from "@/lib/launchFlags";

type HeroProps = {
  cityLabel?: string;
  citySlug?: string;
  /** True on city pages for cities we don't actually operate in yet (kept up
   * for SEO/geo reach) — copy shifts from "book now" to "coming soon". */
  comingSoon?: boolean;
};

// Staggered slide+fade entrance for the text column — each element animates in
// slightly after the previous one via animationDelay, respecting
// prefers-reduced-motion (handled globally in globals.css).
function reveal(delayMs: number): {
  className: string;
  style: React.CSSProperties;
} {
  return {
    className: "opacity-0 animate-[slide-fade-in_0.7s_ease-out_forwards]",
    style: { animationDelay: `${delayMs}ms` },
  };
}

export default function Hero({
  cityLabel = "México",
  citySlug,
  comingSoon = false,
}: HeroProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const citiesCount = getLiveCities().length;
  const reserveHref = citySlug ? "#prueba" : "#ciudades";

  const stats = [
    { value: "18+", label: "EDAD PARA JUGAR" },
    { value: "FLEXIBLE", label: "SIN MEMBRESÍA FIJA" },
    {
      value: String(citiesCount),
      label: citiesCount === 1 ? "CIUDAD" : "CIUDADES",
    },
  ];

  return (
    <section
      id="top"
      className="relative overflow-hidden bg-coal pt-32 pb-16 text-bone"
    >
      {!imageLoaded ? (
        <div
          className="absolute inset-0 animate-pulse bg-coal-deep"
          aria-hidden="true"
        >
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.4s_infinite] bg-gradient-to-r from-transparent via-bone/10 to-transparent" />
        </div>
      ) : null}
      <Image
        src="/pexels-franco-monsalvo-252430633-38092600.jpg"
        alt=""
        fill
        priority
        quality={90}
        sizes="100vw"
        onLoad={() => setImageLoaded(true)}
        className={`object-cover object-[75%_38%] transition-opacity duration-700 ease-out sm:object-[center_38%] ${
          imageLoaded ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-coal-deep/90 from-5% via-coal-deep/55 to-coal-deep/20"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-grid-lines"
        aria-hidden="true"
      />
      {/* Faded brand mark watermark — kept subtle (low opacity + screen blend
          so the black background disappears) rather than a loud logo stamp. */}
      <Image
        src="/once-fc-mark.png"
        alt=""
        aria-hidden="true"
        width={620}
        height={600}
        className="pointer-events-none absolute -right-16 top-1/2 hidden w-[26rem] -translate-y-1/2 opacity-[0.12] mix-blend-screen sm:block md:w-[34rem] lg:w-[40rem]"
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <p
          className={`font-mono text-xs uppercase tracking-[0.3em] text-volt ${reveal(0).className}`}
          style={reveal(0).style}
        >
          {comingSoon ? "Próximamente" : "Entrenamientos"} · {cityLabel}
        </p>

        <h1
          className={`mt-6 max-w-3xl font-display text-[13vw] leading-[0.9] tracking-tight sm:text-7xl md:text-8xl ${reveal(120).className}`}
          style={reveal(120).style}
        >
          ENTRENA
          <br />
          MEJORA
          <br />
          DISFRUTA <span className="text-outline">EL FÚTBOL</span>
        </h1>

        <div
          className={`mt-10 flex max-w-3xl flex-col gap-6 sm:flex-row sm:items-end sm:justify-between ${reveal(240).className}`}
          style={reveal(240).style}
        >
          <p className="max-w-md font-body text-lg text-bone/80">
            {comingSoon ? (
              <>
                Muy pronto vas a poder reservar entrenamientos para{" "}
                <strong className="text-volt">adultos</strong> en las mejores
                canchas de {cityLabel}. Déjanos tus datos y te avisamos apenas
                abramos.
              </>
            ) : (
              <>
                Reserva entrenamientos para{" "}
                <strong className="text-volt">adultos</strong> en las mejores
                canchas de la ciudad, con coaches de experiencia. Sin membresía
                fija: agenda cuando te acomode.
              </>
            )}
          </p>

          <div className="flex flex-shrink-0 gap-3">
            <a
              href={reserveHref}
              className="rounded-sm bg-volt px-6 py-3 text-center font-body text-sm font-semibold text-coal-deep transition hover:brightness-95"
            >
              {comingSoon
                ? "Avísenme cuando abran"
                : "Reserva tu entrenamiento gratis"}
            </a>
            {/* Points at the events list when it's live; pre-launch that
                section is hidden (mock data), so this points at Método
                instead — see lib/launchFlags.ts. */}
            <a
              href={PRELAUNCH_MODE ? "#metodo" : "#sesiones"}
              className="rounded-sm border border-bone/30 px-6 py-3 text-center font-body text-sm font-semibold text-bone transition hover:border-volt hover:text-volt"
            >
              {PRELAUNCH_MODE ? "Cómo funciona" : "Ver entrenamientos"}
            </a>
          </div>
        </div>

        <dl
          className={`mt-16 grid grid-cols-3 gap-3 border-t border-bone/15 pt-8 sm:gap-6 ${reveal(360).className}`}
          style={reveal(360).style}
        >
          {stats.map((stat) => (
            <div key={stat.label} className="min-w-0">
              <dt className="sr-only">{stat.label}</dt>
              <dd className="font-mono scoreboard-num truncate text-xl text-volt sm:text-3xl md:text-4xl">
                {stat.value}
              </dd>
              <dd className="mt-1 font-mono text-[9px] uppercase tracking-wide text-bone/60 sm:text-[11px] sm:tracking-widest">
                {stat.label}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
