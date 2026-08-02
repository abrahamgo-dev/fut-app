import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { toggleLeadRead, deleteLead } from "./actions";

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: { filter?: string };
}) {
  const where: Prisma.LeadWhereInput = {};
  if (searchParams.filter === "duplicates") where.isDuplicatePhone = true;
  if (searchParams.filter === "flagged") where.isRateLimitedIp = true;
  if (searchParams.filter === "unread") where.read = false;
  if (searchParams.filter === "read") where.read = true;

  const [leads, duplicateCount, flaggedCount, unreadCount] = await Promise.all([
    prisma.lead.findMany({ where, orderBy: { createdAt: "desc" }, take: 200 }),
    prisma.lead.count({ where: { isDuplicatePhone: true } }),
    prisma.lead.count({ where: { isRateLimitedIp: true } }),
    prisma.lead.count({ where: { read: false } }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-bone">Solicitudes de sesión gratis</h1>
        <p className="mt-1 text-sm text-bone/60">
          Cada envío del formulario de "Reserva tu sesión gratis". Un mismo teléfono no vuelve a
          notificarte por correo dentro de {90} días, pero queda registrado aquí como duplicado
          para que lo revises si hace falta.{" "}
          {unreadCount > 0 ? (
            <span className="text-volt">{unreadCount} sin leer.</span>
          ) : (
            "Todo leído."
          )}
        </p>
      </div>

      <div className="flex flex-wrap gap-4">
        <a
          href="/panel/admin/leads"
          className={`rounded-sm border px-4 py-2 text-sm font-medium transition ${
            !searchParams.filter
              ? "border-volt text-volt"
              : "border-bone/20 text-bone/70 hover:border-volt hover:text-volt"
          }`}
        >
          Todas
        </a>
        <a
          href="/panel/admin/leads?filter=unread"
          className={`rounded-sm border px-4 py-2 text-sm font-medium transition ${
            searchParams.filter === "unread"
              ? "border-volt text-volt"
              : "border-bone/20 text-bone/70 hover:border-volt hover:text-volt"
          }`}
        >
          Sin leer ({unreadCount})
        </a>
        <a
          href="/panel/admin/leads?filter=duplicates"
          className={`rounded-sm border px-4 py-2 text-sm font-medium transition ${
            searchParams.filter === "duplicates"
              ? "border-volt text-volt"
              : "border-bone/20 text-bone/70 hover:border-volt hover:text-volt"
          }`}
        >
          Teléfono duplicado ({duplicateCount})
        </a>
        <a
          href="/panel/admin/leads?filter=flagged"
          className={`rounded-sm border px-4 py-2 text-sm font-medium transition ${
            searchParams.filter === "flagged"
              ? "border-volt text-volt"
              : "border-bone/20 text-bone/70 hover:border-volt hover:text-volt"
          }`}
        >
          IP sospechosa ({flaggedCount})
        </a>
      </div>

      {leads.length === 0 ? (
        <p className="text-sm text-bone/60">No hay solicitudes con este filtro.</p>
      ) : (
        <ul className="divide-y divide-bone/10 rounded-sm border border-bone/10">
          {leads.map((lead) => (
            <li key={lead.id} className="flex flex-wrap items-center justify-between gap-4 px-4 py-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-bone">
                  {lead.name}
                  {!lead.read ? (
                    <span className="ml-2 font-mono text-[10px] uppercase tracking-widest text-volt">
                      Nuevo
                    </span>
                  ) : null}
                  {lead.isDuplicatePhone ? (
                    <span className="ml-2 rounded-sm border border-amber-400/40 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-amber-300">
                      Teléfono duplicado
                    </span>
                  ) : null}
                  {lead.isRateLimitedIp ? (
                    <span className="ml-2 rounded-sm border border-rose-400/40 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-rose-300">
                      IP sospechosa
                    </span>
                  ) : null}
                  {lead.whatsappSentAt ? (
                    <span className="ml-2 rounded-sm border border-emerald-400/40 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-emerald-300">
                      WhatsApp enviado
                    </span>
                  ) : null}
                </p>
                <p className="text-xs text-bone/50">
                  {lead.phone} · {lead.age} años
                  {lead.cityName ? ` · ${lead.cityName}` : ""}
                  {lead.preferredSchedule ? ` · ${lead.preferredSchedule}` : ""}
                </p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-bone/30">
                  {lead.createdAt.toLocaleString("es-MX", {
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
                    await toggleLeadRead(lead.id, !lead.read);
                  }}
                >
                  <button
                    type="submit"
                    className="rounded-sm border border-bone/20 px-3 py-1.5 text-xs font-medium text-bone/70 transition hover:border-volt hover:text-volt"
                  >
                    {lead.read ? "Marcar sin leer" : "Marcar leído"}
                  </button>
                </form>
                <form
                  action={async () => {
                    "use server";
                    await deleteLead(lead.id);
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
