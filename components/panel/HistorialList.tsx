"use client";

import { useEffect, useState, useTransition } from "react";
import { RESERVA_STATUS_LABEL } from "@/lib/reservaStatus";
import { RESERVAS_PAGE_SIZE } from "@/lib/reservaPagination";
import {
  loadMoreHistorial,
  type ReservaListItem,
} from "@/app/(panel)/panel/cuenta/actions";

const USER_STATUS_LABEL: Record<string, string> = {
  PENDING: "Pendiente de pago",
  PAID: "Confirmada",
  CANCELLED: "Cancelada",
  EXPIRED: "Vencida",
  REFUNDED: "Reembolsada",
};

const STATUS_BADGE_CLASS: Record<string, string> = {
  PENDING: "border-amber-300/40 bg-amber-300/10 text-amber-200",
  PAID: "border-emerald-300/40 bg-emerald-300/10 text-emerald-200",
  CANCELLED: "border-red-300/40 bg-red-300/10 text-red-200",
  EXPIRED: "border-bone/20 bg-bone/10 text-bone/60",
  REFUNDED: "border-cyan-300/40 bg-cyan-300/10 text-cyan-200",
};

const STATUS_FOCUS_CLASS: Record<string, string> = {
  PENDING: "ring-1 ring-amber-300/30 bg-amber-300/5",
  PAID: "ring-1 ring-emerald-300/30 bg-emerald-300/5",
  CANCELLED: "ring-1 ring-red-300/30 bg-red-300/5",
  EXPIRED: "ring-1 ring-bone/20 bg-bone/5",
  REFUNDED: "ring-1 ring-cyan-300/30 bg-cyan-300/5",
};

const USER_STATUS_LABEL_FALLBACK = "estado";

type HighlightStatus = "PAID" | "CANCELLED" | "EXPIRED" | null;

export default function HistorialList({
  initialItems,
  initialHasMore,
  initialHighlight,
}: {
  initialItems: ReservaListItem[];
  initialHasMore: boolean;
  initialHighlight?: HighlightStatus;
}) {
  const [items, setItems] = useState(initialItems);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isPending, startTransition] = useTransition();
  const [activeHighlight, setActiveHighlight] = useState<HighlightStatus>(
    initialHighlight ?? null,
  );

  useEffect(() => {
    setActiveHighlight(initialHighlight ?? null);
  }, [initialHighlight]);

  useEffect(() => {
    if (!activeHighlight) return;
    const timer = window.setTimeout(() => {
      setActiveHighlight(null);
    }, 7000);
    return () => window.clearTimeout(timer);
  }, [activeHighlight]);

  function handleLoadMore() {
    startTransition(async () => {
      const page = await loadMoreHistorial(items.length);
      setItems((prev) => [...prev, ...page.items]);
      setHasMore(page.hasMore);
    });
  }

  if (items.length === 0) {
    return (
      <div className="rounded-sm border border-bone/10 bg-bone/5 p-4 text-sm text-bone/70">
        Aún no hay clases en tu historial.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activeHighlight ? (
        <div className="rounded-sm border border-volt/30 bg-volt/10 px-3 py-2 text-xs text-bone/80">
          Resaltando temporalmente:{" "}
          {USER_STATUS_LABEL[activeHighlight] ?? USER_STATUS_LABEL_FALLBACK}.
        </div>
      ) : null}

      <ul className="divide-y divide-bone/10 rounded-sm border border-bone/10">
        {items.map((reserva) => {
          const startsAt = new Date(reserva.startsAtISO);
          const isFocused = activeHighlight
            ? reserva.status === activeHighlight
            : false;
          const isDimmed = activeHighlight
            ? reserva.status !== activeHighlight
            : false;

          return (
            <li
              key={reserva.id}
              className={`flex flex-wrap items-center justify-between gap-4 px-4 py-3 transition ${
                isFocused
                  ? (STATUS_FOCUS_CLASS[reserva.status] ??
                    "ring-1 ring-volt/30 bg-volt/5")
                  : ""
              } ${isDimmed ? "opacity-60" : ""}`}
            >
              <div>
                <p className="text-sm font-medium text-bone">{reserva.title}</p>
                <p className="text-xs text-bone/50">
                  {reserva.sedeName} ·{" "}
                  {startsAt.toLocaleString("es-MX", {
                    dateStyle: "medium",
                    timeStyle: "short",
                    timeZone: "America/Mexico_City",
                  })}
                </p>
              </div>
              <span
                className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-semibold ${
                  STATUS_BADGE_CLASS[reserva.status] ??
                  "border-bone/20 bg-bone/10 text-bone/70"
                }`}
              >
                <span className="mr-1.5 mt-[1px] inline-block h-1.5 w-1.5 rounded-full bg-current" />
                {USER_STATUS_LABEL[reserva.status] ??
                  RESERVA_STATUS_LABEL[reserva.status] ??
                  reserva.status}
              </span>
            </li>
          );
        })}
      </ul>

      {hasMore ? (
        <button
          type="button"
          onClick={handleLoadMore}
          disabled={isPending}
          className="w-full rounded-sm border border-bone/15 px-4 py-2.5 text-center text-sm font-semibold text-bone/80 transition hover:border-volt hover:text-volt disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Cargando…" : `Cargar ${RESERVAS_PAGE_SIZE} más`}
        </button>
      ) : null}
    </div>
  );
}
