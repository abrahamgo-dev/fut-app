import type { Metadata } from "next";
import { signIn } from "@/auth";

export const metadata: Metadata = {
  title: "Iniciar sesión — Once FC",
  robots: { index: false, follow: false },
};

const ERROR_MESSAGES: Record<string, string> = {
  OAuthAccountNotLinked:
    "Ese correo ya está registrado con otro método. Intenta con la cuenta de Google original.",
  AccessDenied: "No se pudo completar el acceso. Intenta de nuevo.",
  Default: "Algo salió mal al iniciar sesión. Intenta de nuevo.",
};

export default function LoginPage({
  searchParams,
}: {
  searchParams: { callbackUrl?: string; error?: string };
}) {
  const callbackUrl = searchParams.callbackUrl ?? "/panel";
  const errorMessage = searchParams.error
    ? (ERROR_MESSAGES[searchParams.error] ?? ERROR_MESSAGES.Default)
    : null;

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-coal-deep px-6 py-16 text-bone">
      <div
        className="pointer-events-none absolute inset-0 bg-grid-lines"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-coal-deep via-coal-deep to-coal"
        aria-hidden="true"
      />

      <div className="relative w-full max-w-sm">
        <a
          href="/"
          className="mb-10 flex justify-center font-display text-2xl tracking-wide text-bone"
        >
          ONCE<span className="text-volt">FC</span>
        </a>

        <div className="rounded-sm border border-bone/10 bg-coal px-8 py-10">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-volt">
            Acceso de jugadores
          </p>
          <h1 className="mt-3 font-display text-3xl leading-tight">
            Entra a tu cuenta
          </h1>
          <p className="mt-3 font-body text-sm text-bone/60">
            Reserva tus entrenamientos, revisa tu horario y gestiona tu cuenta
            con tu cuenta de Google.
          </p>

          {errorMessage ? (
            <p
              role="alert"
              className="mt-6 rounded-sm border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-300"
            >
              {errorMessage}
            </p>
          ) : null}

          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: callbackUrl });
            }}
            className="mt-8"
          >
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-3 rounded-sm bg-bone px-5 py-3 font-body text-sm font-semibold text-ink transition hover:brightness-95"
            >
              <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden="true">
                <path
                  fill="#FFC107"
                  d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.5 6.1 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.8 1.1 8 3l5.7-5.7C34.5 6.1 29.5 4 24 4c-7.4 0-13.8 4.2-17 10.3.3-.2 0 0 0 0z"
                />
                <path
                  fill="#4CAF50"
                  d="M24 44c5.4 0 10.3-2.1 14-5.5l-6.5-5.4c-2 1.5-4.6 2.4-7.5 2.4-5.2 0-9.6-3.3-11.2-7.9l-6.6 5.1C9.9 39.7 16.4 44 24 44z"
                />
                <path
                  fill="#1976D2"
                  d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.6l6.5 5.4C41.5 35.7 44 30.3 44 24c0-1.3-.1-2.7-.4-3.5z"
                />
              </svg>
              Continuar con Google
            </button>
          </form>

          <p className="mt-6 text-center font-mono text-[11px] uppercase tracking-widest text-bone/30">
            Solo para jugadores registrados
          </p>
        </div>

        <a
          href="/"
          className="mt-8 block text-center font-body text-sm text-bone/50 transition hover:text-volt"
        >
          ← Volver al sitio
        </a>
      </div>
    </div>
  );
}
