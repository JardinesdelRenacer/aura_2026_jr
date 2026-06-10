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

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Sede" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'INACTIVA',
    "adminId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Sede_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Sede" ("adminId", "createdAt", "estado", "id", "nombre", "updatedAt") SELECT "adminId", "createdAt", "estado", "id", "nombre", "updatedAt" FROM "Sede";
DROP TABLE "Sede";
ALTER TABLE "new_Sede" RENAME TO "Sede";
CREATE UNIQUE INDEX "Sede_adminId_key" ON "Sede"("adminId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Obituario_sedeId_sala_key" ON "Obituario"("sedeId", "sala");

-- CreateIndex
CREATE UNIQUE INDEX "ConfiguracionPantalla_sedeId_key" ON "ConfiguracionPantalla"("sedeId");
