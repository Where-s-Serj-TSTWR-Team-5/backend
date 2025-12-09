/*
  Warnings:

  - You are about to drop the `Plant` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Plant";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Event" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "scientificName" TEXT,
    "description" TEXT,
    "sunlightRequirement" INTEGER,
    "waterNeeds" INTEGER,
    "image" TEXT,
    "plantTypeID" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
