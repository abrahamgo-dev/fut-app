const pillars = [
  {
    n: "01",
    title: "Sedes de calidad",
    body: "Elegimos las canchas por iluminación, césped y ubicación — no cualquier terreno. Cada sesión te dice exactamente dónde vas a jugar antes de reservar.",
  },
  {
    n: "02",
    title: "Reserva por sesión",
    body: "Sin membresía fija ni asistencia diaria obligatoria: agenda la sesión que te acomode, cuando te acomode.",
  },
  {
    n: "03",
    title: "Coaches con experiencia",
    body: "Un grupo pequeño de entrenadores con experiencia trabajando con jugadores adultos, no solo con niños.",
  },
  {
    n: "04",
    title: "Crece a tu ritmo",
    body: "Cada sesión indica su nivel — de iniciación a competitivo — para que elijas la que corresponda a tu condición, sin quedarte atado a un grupo fijo.",
  },
  {
    n: "05",
    title: "Partidos todo el año",
    body: "Calendario de amistosos y torneos para quienes quieren competir, no solo entrenar.",
  },
  {
    n: "06",
    title: "Comunidad de jugadores",
    body: "Grupo de WhatsApp, calendario de sesiones y resultados, y una comunidad de adultos que también trabajan, tienen familia y aun así no dejan el fútbol.",
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
