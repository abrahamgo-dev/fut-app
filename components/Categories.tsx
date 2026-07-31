import type { Level } from "@/data/cities";

const defaultLevels: Level[] = [
  {
    code: "N1",
    title: "Iniciación",
    focus: "Vuelve a moverse: técnica base y forma física, sin presión.",
    days: "Mar / Jue",
    time: "4:00 pm",
  },
  {
    code: "N2",
    title: "Intermedio",
    focus: "Táctica, posesión y ritmo real de juego.",
    days: "Lun / Mié",
    time: "5:00 pm",
  },
  {
    code: "N3",
    title: "Competitivo",
    focus: "Alta intensidad y partidos contra otros clubes.",
    days: "Lun a Jue",
    time: "8:00 pm",
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
    time: "6:00 pm",
  },
  {
    code: "LIB",
    title: "Liga libre",
    focus: "Partidos organizados, recreativos, solo por el gusto de jugar.",
    days: "Sáb",
    time: "5:00 pm",
  },
];

const AVAILABLE_SLOTS = [
  "7:00 am",
  "8:00 am",
  "4:00 pm",
  "5:00 pm",
  "6:00 pm",
  "7:00 pm",
  "8:00 pm",
  "9:00 pm",
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

        <p className="mt-6 max-w-2xl font-body text-sm text-ink/60">
          Entrenamos de 7 am a 9 pm, de lunes a sábado (no hay sesiones los viernes), sujeto a
          cancha y clima.
        </p>

        <p className="mt-10 font-mono text-xs uppercase tracking-widest text-ink/40 sm:hidden">
          Desliza para ver el horario completo →
        </p>

        <div className="mt-4 overflow-x-auto [contain:layout] sm:mt-12">
          <table className="w-full min-w-[600px] border-collapse">
            <caption className="sr-only">Horario disponible por nivel</caption>
            <thead>
              <tr>
                <th scope="col" className="w-1/3 border-b border-ink/15 pb-4 text-left">
                  <span className="font-mono text-xs uppercase tracking-widest text-ink/50">
                    Nivel
                  </span>
                </th>
                {AVAILABLE_SLOTS.map((slot) => (
                  <th
                    key={slot}
                    scope="col"
                    className="border-b border-ink/15 pb-4 text-center"
                  >
                    <span className="font-mono text-xs uppercase tracking-widest text-ink/50">
                      {slot}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {levels.map((level) => (
                <tr key={level.code}>
                  <th scope="row" className="border-b border-ink/10 py-5 pr-6 text-left align-top">
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono text-xs text-volt-dim">{level.code}</span>
                      <span className="font-display text-lg text-ink">{level.title}</span>
                    </div>
                    <p className="mt-1 max-w-xs font-body text-sm font-normal text-ink/60">
                      {level.focus}
                    </p>
                  </th>
                  {AVAILABLE_SLOTS.map((slot) => (
                    <td key={slot} className="border-b border-ink/10 py-5 text-center align-top">
                      {level.time === slot ? (
                        <div className="flex flex-col items-center gap-1.5">
                          <span className="h-2.5 w-2.5 rounded-full bg-volt" aria-hidden="true" />
                          <span className="font-mono text-[11px] uppercase tracking-widest text-ink/60">
                            {level.days}
                          </span>
                        </div>
                      ) : (
                        <span className="sr-only">No disponible</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
