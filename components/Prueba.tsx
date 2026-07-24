"use client";

import { useState } from "react";

export default function Prueba() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: connect to your real form handler (email service, CRM, etc.)
    setSent(true);
  }

  return (
    <section id="prueba" className="bg-volt py-24 text-coal-deep">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 md:grid-cols-2">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-coal-deep/70">
            Sesión gratuita
          </p>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl">
            Tu primer entrenamiento va por nosotros
          </h2>
          <p className="mt-4 max-w-md font-body text-sm text-coal-deep/80">
            Déjanos tus datos y te contactamos en menos de 24 horas para agendar tu nivel.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 rounded-sm bg-bone p-8 text-ink"
        >
          {sent ? (
            <p className="font-body text-sm">
              Listo, recibimos tus datos. Un coach de Once FC te escribe pronto.
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
              <button
                type="submit"
                className="mt-2 rounded-sm bg-coal-deep px-6 py-3 font-body text-sm font-semibold text-bone transition hover:bg-coal"
              >
                Quiero mi sesión gratis
              </button>
            </>
          )}
        </form>
      </div>
    </section>
  );
}
