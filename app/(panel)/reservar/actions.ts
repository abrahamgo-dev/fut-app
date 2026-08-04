"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth-guards";
import { getAvailableSlots } from "@/lib/availability";

const GENERIC_UNAVAILABLE_ERROR = "Ese horario ya no está disponible.";

// `createBooking` is an exported server action, so it's independently
// callable with arbitrary arguments regardless of what the booking page's UI
// offers — it can't just trust opts.startsAt/endsAt came from a real slot.
// Re-deriving the trainer's actual available slots and requiring an exact
// match keeps a caller from booking outside the trainer's configured
// availability (or a stale/nonexistent slot).
export async function createBooking(opts: {
  trainerId: string;
  citySlug: string;
  startsAt: string;
  endsAt: string;
}): Promise<{ error?: string }> {
  const session = await requireSession();

  const startsAt = new Date(opts.startsAt);
  const endsAt = new Date(opts.endsAt);
  if (Number.isNaN(startsAt.getTime()) || Number.isNaN(endsAt.getTime())) {
    return { error: GENERIC_UNAVAILABLE_ERROR };
  }

  const slots = await getAvailableSlots({
    citySlug: opts.citySlug,
    trainerId: opts.trainerId,
  });
  const matchesRealSlot = slots.some(
    (slot) =>
      slot.startsAt.getTime() === startsAt.getTime() &&
      slot.endsAt.getTime() === endsAt.getTime(),
  );
  if (!matchesRealSlot) {
    return { error: GENERIC_UNAVAILABLE_ERROR };
  }

  try {
    await prisma.$transaction(
      async (tx) => {
        const conflict = await tx.booking.findFirst({
          where: { trainerId: opts.trainerId, startsAt, status: "CONFIRMED" },
        });
        if (conflict) throw new Error("CONFLICT");

        await tx.booking.create({
          data: {
            userId: session.user.id,
            trainerId: opts.trainerId,
            citySlug: opts.citySlug,
            startsAt,
            endsAt,
          },
        });
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );
  } catch {
    // Either the pre-create conflict check found a booking, or two
    // concurrent requests raced for the same slot and Postgres rejected one
    // as a serialization conflict — both mean the slot is gone.
    return { error: GENERIC_UNAVAILABLE_ERROR };
  }

  revalidatePath(`/reservar/${opts.citySlug}/${opts.trainerId}`);
  revalidatePath("/panel/cuenta");

  return {};
}
