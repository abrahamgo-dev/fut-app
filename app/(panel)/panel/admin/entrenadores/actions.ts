"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-guards";

function revalidatePublicPages() {
  revalidatePath("/panel/admin/entrenadores");
  revalidatePath("/");
  revalidatePath("/ciudades/[slug]", "page");
}

export async function updateTrainerProfile(formData: FormData) {
  await requireRole(["ADMIN"]);

  const userId = String(formData.get("userId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const image = String(formData.get("image") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();

  if (!userId || !name) {
    throw new Error("Datos de entrenador inválidos.");
  }

  await prisma.user.update({
    where: { id: userId },
    data: { name, image: image || null, bio: bio || null },
  });

  revalidatePublicPages();
}

export async function createTrainer(formData: FormData) {
  await requireRole(["ADMIN"]);

  const name = String(formData.get("name") ?? "").trim();
  const image = String(formData.get("image") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();

  if (!name) {
    throw new Error("El nombre es obligatorio.");
  }

  await prisma.user.create({
    data: {
      name,
      image: image || null,
      bio: bio || null,
      role: "TRAINER",
    },
  });

  revalidatePublicPages();
}
