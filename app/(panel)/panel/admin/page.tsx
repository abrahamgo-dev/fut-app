import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const [userCount, trainerCount, upcomingBookingCount] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "TRAINER" } }),
    prisma.booking.count({ where: { status: "CONFIRMED", startsAt: { gte: new Date() } } }),
  ]);

  const stats = [
    { label: "Usuarios", value: userCount },
    { label: "Entrenadores", value: trainerCount },
    { label: "Reservas próximas", value: upcomingBookingCount },
  ];

  return (
    <div className="space-y-8">
      <h1 className="font-display text-2xl text-bone">Panel de administración</h1>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-sm border border-bone/10 px-4 py-5">
            <p className="font-mono text-3xl text-volt">{stat.value}</p>
            <p className="text-sm text-bone/60">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-4">
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
      </div>
    </div>
  );
}
