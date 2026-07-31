import { prisma } from "@/lib/prisma";
import { createTrainer, updateTrainerProfile } from "./actions";

export default async function AdminEntrenadoresPage() {
  const trainers = await prisma.user.findMany({
    where: { role: "TRAINER" },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl text-bone">Entrenadores</h1>
        <p className="mt-1 text-sm text-bone/60">
          Foto y bio que se muestran públicamente en las tarjetas de próximas sesiones. Para
          cambiar el rol de un usuario existente a entrenador, hazlo desde{" "}
          <a href="/panel/admin/usuarios" className="text-volt hover:underline">
            Usuarios
          </a>
          .
        </p>
      </div>

      {trainers.length === 0 ? (
        <p className="text-sm text-bone/60">
          Todavía no hay entrenadores. Agrega uno abajo o promueve a un usuario desde Usuarios.
        </p>
      ) : (
        <ul className="space-y-4">
          {trainers.map((trainer) => (
            <li key={trainer.id} className="rounded-sm border border-bone/10 p-4">
              <form
                action={updateTrainerProfile}
                className="flex flex-col gap-4 sm:flex-row sm:items-start"
              >
                <input type="hidden" name="userId" value={trainer.id} />

                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-bone/5">
                  {trainer.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={trainer.image}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="font-mono text-[10px] uppercase text-bone/30">Sin foto</span>
                  )}
                </div>

                <div className="grid flex-1 gap-3 sm:grid-cols-2">
                  <label className="flex flex-col gap-1 text-sm text-bone/80">
                    Nombre
                    <input
                      type="text"
                      name="name"
                      defaultValue={trainer.name ?? ""}
                      required
                      className="rounded-sm border border-bone/20 bg-coal-deep px-3 py-2 text-bone"
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-sm text-bone/80">
                    Foto (URL)
                    <input
                      type="url"
                      name="image"
                      defaultValue={trainer.image ?? ""}
                      placeholder="https://..."
                      className="rounded-sm border border-bone/20 bg-coal-deep px-3 py-2 text-bone placeholder:text-bone/30"
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-sm text-bone/80 sm:col-span-2">
                    Bio corta
                    <textarea
                      name="bio"
                      defaultValue={trainer.bio ?? ""}
                      rows={2}
                      placeholder="Licenciado en educación física, 8 años entrenando ligas amateur..."
                      className="rounded-sm border border-bone/20 bg-coal-deep px-3 py-2 text-bone placeholder:text-bone/30"
                    />
                  </label>
                  {trainer.email ? (
                    <p className="text-xs text-bone/40 sm:col-span-2">{trainer.email}</p>
                  ) : (
                    <p className="text-xs text-bone/40 sm:col-span-2">
                      Perfil de muestra · sin cuenta vinculada todavía
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="flex-shrink-0 self-start rounded-sm border border-bone/20 px-4 py-2 text-sm font-medium text-bone/80 transition hover:border-volt hover:text-volt"
                >
                  Guardar
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}

      <section>
        <h2 className="mb-4 font-display text-lg text-bone">Agregar entrenador de muestra</h2>
        <p className="mb-4 max-w-md text-sm text-bone/60">
          Crea un perfil de entrenador sin necesidad de que esa persona inicie sesión todavía —
          útil para llenar la sección de próximas sesiones mientras el equipo se une a la
          plataforma.
        </p>
        <form action={createTrainer} className="grid max-w-md gap-4">
          <label className="flex flex-col gap-1 text-sm text-bone/80">
            Nombre
            <input
              type="text"
              name="name"
              required
              placeholder="Coach Ana Torres"
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
          <label className="flex flex-col gap-1 text-sm text-bone/80">
            Bio corta (opcional)
            <textarea
              name="bio"
              rows={2}
              placeholder="Licenciada en educación física, 8 años entrenando ligas amateur..."
              className="rounded-sm border border-bone/20 bg-coal-deep px-3 py-2 text-bone placeholder:text-bone/30"
            />
          </label>
          <button
            type="submit"
            className="rounded-sm bg-volt px-4 py-2 text-sm font-semibold text-coal-deep transition hover:bg-bone"
          >
            Agregar entrenador
          </button>
        </form>
      </section>
    </div>
  );
}
