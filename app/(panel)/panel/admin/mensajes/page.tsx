import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { toggleLeadMessageRead, deleteLeadMessage } from "./actions";

export default async function AdminMensajesPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const where: Prisma.LeadMessageWhereInput = {};
  if (searchParams.status === "unread") where.read = false;
  if (searchParams.status === "read") where.read = true;

  const [messages, unreadCount] = await Promise.all([
    prisma.leadMessage.findMany({ where, orderBy: { createdAt: "desc" }, take: 200 }),
    prisma.leadMessage.count({ where: { read: false } }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-bone">Mensajes</h1>
        <p className="mt-1 text-sm text-bone/60">
          Solicitudes de sesión gratuita enviadas desde el formulario del sitio.{" "}
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

      {messages.length === 0 ? (
        <p className="text-sm text-bone/60">No hay mensajes con estos filtros.</p>
      ) : (
        <ul className="divide-y divide-bone/10 rounded-sm border border-bone/10">
          {messages.map((message) => (
            <li
              key={message.id}
              className="flex flex-wrap items-center justify-between gap-4 px-4 py-3"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-bone">
                  {message.name}
                  {!message.read ? (
                    <span className="ml-2 font-mono text-[10px] uppercase tracking-widest text-volt">
                      Nuevo
                    </span>
                  ) : null}
                </p>
                <p className="text-xs text-bone/50">
                  {message.age} años · {message.phone}
                  {message.cityName ? ` · ${message.cityName}` : ""}
                  {message.preferredSchedule ? ` · ${message.preferredSchedule}` : ""}
                </p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-bone/30">
                  {message.createdAt.toLocaleString("es-MX", {
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
                    await toggleLeadMessageRead(message.id, !message.read);
                  }}
                >
                  <button
                    type="submit"
                    className="rounded-sm border border-bone/20 px-3 py-1.5 text-xs font-medium text-bone/70 transition hover:border-volt hover:text-volt"
                  >
                    {message.read ? "Marcar sin leer" : "Marcar leído"}
                  </button>
                </form>
                <form
                  action={async () => {
                    "use server";
                    await deleteLeadMessage(message.id);
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
