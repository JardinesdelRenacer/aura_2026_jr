/*
  Warnings:

  - Added the required column `ciudad` to the `Sede` table without a default value. This is not possible if the table is not empty.
  - Added the required column `departamento` to the `Sede` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Sede" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "departamento" TEXT NOT NULL,
    "ciudad" TEXT NOT NULL,
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
