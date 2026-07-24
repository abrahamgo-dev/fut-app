const stats = [
  { value: "18+", label: "EDAD PARA JUGAR" },
  { value: "3", label: "NIVELES DE JUEGO" },
  { value: "18", label: "ENTRENADORES CERT." },
  { value: "8", label: "AÑOS DE ONCE FC" },
];

export default function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-coal pt-32 pb-16 text-bone"
    >
      <div className="pointer-events-none absolute inset-0 bg-grid-lines" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-24 top-24 h-96 w-96 rounded-full border border-bone/10" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-10 top-40 h-64 w-64 rounded-full border border-volt/20" aria-hidden="true" />

      <div className="relative mx-auto max-w-6xl px-6">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-volt">
          Club de entrenamiento · México
        </p>

        <h1 className="mt-6 font-display text-[13vw] leading-[0.9] tracking-tight sm:text-7xl md:text-8xl">
          FÚTBOL PARA
          <br />
          LOS QUE YA NO
          <br />
          SON <span className="text-outline">NIÑOS</span>
        </h1>

        <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <p className="max-w-md font-body text-lg text-bone/80">
            Entrena, compite y mantente en forma en un club pensado para{" "}
            <strong className="text-volt">adultos</strong>: horarios después del trabajo,
            entrenadores certificados y partidos todo el año.
          </p>

          <div className="flex flex-shrink-0 gap-3">
            <a
              href="#prueba"
              className="rounded-sm bg-volt px-6 py-3 text-center font-body text-sm font-semibold text-coal-deep transition hover:brightness-95"
            >
              Reserva tu sesión gratis
            </a>
            <a
              href="#niveles"
              className="rounded-sm border border-bone/30 px-6 py-3 text-center font-body text-sm font-semibold text-bone transition hover:border-volt hover:text-volt"
            >
              Ver niveles
            </a>
          </div>
        </div>

        <dl className="mt-16 grid grid-cols-2 gap-6 border-t border-bone/15 pt-8 sm:grid-cols-4">
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
