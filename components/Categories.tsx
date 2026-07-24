const levels = [
  {
    code: "N1",
    title: "Iniciación",
    focus: "Vuelve a moverse: técnica base y forma física, sin presión.",
    days: "Mar / Jue",
  },
  {
    code: "N2",
    title: "Intermedio",
    focus: "Táctica, posesión y ritmo real de juego.",
    days: "Lun / Mié / Vie",
  },
  {
    code: "N3",
    title: "Competitivo",
    focus: "Alta intensidad y partidos contra otros clubes.",
    days: "Lun a Vie",
  },
  {
    code: "AM",
    title: "Mañanero",
    focus: "Sesión de 7 a 8 am, antes de entrar a la oficina.",
    days: "Mar / Jue / Sáb",
  },
  {
    code: "GYM",
    title: "Fuerza & core",
    focus: "Acondicionamiento físico y prevención de lesiones.",
    days: "Lun / Mié",
  },
  {
    code: "LIB",
    title: "Liga libre",
    focus: "Partidos organizados, recreativos, solo por el gusto de jugar.",
    days: "Sáb",
  },
];

export default function Categories() {
  return (
    <section id="niveles" className="bg-bone py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-graphite">
              Elige tu ritmo
            </p>
            <h2 className="mt-3 font-display text-4xl text-ink sm:text-5xl">
              Un nivel para cada jugador
            </h2>
          </div>
          <p className="max-w-sm font-body text-sm text-ink/60">
            Aquí no hay edades, hay niveles: entra al grupo que corresponda a tu condición y
            experiencia, y sube cuando estés listo.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-sm bg-ink/10 sm:grid-cols-2 lg:grid-cols-3">
          {levels.map((level) => (
            <div
              key={level.code}
              className="group flex flex-col justify-between bg-bone p-6 transition hover:bg-coal"
            >
              <div className="flex items-baseline justify-between">
                <span className="font-mono scoreboard-num text-sm text-graphite group-hover:text-volt">
                  {level.days}
                </span>
                <span className="font-display text-2xl text-ink group-hover:text-bone">
                  {level.code}
                </span>
              </div>
              <div className="mt-8">
                <p className="font-body text-sm font-semibold text-ink group-hover:text-volt">
                  {level.title}
                </p>
                <p className="mt-2 font-body text-sm text-ink/70 group-hover:text-bone/80">
                  {level.focus}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
