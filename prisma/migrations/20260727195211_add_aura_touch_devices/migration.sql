-- CreateEnum
CREATE TYPE "TipoDispositivo" AS ENUM ('PANTALLA', 'AURA_TOUCH');

-- AlterTable
ALTER TABLE "CodigoRegistro" ADD COLUMN     "tipoDispositivo" "TipoDispositivo" NOT NULL DEFAULT 'PANTALLA';

-- CreateTable
CREATE TABLE "AuraTouch" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "lastSeen" TIMESTAMP(3),
    "sedeId" TEXT NOT NULL,
    "userAgent" TEXT,
    "ip" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AuraTouch_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AuraTouch_token_key" ON "AuraTouch"("token");

-- CreateIndex
CREATE INDEX "AuraTouch_sedeId_idx" ON "AuraTouch"("sedeId");

-- CreateIndex
CREATE INDEX "AuraTouch_activo_idx" ON "AuraTouch"("activo");

-- AddForeignKey
ALTER TABLE "AuraTouch" ADD CONSTRAINT "AuraTouch_sedeId_fkey" FOREIGN KEY ("sedeId") REFERENCES "Sede"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
