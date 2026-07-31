import { requireSession } from "@/lib/auth-guards";
import { getActiveCities } from "@/data/cities";

export default async function ReservarPage() {
  await requireSession();

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl text-bone">Reserva una sesión</h1>
      <p className="text-sm text-bone/60">Elige tu ciudad para ver entrenadores disponibles.</p>
      <ul className="grid gap-3 sm:grid-cols-2">
        {getActiveCities().map((city) => (
          <li key={city.slug}>
            <a
              href={`/reservar/${city.slug}`}
              className="block rounded-sm border border-bone/10 px-4 py-3 text-bone transition hover:border-volt hover:text-volt"
            >
              {city.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
