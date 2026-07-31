"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-guards";

export async function cancelBookingAsTrainer(bookingId: string) {
  const session = await requireRole(["TRAINER", "ADMIN"]);

  await prisma.booking.updateMany({
    where: { id: bookingId, trainerId: session.user.id, status: "CONFIRMED" },
    data: { status: "CANCELLED", cancelledAt: new Date() },
  });

  revalidatePath("/panel/entrenador");
}
