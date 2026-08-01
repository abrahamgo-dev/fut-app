import Link from "next/link";
import type { City } from "@/data/cities";

export default function CityPicker({
  cities,
  showMoreCitiesCard = false,
}: {
  cities: City[];
  /** Only enable where the grid needs an extra tile to avoid a dangling empty
   * cell (e.g. 5 cities in a 3-column grid) — check the math before flipping
   * this on somewhere new. */
  showMoreCitiesCard?: boolean;
}) {
  return (
    <div className="grid grid-cols-1 gap-px overflow-hidden rounded-sm bg-bone/10 sm:grid-cols-2 lg:grid-cols-3">
      {cities.map((city) => {
        const comingSoon = city.status === "comingSoon";

        return (
          <Link
            key={city.slug}
            href={`/ciudades/${city.slug}`}
            className="group flex flex-col justify-between bg-coal-deep p-6 transition hover:bg-volt"
          >
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-2xl text-bone group-hover:text-coal-deep">
                  {city.name}
                </h3>
                {comingSoon ? (
                  <span className="rounded-sm border border-bone/25 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-bone/60 group-hover:border-coal-deep/40 group-hover:text-coal-deep/70">
                    Próximamente
                  </span>
                ) : null}
              </div>
              <p className="mt-2 font-body text-sm text-bone/60 group-hover:text-coal-deep/80">
                {city.state}
              </p>
            </div>
            <p className="mt-8 font-mono text-xs uppercase tracking-widest text-volt-dim group-hover:text-coal-deep">
              {comingSoon
                ? "Recibe aviso al abrir →"
                : "Ver entrenamientos y sedes →"}
            </p>
          </Link>
        );
      })}

      {showMoreCitiesCard ? (
        <a
          href="mailto:hola@once-fc.com?subject=Mi%20ciudad%20no%20est%C3%A1%20en%20la%20lista"
          className="group flex flex-col justify-between bg-coal-deep p-6 transition hover:bg-volt"
        >
          <div>
            <h3 className="font-display text-2xl text-bone group-hover:text-coal-deep">
              ¿Tu ciudad no está aquí?
            </h3>
            <p className="mt-2 font-body text-sm text-bone/60 group-hover:text-coal-deep/80">
              Escríbenos y te avisamos cuando lleguemos.
            </p>
          </div>
          <p className="mt-8 font-mono text-xs uppercase tracking-widest text-volt-dim group-hover:text-coal-deep">
            hola@once-fc.com →
          </p>
        </a>
      ) : null}
    </div>
  );
}
