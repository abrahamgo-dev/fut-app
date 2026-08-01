"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-guards";

export async function toggleJobApplicationRead(jobApplicationId: string, read: boolean) {
  await requireRole(["ADMIN"]);

  await prisma.jobApplication.update({
    where: { id: jobApplicationId },
    data: { read },
  });

  revalidatePath("/panel/admin/postulaciones");
}

export async function deleteJobApplication(jobApplicationId: string) {
  await requireRole(["ADMIN"]);

  await prisma.jobApplication.delete({ where: { id: jobApplicationId } });

  revalidatePath("/panel/admin/postulaciones");
}
