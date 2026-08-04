"use client";

import { useFormState, useFormStatus } from "react-dom";
import {
  cancelSesionAndRefund,
  type CancelSesionRefundResult,
} from "../actions";

const initialState: CancelSesionRefundResult = {};

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-sm border border-red-400/60 px-4 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? "Procesando…" : label}
    </button>
  );
}

export default function CancelSesionForm({
  sesionId,
  paidCount,
  isRetry,
}: {
  sesionId: string;
  paidCount: number;
  isRetry: boolean;
}) {
  const [state, formAction] = useFormState(cancelSesionAndRefund, initialState);

  const confirmMessage = isRetry
    ? `Quedan ${paidCount} reembolso(s) pendiente(s) por procesar. ¿Reintentar ahora?`
    : `¿Seguro que quieres cancelar este entrenamiento? Se reembolsará por completo, vía Stripe, a ${paidCount} ${
        paidCount === 1 ? "persona" : "personas"
      }. Esto no se puede deshacer.`;

  return (
    <form
      action={formAction}
      onSubmit={(event) => {
        if (!window.confirm(confirmMessage)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="sesionId" value={sesionId} />
      <SubmitButton
        label={isRetry ? "Reintentar reembolsos pendientes" : "Cancelar entrenamiento y reembolsar"}
      />

      {state.error ? (
        <p className="mt-3 text-sm text-red-400">{state.error}</p>
      ) : null}

      {state.refunded !== undefined ? (
        <div className="mt-3 space-y-2 text-sm">
          <p className="text-bone/80">
            {state.refunded} reembolso{state.refunded === 1 ? "" : "s"} exitoso
            {state.refunded === 1 ? "" : "s"}
            {state.failed ? `, ${state.failed} sin completar` : ""}.
          </p>
          {state.failures && state.failures.length > 0 ? (
            <ul className="list-disc space-y-1 pl-5 text-xs text-bone/50">
              {state.failures.map((failure) => (
                <li key={failure.reservaId}>
                  {failure.userLabel}: {failure.message}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </form>
  );
}
