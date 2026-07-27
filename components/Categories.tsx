import type { Level } from "@/data/cities";

const defaultLevels: Level[] = [
  {
    code: "N1",
    title: "Iniciación",
    focus: "Vuelve a moverse: técnica base y forma física, sin presión.",
    days: "Mar / Jue",
    time: "12:00 pm",
  },
  {
    code: "N2",
    title: "Intermedio",
    focus: "Táctica, posesión y ritmo real de juego.",
    days: "Lun / Mié / Vie",
    time: "5:00 pm",
  },
  {
    code: "N3",
    title: "Competitivo",
    focus: "Alta intensidad y partidos contra otros clubes.",
    days: "Lun a Vie",
    time: "7:00 pm",
    limited: true,
  },
  {
    code: "AM",
    title: "Mañanero",
    focus: "Sesión de 7 a 8 am, antes de entrar a la oficina.",
    days: "Mar / Jue / Sáb",
    time: "7:00 am",
  },
  {
    code: "GYM",
    title: "Fuerza & core",
    focus: "Acondicionamiento físico y prevención de lesiones.",
    days: "Lun / Mié",
    time: "12:00 pm",
  },
  {
    code: "LIB",
    title: "Liga libre",
    focus: "Partidos organizados, recreativos, solo por el gusto de jugar.",
    days: "Sáb",
    time: "5:00 pm",
  },
];

export default function Categories({ levels = defaultLevels }: { levels?: Level[] }) {
  return (
    <section id="niveles" className="bg-bone py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-ink/70">
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
                <span className="font-mono scoreboard-num text-sm text-ink/60 group-hover:text-volt">
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
                <p className="mt-3 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-ink/70 group-hover:text-bone/70">
                  {level.time}
                  {level.limited ? (
                    <span className="rounded-sm bg-volt-dim px-2 py-0.5 text-[10px] font-semibold normal-case tracking-normal text-coal-deep">
                      Cupo limitado
                    </span>
                  ) : null}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
