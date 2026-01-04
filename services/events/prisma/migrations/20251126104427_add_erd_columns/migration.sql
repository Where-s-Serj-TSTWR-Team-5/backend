/*
  Warnings:

  - You are about to drop the column `type` on the `Plant` table. All the data in the column will be lost.
  - Made the column `name` on table `Plant` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Plant" (
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
INSERT INTO "new_Plant" ("createdAt", "id", "name") SELECT "createdAt", "id", "name" FROM "Plant";
DROP TABLE "Plant";
ALTER TABLE "new_Plant" RENAME TO "Plant";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
