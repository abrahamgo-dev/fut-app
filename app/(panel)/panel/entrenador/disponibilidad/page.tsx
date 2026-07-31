import { requireRole } from "@/lib/auth-guards";
import { prisma } from "@/lib/prisma";
import { getActiveCities, getCityBySlug } from "@/data/cities";
import { createAvailabilityRule, deleteAvailabilityRule } from "./actions";

const DAY_LABELS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

export default async function TrainerAvailabilityPage() {
  const session = await requireRole(["TRAINER", "ADMIN"]);

  const rules = await prisma.trainerAvailability.findMany({
    where: { trainerId: session.user.id },
    orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
  });

  return (
    <div className="space-y-8">
      <h1 className="font-display text-2xl text-bone">Mi disponibilidad</h1>

      <section>
        <h2 className="mb-4 font-display text-lg text-bone">Reglas semanales</h2>
        {rules.length === 0 ? (
          <p className="text-sm text-bone/60">
            Todavía no tienes horarios configurados. Agrega uno abajo.
          </p>
        ) : (
          <ul className="divide-y divide-bone/10 rounded-sm border border-bone/10">
            {rules.map((rule) => (
              <li
                key={rule.id}
                className="flex flex-wrap items-center justify-between gap-4 px-4 py-3"
              >
                <p className="text-sm text-bone">
                  {getCityBySlug(rule.citySlug)?.name ?? rule.citySlug} ·{" "}
                  {DAY_LABELS[rule.dayOfWeek]} · {rule.startTime}–{rule.endTime} · sesiones de{" "}
                  {rule.slotDurationMinutes} min
                </p>
                <form
                  action={async () => {
                    "use server";
                    await deleteAvailabilityRule(rule.id);
                  }}
                >
                  <button
                    type="submit"
                    className="rounded-sm border border-bone/20 px-3 py-1.5 text-xs font-medium text-bone/70 transition hover:border-red-400 hover:text-red-400"
                  >
                    Eliminar
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="mb-4 font-display text-lg text-bone">Agregar horario</h2>
        <form action={createAvailabilityRule} className="grid max-w-md gap-4">
          <label className="flex flex-col gap-1 text-sm text-bone/80">
            Ciudad
            <select
              name="citySlug"
              required
              className="rounded-sm border border-bone/20 bg-coal-deep px-3 py-2 text-bone"
            >
              {getActiveCities().map((city) => (
                <option key={city.slug} value={city.slug}>
                  {city.name}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1 text-sm text-bone/80">
            Día
            <select
              name="dayOfWeek"
              required
              className="rounded-sm border border-bone/20 bg-coal-deep px-3 py-2 text-bone"
            >
              {DAY_LABELS.map((label, index) => (
                <option key={label} value={index}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <div className="flex gap-4">
            <label className="flex flex-1 flex-col gap-1 text-sm text-bone/80">
              Hora inicio
              <input
                type="time"
                name="startTime"
                required
                className="rounded-sm border border-bone/20 bg-coal-deep px-3 py-2 text-bone"
              />
            </label>
            <label className="flex flex-1 flex-col gap-1 text-sm text-bone/80">
              Hora fin
              <input
                type="time"
                name="endTime"
                required
                className="rounded-sm border border-bone/20 bg-coal-deep px-3 py-2 text-bone"
              />
            </label>
          </div>

          <label className="flex flex-col gap-1 text-sm text-bone/80">
            Duración de sesión (minutos)
            <input
              type="number"
              name="slotDurationMinutes"
              defaultValue={60}
              min={15}
              step={15}
              required
              className="rounded-sm border border-bone/20 bg-coal-deep px-3 py-2 text-bone"
            />
          </label>

          <button
            type="submit"
            className="rounded-sm bg-volt px-4 py-2 text-sm font-semibold text-coal-deep transition hover:bg-bone"
          >
            Agregar horario
          </button>
        </form>
      </section>
    </div>
  );
}
