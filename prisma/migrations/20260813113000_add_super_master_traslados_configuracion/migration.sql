-- ============================================================
-- AURA 2026
-- SUPER MASTER + TRASLADOS + CONFIGURACIÓN GLOBAL
-- ============================================================


-- ============================================================
-- 1. NUEVO ROL: SUPER_MASTER
-- ============================================================

ALTER TYPE "Role"
ADD VALUE IF NOT EXISTS 'SUPER_MASTER' BEFORE 'MASTER';


-- ============================================================
-- 2. TABLA: TrasladoObituario
-- ============================================================

CREATE TABLE "TrasladoObituario" (
    "id" TEXT NOT NULL,

    "sedeId" TEXT NOT NULL,

    "obituarioNombre" TEXT NOT NULL,

    "salaOrigen" TEXT NOT NULL,

    "salaDestino" TEXT NOT NULL,

    "usuarioId" TEXT,

    "usuarioEmail" TEXT,

    "estado" TEXT NOT NULL DEFAULT 'COMPLETADO',

    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrasladoObituario_pkey"
        PRIMARY KEY ("id")
);


-- ============================================================
-- 3. ÍNDICES: TrasladoObituario
-- ============================================================

CREATE INDEX "TrasladoObituario_sedeId_idx"
ON "TrasladoObituario"("sedeId");


CREATE INDEX "TrasladoObituario_createdAt_idx"
ON "TrasladoObituario"("createdAt");


-- ============================================================
-- 4. RELACIÓN: TrasladoObituario -> Sede
-- ============================================================

ALTER TABLE "TrasladoObituario"
ADD CONSTRAINT "TrasladoObituario_sedeId_fkey"
FOREIGN KEY ("sedeId")
REFERENCES "Sede"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;


-- ============================================================
-- 5. TABLA: ConfiguracionGlobal
-- ============================================================

CREATE TABLE "ConfiguracionGlobal" (
    "id" TEXT NOT NULL,

    "companyName" TEXT NOT NULL,

    "companyPhone" TEXT,

    "companyEmail" TEXT,

    "companyWebsite" TEXT,

    "logo" TEXT,

    "primaryColor" TEXT NOT NULL DEFAULT '#2563EB',

    "secondaryColor" TEXT NOT NULL DEFAULT '#0F172A',

    "autoplay" BOOLEAN NOT NULL DEFAULT true,

    "seconds" INTEGER NOT NULL DEFAULT 10,

    "transitionEffect" TEXT NOT NULL DEFAULT 'fade',

    "auraTouchTimeout" INTEGER NOT NULL DEFAULT 90,

    "keyboardEnabled" BOOLEAN NOT NULL DEFAULT true,

    "refreshInterval" INTEGER NOT NULL DEFAULT 5,

    "maintenanceMode" BOOLEAN NOT NULL DEFAULT false,

    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConfiguracionGlobal_pkey"
        PRIMARY KEY ("id")
);