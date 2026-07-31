import { notFound } from "next/navigation";
import { requireSession } from "@/lib/auth-guards";
import { prisma } from "@/lib/prisma";
import { getCityBySlug } from "@/data/cities";
import { getAvailableSlots } from "@/lib/availability";
import { createBooking } from "../../actions";

export default async function ReservarTrainerPage({
  params,
}: {
  params: { citySlug: string; trainerId: string };
}) {
  await requireSession();

  const city = getCityBySlug(params.citySlug);
  if (!city) notFound();

  const trainer = await prisma.user.findUnique({
    where: { id: params.trainerId },
    select: { id: true, name: true, email: true },
  });
  if (!trainer) notFound();

  const slots = await getAvailableSlots({ citySlug: city.slug, trainerId: trainer.id });

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl text-bone">
        {trainer.name ?? trainer.email} · {city.name}
      </h1>

      {slots.length === 0 ? (
        <p className="text-sm text-bone/60">
          No hay horarios disponibles en las próximas semanas.
        </p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {slots.map((slot) => (
            <li key={slot.startsAt.toISOString()}>
              <form
                action={async () => {
                  "use server";
                  await createBooking({
                    trainerId: trainer.id,
                    citySlug: city.slug,
                    startsAt: slot.startsAt.toISOString(),
                    endsAt: slot.endsAt.toISOString(),
                  });
                }}
              >
                <button
                  type="submit"
                  className="w-full rounded-sm border border-bone/10 px-4 py-3 text-left text-bone transition hover:border-volt hover:text-volt"
                >
                  {slot.startsAt.toLocaleString("es-MX", {
                    weekday: "long",
                    day: "numeric",
                    month: "short",
                    hour: "numeric",
                    minute: "2-digit",
                    timeZone: "America/Mexico_City",
                  })}
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
