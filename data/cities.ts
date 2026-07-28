export type Level = {
  code: string;
  title: string;
  focus: string;
  days: string;
  /** Session start time — one of the four realistic slots: 7:00 am, 12:00 pm, 5:00 pm, 7:00 pm. */
  time: string;
  /** True for the 7:00 pm slot — highest demand, hardest to guarantee a spot. */
  limited?: boolean;
};

export type City = {
  slug: string;
  name: string;
  state: string;
  /** Public-facing area only — never the exact field address. */
  zoneLabel: string;
  scheduleNote: string;
  /** Raw 10-digit Mexican mobile number, no spaces (e.g. "8110191519") — formatted for display and wa.me links in Footer. */
  contactWhatsapp: string;
  contactEmail: string;
  levels: Level[];
  active: boolean;
};

export const cities: City[] = [
  {
    slug: "monterrey",
    name: "Monterrey",
    state: "Nuevo León",
    zoneLabel: "Guadalupe, Nuevo León",
    scheduleNote: "Sesiones: 7 am · 12 pm · 5 pm · 7 pm (cupo limitado)",
    contactWhatsapp: "8110191519",
    contactEmail: "monterrey@once-fc.com",
    levels: [
      {
        code: "N1",
        title: "Iniciación",
        focus: "Vuelve a moverse: técnica base y forma física, sin presión.",
        days: "Mar / Jue",
        time: "12:00 pm",
      },
      {
        code: "N2",
        title: "Intermedio",
        focus: "Táctica, posesión y ritmo real de juego.",
        days: "Lun / Mié / Vie",
        time: "5:00 pm",
      },
      {
        code: "N3",
        title: "Competitivo",
        focus: "Alta intensidad y partidos contra otros clubes.",
        days: "Lun a Vie",
        time: "7:00 pm",
        limited: true,
      },
      {
        code: "AM",
        title: "Mañanero",
        focus: "Sesión de 7 a 8 am, antes de entrar a la oficina.",
        days: "Mar / Jue / Sáb",
        time: "7:00 am",
      },
      {
        code: "GYM",
        title: "Fuerza & core",
        focus: "Acondicionamiento físico y prevención de lesiones.",
        days: "Lun / Mié",
        time: "12:00 pm",
      },
      {
        code: "LIB",
        title: "Liga libre",
        focus: "Partidos organizados, recreativos, solo por el gusto de jugar.",
        days: "Sáb",
        time: "5:00 pm",
      },
    ],
    active: true,
  },
  {
    slug: "guadalajara",
    name: "Guadalajara",
    state: "Jalisco",
    zoneLabel: "Zapopan, Jalisco",
    scheduleNote: "Sesiones: 7 am · 12 pm · 5 pm · 7 pm (cupo limitado)",
    contactWhatsapp: "8110191519",
    contactEmail: "guadalajara@once-fc.com",
    levels: [
      {
        code: "N1",
        title: "Iniciación",
        focus: "Vuelve a moverse: técnica base y forma física, sin presión.",
        days: "Lun / Mié",
        time: "12:00 pm",
      },
      {
        code: "N2",
        title: "Intermedio",
        focus: "Táctica, posesión y ritmo real de juego.",
        days: "Mar / Jue / Sáb",
        time: "7:00 pm",
        limited: true,
      },
      {
        code: "AM",
        title: "Mañanero",
        focus: "Sesión de 7 a 8 am, antes de entrar a la oficina.",
        days: "Mar / Jue",
        time: "7:00 am",
      },
      {
        code: "LIB",
        title: "Liga libre",
        focus: "Partidos organizados, recreativos, solo por el gusto de jugar.",
        days: "Sáb",
        time: "5:00 pm",
      },
    ],
    active: true,
  },
  {
    slug: "cdmx",
    name: "Ciudad de México",
    state: "CDMX",
    zoneLabel: "Del Valle, Ciudad de México",
    scheduleNote: "Sesiones: 7 am · 12 pm · 5 pm · 7 pm (cupo limitado)",
    contactWhatsapp: "8110191519",
    contactEmail: "cdmx@once-fc.com",
    levels: [
      {
        code: "N1",
        title: "Iniciación",
        focus: "Vuelve a moverse: técnica base y forma física, sin presión.",
        days: "Mar / Jue",
        time: "12:00 pm",
      },
      {
        code: "N2",
        title: "Intermedio",
        focus: "Táctica, posesión y ritmo real de juego.",
        days: "Lun / Mié / Vie",
        time: "5:00 pm",
      },
      {
        code: "N3",
        title: "Competitivo",
        focus: "Alta intensidad y partidos contra otros clubes.",
        days: "Lun a Vie",
        time: "7:00 pm",
        limited: true,
      },
      {
        code: "AM",
        title: "Mañanero",
        focus: "Sesión de 7 a 8 am, antes de entrar a la oficina.",
        days: "Mar / Jue / Sáb",
        time: "7:00 am",
      },
      {
        code: "LIB",
        title: "Liga libre",
        focus: "Partidos organizados, recreativos, solo por el gusto de jugar.",
        days: "Sáb",
        time: "5:00 pm",
      },
    ],
    active: true,
  },
];

export function getCityBySlug(slug: string): City | undefined {
  return cities.find((city) => city.slug === slug && city.active);
}

export function getActiveCities(): City[] {
  return cities.filter((city) => city.active);
}
