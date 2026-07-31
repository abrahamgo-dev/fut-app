"use server";

import { revalidatePath } from "next/cache";
import type { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-guards";

const VALID_ROLES: Role[] = ["USER", "TRAINER", "ADMIN"];

export async function setUserRole(formData: FormData) {
  await requireRole(["ADMIN"]);

  const userId = String(formData.get("userId") ?? "");
  const role = String(formData.get("role") ?? "");

  if (!userId || !VALID_ROLES.includes(role as Role)) {
    throw new Error("Datos inválidos.");
  }

  await prisma.user.update({
    where: { id: userId },
    data: { role: role as Role },
  });

  revalidatePath("/panel/admin/usuarios");
}
