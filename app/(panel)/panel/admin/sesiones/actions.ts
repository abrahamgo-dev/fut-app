"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-guards";
import { localToUtc } from "@/lib/availability";

const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function revalidatePublicPages() {
  revalidatePath("/panel/admin/sesiones");
  revalidatePath("/");
  revalidatePath("/ciudades/[slug]", "page");
}

export async function createSesion(formData: FormData) {
  await requireRole(["ADMIN"]);

  const title = String(formData.get("title") ?? "").trim();
  const sedeId = String(formData.get("sedeId") ?? "");
  const trainerId = String(formData.get("trainerId") ?? "");
  const date = String(formData.get("date") ?? "");
  const time = String(formData.get("time") ?? "");
  const durationMinutes = Number(formData.get("durationMinutes"));
  const levelLabel = String(formData.get("levelLabel") ?? "").trim();
  const capacityRaw = String(formData.get("capacity") ?? "").trim();
  const priceRaw = String(formData.get("price") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  if (
    !title ||
    !sedeId ||
    !trainerId ||
    !DATE_PATTERN.test(date) ||
    !TIME_PATTERN.test(time) ||
    !Number.isFinite(durationMinutes) ||
    durationMinutes <= 0
  ) {
    throw new Error("Datos de sesión inválidos.");
  }

  const [year, month, day] = date.split("-").map(Number);
  const startsAt = localToUtc(new Date(Date.UTC(year, month - 1, day)), time);
  const capacity = capacityRaw ? Number(capacityRaw) : null;
  const priceCents = priceRaw ? Math.round(Number(priceRaw) * 100) : null;

  await prisma.sesion.create({
    data: {
      title,
      sedeId,
      trainerId,
      startsAt,
      durationMinutes,
      levelLabel: levelLabel || null,
      capacity: capacity && Number.isFinite(capacity) ? capacity : null,
      priceCents: priceCents && Number.isFinite(priceCents) && priceCents > 0 ? priceCents : null,
      description: description || null,
    },
  });

  revalidatePublicPages();
}

export async function toggleSesionActive(sesionId: string, active: boolean) {
  await requireRole(["ADMIN"]);

  await prisma.sesion.update({ where: { id: sesionId }, data: { active } });

  revalidatePublicPages();
}

export async function deleteSesion(sesionId: string) {
  await requireRole(["ADMIN"]);

  await prisma.sesion.delete({ where: { id: sesionId } });

  revalidatePublicPages();
}
