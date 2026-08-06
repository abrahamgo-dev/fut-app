"use server";

import { revalidatePath } from "next/cache";
import type { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-guards";

const VALID_ROLES: Role[] = ["USER", "TRAINER", "ADMIN"];
const PHONE_PATTERN = /^[0-9+()\-\s]{7,20}$/;

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

// Lets an admin retroactively fill in phone/municipio for accounts that
// slipped through without it (e.g. created before the mandatory profile step
// existed, or via a checkout/manual-reserva bug) — there was previously no
// way to fix this short of asking the player to log back in.
export async function updateUserContact(formData: FormData) {
  await requireRole(["ADMIN"]);

  const userId = String(formData.get("userId") ?? "");
  const phone = String(formData.get("phone") ?? "").trim();
  const municipio = String(formData.get("municipio") ?? "").trim();

  if (!userId) {
    throw new Error("Datos inválidos.");
  }
  if (phone && !PHONE_PATTERN.test(phone)) {
    throw new Error("Ese teléfono no se ve válido.");
  }

  await prisma.user.update({
    where: { id: userId },
    data: { phone: phone || null, municipio: municipio || null },
  });

  revalidatePath("/panel/admin/usuarios");
}
