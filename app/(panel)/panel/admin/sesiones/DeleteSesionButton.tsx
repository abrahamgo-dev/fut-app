"use client";

import { useFormState, useFormStatus } from "react-dom";
import { deleteSesion, type DeleteSesionState } from "./actions";

const initialState: DeleteSesionState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-sm border border-bone/20 px-3 py-1.5 text-xs font-medium text-bone/70 transition hover:border-red-400 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? "Eliminando…" : "Eliminar"}
    </button>
  );
}

export default function DeleteSesionButton({
  sesionId,
  title,
}: {
  sesionId: string;
  title: string;
}) {
  const [state, formAction] = useFormState(deleteSesion, initialState);

  return (
    <form
      action={formAction}
      onSubmit={(event) => {
        if (
          !window.confirm(
            `¿Seguro que quieres eliminar "${title}" por completo? Esto no se puede deshacer.`,
          )
        ) {
          event.preventDefault();
        }
      }}
      className="flex flex-col items-end gap-1"
    >
      <input type="hidden" name="sesionId" value={sesionId} />
      <SubmitButton />
      {state.error ? (
        <p className="max-w-[220px] text-right text-[11px] text-red-400">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}
