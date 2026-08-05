"use client";

import { useFormState, useFormStatus } from "react-dom";
import {
  updateProfile,
  type ProfileFormState,
} from "@/app/(panel)/panel/cuenta/perfil/actions";

const initialState: ProfileFormState = {};

const inputClassName =
  "rounded-sm border border-bone/20 bg-bone/5 px-3 py-2 font-body text-sm text-bone outline-none transition focus-visible:border-volt";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center rounded-sm bg-volt px-4 py-2 text-sm font-semibold text-coal-deep transition hover:bg-bone disabled:cursor-wait disabled:opacity-70"
    >
      {pending ? "Guardando…" : label}
    </button>
  );
}

export default function ProfileForm({
  defaultValues,
  onboarding,
  justSaved,
}: {
  defaultValues: {
    name: string;
    email: string;
    phone: string;
    municipio: string;
  };
  onboarding: boolean;
  justSaved: boolean;
}) {
  const [state, formAction] = useFormState(updateProfile, initialState);

  return (
    <form action={formAction} className="flex max-w-md flex-col gap-4">
      <input type="hidden" name="onboarding" value={onboarding ? "1" : "0"} />

      <label className="flex flex-col gap-1 text-sm font-medium text-bone">
        Nombre
        <input
          required
          type="text"
          name="name"
          defaultValue={defaultValues.name}
          className={inputClassName}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm font-medium text-bone/50">
        Email
        <input
          disabled
          type="email"
          value={defaultValues.email}
          className={`${inputClassName} cursor-not-allowed opacity-60`}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm font-medium text-bone">
        Teléfono
        <input
          required
          type="tel"
          name="phone"
          autoComplete="tel"
          placeholder="10 dígitos"
          defaultValue={defaultValues.phone}
          className={inputClassName}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm font-medium text-bone">
        Municipio
        <input
          required
          type="text"
          name="municipio"
          placeholder="Ej. San Pedro Garza García"
          defaultValue={defaultValues.municipio}
          className={inputClassName}
        />
      </label>

      {state.error ? (
        <p role="alert" className="text-sm text-red-400">
          {state.error}
        </p>
      ) : null}

      {justSaved ? (
        <p role="status" className="text-sm text-volt">
          Perfil actualizado.
        </p>
      ) : null}

      <SubmitButton label={onboarding ? "Continuar" : "Guardar cambios"} />
    </form>
  );
}
