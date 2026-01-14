-- CreateTable
CREATE TABLE "PlantType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "PlantedPlant" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "plantId" INTEGER NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "mapX" REAL,
    "mapY" REAL,
    "plantedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "harvestedAt" DATETIME,
    "sunlightLevel" INTEGER,
    "waterLevel" INTEGER,
    CONSTRAINT "PlantedPlant_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "Plant" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PlantedPlant_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Plant_plantTypeID_fkey" FOREIGN KEY ("plantTypeID") REFERENCES "PlantType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Plant" ("createdAt", "description", "id", "image", "name", "plantTypeID", "scientificName", "sunlightRequirement", "waterNeeds") SELECT "createdAt", "description", "id", "image", "name", "plantTypeID", "scientificName", "sunlightRequirement", "waterNeeds" FROM "Plant";
DROP TABLE "Plant";
ALTER TABLE "new_Plant" RENAME TO "Plant";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "PlantType_name_key" ON "PlantType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "PlantedPlant_ownerId_plantId_key" ON "PlantedPlant"("ownerId", "plantId");
