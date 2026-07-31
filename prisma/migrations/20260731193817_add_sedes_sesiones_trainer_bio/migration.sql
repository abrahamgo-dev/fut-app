-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bio" TEXT;

-- CreateTable
CREATE TABLE "Sede" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "citySlug" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "image" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sede_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sesion" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "levelLabel" TEXT,
    "capacity" INTEGER,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "durationMinutes" INTEGER NOT NULL DEFAULT 60,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sedeId" TEXT NOT NULL,
    "trainerId" TEXT NOT NULL,

    CONSTRAINT "Sesion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Sede_citySlug_idx" ON "Sede"("citySlug");

-- CreateIndex
CREATE INDEX "Sesion_sedeId_idx" ON "Sesion"("sedeId");

-- CreateIndex
CREATE INDEX "Sesion_trainerId_idx" ON "Sesion"("trainerId");

-- CreateIndex
CREATE INDEX "Sesion_startsAt_idx" ON "Sesion"("startsAt");

-- AddForeignKey
ALTER TABLE "Sesion" ADD CONSTRAINT "Sesion_sedeId_fkey" FOREIGN KEY ("sedeId") REFERENCES "Sede"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sesion" ADD CONSTRAINT "Sesion_trainerId_fkey" FOREIGN KEY ("trainerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
