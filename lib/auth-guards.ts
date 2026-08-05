import { redirect } from "next/navigation";
import type { Role } from "@prisma/client";
import type { Session } from "next-auth";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function requireSession(callbackUrl = "/panel"): Promise<Session> {
  const session = await auth();
  if (!session?.user) {
    redirect(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
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

export const PROFILE_COMPLETION_PATH = "/panel/cuenta/perfil";

/// True once name, phone, and municipio are all set — the three fields the
/// mandatory profile step collects. Accounts created before that field
/// existed have phone/municipio as null, so they read as incomplete too,
/// which is what routes them back through the gate on their next login.
export async function isProfileComplete(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, phone: true, municipio: true },
  });
  return !!(user?.name && user.phone && user.municipio);
}
