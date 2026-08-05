import CuentaSidebar from "@/components/panel/CuentaSidebar";

export default function CuentaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-8 md:flex-row md:items-start">
      <CuentaSidebar />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
