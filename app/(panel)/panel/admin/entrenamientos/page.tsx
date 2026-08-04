import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getActiveCities, getCityBySlug } from "@/data/cities";

export default async function AdminEntrenamientosPage({
  searchParams,
}: {
  searchParams: { citySlug?: string; when?: string };
}) {
  const when = searchParams.when === "past" || searchParams.when === "all" ? searchParams.when : "upcoming";

  const where: Prisma.SesionWhereInput = {};
  if (searchParams.citySlug) where.sede = { citySlug: searchParams.citySlug };
  if (when === "upcoming") where.startsAt = { gte: new Date() };
  else if (when === "past") where.startsAt = { lt: new Date() };

  const sesiones = await prisma.sesion.findMany({
    where,
    include: {
      sede: true,
      trainer: { select: { name: true, email: true } },
      reservas: { select: { status: true } },
    },
    orderBy: { startsAt: when === "past" ? "desc" : "asc" },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-bone">Sesiones</h1>
        <p className="mt-1 text-sm text-bone/60">
          Elige una sesión para ver quién pagó y se anotó, o para agregar una inscripción
          manual.
        </p>
      </div>

      <form className="flex flex-wrap items-end gap-4">
        <label className="flex flex-col gap-1 text-sm text-bone/80">
          Ciudad
          <select
            name="citySlug"
            defaultValue={searchParams.citySlug ?? ""}
            className="rounded-sm border border-bone/20 bg-coal-deep px-3 py-2 text-bone"
          >
            <option value="">Todas</option>
            {getActiveCities().map((city) => (
              <option key={city.slug} value={city.slug}>
                {city.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm text-bone/80">
          Cuándo
          <select
            name="when"
            defaultValue={when}
            className="rounded-sm border border-bone/20 bg-coal-deep px-3 py-2 text-bone"
          >
            <option value="upcoming">Próximos</option>
            <option value="past">Pasados</option>
            <option value="all">Todos</option>
          </select>
        </label>
        <button
          type="submit"
          className="rounded-sm border border-bone/20 px-4 py-2 text-sm font-medium text-bone/80 transition hover:border-volt hover:text-volt"
        >
          Filtrar
        </button>
      </form>

      {sesiones.length === 0 ? (
        <p className="text-sm text-bone/60">No hay entrenamientos con estos filtros.</p>
      ) : (
        <ul className="divide-y divide-bone/10 rounded-sm border border-bone/10">
          {sesiones.map((sesion) => {
            const paidCount = sesion.reservas.filter((r) => r.status === "PAID").length;
            const pendingCount = sesion.reservas.filter((r) => r.status === "PENDING").length;
            const city = getCityBySlug(sesion.sede.citySlug);

            return (
              <li key={sesion.id}>
                <a
                  href={`/panel/admin/entrenamientos/${sesion.id}`}
                  className="flex flex-wrap items-center justify-between gap-4 px-4 py-3 transition hover:bg-volt/5"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-bone">
                      {sesion.title}
                      {sesion.levelLabel ? (
                        <span className="ml-2 rounded-sm border border-volt-dim/40 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-volt-dim">
                          {sesion.levelLabel}
                        </span>
                      ) : null}
                    </p>
                    <p className="truncate text-xs text-bone/50">
                      {sesion.trainer.name ?? sesion.trainer.email} · {sesion.sede.name}
                      {city ? `, ${city.name}` : ""} ·{" "}
                      {sesion.startsAt.toLocaleString("es-MX", {
                        dateStyle: "medium",
                        timeStyle: "short",
                        timeZone: "America/Mexico_City",
                      })}
                    </p>
                  </div>
                  <div className="flex flex-shrink-0 items-center gap-3 font-mono text-xs uppercase tracking-widest">
                    {sesion.cancelledAt ? (
                      <span className="rounded-sm border border-red-400/40 px-2 py-1 text-red-400">
                        Cancelado
                      </span>
                    ) : null}
                    <span className="rounded-sm border border-volt/40 px-2 py-1 text-volt">
                      {paidCount}
                      {sesion.capacity ? ` / ${sesion.capacity}` : ""} pagadas
                    </span>
                    {pendingCount > 0 ? (
                      <span className="rounded-sm border border-bone/20 px-2 py-1 text-bone/50">
                        {pendingCount} pendientes
                      </span>
                    ) : null}
                  </div>
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
