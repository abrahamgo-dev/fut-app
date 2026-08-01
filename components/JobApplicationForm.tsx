"use client";

import { useState } from "react";
import { getActiveCities } from "@/data/cities";

export default function JobApplicationForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const cities = getActiveCities();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");

    const form = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/postulacion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          phone: form.get("phone"),
          cityName: form.get("cityName"),
          message: form.get("message"),
        }),
      });

      if (!res.ok) throw new Error("request failed");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-sm bg-bone p-8 text-ink"
    >
      {status === "sent" ? (
        <p role="status" className="font-body text-sm">
          Listo, recibimos tu postulación. Si tu perfil encaja con una vacante disponible, te
          contactamos por teléfono.
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
          <label className="flex flex-col gap-1 text-sm font-medium">
            Sede
            <select
              required
              name="cityName"
              defaultValue=""
              className="rounded-sm border border-ink/20 bg-transparent px-3 py-2 font-body text-sm outline-none focus-visible:border-coal-deep"
            >
              <option value="" disabled>
                Elige una ciudad
              </option>
              {cities.map((city) => (
                <option key={city.slug} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium">
            Cuéntanos sobre tu experiencia
            <textarea
              required
              name="message"
              rows={4}
              placeholder="Como jugador, entrenador, árbitro... y qué puesto te interesa."
              className="resize-none rounded-sm border border-ink/20 bg-transparent px-3 py-2 font-body text-sm outline-none focus-visible:border-coal-deep"
            />
          </label>
          {status === "error" ? (
            <p role="alert" className="font-body text-sm text-red-700">
              No se pudo enviar tu postulación. Intenta de nuevo o escríbenos directo por correo.
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
            ) : (
              "Enviar postulación"
            )}
          </button>
        </>
      )}
    </form>
  );
}
