import { requireRole } from "@/lib/auth-guards";

export default async function TrainerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole(["TRAINER", "ADMIN"]);
  return <>{children}</>;
}
