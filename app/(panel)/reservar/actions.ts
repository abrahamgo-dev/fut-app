"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth-guards";

export async function createBooking(opts: {
  trainerId: string;
  citySlug: string;
  startsAt: string;
  endsAt: string;
}): Promise<{ error?: string }> {
  const session = await requireSession();

  const startsAt = new Date(opts.startsAt);
  const endsAt = new Date(opts.endsAt);

  const conflict = await prisma.booking.findFirst({
    where: { trainerId: opts.trainerId, startsAt, status: "CONFIRMED" },
  });

  if (conflict) {
    return { error: "Ese horario ya no está disponible." };
  }

  await prisma.booking.create({
    data: {
      userId: session.user.id,
      trainerId: opts.trainerId,
      citySlug: opts.citySlug,
      startsAt,
      endsAt,
    },
  });

  revalidatePath(`/reservar/${opts.citySlug}/${opts.trainerId}`);
  revalidatePath("/panel/cuenta");

  return {};
}
