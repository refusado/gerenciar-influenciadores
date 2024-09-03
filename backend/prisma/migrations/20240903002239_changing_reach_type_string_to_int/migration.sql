/*
  Warnings:

  - You are about to alter the column `reach` on the `Influencer` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Influencer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "niche" TEXT NOT NULL,
    "reach" INTEGER NOT NULL,
    "instagram" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "cep" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "neighborhood" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" DATETIME NOT NULL
);
INSERT INTO "new_Influencer" ("cep", "city", "createdAt", "id", "image", "instagram", "name", "neighborhood", "niche", "reach", "state", "street", "updateAt") SELECT "cep", "city", "createdAt", "id", "image", "instagram", "name", "neighborhood", "niche", "reach", "state", "street", "updateAt" FROM "Influencer";
DROP TABLE "Influencer";
ALTER TABLE "new_Influencer" RENAME TO "Influencer";
CREATE UNIQUE INDEX "Influencer_instagram_key" ON "Influencer"("instagram");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
