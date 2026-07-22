-- CreateEnum
CREATE TYPE "Role" AS ENUM ('MASTER', 'ADMIN');

-- CreateEnum
CREATE TYPE "EstadoSede" AS ENUM ('ACTIVA', 'INACTIVA');

-- CreateEnum
CREATE TYPE "EstadoPantalla" AS ENUM ('OFFLINE', 'ONLINE', 'MANTENIMIENTO', 'ERROR');

-- CreateEnum
CREATE TYPE "EstadoObituario" AS ENUM ('ACTIVO', 'FINALIZADO', 'ARCHIVADO');

-- CreateEnum
CREATE TYPE "EstadoCondolencia" AS ENUM ('PENDIENTE', 'ENTREGADA', 'ARCHIVADA');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nombres" TEXT,
    "apellidos" TEXT,
    "cedula" TEXT,
    "telefono" TEXT,
    "departamento" TEXT,
    "ciudad" TEXT,
    "estado" TEXT DEFAULT 'ACTIVO',
    "lastSeen" TIMESTAMP(3),
    "role" "Role" NOT NULL DEFAULT 'ADMIN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sede" (
    "id" TEXT NOT NULL,
    "departamento" TEXT NOT NULL,
    "ciudad" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "estado" "EstadoSede" NOT NULL DEFAULT 'INACTIVA',
    "numeroSalas" INTEGER NOT NULL DEFAULT 1,
    "salaVip" BOOLEAN NOT NULL DEFAULT false,
    "adminId" TEXT,
    "lastSeen" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sede_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Obituario" (
    "id" TEXT NOT NULL,
    "sedeId" TEXT NOT NULL,
    "sala" TEXT NOT NULL,
    "estado" "EstadoObituario" NOT NULL DEFAULT 'ACTIVO',
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "dob" TEXT,
    "dod" TEXT,
    "timeStart" TEXT,
    "timeEnd" TEXT,
    "cemetery" TEXT,
    "endTime" TEXT,
    "endDate" TEXT,
    "massTime" TEXT,
    "massChurch" TEXT,
    "massChurchType" TEXT DEFAULT 'Parroquia',
    "massAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Obituario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Condolencia" (
    "id" TEXT NOT NULL,
    "codigo" TEXT,
    "obituarioId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "documentNumber" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "message" TEXT NOT NULL,
    "estado" "EstadoCondolencia" NOT NULL DEFAULT 'PENDIENTE',
    "pdfGenerado" BOOLEAN NOT NULL DEFAULT false,
    "enviadoAt" TIMESTAMP(3),
    "observaciones" TEXT,
    "acceptedPrivacyPolicy" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Condolencia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConfiguracionPantalla" (
    "id" TEXT NOT NULL,
    "sedeId" TEXT NOT NULL,
    "autoPlay" BOOLEAN NOT NULL DEFAULT true,
    "seconds" INTEGER NOT NULL DEFAULT 10,
    "transitionEffect" TEXT NOT NULL DEFAULT 'fade',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConfiguracionPantalla_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Media" (
    "id" TEXT NOT NULL,
    "sedeId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "orden" INTEGER NOT NULL,
    "room" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Presentacion" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "projectionMode" TEXT NOT NULL DEFAULT 'classic',
    "selectedImage" INTEGER NOT NULL DEFAULT 0,
    "roomsToShow" JSONB,
    "obituaries" JSONB,
    "sedeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Presentacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PantallaCliente" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "online" BOOLEAN NOT NULL DEFAULT false,
    "estado" "EstadoPantalla" NOT NULL DEFAULT 'OFFLINE',
    "reiniciar" BOOLEAN NOT NULL DEFAULT false,
    "lastSeen" TIMESTAMP(3),
    "sedeId" TEXT NOT NULL,
    "presentacionId" TEXT,
    "screenWidth" INTEGER,
    "screenHeight" INTEGER,
    "viewportWidth" INTEGER,
    "viewportHeight" INTEGER,
    "ip" TEXT,
    "userAgent" TEXT,
    "language" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PantallaCliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CodigoRegistro" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "pantallaNombre" TEXT,
    "sedeId" TEXT NOT NULL,
    "usado" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "utilizadoAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CodigoRegistro_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Sede_adminId_key" ON "Sede"("adminId");

-- CreateIndex
CREATE UNIQUE INDEX "Obituario_sedeId_sala_key" ON "Obituario"("sedeId", "sala");

-- CreateIndex
CREATE UNIQUE INDEX "Condolencia_codigo_key" ON "Condolencia"("codigo");

-- CreateIndex
CREATE INDEX "Condolencia_obituarioId_idx" ON "Condolencia"("obituarioId");

-- CreateIndex
CREATE INDEX "Condolencia_estado_idx" ON "Condolencia"("estado");

-- CreateIndex
CREATE UNIQUE INDEX "ConfiguracionPantalla_sedeId_key" ON "ConfiguracionPantalla"("sedeId");

-- CreateIndex
CREATE UNIQUE INDEX "PantallaCliente_token_key" ON "PantallaCliente"("token");

-- CreateIndex
CREATE INDEX "PantallaCliente_sedeId_idx" ON "PantallaCliente"("sedeId");

-- CreateIndex
CREATE INDEX "PantallaCliente_estado_idx" ON "PantallaCliente"("estado");

-- CreateIndex
CREATE INDEX "PantallaCliente_online_idx" ON "PantallaCliente"("online");

-- CreateIndex
CREATE UNIQUE INDEX "CodigoRegistro_codigo_key" ON "CodigoRegistro"("codigo");

-- AddForeignKey
ALTER TABLE "Sede" ADD CONSTRAINT "Sede_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Obituario" ADD CONSTRAINT "Obituario_sedeId_fkey" FOREIGN KEY ("sedeId") REFERENCES "Sede"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Condolencia" ADD CONSTRAINT "Condolencia_obituarioId_fkey" FOREIGN KEY ("obituarioId") REFERENCES "Obituario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfiguracionPantalla" ADD CONSTRAINT "ConfiguracionPantalla_sedeId_fkey" FOREIGN KEY ("sedeId") REFERENCES "Sede"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_sedeId_fkey" FOREIGN KEY ("sedeId") REFERENCES "Sede"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Presentacion" ADD CONSTRAINT "Presentacion_sedeId_fkey" FOREIGN KEY ("sedeId") REFERENCES "Sede"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PantallaCliente" ADD CONSTRAINT "PantallaCliente_sedeId_fkey" FOREIGN KEY ("sedeId") REFERENCES "Sede"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PantallaCliente" ADD CONSTRAINT "PantallaCliente_presentacionId_fkey" FOREIGN KEY ("presentacionId") REFERENCES "Presentacion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CodigoRegistro" ADD CONSTRAINT "CodigoRegistro_sedeId_fkey" FOREIGN KEY ("sedeId") REFERENCES "Sede"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
