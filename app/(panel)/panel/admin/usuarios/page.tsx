import { prisma } from "@/lib/prisma";
import { setUserRole, updateUserContact } from "./actions";

const ROLES = ["USER", "TRAINER", "ADMIN"] as const;

export default async function AdminUsuariosPage() {
  const users = await prisma.user.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl text-bone">Usuarios</h1>

      <ul className="divide-y divide-bone/10 rounded-sm border border-bone/10">
        {users.map((user) => (
          <li key={user.id} className="flex flex-wrap items-center justify-between gap-4 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-bone">{user.name ?? "Sin nombre"}</p>
              <p className="text-xs text-bone/50">{user.email}</p>
              {(!user.phone || !user.municipio) && (
                <p className="mt-1 text-[11px] uppercase tracking-widest text-amber-300">
                  Perfil incompleto
                </p>
              )}
            </div>
            <form action={updateUserContact} className="flex flex-wrap items-center gap-2">
              <input type="hidden" name="userId" value={user.id} />
              <input
                type="tel"
                name="phone"
                defaultValue={user.phone ?? ""}
                placeholder="Teléfono"
                className="w-32 rounded-sm border border-bone/20 bg-coal-deep px-2 py-1 text-sm text-bone placeholder:text-bone/30"
              />
              <input
                type="text"
                name="municipio"
                defaultValue={user.municipio ?? ""}
                placeholder="Municipio"
                className="w-40 rounded-sm border border-bone/20 bg-coal-deep px-2 py-1 text-sm text-bone placeholder:text-bone/30"
              />
              <button
                type="submit"
                className="rounded-sm border border-bone/20 px-3 py-1.5 text-xs font-medium text-bone/80 transition hover:border-volt hover:text-volt"
              >
                Guardar contacto
              </button>
            </form>
            <form action={setUserRole} className="flex items-center gap-2">
              <input type="hidden" name="userId" value={user.id} />
              <select
                name="role"
                defaultValue={user.role}
                className="rounded-sm border border-bone/20 bg-coal-deep px-2 py-1 text-sm text-bone"
              >
                {ROLES.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="rounded-sm border border-bone/20 px-3 py-1.5 text-xs font-medium text-bone/80 transition hover:border-volt hover:text-volt"
              >
                Guardar
              </button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
