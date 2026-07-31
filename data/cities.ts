export type Level = {
  code: string;
  title: string;
  focus: string;
  days: string;
  /** Session start time — one of: 7:00 am, 8:00 am, 4:00 pm, 5:00 pm, 6:00 pm, 7:00 pm, 8:00 pm, 9:00 pm. */
  time: string;
};

export type City = {
  slug: string;
  name: string;
  state: string;
  /** Public-facing area only — never the exact field address. */
  zoneLabel: string;
  scheduleNote: string;
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
    scheduleNote: "7 am – 9 pm disponible (excepto viernes y domingo)",
    contactEmail: "monterrey@once-fc.com",
    levels: [
      {
        code: "N1",
        title: "Iniciación",
        focus: "Vuelve a moverse: técnica base y forma física, sin presión.",
        days: "Mar / Jue",
        time: "4:00 pm",
      },
      {
        code: "N2",
        title: "Intermedio",
        focus: "Táctica, posesión y ritmo real de juego.",
        days: "Lun / Mié",
        time: "5:00 pm",
      },
      {
        code: "N3",
        title: "Competitivo",
        focus: "Alta intensidad y partidos contra otros clubes.",
        days: "Lun a Jue",
        time: "8:00 pm",
      },
      {
        code: "AM",
        title: "Mañanero",
        focus: "Sesión de 7 a 8 am, antes de entrar a la oficina.",
        days: "Mar / Jue / Sáb",
        time: "7:00 am",
      },
      {
        code: "AM2",
        title: "Madrugador",
        focus: "Segunda sesión mañanera, ritmo suave antes de entrar a trabajar.",
        days: "Lun / Mié",
        time: "8:00 am",
      },
      {
        code: "GYM",
        title: "Fuerza & core",
        focus: "Acondicionamiento físico y prevención de lesiones.",
        days: "Lun / Mié",
        time: "6:00 pm",
      },
      {
        code: "TARDE7",
        title: "Cierre de tarde",
        focus: "Último bloque de la tarde, ritmo alto para cerrar el día.",
        days: "Mar / Jue",
        time: "7:00 pm",
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
    scheduleNote: "7 am – 9 pm disponible (excepto viernes y domingo)",
    contactEmail: "guadalajara@once-fc.com",
    levels: [
      {
        code: "N1",
        title: "Iniciación",
        focus: "Vuelve a moverse: técnica base y forma física, sin presión.",
        days: "Lun / Mié",
        time: "4:00 pm",
      },
      {
        code: "N2",
        title: "Intermedio",
        focus: "Táctica, posesión y ritmo real de juego.",
        days: "Mar / Jue / Sáb",
        time: "8:00 pm",
      },
      {
        code: "AM",
        title: "Mañanero",
        focus: "Sesión de 7 a 8 am, antes de entrar a la oficina.",
        days: "Mar / Jue",
        time: "7:00 am",
      },
      {
        code: "AM2",
        title: "Madrugador",
        focus: "Segunda sesión mañanera, ritmo suave antes de entrar a trabajar.",
        days: "Lun / Mié",
        time: "8:00 am",
      },
      {
        code: "TARDE6",
        title: "Táctica de tarde",
        focus: "Trabajo táctico y de posesión a media tarde.",
        days: "Mar / Jue",
        time: "6:00 pm",
      },
      {
        code: "TARDE7",
        title: "Cierre de tarde",
        focus: "Último bloque de la tarde, ritmo alto para cerrar el día.",
        days: "Lun / Mié",
        time: "7:00 pm",
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
    scheduleNote: "7 am – 9 pm disponible (excepto viernes y domingo)",
    contactEmail: "cdmx@once-fc.com",
    levels: [
      {
        code: "N1",
        title: "Iniciación",
        focus: "Vuelve a moverse: técnica base y forma física, sin presión.",
        days: "Mar / Jue",
        time: "4:00 pm",
      },
      {
        code: "N2",
        title: "Intermedio",
        focus: "Táctica, posesión y ritmo real de juego.",
        days: "Lun / Mié",
        time: "5:00 pm",
      },
      {
        code: "N3",
        title: "Competitivo",
        focus: "Alta intensidad y partidos contra otros clubes.",
        days: "Lun a Jue",
        time: "8:00 pm",
      },
      {
        code: "AM",
        title: "Mañanero",
        focus: "Sesión de 7 a 8 am, antes de entrar a la oficina.",
        days: "Mar / Jue / Sáb",
        time: "7:00 am",
      },
      {
        code: "AM2",
        title: "Madrugador",
        focus: "Segunda sesión mañanera, ritmo suave antes de entrar a trabajar.",
        days: "Lun / Mié",
        time: "8:00 am",
      },
      {
        code: "TARDE6",
        title: "Táctica de tarde",
        focus: "Trabajo táctico y de posesión a media tarde.",
        days: "Mar / Jue",
        time: "6:00 pm",
      },
      {
        code: "TARDE7",
        title: "Cierre de tarde",
        focus: "Último bloque de la tarde, ritmo alto para cerrar el día.",
        days: "Lun / Mié",
        time: "7:00 pm",
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
    slug: "tijuana",
    name: "Tijuana",
    state: "Baja California",
    zoneLabel: "Zona Río, Tijuana",
    scheduleNote: "7 am – 9 pm disponible (excepto viernes y domingo)",
    contactEmail: "tijuana@once-fc.com",
    levels: [
      {
        code: "N1",
        title: "Iniciación",
        focus: "Vuelve a moverse: técnica base y forma física, sin presión.",
        days: "Lun / Mié",
        time: "4:00 pm",
      },
      {
        code: "N2",
        title: "Intermedio",
        focus: "Táctica, posesión y ritmo real de juego.",
        days: "Mar / Jue / Sáb",
        time: "8:00 pm",
      },
      {
        code: "AM",
        title: "Mañanero",
        focus: "Sesión de 7 a 8 am, antes de entrar a la oficina.",
        days: "Mar / Jue",
        time: "7:00 am",
      },
      {
        code: "AM2",
        title: "Madrugador",
        focus: "Segunda sesión mañanera, ritmo suave antes de entrar a trabajar.",
        days: "Lun / Mié",
        time: "8:00 am",
      },
      {
        code: "TARDE6",
        title: "Táctica de tarde",
        focus: "Trabajo táctico y de posesión a media tarde.",
        days: "Mar / Jue",
        time: "6:00 pm",
      },
      {
        code: "TARDE7",
        title: "Cierre de tarde",
        focus: "Último bloque de la tarde, ritmo alto para cerrar el día.",
        days: "Lun / Mié",
        time: "7:00 pm",
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
    slug: "saltillo",
    name: "Saltillo",
    state: "Coahuila",
    zoneLabel: "Saltillo Centro, Coahuila",
    scheduleNote: "7 am – 9 pm disponible (excepto viernes y domingo)",
    contactEmail: "saltillo@once-fc.com",
    levels: [
      {
        code: "N1",
        title: "Iniciación",
        focus: "Vuelve a moverse: técnica base y forma física, sin presión.",
        days: "Mar / Jue",
        time: "4:00 pm",
      },
      {
        code: "N2",
        title: "Intermedio",
        focus: "Táctica, posesión y ritmo real de juego.",
        days: "Lun / Mié",
        time: "9:00 pm",
      },
      {
        code: "AM",
        title: "Mañanero",
        focus: "Sesión de 7 a 8 am, antes de entrar a la oficina.",
        days: "Mar / Jue",
        time: "7:00 am",
      },
      {
        code: "AM2",
        title: "Madrugador",
        focus: "Segunda sesión mañanera, ritmo suave antes de entrar a trabajar.",
        days: "Lun / Mié",
        time: "8:00 am",
      },
      {
        code: "TARDE5",
        title: "Intermedio tarde",
        focus: "Táctica, posesión y ritmo real de juego, entre semana.",
        days: "Mar / Jue",
        time: "5:00 pm",
      },
      {
        code: "TARDE6",
        title: "Táctica de tarde",
        focus: "Trabajo táctico y de posesión a media tarde.",
        days: "Lun / Mié",
        time: "6:00 pm",
      },
      {
        code: "TARDE7",
        title: "Cierre de tarde",
        focus: "Último bloque de la tarde, ritmo alto para cerrar el día.",
        days: "Mar / Jue",
        time: "7:00 pm",
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
