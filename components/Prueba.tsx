"use client";

import { useState } from "react";
import { buildWhatsAppUrl } from "@/lib/contact";

export default function Prueba({
  cityName,
  comingSoon = false,
}: {
  cityName?: string;
  comingSoon?: boolean;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");

  const whatsappUrl = buildWhatsAppUrl(
    comingSoon
      ? `Hola, quiero que me avisen cuando abran entrenamientos${cityName ? ` en ${cityName}` : ""}.`
      : `Hola, quiero saber más sobre los planes de entrenamiento${cityName ? ` en ${cityName}` : ""}.`,
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");

    const form = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          age: form.get("age"),
          email: form.get("email"),
          phone: form.get("phone"),
          cityName,
        }),
      });

      if (!res.ok) throw new Error("request failed");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="prueba" className="bg-volt py-24 text-coal-deep">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 md:grid-cols-2">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-coal-deep/70">
            {comingSoon ? "Próximamente" : "Contacto"}
            {cityName ? ` · ${cityName}` : ""}
          </p>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl">
            {comingSoon
              ? "Sé de los primeros en enterarte"
              : "Comunícate con nuestro equipo"}
          </h2>
          <p className="mt-4 max-w-md font-body text-sm text-coal-deep/80">
            {comingSoon
              ? `Déjanos tus datos y te avisamos en cuanto abramos sesiones en ${cityName ?? "tu ciudad"}.`
              : "Déjanos tus datos y te contactamos en menos de 24 horas para revisar promociones, horarios y encontrar la sesión que mejor te acomode."}
          </p>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex w-fit items-center gap-2.5 rounded-sm bg-coal-deep px-5 py-3 font-body text-sm font-semibold text-bone transition hover:bg-coal"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5 flex-shrink-0"
            >
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2.05 22l5.25-1.38a9.87 9.87 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91C21.96 6.45 17.5 2 12.04 2zm5.8 14.17c-.24.68-1.4 1.33-1.93 1.4-.5.07-1.12.1-1.8-.11-.42-.13-.95-.31-1.64-.6-2.87-1.24-4.75-4.15-4.9-4.34-.14-.2-1.17-1.56-1.17-2.97 0-1.42.74-2.11 1-2.4.26-.29.57-.36.76-.36.19 0 .38 0 .55.01.18.01.41-.07.64.49.24.58.81 2 .88 2.14.07.14.12.31.02.5-.09.19-.14.31-.28.48-.14.17-.29.37-.42.5-.14.14-.28.29-.12.57.16.28.7 1.16 1.51 1.88 1.04.93 1.91 1.22 2.19 1.36.28.14.44.12.6-.07.17-.19.7-.81.89-1.09.19-.28.38-.23.63-.14.26.09 1.63.77 1.91.91.28.14.47.21.53.33.07.12.07.68-.17 1.36z" />
            </svg>
            Escríbenos por WhatsApp
          </a>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 rounded-sm bg-bone p-8 text-ink"
        >
          {status === "sent" ? (
            <p role="status" className="font-body text-sm">
              {comingSoon
                ? `Listo, te avisamos en cuanto abramos sesiones en ${cityName ?? "tu ciudad"}.`
                : "Listo, recibimos tus datos. Un coach de Once FC te contacta pronto para revisar promociones, horarios y la ubicación exacta de la cancha."}
            </p>
          ) : (
            <>
              {cityName ? (
                <>
                  <label className="flex flex-col gap-1 text-sm font-medium">
                    Ciudad
                    <input
                      type="text"
                      value={cityName}
                      disabled
                      readOnly
                      className="rounded-sm border border-ink/20 bg-ink/5 px-3 py-2 font-body text-sm text-ink/70"
                    />
                  </label>
                  <label className="flex items-start gap-2 text-sm font-medium">
                    <input required type="checkbox" name="cityConfirmed" className="mt-1" />
                    <span>
                      {comingSoon ? (
                        <>
                          Avísenme cuando abran en <strong>{cityName}</strong>
                        </>
                      ) : (
                        <>
                          Confirmo que quiero entrenar en <strong>{cityName}</strong>
                        </>
                      )}
                    </span>
                  </label>
                </>
              ) : null}
              <label className="flex flex-col gap-1 text-sm font-medium">
                Tu nombre
                <input
                  required
                  type="text"
                  name="name"
                  className="rounded-sm border border-ink/20 bg-transparent px-3 py-2 font-body text-sm outline-none focus-visible:border-coal-deep"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm font-medium">
                Edad
                <input
                  required
                  type="number"
                  min={18}
                  max={70}
                  name="age"
                  className="rounded-sm border border-ink/20 bg-transparent px-3 py-2 font-body text-sm outline-none focus-visible:border-coal-deep"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm font-medium">
                Correo electrónico
                <input
                  required
                  type="email"
                  name="email"
                  autoComplete="email"
                  className="rounded-sm border border-ink/20 bg-transparent px-3 py-2 font-body text-sm outline-none focus-visible:border-coal-deep"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm font-medium">
                Teléfono (opcional)
                <input
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  placeholder="10 dígitos"
                  className="rounded-sm border border-ink/20 bg-transparent px-3 py-2 font-body text-sm outline-none focus-visible:border-coal-deep"
                />
              </label>
              {status === "error" ? (
                <p role="alert" className="font-body text-sm text-red-700">
                  No se pudo enviar tu solicitud. Intenta de nuevo o{" "}
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold underline"
                  >
                    escríbenos directo por WhatsApp
                  </a>
                  .
                </p>
              ) : null}
              <button
                type="submit"
                disabled={status === "loading"}
                className="relative mt-2 flex items-center justify-center gap-3 overflow-hidden rounded-sm bg-coal-deep px-6 py-3 font-body text-sm font-semibold text-bone transition hover:bg-coal disabled:cursor-wait disabled:opacity-90"
              >
                {status === "loading" ? (
                  <>
                    <span
                      aria-hidden="true"
                      className="h-4 w-4 animate-spin rounded-full border-2 border-bone/30 border-t-volt"
                    />
                    <span className="animate-pulse">Enviando...</span>
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 -translate-x-full animate-[shimmer_1.4s_infinite] bg-gradient-to-r from-transparent via-bone/10 to-transparent"
                    />
                  </>
                ) : comingSoon ? (
                  "Avísenme cuando abran"
                ) : (
                  "Quiero que me contacten"
                )}
              </button>
            </>
          )}
        </form>
      </div>
    </section>
  );
}
