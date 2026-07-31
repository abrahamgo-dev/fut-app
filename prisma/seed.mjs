// Mock data for Sede / Sesion / trainer profiles so the admin panel and the
// public "Próximas sesiones" section aren't empty out of the box. Safe to
// re-run: it's a no-op once any Sede already exists (real admin data wins).
//
// Usage: node prisma/seed.mjs  (also runs automatically via `npx prisma db seed`)
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Same fixed America/Mexico_City offset used by lib/availability.ts.
const TZ_OFFSET_MINUTES = -6 * 60;

function atLocalTime(daysFromNow, hhmm) {
  const [hours, minutes] = hhmm.split(":").map(Number);
  const now = new Date();
  const utcMidnight = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + daysFromNow
  );
  return new Date(utcMidnight + (hours * 60 + minutes - TZ_OFFSET_MINUTES) * 60_000);
}

const SEDES = [
  {
    key: "mty",
    name: "Cancha Guadalupe Sports",
    citySlug: "monterrey",
    address: "Av. Eugenio Garza Sada 2504, Guadalupe, Nuevo León",
    image: "/izuddin-helmi-adnan-K5ChxJaheKI-unsplash.jpg",
  },
  {
    key: "gdl",
    name: "Cancha Zapopan Elite",
    citySlug: "guadalajara",
    address: "Av. Patria 1891, Zapopan, Jalisco",
    image: "/hero-players.jpg",
  },
  {
    key: "cdmx",
    name: "Cancha Del Valle",
    citySlug: "cdmx",
    address: "Av. Coyoacán 1435, Del Valle, Ciudad de México",
    image: "/connor-coyne-OgqWLzWRSaI-unsplash.jpg",
  },
  {
    key: "tij",
    name: "Cancha Zona Río",
    citySlug: "tijuana",
    address: "Blvd. Sánchez Taboada 3115, Zona Río, Tijuana",
    image: "/izuddin-helmi-adnan-K5ChxJaheKI-unsplash.jpg",
  },
  {
    key: "sal",
    name: "Cancha Saltillo Centro",
    citySlug: "saltillo",
    address: "Blvd. Venustiano Carranza 1500, Saltillo Centro, Coahuila",
    image: "/hero-players.jpg",
  },
];

const TRAINERS = [
  {
    key: "diego",
    name: "Diego Ramírez",
    bio: "Ex-jugador profesional, 10 años formando equipos amateur en torneos regionales.",
    image:
      "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop&crop=faces&q=80",
  },
  {
    key: "valeria",
    name: "Valeria Ortiz",
    bio: "Licenciada en educación física, especialista en preparación física y prevención de lesiones.",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=faces&q=80",
  },
  {
    key: "emiliano",
    name: "Emiliano Cruz",
    bio: "Entrenador certificado, enfoque táctico y trabajo de posesión para grupos competitivos.",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=faces&q=80",
  },
  {
    key: "renata",
    name: "Renata Salas",
    bio: "8 años dirigiendo ligas recreativas para adultos que vuelven a jugar después de años.",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=faces&q=80",
  },
  {
    key: "hector",
    name: "Héctor Villanueva",
    bio: "Exjugador de fuerzas básicas, hoy dedicado a formar jugadores adultos amateur.",
    image:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=faces&q=80",
  },
];

// { sedeKey, trainerKey, daysFromNow, time, title, levelLabel, capacity }
const SESIONES = [
  { sede: "mty", trainer: "diego", days: 1, time: "07:00", title: "Sesión mañanero", levelLabel: "Mañanero", capacity: 14 },
  { sede: "mty", trainer: "emiliano", days: 3, time: "19:00", title: "Cierre de tarde competitivo", levelLabel: "Competitivo", capacity: 18 },
  { sede: "mty", trainer: "renata", days: 6, time: "17:00", title: "Liga libre de fin de semana", levelLabel: "Liga libre", capacity: 20 },
  { sede: "gdl", trainer: "valeria", days: 2, time: "16:00", title: "Iniciación técnica base", levelLabel: "Iniciación", capacity: 12 },
  { sede: "gdl", trainer: "hector", days: 4, time: "20:00", title: "Intermedio · táctica y posesión", levelLabel: "Intermedio", capacity: 16 },
  { sede: "cdmx", trainer: "diego", days: 2, time: "17:00", title: "Intermedio Del Valle", levelLabel: "Intermedio", capacity: 16 },
  { sede: "cdmx", trainer: "renata", days: 5, time: "20:00", title: "Cierre de tarde competitivo", levelLabel: "Competitivo", capacity: 18 },
  { sede: "tij", trainer: "emiliano", days: 3, time: "19:00", title: "Táctica de tarde", levelLabel: "Intermedio", capacity: 14 },
  { sede: "sal", trainer: "hector", days: 4, time: "18:00", title: "Táctica de tarde Saltillo", levelLabel: "Intermedio", capacity: 14 },
];

async function main() {
  const existingSedeCount = await prisma.sede.count();
  if (existingSedeCount > 0) {
    console.log(`Ya hay ${existingSedeCount} sede(s) en la base de datos. No se sembraron datos de muestra.`);
    return;
  }

  const sedeByKey = {};
  for (const sede of SEDES) {
    const { key, ...data } = sede;
    sedeByKey[key] = await prisma.sede.create({ data });
  }
  console.log(`Sedes creadas: ${Object.keys(sedeByKey).length}`);

  const trainerByKey = {};
  for (const trainer of TRAINERS) {
    const { key, ...data } = trainer;
    trainerByKey[key] = await prisma.user.create({ data: { ...data, role: "TRAINER" } });
  }
  console.log(`Entrenadores creados: ${Object.keys(trainerByKey).length}`);

  let sesionCount = 0;
  for (const sesion of SESIONES) {
    await prisma.sesion.create({
      data: {
        title: sesion.title,
        levelLabel: sesion.levelLabel,
        capacity: sesion.capacity,
        startsAt: atLocalTime(sesion.days, sesion.time),
        sedeId: sedeByKey[sesion.sede].id,
        trainerId: trainerByKey[sesion.trainer].id,
      },
    });
    sesionCount += 1;
  }
  console.log(`Sesiones creadas: ${sesionCount}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
