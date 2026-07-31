import { prisma } from "@/lib/prisma";
import { getCityBySlug } from "@/data/cities";
import { createSesion, deleteSesion, toggleSesionActive } from "./actions";

export default async function AdminSesionesPage() {
  const [sesiones, sedes, trainers] = await Promise.all([
    prisma.sesion.findMany({
      include: { sede: true, trainer: { select: { name: true, email: true } } },
      orderBy: { startsAt: "desc" },
      take: 100,
    }),
    prisma.sede.findMany({ where: { active: true }, orderBy: { name: "asc" } }),
    prisma.user.findMany({ where: { role: "TRAINER" }, orderBy: { name: "asc" } }),
  ]);

  const now = new Date();
  const canCreate = sedes.length > 0 && trainers.length > 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl text-bone">Próximas sesiones</h1>
        <p className="mt-1 text-sm text-bone/60">
          Combina una sede y un entrenador en una sesión pública. Aparecen en el sitio ordenadas
          por fecha, mientras estén activas y en el futuro.
        </p>
      </div>

      {sesiones.length === 0 ? (
        <p className="text-sm text-bone/60">Todavía no hay sesiones. Agrega la primera abajo.</p>
      ) : (
        <ul className="divide-y divide-bone/10 rounded-sm border border-bone/10">
          {sesiones.map((sesion) => {
            const isPast = sesion.startsAt < now;
            return (
              <li key={sesion.id} className="flex flex-wrap items-center justify-between gap-4 px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-bone">
                    {sesion.title}
                    {sesion.levelLabel ? (
                      <span className="ml-2 rounded-sm border border-volt-dim/40 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-volt-dim">
                        {sesion.levelLabel}
                      </span>
                    ) : null}
                    {!sesion.active ? (
                      <span className="ml-2 font-mono text-[10px] uppercase tracking-widest text-bone/40">
                        Inactiva
                      </span>
                    ) : isPast ? (
                      <span className="ml-2 font-mono text-[10px] uppercase tracking-widest text-bone/40">
                        Pasada
                      </span>
                    ) : null}
                  </p>
                  <p className="truncate text-xs text-bone/50">
                    {sesion.trainer.name ?? sesion.trainer.email} ·{" "}
                    {sesion.sede.name} ({getCityBySlug(sesion.sede.citySlug)?.name ?? sesion.sede.citySlug}) ·{" "}
                    {sesion.startsAt.toLocaleString("es-MX", {
                      dateStyle: "medium",
                      timeStyle: "short",
                      timeZone: "America/Mexico_City",
                    })}
                  </p>
                </div>

                <div className="flex flex-shrink-0 gap-2">
                  <form
                    action={async () => {
                      "use server";
                      await toggleSesionActive(sesion.id, !sesion.active);
                    }}
                  >
                    <button
                      type="submit"
                      className="rounded-sm border border-bone/20 px-3 py-1.5 text-xs font-medium text-bone/70 transition hover:border-volt hover:text-volt"
                    >
                      {sesion.active ? "Desactivar" : "Activar"}
                    </button>
                  </form>
                  <form
                    action={async () => {
                      "use server";
                      await deleteSesion(sesion.id);
                    }}
                  >
                    <button
                      type="submit"
                      className="rounded-sm border border-bone/20 px-3 py-1.5 text-xs font-medium text-bone/70 transition hover:border-red-400 hover:text-red-400"
                    >
                      Eliminar
                    </button>
                  </form>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <section>
        <h2 className="mb-4 font-display text-lg text-bone">Agregar sesión</h2>

        {!canCreate ? (
          <p className="max-w-md text-sm text-bone/60">
            Necesitas al menos una{" "}
            <a href="/panel/admin/sedes" className="text-volt hover:underline">
              sede
            </a>{" "}
            y un{" "}
            <a href="/panel/admin/entrenadores" className="text-volt hover:underline">
              entrenador
            </a>{" "}
            antes de poder publicar una sesión.
          </p>
        ) : (
          <form action={createSesion} className="grid max-w-md gap-4">
            <label className="flex flex-col gap-1 text-sm text-bone/80">
              Título
              <input
                type="text"
                name="title"
                required
                placeholder="Sesión de nivel intermedio"
                className="rounded-sm border border-bone/20 bg-coal-deep px-3 py-2 text-bone placeholder:text-bone/30"
              />
            </label>

            <label className="flex flex-col gap-1 text-sm text-bone/80">
              Sede
              <select
                name="sedeId"
                required
                className="rounded-sm border border-bone/20 bg-coal-deep px-3 py-2 text-bone"
              >
                {sedes.map((sede) => (
                  <option key={sede.id} value={sede.id}>
                    {sede.name} · {getCityBySlug(sede.citySlug)?.name ?? sede.citySlug}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1 text-sm text-bone/80">
              Entrenador
              <select
                name="trainerId"
                required
                className="rounded-sm border border-bone/20 bg-coal-deep px-3 py-2 text-bone"
              >
                {trainers.map((trainer) => (
                  <option key={trainer.id} value={trainer.id}>
                    {trainer.name ?? trainer.email ?? trainer.id}
                  </option>
                ))}
              </select>
            </label>

            <div className="flex gap-4">
              <label className="flex flex-1 flex-col gap-1 text-sm text-bone/80">
                Fecha
                <input
                  type="date"
                  name="date"
                  required
                  className="rounded-sm border border-bone/20 bg-coal-deep px-3 py-2 text-bone"
                />
              </label>
              <label className="flex flex-1 flex-col gap-1 text-sm text-bone/80">
                Hora
                <input
                  type="time"
                  name="time"
                  required
                  className="rounded-sm border border-bone/20 bg-coal-deep px-3 py-2 text-bone"
                />
              </label>
            </div>

            <div className="flex gap-4">
              <label className="flex flex-1 flex-col gap-1 text-sm text-bone/80">
                Duración (min)
                <input
                  type="number"
                  name="durationMinutes"
                  defaultValue={60}
                  min={15}
                  step={15}
                  required
                  className="rounded-sm border border-bone/20 bg-coal-deep px-3 py-2 text-bone"
                />
              </label>
              <label className="flex flex-1 flex-col gap-1 text-sm text-bone/80">
                Cupo (opcional)
                <input
                  type="number"
                  name="capacity"
                  min={1}
                  className="rounded-sm border border-bone/20 bg-coal-deep px-3 py-2 text-bone"
                />
              </label>
            </div>

            <label className="flex flex-col gap-1 text-sm text-bone/80">
              Nivel (opcional)
              <input
                type="text"
                name="levelLabel"
                placeholder="Intermedio"
                className="rounded-sm border border-bone/20 bg-coal-deep px-3 py-2 text-bone placeholder:text-bone/30"
              />
            </label>

            <label className="flex flex-col gap-1 text-sm text-bone/80">
              Descripción (opcional)
              <textarea
                name="description"
                rows={2}
                placeholder="Qué van a trabajar en esta sesión..."
                className="rounded-sm border border-bone/20 bg-coal-deep px-3 py-2 text-bone placeholder:text-bone/30"
              />
            </label>

            <button
              type="submit"
              className="rounded-sm bg-volt px-4 py-2 text-sm font-semibold text-coal-deep transition hover:bg-bone"
            >
              Publicar sesión
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
