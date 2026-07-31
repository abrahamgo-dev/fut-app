"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-guards";

const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

export async function createAvailabilityRule(formData: FormData) {
  const session = await requireRole(["TRAINER", "ADMIN"]);

  const citySlug = String(formData.get("citySlug") ?? "");
  const dayOfWeek = Number(formData.get("dayOfWeek"));
  const startTime = String(formData.get("startTime") ?? "");
  const endTime = String(formData.get("endTime") ?? "");
  const slotDurationMinutes = Number(formData.get("slotDurationMinutes"));

  if (
    !citySlug ||
    Number.isNaN(dayOfWeek) ||
    dayOfWeek < 0 ||
    dayOfWeek > 6 ||
    !TIME_PATTERN.test(startTime) ||
    !TIME_PATTERN.test(endTime) ||
    startTime >= endTime ||
    !Number.isFinite(slotDurationMinutes) ||
    slotDurationMinutes <= 0
  ) {
    throw new Error("Datos de disponibilidad inválidos.");
  }

  await prisma.trainerAvailability.create({
    data: {
      trainerId: session.user.id,
      citySlug,
      dayOfWeek,
      startTime,
      endTime,
      slotDurationMinutes,
    },
  });

  revalidatePath("/panel/entrenador/disponibilidad");
}

export async function deleteAvailabilityRule(ruleId: string) {
  const session = await requireRole(["TRAINER", "ADMIN"]);

  await prisma.trainerAvailability.deleteMany({
    where: { id: ruleId, trainerId: session.user.id },
  });

  revalidatePath("/panel/entrenador/disponibilidad");
}
