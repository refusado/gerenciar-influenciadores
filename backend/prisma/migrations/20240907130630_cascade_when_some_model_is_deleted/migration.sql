-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_InfluencerBrandLink" (
    "influencerId" INTEGER NOT NULL,
    "brandId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("influencerId", "brandId"),
    CONSTRAINT "InfluencerBrandLink_influencerId_fkey" FOREIGN KEY ("influencerId") REFERENCES "Influencer" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "InfluencerBrandLink_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_InfluencerBrandLink" ("brandId", "createdAt", "influencerId") SELECT "brandId", "createdAt", "influencerId" FROM "InfluencerBrandLink";
DROP TABLE "InfluencerBrandLink";
ALTER TABLE "new_InfluencerBrandLink" RENAME TO "InfluencerBrandLink";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
