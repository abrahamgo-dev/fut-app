-- Hand-written migration: Prisma's schema DSL doesn't support partial
-- (filtered) unique indexes, so these two constraints exist only here, not
-- as `@@unique` in schema.prisma. See the comments on the Reserva and
-- Booking models for the app-layer checks these back up.

-- One active (PENDING or PAID) reservation per user per Sesion. A cancelled
-- or expired reservation doesn't count, so a user can always try again.
CREATE UNIQUE INDEX "Reserva_userId_sesionId_active_key"
  ON "Reserva" ("userId", "sesionId")
  WHERE status IN ('PENDING', 'PAID');

-- No two confirmed bookings for the same trainer at the same start time. A
-- cancelled booking doesn't count, so the slot can be rebooked.
CREATE UNIQUE INDEX "Booking_trainerId_startsAt_confirmed_key"
  ON "Booking" ("trainerId", "startsAt")
  WHERE status = 'CONFIRMED';
