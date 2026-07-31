import { notFound } from "next/navigation";
import { requireSession } from "@/lib/auth-guards";
import { prisma } from "@/lib/prisma";
import { getCityBySlug } from "@/data/cities";

export default async function ReservarCiudadPage({
  params,
}: {
  params: { citySlug: string };
}) {
  await requireSession();

  const city = getCityBySlug(params.citySlug);
  if (!city) notFound();

  const rules = await prisma.trainerAvailability.findMany({
    where: { citySlug: city.slug },
    include: { trainer: { select: { id: true, name: true, email: true } } },
    distinct: ["trainerId"],
  });

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl text-bone">Entrenadores en {city.name}</h1>
      {rules.length === 0 ? (
        <p className="text-sm text-bone/60">
          Todavía no hay entrenadores con horarios disponibles en esta ciudad.
        </p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {rules.map((rule) => (
            <li key={rule.trainer.id}>
              <a
                href={`/reservar/${city.slug}/${rule.trainer.id}`}
                className="block rounded-sm border border-bone/10 px-4 py-3 text-bone transition hover:border-volt hover:text-volt"
              >
                {rule.trainer.name ?? rule.trainer.email}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
