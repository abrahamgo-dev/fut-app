import Link from "next/link";
import type { City } from "@/data/cities";

export default function CityPicker({ cities }: { cities: City[] }) {
  return (
    <div className="grid grid-cols-1 gap-px overflow-hidden rounded-sm bg-bone/10 sm:grid-cols-2 lg:grid-cols-3">
      {cities.map((city) => (
        <Link
          key={city.slug}
          href={`/ciudades/${city.slug}`}
          className="group flex flex-col justify-between bg-coal-deep p-6 transition hover:bg-volt"
        >
          <div>
            <h3 className="font-display text-2xl text-bone group-hover:text-coal-deep">
              {city.name}
            </h3>
            <p className="mt-2 font-body text-sm text-bone/60 group-hover:text-coal-deep/80">
              {city.state}
            </p>
          </div>
          <p className="mt-8 font-mono text-xs uppercase tracking-widest text-volt-dim group-hover:text-coal-deep">
            Ver sesiones y sedes →
          </p>
        </Link>
      ))}
    </div>
  );
}
