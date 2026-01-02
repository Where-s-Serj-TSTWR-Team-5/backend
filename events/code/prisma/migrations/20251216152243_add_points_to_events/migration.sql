-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Event" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "organizerId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "banner" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "startAt" DATETIME NOT NULL,
    "endAt" DATETIME NOT NULL,
    "date" DATETIME NOT NULL,
    "studyPoints" INTEGER,
    "points" INTEGER,
    "maxParticipants" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Event" ("banner", "createdAt", "date", "description", "endAt", "id", "location", "maxParticipants", "organizerId", "startAt", "studyPoints", "thumbnail", "title", "updatedAt") SELECT "banner", "createdAt", "date", "description", "endAt", "id", "location", "maxParticipants", "organizerId", "startAt", "studyPoints", "thumbnail", "title", "updatedAt" FROM "Event";
DROP TABLE "Event";
ALTER TABLE "new_Event" RENAME TO "Event";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
