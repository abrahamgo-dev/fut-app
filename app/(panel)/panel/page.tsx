import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth-guards";

export default async function PanelIndexPage() {
  const session = await requireSession();

  if (session.user.role === "ADMIN") {
    redirect("/panel/admin");
  }

  if (session.user.role === "TRAINER") {
    redirect("/panel/entrenador");
  }

  redirect("/panel/cuenta");
}
