/*
  Warnings:

  - A unique constraint covering the columns `[category]` on the table `EventLabel` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "EventLabel_category_key" ON "EventLabel"("category");
