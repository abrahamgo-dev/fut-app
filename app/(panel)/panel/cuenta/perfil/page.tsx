import { requireSession } from "@/lib/auth-guards";
import { prisma } from "@/lib/prisma";
import ProfileForm from "@/components/panel/ProfileForm";

export default async function PerfilPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const session = await requireSession();
  const isOnboarding = searchParams?.onboarding === "1";
  const justSaved = searchParams?.guardado === "1";
  const callbackUrlParam = searchParams?.callbackUrl;
  const callbackUrl = typeof callbackUrlParam === "string" ? callbackUrlParam : "";

  const user = await prisma.user.findUniqueOrThrow({
    where: { id: session.user.id },
    select: { name: true, email: true, phone: true, municipio: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-bone">Perfil</h1>
        <p className="mt-1 text-sm text-bone/70">
          {isOnboarding
            ? "Antes de continuar, completa tus datos. Los usamos para avisarte de tus clases y contactarte si hace falta."
            : "Actualiza tus datos de contacto."}
        </p>
      </div>

      <ProfileForm
        defaultValues={{
          name: user.name ?? "",
          email: user.email ?? "",
          phone: user.phone ?? "",
          municipio: user.municipio ?? "",
        }}
        onboarding={isOnboarding}
        justSaved={justSaved}
        callbackUrl={callbackUrl}
      />
    </div>
  );
}
