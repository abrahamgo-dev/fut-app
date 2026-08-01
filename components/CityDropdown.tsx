"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { City } from "@/data/cities";

export default function CityDropdown({
  cities,
  currentSlug,
}: {
  cities: City[];
  currentSlug?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        className="flex items-center gap-1 font-body text-sm font-medium text-bone/80 transition hover:text-volt"
      >
        Ciudades
        <svg
          width="10"
          height="6"
          viewBox="0 0 10 6"
          fill="none"
          aria-hidden="true"
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>

      {open ? (
        <ul className="absolute right-0 top-full mt-2 w-48 rounded-sm border border-bone/10 bg-coal-deep py-2 shadow-lg">
          {cities.map((city) => (
            <li key={city.slug}>
              <Link
                href={`/ciudades/${city.slug}`}
                onClick={() => setOpen(false)}
                className={`flex items-center justify-between gap-2 px-4 py-2 font-body text-sm transition hover:bg-bone/10 hover:text-volt ${
                  city.slug === currentSlug ? "text-volt" : "text-bone/80"
                }`}
              >
                {city.name}
                {city.status === "comingSoon" ? (
                  <span className="font-mono text-[10px] uppercase tracking-widest text-bone/40">
                    Próx.
                  </span>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
