"use client";

import { useState } from "react";

export default function Prueba({
  cityName,
  comingSoon = false,
}: {
  cityName?: string;
  comingSoon?: boolean;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");

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
            {comingSoon ? "Próximamente" : "Sesión gratuita"}
            {cityName ? ` · ${cityName}` : ""}
          </p>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl">
            {comingSoon
              ? "Sé de los primeros en enterarte"
              : "Tu primer entrenamiento va por nosotros"}
          </h2>
          <p className="mt-4 max-w-md font-body text-sm text-coal-deep/80">
            {comingSoon
              ? `Déjanos tus datos y te avisamos en cuanto abramos sesiones en ${cityName ?? "tu ciudad"}.`
              : "Déjanos tus datos y te contactamos en menos de 24 horas para agendar tu sesión y darte la ubicación exacta de la cancha."}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 rounded-sm bg-bone p-8 text-ink"
        >
          {status === "sent" ? (
            <p role="status" className="font-body text-sm">
              {comingSoon
                ? `Listo, te avisamos en cuanto abramos sesiones en ${cityName ?? "tu ciudad"}.`
                : "Listo, recibimos tus datos. Un coach de Once FC te contacta pronto con la ubicación exacta de la cancha y los horarios disponibles."}
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
                Teléfono
                <input
                  required
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  placeholder="10 dígitos"
                  className="rounded-sm border border-ink/20 bg-transparent px-3 py-2 font-body text-sm outline-none focus-visible:border-coal-deep"
                />
              </label>
              {status === "error" ? (
                <p role="alert" className="font-body text-sm text-red-700">
                  No se pudo enviar tu solicitud. Intenta de nuevo o escríbenos directo por
                  WhatsApp.
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
                  "Quiero mi sesión gratis"
                )}
              </button>
            </>
          )}
        </form>
      </div>
    </section>
  );
}
