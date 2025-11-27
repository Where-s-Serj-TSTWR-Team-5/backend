-- CreateTable
CREATE TABLE "Plant" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "plantTypeID" INTEGER,
    "name" TEXT NOT NULL,
    "scientificName" TEXT,
    "description" TEXT,
    "sunlightRequirement" INTEGER,
    "waterNeeds" INTEGER,
    "image" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_DATE
);

-- Optional: Index on name (recommended)
CREATE UNIQUE INDEX "Plant_name_key" ON "Plant"("name");
