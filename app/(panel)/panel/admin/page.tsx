import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const [
    userCount,
    trainerCount,
    upcomingReservaCount,
    sedeCount,
    upcomingSesionCount,
    unreadLeadCount,
    unreadApplicationCount,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "TRAINER" } }),
    prisma.reserva.count({
      where: { status: { in: ["PENDING", "PAID"] }, sesion: { startsAt: { gte: new Date() } } },
    }),
    prisma.sede.count({ where: { active: true } }),
    prisma.sesion.count({ where: { active: true, startsAt: { gte: new Date() } } }),
    prisma.lead.count({ where: { read: false } }),
    prisma.jobApplication.count({ where: { read: false } }),
  ]);

  const stats = [
    { label: "Usuarios", value: userCount },
    { label: "Entrenadores", value: trainerCount },
    { label: "Reservas próximas", value: upcomingReservaCount },
    { label: "Sedes activas", value: sedeCount },
    { label: "Sesiones próximas", value: upcomingSesionCount },
    { label: "Leads sin leer", value: unreadLeadCount },
    { label: "Postulaciones sin leer", value: unreadApplicationCount },
  ];

  return (
    <div className="space-y-8">
      <h1 className="font-display text-2xl text-bone">Panel de administración</h1>

      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-sm border border-bone/10 px-4 py-5">
            <p className="font-mono text-3xl text-volt">{stat.value}</p>
            <p className="text-sm text-bone/60">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-4">
        <a
          href="/panel/admin/sesiones"
          className="rounded-sm border border-bone/20 px-4 py-2 text-sm font-medium text-bone/80 transition hover:border-volt hover:text-volt"
        >
          Publicar sesión
        </a>
        <a
          href="/panel/admin/sedes"
          className="rounded-sm border border-bone/20 px-4 py-2 text-sm font-medium text-bone/80 transition hover:border-volt hover:text-volt"
        >
          Gestionar sedes
        </a>
        <a
          href="/panel/admin/entrenadores"
          className="rounded-sm border border-bone/20 px-4 py-2 text-sm font-medium text-bone/80 transition hover:border-volt hover:text-volt"
        >
          Gestionar entrenadores
        </a>
        <a
          href="/panel/admin/usuarios"
          className="rounded-sm border border-bone/20 px-4 py-2 text-sm font-medium text-bone/80 transition hover:border-volt hover:text-volt"
        >
          Gestionar usuarios
        </a>
        <a
          href="/panel/admin/reservas"
          className="rounded-sm border border-bone/20 px-4 py-2 text-sm font-medium text-bone/80 transition hover:border-volt hover:text-volt"
        >
          Ver reservas
        </a>
        <a
          href="/panel/admin/leads"
          className="rounded-sm border border-bone/20 px-4 py-2 text-sm font-medium text-bone/80 transition hover:border-volt hover:text-volt"
        >
          Ver leads
        </a>
        <a
          href="/panel/admin/postulaciones"
          className="rounded-sm border border-bone/20 px-4 py-2 text-sm font-medium text-bone/80 transition hover:border-volt hover:text-volt"
        >
          Ver bolsa de trabajo
        </a>
      </div>
    </div>
  );
}
