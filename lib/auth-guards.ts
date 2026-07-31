import { redirect } from "next/navigation";
import type { Role } from "@prisma/client";
import type { Session } from "next-auth";
import { auth } from "@/auth";

export async function requireSession(): Promise<Session> {
  const session = await auth();
  if (!session?.user) {
    redirect("/api/auth/signin?callbackUrl=/panel");
  }
  return session;
}

export async function requireRole(roles: Role[]): Promise<Session> {
  const session = await requireSession();
  if (!roles.includes(session.user.role)) {
    redirect("/panel/cuenta");
  }
  return session;
}
