export type City = {
  slug: string;
  name: string;
  state: string;
  scheduleNote: string;
  contactEmail: string;
  active: boolean;
  /** "live" = actually running sessions there today. "comingSoon" = page stays
   * up for SEO/geo reach, but copy must not claim we're operating there yet. */
  status: "live" | "comingSoon";
};

export const cities: City[] = [
  {
    slug: "monterrey",
    name: "Monterrey",
    state: "Nuevo León",
    scheduleNote: "Sesiones de 7:00 a 21:00 (según disponibilidad)",
    contactEmail: "monterrey@once-fc.com",
    active: true,
    status: "live",
  },
  {
    slug: "guadalajara",
    name: "Guadalajara",
    state: "Jalisco",
    scheduleNote: "Sesiones de 7:00 a 21:00 (según disponibilidad)",
    contactEmail: "guadalajara@once-fc.com",
    active: true,
    status: "comingSoon",
  },
  {
    slug: "cdmx",
    name: "Ciudad de México",
    state: "CDMX",
    scheduleNote: "Sesiones de 7:00 a 21:00 (según disponibilidad)",
    contactEmail: "cdmx@once-fc.com",
    active: true,
    status: "comingSoon",
  },
  {
    slug: "tijuana",
    name: "Tijuana",
    state: "Baja California",
    scheduleNote: "Sesiones de 7:00 a 21:00 (según disponibilidad)",
    contactEmail: "tijuana@once-fc.com",
    active: true,
    status: "comingSoon",
  },
  {
    slug: "saltillo",
    name: "Saltillo",
    state: "Coahuila",
    scheduleNote: "Sesiones de 7:00 a 21:00 (según disponibilidad)",
    contactEmail: "saltillo@once-fc.com",
    active: true,
    status: "comingSoon",
  },
];

export function getCityBySlug(slug: string): City | undefined {
  return cities.find((city) => city.slug === slug && city.active);
}

export function getActiveCities(): City[] {
  return cities.filter((city) => city.active);
}

export function getLiveCities(): City[] {
  return cities.filter((city) => city.active && city.status === "live");
}
