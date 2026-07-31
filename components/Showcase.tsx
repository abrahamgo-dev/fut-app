import Image from "next/image";

const shots = [
  {
    n: "01",
    src: "/izuddin-helmi-adnan-K5ChxJaheKI-unsplash.jpg",
    alt: "Cancha iluminada durante un entrenamiento nocturno",
    caption: "Entrenamiento nocturno",
    span: "sm:col-span-2 sm:aspect-[16/10]",
  },
  {
    n: "02",
    src: "/connor-coyne-OgqWLzWRSaI-unsplash.jpg",
    alt: "Jugador dominando el balón con la mirada en el control técnico",
    caption: "Control y técnica",
    span: "",
  },
];

export default function Showcase() {
  return (
    <section className="relative overflow-hidden bg-coal-deep py-24 text-bone">
      <div
        className="pointer-events-none absolute inset-0 bg-grid-lines opacity-60"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-volt">Así se vive</p>
            <h2 className="mt-3 font-display text-5xl leading-[0.92] tracking-tight sm:text-6xl md:text-7xl">
              CANCHA REAL
              <br />
              NIVEL <span className="text-outline">REAL</span>
            </h2>
          </div>
          <p className="max-w-sm font-body text-sm text-bone/60">
            Luz de cancha, césped de verdad y un balón que no deja de moverse: así se siente
            entrenar con nosotros, semana tras semana.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
          {shots.map((shot) => (
            <div
              key={shot.n}
              className={`group relative aspect-[4/5] overflow-hidden rounded-sm ${shot.span}`}
            >
              <Image
                src={shot.src}
                alt={shot.alt}
                fill
                sizes={
                  shot.span
                    ? "(min-width: 640px) 66vw, 100vw"
                    : "(min-width: 640px) 33vw, 100vw"
                }
                className="object-cover transition duration-700 ease-out group-hover:scale-105"
              />
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-coal-deep/85 via-coal-deep/5 to-transparent"
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute inset-0 opacity-0 ring-1 ring-inset ring-volt/40 transition group-hover:opacity-100"
                aria-hidden="true"
              />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-6">
                <p className="font-mono text-[11px] uppercase tracking-widest text-bone/80">
                  {shot.caption}
                </p>
                <p className="font-mono scoreboard-num text-2xl text-volt">{shot.n}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
