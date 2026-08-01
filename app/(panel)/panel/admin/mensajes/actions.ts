"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-guards";

export async function toggleLeadMessageRead(leadMessageId: string, read: boolean) {
  await requireRole(["ADMIN"]);

  await prisma.leadMessage.update({
    where: { id: leadMessageId },
    data: { read },
  });

  revalidatePath("/panel/admin/mensajes");
}

export async function deleteLeadMessage(leadMessageId: string) {
  await requireRole(["ADMIN"]);

  await prisma.leadMessage.delete({ where: { id: leadMessageId } });

  revalidatePath("/panel/admin/mensajes");
}
