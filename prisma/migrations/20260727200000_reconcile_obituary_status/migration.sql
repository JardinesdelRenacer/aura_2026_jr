-- CreateEnum
CREATE TYPE "EstadoObituario" AS ENUM (
    'ACTIVO',
    'FINALIZADO',
    'ARCHIVADO'
);

-- AlterTable
ALTER TABLE "Obituario"
ADD COLUMN "estado" "EstadoObituario" NOT NULL DEFAULT 'ACTIVO';