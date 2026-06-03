/*
  Warnings:

  - You are about to drop the column `createAt` on the `Presentacion` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Presentacion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "images" TEXT NOT NULL,
    "autoPlay" BOOLEAN NOT NULL,
    "seconds" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Presentacion" ("autoPlay", "id", "images", "nombre", "seconds") SELECT "autoPlay", "id", "images", "nombre", "seconds" FROM "Presentacion";
DROP TABLE "Presentacion";
ALTER TABLE "new_Presentacion" RENAME TO "Presentacion";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
