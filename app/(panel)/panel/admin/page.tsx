import { prisma } from "@/lib/prisma";
import AdminStatsPanel, { type StatGroup } from "@/components/AdminStatsPanel";

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

  const groups: StatGroup[] = [
    {
      label: "Reservas",
      items: [
        {
          label: "Reservas próximas",
          value: upcomingReservaCount,
          href: "/panel/admin/entrenamientos",
        },
      ],
    },
    {
      label: "Operación",
      items: [
        {
          label: "Entrenamientos próximos",
          value: upcomingSesionCount,
          href: "/panel/admin/sesiones",
        },
        { label: "Sedes activas", value: sedeCount, href: "/panel/admin/sedes" },
        { label: "Entrenadores", value: trainerCount, href: "/panel/admin/entrenadores" },
      ],
    },
    {
      label: "Personas",
      items: [{ label: "Usuarios", value: userCount, href: "/panel/admin/usuarios" }],
    },
    {
      label: "Bandeja de entrada",
      items: [
        { label: "Leads sin leer", value: unreadLeadCount, href: "/panel/admin/leads" },
        {
          label: "Postulaciones sin leer",
          value: unreadApplicationCount,
          href: "/panel/admin/postulaciones",
        },
      ],
    },
  ];

  return (
    <div className="space-y-8">
      <h1 className="font-display text-2xl text-bone">Panel de administración</h1>
      <AdminStatsPanel groups={groups} />
    </div>
  );
}
