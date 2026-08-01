import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { toggleJobApplicationRead, deleteJobApplication } from "./actions";

export default async function AdminPostulacionesPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const where: Prisma.JobApplicationWhereInput = {};
  if (searchParams.status === "unread") where.read = false;
  if (searchParams.status === "read") where.read = true;

  const [applications, unreadCount] = await Promise.all([
    prisma.jobApplication.findMany({ where, orderBy: { createdAt: "desc" }, take: 200 }),
    prisma.jobApplication.count({ where: { read: false } }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-bone">Bolsa de trabajo</h1>
        <p className="mt-1 text-sm text-bone/60">
          Postulaciones enviadas desde el formulario de bolsa de trabajo del sitio.{" "}
          {unreadCount > 0 ? (
            <span className="text-volt">
              {unreadCount} sin leer.
            </span>
          ) : (
            "Todo leído."
          )}
        </p>
      </div>

      <form className="flex flex-wrap items-end gap-4">
        <label className="flex flex-col gap-1 text-sm text-bone/80">
          Estado
          <select
            name="status"
            defaultValue={searchParams.status ?? ""}
            className="rounded-sm border border-bone/20 bg-coal-deep px-3 py-2 text-bone"
          >
            <option value="">Todos</option>
            <option value="unread">Sin leer</option>
            <option value="read">Leídos</option>
          </select>
        </label>
        <button
          type="submit"
          className="rounded-sm border border-bone/20 px-4 py-2 text-sm font-medium text-bone/80 transition hover:border-volt hover:text-volt"
        >
          Filtrar
        </button>
      </form>

      {applications.length === 0 ? (
        <p className="text-sm text-bone/60">No hay postulaciones con estos filtros.</p>
      ) : (
        <ul className="divide-y divide-bone/10 rounded-sm border border-bone/10">
          {applications.map((application) => (
            <li key={application.id} className="flex flex-wrap items-start justify-between gap-4 px-4 py-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-bone">
                  {application.name}
                  {!application.read ? (
                    <span className="ml-2 font-mono text-[10px] uppercase tracking-widest text-volt">
                      Nuevo
                    </span>
                  ) : null}
                </p>
                <p className="text-xs text-bone/50">{application.phone}</p>
                <p className="mt-1 max-w-xl whitespace-pre-wrap text-sm text-bone/70">
                  {application.message}
                </p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-bone/30">
                  {application.createdAt.toLocaleString("es-MX", {
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
                    await toggleJobApplicationRead(application.id, !application.read);
                  }}
                >
                  <button
                    type="submit"
                    className="rounded-sm border border-bone/20 px-3 py-1.5 text-xs font-medium text-bone/70 transition hover:border-volt hover:text-volt"
                  >
                    {application.read ? "Marcar sin leer" : "Marcar leído"}
                  </button>
                </form>
                <form
                  action={async () => {
                    "use server";
                    await deleteJobApplication(application.id);
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
    </div>
  );
}
