"use client";

import { useState } from "react";

export default function Prueba({ cityName }: { cityName?: string }) {
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
            Sesión gratuita{cityName ? ` · ${cityName}` : ""}
          </p>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl">
            Tu primer entrenamiento va por nosotros
          </h2>
          <p className="mt-4 max-w-md font-body text-sm text-coal-deep/80">
            Déjanos tus datos y te contactamos en menos de 24 horas por WhatsApp para agendar tu
            nivel y darte la ubicación exacta de la cancha.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 rounded-sm bg-bone p-8 text-ink"
        >
          {status === "sent" ? (
            <p role="status" className="font-body text-sm">
              Listo, recibimos tus datos. Un coach de Once FC te escribe por WhatsApp con la
              ubicación exacta de la cancha y los horarios disponibles.
            </p>
          ) : (
            <>
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
                Teléfono (WhatsApp)
                <input
                  required
                  type="tel"
                  name="phone"
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
                className="mt-2 rounded-sm bg-coal-deep px-6 py-3 font-body text-sm font-semibold text-bone transition hover:bg-coal disabled:opacity-60"
              >
                {status === "loading" ? "Enviando..." : "Quiero mi sesión gratis"}
              </button>
            </>
          )}
        </form>
      </div>
    </section>
  );
}
