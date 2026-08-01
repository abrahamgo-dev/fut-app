import Image from "next/image";

const bigShot = {
  n: "01",
  src: "/izuddin-helmi-adnan-K5ChxJaheKI-unsplash.jpg",
  alt: "Cancha iluminada durante un entrenamiento nocturno, vista aérea",
  caption: "Iluminación profesional",
};

const smallShots = [
  {
    n: "02",
    src: "/connor-coyne-OgqWLzWRSaI-unsplash.jpg",
    alt: "Jugador dominando el balón con la mirada en el control técnico",
    caption: "Control y técnica",
  },
  {
    n: "03",
    src: "/sven-kucinic-Z0KjmjxUsKs-unsplash.jpg",
    alt: "Jugador rematando a gol en plena carrera",
    caption: "Remate a gol",
  },
  {
    n: "04",
    src: "/dmitry-ant-lTydd5V_cUE-unsplash.jpg",
    alt: "Cancha de pasto sintético vacía, vista aérea",
    caption: "Superficie de calidad",
  },
  {
    n: "05",
    src: "/sporlab-ggUrWc5Pg9o-unsplash.jpg",
    alt: "Partido nocturno en cancha con iluminación artificial",
    caption: "Ritmo de partido",
  },
];

function Tile({
  shot,
  sizes,
  className = "",
}: {
  shot: { n: string; src: string; alt: string; caption: string };
  sizes: string;
  className?: string;
}) {
  return (
    <div
      className={`group relative aspect-[4/5] overflow-hidden rounded-sm sm:aspect-auto ${className}`}
    >
      <Image
        src={shot.src}
        alt={shot.alt}
        fill
        sizes={sizes}
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
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 sm:p-5">
        <p className="font-mono text-[11px] uppercase tracking-widest text-bone/80">
          {shot.caption}
        </p>
        <p className="font-mono scoreboard-num text-xl text-volt">{shot.n}</p>
      </div>
    </div>
  );
}

export default function Showcase({ cityName }: { cityName?: string }) {
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
            Luz de cancha, césped de verdad y buena ubicación
            {cityName ? ` en ${cityName}` : ""}: así se siente entrenar con nosotros.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-4 sm:auto-rows-[14rem] sm:gap-5">
          <Tile
            shot={bigShot}
            sizes="(min-width: 640px) 50vw, 100vw"
            className="sm:col-span-2 sm:row-span-2"
          />
          {smallShots.map((shot) => (
            <Tile key={shot.n} shot={shot} sizes="(min-width: 640px) 25vw, 100vw" />
          ))}
        </div>
      </div>
    </section>
  );
}
