import { prisma } from "@/lib/prisma";
import { getActiveCities, getCityBySlug } from "@/data/cities";
import { createSede, deleteSede, toggleSedeActive } from "./actions";

export default async function AdminSedesPage() {
  const sedes = await prisma.sede.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl text-bone">Sedes</h1>
        <p className="mt-1 text-sm text-bone/60">
          Las canchas donde entrenamos. Cada sesión que publiques debe apuntar a una de estas
          sedes.
        </p>
      </div>

      {sedes.length === 0 ? (
        <p className="text-sm text-bone/60">Todavía no hay sedes. Agrega la primera abajo.</p>
      ) : (
        <ul className="divide-y divide-bone/10 rounded-sm border border-bone/10">
          {sedes.map((sede) => (
            <li key={sede.id} className="flex flex-wrap items-center gap-4 px-4 py-3">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-sm bg-bone/5">
                {sede.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={sede.image} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="font-mono text-[10px] uppercase text-bone/30">Sin foto</span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-bone">
                  {sede.name}
                  {!sede.active ? (
                    <span className="ml-2 font-mono text-[10px] uppercase tracking-widest text-bone/40">
                      Inactiva
                    </span>
                  ) : null}
                </p>
                <p className="truncate text-xs text-bone/50">
                  {getCityBySlug(sede.citySlug)?.name ?? sede.citySlug} · {sede.address}
                </p>
              </div>

              <div className="flex flex-shrink-0 gap-2">
                <form
                  action={async () => {
                    "use server";
                    await toggleSedeActive(sede.id, !sede.active);
                  }}
                >
                  <button
                    type="submit"
                    className="rounded-sm border border-bone/20 px-3 py-1.5 text-xs font-medium text-bone/70 transition hover:border-volt hover:text-volt"
                  >
                    {sede.active ? "Desactivar" : "Activar"}
                  </button>
                </form>
                <form
                  action={async () => {
                    "use server";
                    await deleteSede(sede.id);
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
          ))}
        </ul>
      )}

      <section>
        <h2 className="mb-4 font-display text-lg text-bone">Agregar sede</h2>
        <form action={createSede} className="grid max-w-md gap-4">
          <label className="flex flex-col gap-1 text-sm text-bone/80">
            Nombre
            <input
              type="text"
              name="name"
              required
              placeholder="Cancha Los Pinos"
              className="rounded-sm border border-bone/20 bg-coal-deep px-3 py-2 text-bone placeholder:text-bone/30"
            />
          </label>

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
            Dirección / zona
            <input
              type="text"
              name="address"
              required
              placeholder="Av. Siempre Viva 123, Guadalupe"
              className="rounded-sm border border-bone/20 bg-coal-deep px-3 py-2 text-bone placeholder:text-bone/30"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm text-bone/80">
            Foto (URL, opcional)
            <input
              type="url"
              name="image"
              placeholder="https://..."
              className="rounded-sm border border-bone/20 bg-coal-deep px-3 py-2 text-bone placeholder:text-bone/30"
            />
          </label>

          <button
            type="submit"
            className="rounded-sm bg-volt px-4 py-2 text-sm font-semibold text-coal-deep transition hover:bg-bone"
          >
            Agregar sede
          </button>
        </form>
      </section>
    </div>
  );
}
