-- AlterEnum
ALTER TYPE "ReservaStatus" ADD VALUE 'REFUNDED';

-- AlterTable
ALTER TABLE "Sesion" ADD COLUMN     "cancelledAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Reserva" ADD COLUMN     "stripePaymentIntentId" TEXT,
ADD COLUMN     "stripeRefundId" TEXT,
ADD COLUMN     "refundedAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "Reserva_stripePaymentIntentId_key" ON "Reserva"("stripePaymentIntentId");
