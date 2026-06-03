-- CreateTable
CREATE TABLE "Presentacion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "images" TEXT NOT NULL,
    "autoPlay" BOOLEAN NOT NULL,
    "seconds" INTEGER NOT NULL,
    "createAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
