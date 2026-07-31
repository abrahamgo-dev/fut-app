"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-guards";

export async function cancelBookingAsAdmin(bookingId: string) {
  await requireRole(["ADMIN"]);

  await prisma.booking.updateMany({
    where: { id: bookingId, status: "CONFIRMED" },
    data: { status: "CANCELLED", cancelledAt: new Date() },
  });

  revalidatePath("/panel/admin/reservas");
}
