"use client";

import { useState, useTransition } from "react";
import { buildGoogleCalendarUrl } from "@/lib/googleCalendar";
import { RESERVA_STATUS_LABEL } from "@/lib/reservaStatus";
import { RESERVAS_PAGE_SIZE } from "@/lib/reservaPagination";
import {
  loadMoreReservasActivas,
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

export default function ReservasActivasList({
  initialItems,
  initialHasMore,
}: {
  initialItems: ReservaListItem[];
  initialHasMore: boolean;
}) {
  const [items, setItems] = useState(initialItems);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isPending, startTransition] = useTransition();

  function handleLoadMore() {
    startTransition(async () => {
      const page = await loadMoreReservasActivas(items.length);
      setItems((prev) => [...prev, ...page.items]);
      setHasMore(page.hasMore);
    });
  }

  if (items.length === 0) {
    return (
      <div className="rounded-sm border border-bone/10 bg-bone/5 p-4 text-sm text-bone/70">
        Aún no tienes clases reservadas. Ve al calendario y aparta tu lugar.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ul className="divide-y divide-bone/10 rounded-sm border border-bone/10">
        {items.map((reserva) => {
          const startsAt = new Date(reserva.startsAtISO);
          const googleCalendarUrl = buildGoogleCalendarUrl({
            title: reserva.title,
            description: reserva.description,
            location: `${reserva.sedeName} - ${reserva.sedeAddress}`,
            startsAt,
            durationMinutes: reserva.durationMinutes,
          });
          const icsUrl = `/api/calendar/ics?reserva_id=${encodeURIComponent(reserva.id)}`;

          return (
            <li
              key={reserva.id}
              className="rounded-sm border border-transparent px-4 py-3 transition duration-200 hover:border-volt hover:bg-volt/5"
            >
              <a
                href={`/eventos/${reserva.sesionId}`}
                className="flex flex-wrap items-center justify-between gap-4"
              >
                <div>
                  <p className="text-sm font-medium text-bone">
                    {reserva.title}
                  </p>
                  <p className="text-xs text-bone/50">
                    {reserva.sedeName} ·{" "}
                    {startsAt.toLocaleString("es-MX", {
                      dateStyle: "medium",
                      timeStyle: "short",
                      timeZone: "America/Mexico_City",
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-bone/80">
                    {(reserva.amountCents / 100).toLocaleString("es-MX", {
                      style: "currency",
                      currency: "MXN",
                    })}
                  </p>
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
                </div>
              </a>

              <div className="mt-3 flex flex-wrap gap-2">
                <a
                  href={googleCalendarUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-sm border border-bone/25 px-3 py-1.5 text-xs font-semibold text-bone/85 transition hover:border-volt hover:text-volt"
                >
                  Agregar a Google Calendar
                </a>
                <a
                  href={icsUrl}
                  className="rounded-sm border border-bone/25 px-3 py-1.5 text-xs font-semibold text-bone/85 transition hover:border-volt hover:text-volt"
                >
                  Descargar recordatorio (.ics)
                </a>
              </div>
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
