"use client";

import { useState } from "react";
import Image from "next/image";
import { getActiveCities } from "@/data/cities";
import { PRELAUNCH_MODE } from "@/lib/launchFlags";

type HeroProps = {
  cityLabel?: string;
  citySlug?: string;
  sedesCount?: number;
};

export default function Hero({ cityLabel = "México", citySlug, sedesCount = 5 }: HeroProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const citiesCount = getActiveCities().length;
  const reserveHref = citySlug ? "#prueba" : "#ciudades";

  const stats = [
    { value: "18+", label: "EDAD PARA JUGAR" },
    { value: String(sedesCount), label: "SEDES DE CALIDAD" },
    { value: String(citiesCount), label: "CIUDADES" },
  ];

  return (
    <section
      id="top"
      className="relative overflow-hidden bg-coal pt-32 pb-16 text-bone"
    >
      {!imageLoaded ? (
        <div className="absolute inset-0 animate-pulse bg-coal-deep" aria-hidden="true">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.4s_infinite] bg-gradient-to-r from-transparent via-bone/10 to-transparent" />
        </div>
      ) : null}
      <Image
        src="/sven-kucinic-Z0KjmjxUsKs-unsplash.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        onLoad={() => setImageLoaded(true)}
        className={`object-cover object-[75%_15%] transition-opacity duration-700 ease-out ${
          imageLoaded ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-coal-deep from-10% via-coal-deep/75 to-coal-deep/40"
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute inset-0 bg-grid-lines" aria-hidden="true" />

      <div className="relative mx-auto max-w-6xl px-6">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-volt">
          Sesiones de entrenamiento · {cityLabel}
        </p>

        <h1 className="mt-6 max-w-3xl font-display text-[13vw] leading-[0.9] tracking-tight sm:text-7xl md:text-8xl">
          ENTRENA
          <br />
          MEJORA
          <br />
          DISFRUTA <span className="text-outline">EL FÚTBOL</span>
        </h1>

        <div className="mt-10 flex max-w-3xl flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <p className="max-w-md font-body text-lg text-bone/80">
            Reserva sesiones de entrenamiento para{" "}
            <strong className="text-volt">adultos</strong> en las mejores canchas de la
            ciudad, con coaches de experiencia. Sin membresía fija: agenda cuando te
            acomode.
          </p>

          <div className="flex flex-shrink-0 gap-3">
            <a
              href={reserveHref}
              className="rounded-sm bg-volt px-6 py-3 text-center font-body text-sm font-semibold text-coal-deep transition hover:brightness-95"
            >
              Reserva tu sesión gratis
            </a>
            {/* Points at the events list when it's live; pre-launch that
                section is hidden (mock data), so this points at Método
                instead — see lib/launchFlags.ts. */}
            <a
              href={PRELAUNCH_MODE ? "#metodo" : "#sesiones"}
              className="rounded-sm border border-bone/30 px-6 py-3 text-center font-body text-sm font-semibold text-bone transition hover:border-volt hover:text-volt"
            >
              {PRELAUNCH_MODE ? "Cómo funciona" : "Ver sesiones"}
            </a>
          </div>
        </div>

        <dl className="mt-16 grid grid-cols-3 gap-6 border-t border-bone/15 pt-8">
          {stats.map((stat) => (
            <div key={stat.label}>
              <dt className="sr-only">{stat.label}</dt>
              <dd className="font-mono scoreboard-num text-3xl text-volt sm:text-4xl">
                {stat.value}
              </dd>
              <dd className="mt-1 font-mono text-[11px] uppercase tracking-widest text-bone/60">
                {stat.label}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
