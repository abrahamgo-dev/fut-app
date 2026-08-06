"use client";

import { useState } from "react";
import { createManualReserva } from "../actions";

const PAYMENT_METHOD_LABEL: Record<string, string> = {
  Efectivo: "Efectivo",
  Transferencia: "Transferencia",
  Tarjeta: "Tarjeta (en cancha)",
  Otro: "Otro",
};

const MANUAL_PAYMENT_METHODS = ["Efectivo", "Transferencia", "Tarjeta", "Otro"];

const inputClassName =
  "rounded-sm border border-bone/20 bg-coal-deep px-3 py-2 text-bone placeholder:text-bone/30";

export default function ManualReservaForm({
  sesionId,
  users,
  defaultAmount,
}: {
  sesionId: string;
  users: { id: string; name: string | null; email: string | null }[];
  defaultAmount: number;
}) {
  const [existingUserId, setExistingUserId] = useState("");
  const isNewPlayer = existingUserId === "";

  return (
    <form action={createManualReserva} className="grid max-w-md gap-4">
      <input type="hidden" name="sesionId" value={sesionId} />

      <label className="flex flex-col gap-1 text-sm text-bone/80">
        Jugador existente (opcional)
        <select
          name="userId"
          value={existingUserId}
          onChange={(event) => setExistingUserId(event.target.value)}
          className={inputClassName}
        >
          <option value="">— Nuevo jugador —</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name ?? user.email ?? user.id}
              {user.email ? ` (${user.email})` : ""}
            </option>
          ))}
        </select>
      </label>

      <p className="text-xs text-bone/40">
        Si el jugador no tiene cuenta todavía, déjalo en “Nuevo jugador” y llena
        su nombre, teléfono y municipio abajo — así no queda incompleto en el
        sistema.
      </p>

      <div className="flex gap-4">
        <label className="flex flex-1 flex-col gap-1 text-sm text-bone/80">
          Nombre (nuevo jugador)
          <input
            type="text"
            name="name"
            required={isNewPlayer}
            placeholder="Nombre y apellido"
            className={inputClassName}
          />
        </label>
        <label className="flex flex-1 flex-col gap-1 text-sm text-bone/80">
          Correo (opcional)
          <input
            type="email"
            name="email"
            placeholder="jugador@correo.com"
            className={inputClassName}
          />
        </label>
      </div>

      {isNewPlayer ? (
        <div className="flex gap-4">
          <label className="flex flex-1 flex-col gap-1 text-sm text-bone/80">
            Teléfono
            <input
              type="tel"
              name="phone"
              required
              placeholder="10 dígitos"
              className={inputClassName}
            />
          </label>
          <label className="flex flex-1 flex-col gap-1 text-sm text-bone/80">
            Municipio
            <input
              type="text"
              name="municipio"
              required
              placeholder="Ej. San Pedro Garza García"
              className={inputClassName}
            />
          </label>
        </div>
      ) : null}

      <div className="flex gap-4">
        <label className="flex flex-1 flex-col gap-1 text-sm text-bone/80">
          Método de pago
          <select
            name="paymentMethod"
            required
            defaultValue=""
            className={inputClassName}
          >
            <option value="" disabled>
              Elige uno
            </option>
            {MANUAL_PAYMENT_METHODS.map((method) => (
              <option key={method} value={method}>
                {PAYMENT_METHOD_LABEL[method] ?? method}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-1 flex-col gap-1 text-sm text-bone/80">
          Monto pagado (MXN)
          <input
            type="number"
            name="amount"
            min={0}
            step={0.01}
            defaultValue={defaultAmount || undefined}
            className={inputClassName}
          />
        </label>
      </div>

      <button
        type="submit"
        className="rounded-sm bg-volt px-4 py-2 text-sm font-semibold text-coal-deep transition hover:bg-bone"
      >
        Registrar inscripción
      </button>
    </form>
  );
}
