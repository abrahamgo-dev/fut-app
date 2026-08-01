"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-guards";

export async function toggleLeadRead(leadId: string, read: boolean) {
  await requireRole(["ADMIN"]);

  await prisma.lead.update({
    where: { id: leadId },
    data: { read },
  });

  revalidatePath("/panel/admin/leads");
}

export async function deleteLead(leadId: string) {
  await requireRole(["ADMIN"]);

  await prisma.lead.delete({ where: { id: leadId } });

  revalidatePath("/panel/admin/leads");
}
