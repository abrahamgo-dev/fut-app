// Mock data for Sede / Sesion / trainer profiles so the admin panel and the
// public "Próximas sesiones" section aren't empty out of the box. Safe to
// re-run: it's a no-op once any Sede already exists (real admin data wins).
//
// Usage: node prisma/seed.mjs  (also runs automatically via `npx prisma db seed`)
import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

function loadEnvFile() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;

  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();
    if (!process.env[key]) {
      process.env[key] = value.replace(/^['"]|['"]$/g, "");
    }
  }
}

loadEnvFile();
const prisma = new PrismaClient();

// Same fixed America/Mexico_City offset used by lib/availability.ts.
const TZ_OFFSET_MINUTES = -6 * 60;

function atLocalTime(daysFromNow, hhmm) {
  const [hours, minutes] = hhmm.split(":").map(Number);
  const now = new Date();
  const utcMidnight = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + daysFromNow,
  );
  return new Date(
    utcMidnight + (hours * 60 + minutes - TZ_OFFSET_MINUTES) * 60_000,
  );
}

function atLocalTimeForAllowedDay(daysFromNow, hhmm) {
  const [hours, minutes] = hhmm.split(":").map(Number);
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + daysFromNow);

  while (date.getDay() === 5 || date.getDay() === 0) {
    date.setDate(date.getDate() + 1);
  }

  const utcMidnight = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
  );
  return new Date(
    utcMidnight + (hours * 60 + minutes - TZ_OFFSET_MINUTES) * 60_000,
  );
}

const DEMO_USER_EMAIL = "demo@oncefc.com";
const DEMO_USER_NAME = "Demo Player";

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

// { sedeKey, trainerKey, daysFromNow, time, title, levelLabel, capacity, price (MXN) }
const SESIONES = [
  {
    sede: "mty",
    trainer: "diego",
    days: 1,
    time: "07:00",
    title: "Sesión mañanero",
    levelLabel: "Mañanero",
    capacity: 14,
    price: 120,
  },
  {
    sede: "mty",
    trainer: "emiliano",
    days: 2,
    time: "19:00",
    title: "Cierre de tarde competitivo",
    levelLabel: "Competitivo",
    capacity: 18,
    price: 200,
  },
  {
    sede: "mty",
    trainer: "renata",
    days: 3,
    time: "07:00",
    title: "Mañana técnica",
    levelLabel: "Iniciación",
    capacity: 12,
    price: 100,
  },
  {
    sede: "mty",
    trainer: "valeria",
    days: 4,
    time: "19:00",
    title: "Táctica nocturna",
    levelLabel: "Intermedio",
    capacity: 16,
    price: 150,
  },
  {
    sede: "gdl",
    trainer: "valeria",
    days: 1,
    time: "07:00",
    title: "Iniciación técnica base",
    levelLabel: "Iniciación",
    capacity: 12,
    price: 100,
  },
  {
    sede: "gdl",
    trainer: "hector",
    days: 2,
    time: "19:00",
    title: "Intermedio · táctica y posesión",
    levelLabel: "Intermedio",
    capacity: 16,
    price: 150,
  },
  {
    sede: "gdl",
    trainer: "diego",
    days: 3,
    time: "07:00",
    title: "Mañana de presión",
    levelLabel: "Competitivo",
    capacity: 14,
    price: 180,
  },
  {
    sede: "gdl",
    trainer: "renata",
    days: 4,
    time: "19:00",
    title: "Liga libre de fin de semana",
    levelLabel: "Liga libre",
    capacity: 20,
    price: 150,
  },
  {
    sede: "cdmx",
    trainer: "diego",
    days: 1,
    time: "19:00",
    title: "Intermedio Del Valle",
    levelLabel: "Intermedio",
    capacity: 16,
    price: 150,
  },
  {
    sede: "cdmx",
    trainer: "renata",
    days: 2,
    time: "07:00",
    title: "Mañana de control",
    levelLabel: "Mañanero",
    capacity: 14,
    price: 120,
  },
  {
    sede: "cdmx",
    trainer: "emiliano",
    days: 3,
    time: "19:00",
    title: "Cierre de tarde competitivo",
    levelLabel: "Competitivo",
    capacity: 18,
    price: 200,
  },
  {
    sede: "cdmx",
    trainer: "valeria",
    days: 4,
    time: "07:00",
    title: "Técnica matutina",
    levelLabel: "Iniciación",
    capacity: 12,
    price: 100,
  },
  {
    sede: "tij",
    trainer: "emiliano",
    days: 1,
    time: "19:00",
    title: "Táctica de tarde",
    levelLabel: "Intermedio",
    capacity: 14,
    price: 150,
  },
  {
    sede: "tij",
    trainer: "hector",
    days: 2,
    time: "07:00",
    title: "Entrenamiento temprano",
    levelLabel: "Mañanero",
    capacity: 14,
    price: 120,
  },
  {
    sede: "tij",
    trainer: "diego",
    days: 3,
    time: "19:00",
    title: "Noches de juego",
    levelLabel: "Liga libre",
    capacity: 16,
    price: 180,
  },
  {
    sede: "sal",
    trainer: "hector",
    days: 1,
    time: "19:00",
    title: "Táctica de tarde Saltillo",
    levelLabel: "Intermedio",
    capacity: 14,
    price: 150,
  },
  {
    sede: "sal",
    trainer: "renata",
    days: 2,
    time: "07:00",
    title: "Mañana de movimiento",
    levelLabel: "Mañanero",
    capacity: 12,
    price: 120,
  },
  {
    sede: "sal",
    trainer: "valeria",
    days: 3,
    time: "19:00",
    title: "Sesión de condición",
    levelLabel: "Competitivo",
    capacity: 16,
    price: 170,
  },
  {
    sede: "mty",
    trainer: "diego",
    days: 1,
    time: "10:00",
    title: "Sesión de movilidad",
    levelLabel: "Mañanero",
    capacity: 12,
    price: 110,
  },
  {
    sede: "mty",
    trainer: "renata",
    days: 2,
    time: "17:00",
    title: "Tarde de juego y ritmo",
    levelLabel: "Liga libre",
    capacity: 14,
    price: 140,
  },
  {
    sede: "gdl",
    trainer: "hector",
    days: 1,
    time: "10:00",
    title: "Sesión técnica matutina",
    levelLabel: "Iniciación",
    capacity: 12,
    price: 95,
  },
  {
    sede: "cdmx",
    trainer: "valeria",
    days: 2,
    time: "17:00",
    title: "Sesión de fuerza y control",
    levelLabel: "Intermedio",
    capacity: 14,
    price: 130,
  },
];

async function main() {
  const existingSedes = await prisma.sede.findMany({
    select: { id: true, citySlug: true, name: true },
  });
  const sedeByCitySlug = Object.fromEntries(
    existingSedes.map((sede) => [sede.citySlug, sede]),
  );

  for (const sede of SEDES) {
    if (!sedeByCitySlug[sede.citySlug]) {
      const { key, ...data } = sede;
      const created = await prisma.sede.create({ data });
      sedeByCitySlug[sede.citySlug] = created;
    }
  }
  console.log(`Sedes disponibles: ${Object.keys(sedeByCitySlug).length}`);

  const existingTrainers = await prisma.user.findMany({
    where: { role: "TRAINER" },
    select: { id: true, name: true },
  });
  const trainerByName = Object.fromEntries(
    existingTrainers.map((trainer) => [trainer.name, trainer]),
  );

  for (const trainer of TRAINERS) {
    if (!trainerByName[trainer.name]) {
      const { key, ...data } = trainer;
      const created = await prisma.user.create({
        data: { ...data, role: "TRAINER" },
      });
      trainerByName[trainer.name] = created;
    }
  }
  console.log(`Entrenadores disponibles: ${Object.keys(trainerByName).length}`);

  const existingSesiones = await prisma.sesion.findMany({
    select: { title: true, startsAt: true, sedeId: true, trainerId: true },
  });
  const existingSesionKeys = new Set(
    existingSesiones.map(
      (sesion) =>
        `${sesion.sedeId}:${sesion.trainerId}:${sesion.startsAt.toISOString()}:${sesion.title}`,
    ),
  );

  const sedeByKey = Object.fromEntries(
    SEDES.map((sede) => [sede.key, sedeByCitySlug[sede.citySlug]]),
  );
  const trainerByKey = Object.fromEntries(
    TRAINERS.map((trainer) => [trainer.key, trainerByName[trainer.name]]),
  );

  // Recur each template weekly so the calendar has sessions spread across
  // both August and September, not just the next few days.
  const RECURRING_WEEKS = 9;

  let sesionCount = 0;
  for (let week = 0; week < RECURRING_WEEKS; week += 1) {
    for (const sesion of SESIONES) {
      const startsAt = atLocalTimeForAllowedDay(
        sesion.days + week * 7,
        sesion.time,
      );
      const sessionKey = `${sedeByKey[sesion.sede].id}:${trainerByKey[sesion.trainer].id}:${startsAt.toISOString()}:${sesion.title}`;

      if (!existingSesionKeys.has(sessionKey)) {
        await prisma.sesion.create({
          data: {
            title: sesion.title,
            levelLabel: sesion.levelLabel,
            capacity: sesion.capacity,
            priceCents: Math.round(sesion.price * 100),
            startsAt,
            sedeId: sedeByKey[sesion.sede].id,
            trainerId: trainerByKey[sesion.trainer].id,
          },
        });
        existingSesionKeys.add(sessionKey);
        sesionCount += 1;
      }
    }
  }
  console.log(`Sesiones creadas: ${sesionCount}`);

  const demoUser = await prisma.user.upsert({
    where: { email: DEMO_USER_EMAIL },
    update: { name: DEMO_USER_NAME, role: "USER" },
    create: {
      email: DEMO_USER_EMAIL,
      name: DEMO_USER_NAME,
      role: "USER",
    },
  });

  const currentUserEmail = process.env.MOCK_ACCOUNT_EMAIL ?? DEMO_USER_EMAIL;
  const currentUser = await prisma.user.upsert({
    where: { email: currentUserEmail },
    update: { name: DEMO_USER_NAME, role: "USER" },
    create: {
      email: currentUserEmail,
      name: DEMO_USER_NAME,
      role: "USER",
    },
  });

  const futureSessions = await prisma.sesion.findMany({
    where: { startsAt: { gte: new Date() } },
    orderBy: { startsAt: "asc" },
    select: { id: true, priceCents: true },
  });

  const existingActiveReservations = await prisma.reserva.findMany({
    where: {
      userId: currentUser.id,
      status: "PAID",
      sesion: { startsAt: { gte: new Date() } },
    },
    select: { sesionId: true },
  });
  const activeReservationSessionIds = new Set(
    existingActiveReservations.map((reserva) => reserva.sesionId),
  );

  // Stride through the whole range (instead of just taking the soonest N)
  // so reservations land throughout August and September, not only in the
  // first couple of weeks.
  const DESIRED_ACTIVE_RESERVATIONS = 30;
  const reservationStride = Math.max(
    1,
    Math.floor(futureSessions.length / DESIRED_ACTIVE_RESERVATIONS),
  );

  for (
    let index = 0;
    index < futureSessions.length &&
    activeReservationSessionIds.size < DESIRED_ACTIVE_RESERVATIONS;
    index += reservationStride
  ) {
    const sesion = futureSessions[index];
    if (activeReservationSessionIds.has(sesion.id)) continue;

    await prisma.reserva.create({
      data: {
        userId: currentUser.id,
        sesionId: sesion.id,
        status: "PAID",
        amountCents: sesion.priceCents ?? 12000,
      },
    });
    activeReservationSessionIds.add(sesion.id);
  }

  const historicalStatuses = ["PAID", "CANCELLED", "EXPIRED"];
  const pastSessionTitles = new Set();
  for (let index = 0; index < 20; index += 1) {
    const daysAgo = 8 + index;
    const time = ["07:00", "10:00", "17:00", "19:00"][index % 4];
    const startsAt = atLocalTime(-daysAgo, time);
    const title = `Historial mock ${index + 1}`;

    const existingPastSession = await prisma.sesion.findFirst({
      where: { title, startsAt },
      select: { id: true },
    });

    let sesionRecord = existingPastSession;
    if (!sesionRecord) {
      const sede = SEDES[index % SEDES.length];
      const trainer = TRAINERS[index % TRAINERS.length];
      const createdSesion = await prisma.sesion.create({
        data: {
          title,
          levelLabel: "Historial",
          capacity: 12,
          priceCents: 9000 + index * 200,
          startsAt,
          sedeId: sedeByCitySlug[sede.citySlug].id,
          trainerId: trainerByName[trainer.name].id,
        },
      });
      sesionRecord = createdSesion;
    }

    const existingHistoryReservation = await prisma.reserva.findFirst({
      where: { userId: currentUser.id, sesionId: sesionRecord.id },
      select: { id: true },
    });

    if (!existingHistoryReservation) {
      await prisma.reserva.create({
        data: {
          userId: currentUser.id,
          sesionId: sesionRecord.id,
          status: historicalStatuses[index % historicalStatuses.length],
          amountCents: 9000 + index * 200,
        },
      });
    }
  }

  const finalActiveCount = await prisma.reserva.count({
    where: {
      userId: demoUser.id,
      status: "PAID",
      sesion: { startsAt: { gte: new Date() } },
    },
  });
  const finalHistoryCount = await prisma.reserva.count({
    where: {
      userId: currentUser.id,
      OR: [{ status: "PAID" }, { status: "CANCELLED" }, { status: "EXPIRED" }],
      sesion: { startsAt: { lt: new Date() } },
    },
  });

  console.log(`Reservas activas del demo user: ${finalActiveCount}`);
  console.log(
    `Historial de entrenamientos del demo user: ${finalHistoryCount}`,
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
