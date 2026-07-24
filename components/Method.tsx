const pillars = [
  {
    n: "01",
    title: "Entrenadores certificados",
    body: "Todo el cuerpo técnico cuenta con licencia FMF y experiencia trabajando con jugadores adultos, no solo con niños.",
  },
  {
    n: "02",
    title: "Progresión por nivel",
    body: "El plan de cada grupo se construye sobre el anterior: de recuperar la forma a competir en serio.",
  },
  {
    n: "03",
    title: "Partidos todo el año",
    body: "Calendario de amistosos y torneos internos para que cada nivel compita, no solo entrene.",
  },
  {
    n: "04",
    title: "Comunidad de jugadores",
    body: "Grupo de WhatsApp, calendario de horarios y resultados, y una comunidad de adultos que también trabajan, tienen familia y aun así no dejan el fútbol.",
  },
];

export default function Method() {
  return (
    <section id="metodo" className="bg-coal-deep py-24 text-bone">
      <div className="mx-auto max-w-6xl px-6">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-volt">Método</p>
        <h2 className="mt-3 max-w-xl font-display text-4xl sm:text-5xl">
          Entrenamiento real, no solo cascarita
        </h2>

        <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2">
          {pillars.map((p) => (
            <div key={p.n} className="flex gap-5 border-t border-bone/15 pt-6">
              <span className="font-mono text-sm text-volt-dim">{p.n}</span>
              <div>
                <h3 className="font-display text-xl tracking-wide">{p.title}</h3>
                <p className="mt-2 max-w-sm font-body text-sm text-bone/70">{p.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
