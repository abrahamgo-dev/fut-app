import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: { filter?: string };
}) {
  const where: Prisma.LeadWhereInput = {};
  if (searchParams.filter === "duplicates") where.isDuplicatePhone = true;
  if (searchParams.filter === "flagged") where.isRateLimitedIp = true;

  const [leads, duplicateCount, flaggedCount] = await Promise.all([
    prisma.lead.findMany({ where, orderBy: { createdAt: "desc" }, take: 200 }),
    prisma.lead.count({ where: { isDuplicatePhone: true } }),
    prisma.lead.count({ where: { isRateLimitedIp: true } }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-bone">Solicitudes de sesión gratis</h1>
        <p className="mt-1 text-sm text-bone/60">
          Cada envío del formulario de "Reserva tu sesión gratis". Un mismo teléfono no vuelve a
          notificarte por correo dentro de {90} días, pero queda registrado aquí como duplicado
          para que lo revises si hace falta.
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
              <div>
                <p className="text-sm font-medium text-bone">
                  {lead.name}
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
                </p>
                <p className="text-xs text-bone/50">
                  {lead.phone} · {lead.age} años
                  {lead.cityName ? ` · ${lead.cityName}` : ""}
                  {lead.preferredSchedule ? ` · ${lead.preferredSchedule}` : ""}
                </p>
              </div>
              <p className="font-mono text-xs text-bone/40">
                {lead.createdAt.toLocaleString("es-MX", {
                  dateStyle: "medium",
                  timeStyle: "short",
                  timeZone: "America/Mexico_City",
                })}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
