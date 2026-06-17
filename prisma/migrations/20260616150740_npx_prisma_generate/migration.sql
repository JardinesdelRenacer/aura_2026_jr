-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nombres" TEXT,
    "apellidos" TEXT,
    "cedula" TEXT,
    "telefono" TEXT,
    "departamento" TEXT,
    "ciudad" TEXT,
    "estado" TEXT DEFAULT 'ACITVO',
    "role" TEXT NOT NULL DEFAULT 'ADMIN',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Sede" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "departamento" TEXT NOT NULL,
    "ciudad" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "EstadoSede" TEXT NOT NULL DEFAULT 'INACTIVA',
    "numeroSalas" INTEGER NOT NULL DEFAULT 1,
    "salaVip" BOOLEAN NOT NULL DEFAULT false,
    "adminId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Sede_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Obituario" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sedeId" TEXT NOT NULL,
    "sala" TEXT NOT NULL,
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Obituario_sedeId_fkey" FOREIGN KEY ("sedeId") REFERENCES "Sede" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ConfiguracionPantalla" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sedeId" TEXT NOT NULL,
    "autoPlay" BOOLEAN NOT NULL DEFAULT true,
    "seconds" INTEGER NOT NULL DEFAULT 10,
    "transitionEffect" TEXT NOT NULL DEFAULT 'fade',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ConfiguracionPantalla_sedeId_fkey" FOREIGN KEY ("sedeId") REFERENCES "Sede" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Media" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sedeId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "orden" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Media_sedeId_fkey" FOREIGN KEY ("sedeId") REFERENCES "Sede" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Presentacion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "images" TEXT NOT NULL,
    "autoPlay" BOOLEAN NOT NULL,
    "seconds" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Sede_adminId_key" ON "Sede"("adminId");

-- CreateIndex
CREATE UNIQUE INDEX "Obituario_sedeId_sala_key" ON "Obituario"("sedeId", "sala");

-- CreateIndex
CREATE UNIQUE INDEX "ConfiguracionPantalla_sedeId_key" ON "ConfiguracionPantalla"("sedeId");
