"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-guards";
import { getActiveCities } from "@/data/cities";

const CITY_SLUGS = new Set(getActiveCities().map((city) => city.slug));

export async function createSede(formData: FormData) {
  await requireRole(["ADMIN"]);

  const name = String(formData.get("name") ?? "").trim();
  const citySlug = String(formData.get("citySlug") ?? "");
  const address = String(formData.get("address") ?? "").trim();
  const image = String(formData.get("image") ?? "").trim();

  if (!name || !CITY_SLUGS.has(citySlug) || !address) {
    throw new Error("Datos de sede inválidos.");
  }

  await prisma.sede.create({
    data: { name, citySlug, address, image: image || null },
  });

  revalidatePath("/panel/admin/sedes");
  revalidatePath("/");
  revalidatePath("/ciudades/[slug]", "page");
}

export async function toggleSedeActive(sedeId: string, active: boolean) {
  await requireRole(["ADMIN"]);

  await prisma.sede.update({
    where: { id: sedeId },
    data: { active },
  });

  revalidatePath("/panel/admin/sedes");
  revalidatePath("/");
  revalidatePath("/ciudades/[slug]", "page");
}

export async function deleteSede(sedeId: string) {
  await requireRole(["ADMIN"]);

  await prisma.sede.delete({ where: { id: sedeId } });

  revalidatePath("/panel/admin/sedes");
  revalidatePath("/");
  revalidatePath("/ciudades/[slug]", "page");
}
