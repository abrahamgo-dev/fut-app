-- CreateTable
CREATE TABLE "LeadMessage" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "age" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "cityName" TEXT,
    "preferredSchedule" TEXT,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeadMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LeadMessage_createdAt_idx" ON "LeadMessage"("createdAt");
