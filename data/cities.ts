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

export type Testimonial = {
  quote: string;
  name: string;
};

export type City = {
  slug: string;
  name: string;
  state: string;
  /** Public-facing area only — never the exact field address. */
  zoneLabel: string;
  scheduleNote: string;
  contactWhatsapp: string;
  contactEmail: string;
  levels: Level[];
  testimonials: Testimonial[];
  active: boolean;
};

export const cities: City[] = [
  {
    slug: "monterrey",
    name: "Monterrey",
    state: "Nuevo León",
    zoneLabel: "Guadalupe, Nuevo León",
    scheduleNote: "Sesiones: 7 am · 12 pm · 5 pm · 7 pm (cupo limitado)",
    contactWhatsapp: "81 0000 0000",
    contactEmail: "monterrey@oncefc.mx",
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
    testimonials: [
      {
        quote:
          "Dejé de jugar como 10 años por la chamba. Volver a entrenar dos veces por semana me regresó la condición... y las ganas.",
        name: "Jugador, nivel intermedio",
      },
      {
        quote:
          "Entro derechito de mi casa a las 7 de la mañana. Es lo único que me ha hecho sostener una rutina de ejercicio en años.",
        name: "Jugador, grupo mañanero",
      },
      {
        quote:
          "No es una escuelita, se siente como un equipo de verdad: entrenamos táctica, jugamos partidos en serio y hay rivalidad sana con otros clubes.",
        name: "Jugador, nivel competitivo",
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
    contactWhatsapp: "33 0000 0000",
    contactEmail: "guadalajara@oncefc.mx",
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
    testimonials: [
      {
        quote:
          "Buscaba algo más serio que la cascarita del domingo y esto es justo eso: entrenamiento real con gente que también compite.",
        name: "Jugador, nivel intermedio",
      },
      {
        quote:
          "Llevo tres meses y ya siento la diferencia en la condición. Los entrenadores sí saben lo que hacen.",
        name: "Jugador, nivel iniciación",
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
    contactWhatsapp: "55 0000 0000",
    contactEmail: "cdmx@oncefc.mx",
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
    testimonials: [
      {
        quote:
          "Entre el tráfico y la chamba había dejado el fútbol por completo. Aquí encontré un horario que sí puedo sostener.",
        name: "Jugador, nivel intermedio",
      },
      {
        quote:
          "Se siente como cuando jugabas en la prepa, pero con entrenadores que de verdad saben de táctica.",
        name: "Jugador, nivel competitivo",
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
