"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth-guards";

export async function cancelMyBooking(bookingId: string) {
  const session = await requireSession();

  await prisma.booking.updateMany({
    where: { id: bookingId, userId: session.user.id, status: "CONFIRMED" },
    data: { status: "CANCELLED", cancelledAt: new Date() },
  });

  revalidatePath("/panel/cuenta");
}
