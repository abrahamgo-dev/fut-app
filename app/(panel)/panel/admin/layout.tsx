import { requireRole } from "@/lib/auth-guards";
import AdminThemeShell from "@/components/AdminThemeShell";

const TABS = [
  { href: "/panel/admin", label: "Resumen" },
  { href: "/panel/admin/sesiones", label: "Entrenamientos" },
  { href: "/panel/admin/sedes", label: "Sedes" },
  { href: "/panel/admin/entrenadores", label: "Entrenadores" },
  { href: "/panel/admin/usuarios", label: "Usuarios" },
  { href: "/panel/admin/entrenamientos", label: "Sesiones" },
  { href: "/panel/admin/leads", label: "Leads" },
  { href: "/panel/admin/postulaciones", label: "Bolsa de trabajo" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole(["ADMIN"]);

  return (
    <AdminThemeShell
      nav={
        <nav className="flex flex-wrap gap-2">
          {TABS.map((tab) => (
            <a
              key={tab.href}
              href={tab.href}
              className="rounded-sm border border-bone/15 px-3 py-1.5 font-mono text-xs uppercase tracking-widest text-bone/70 transition hover:border-volt hover:text-volt"
            >
              {tab.label}
            </a>
          ))}
        </nav>
      }
    >
      {children}
    </AdminThemeShell>
  );
}
