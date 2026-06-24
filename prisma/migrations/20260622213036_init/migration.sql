/*
  Warnings:

  - You are about to drop the column `autoPlay` on the `Presentacion` table. All the data in the column will be lost.
  - You are about to drop the column `images` on the `Presentacion` table. All the data in the column will be lost.
  - You are about to drop the column `seconds` on the `Presentacion` table. All the data in the column will be lost.
  - Added the required column `sedeId` to the `Presentacion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Presentacion` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Presentacion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "projectionMode" TEXT NOT NULL DEFAULT 'classic',
    "selectedImage" INTEGER NOT NULL DEFAULT 0,
    "roomsToShow" JSONB,
    "sedeId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Presentacion_sedeId_fkey" FOREIGN KEY ("sedeId") REFERENCES "Sede" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Presentacion" ("createdAt", "id", "nombre") SELECT "createdAt", "id", "nombre" FROM "Presentacion";
DROP TABLE "Presentacion";
ALTER TABLE "new_Presentacion" RENAME TO "Presentacion";
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nombres" TEXT,
    "apellidos" TEXT,
    "cedula" TEXT,
    "telefono" TEXT,
    "departamento" TEXT,
    "ciudad" TEXT,
    "estado" TEXT DEFAULT 'ACTIVO',
    "role" TEXT NOT NULL DEFAULT 'ADMIN',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("apellidos", "cedula", "ciudad", "createdAt", "departamento", "email", "estado", "id", "nombres", "password", "role", "telefono", "updatedAt") SELECT "apellidos", "cedula", "ciudad", "createdAt", "departamento", "email", "estado", "id", "nombres", "password", "role", "telefono", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
