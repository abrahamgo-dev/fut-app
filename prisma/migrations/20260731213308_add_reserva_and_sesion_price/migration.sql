-- CreateEnum
CREATE TYPE "ReservaStatus" AS ENUM ('PENDING', 'PAID', 'CANCELLED', 'EXPIRED');

-- AlterTable
ALTER TABLE "Sesion" ADD COLUMN     "priceCents" INTEGER;

-- CreateTable
CREATE TABLE "Reserva" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sesionId" TEXT NOT NULL,
    "status" "ReservaStatus" NOT NULL DEFAULT 'PENDING',
    "amountCents" INTEGER NOT NULL,
    "stripeCheckoutSessionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reserva_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Reserva_stripeCheckoutSessionId_key" ON "Reserva"("stripeCheckoutSessionId");

-- CreateIndex
CREATE INDEX "Reserva_sesionId_idx" ON "Reserva"("sesionId");

-- CreateIndex
CREATE INDEX "Reserva_userId_idx" ON "Reserva"("userId");

-- AddForeignKey
ALTER TABLE "Reserva" ADD CONSTRAINT "Reserva_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reserva" ADD CONSTRAINT "Reserva_sesionId_fkey" FOREIGN KEY ("sesionId") REFERENCES "Sesion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
