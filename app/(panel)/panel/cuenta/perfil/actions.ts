"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth-guards";
import { prisma } from "@/lib/prisma";

export type ProfileFormState = {
  error?: string;
};

export async function updateProfile(
  _prevState: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  const session = await requireSession();

  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const municipio = String(formData.get("municipio") ?? "").trim();
  const onboarding = formData.get("onboarding") === "1";

  if (!name || !phone || !municipio) {
    return { error: "Completa nombre, teléfono y municipio." };
  }

  if (!/^[0-9+()\-\s]{7,20}$/.test(phone)) {
    return { error: "Ese teléfono no se ve válido." };
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { name, phone, municipio },
  });

  revalidatePath("/panel/cuenta/perfil");
  // "/panel" re-dispatches by role (cuenta/entrenador/admin) instead of
  // assuming everyone belongs on the player-facing "Mis reservas" page.
  redirect(onboarding ? "/panel" : "/panel/cuenta/perfil?guardado=1");
}
