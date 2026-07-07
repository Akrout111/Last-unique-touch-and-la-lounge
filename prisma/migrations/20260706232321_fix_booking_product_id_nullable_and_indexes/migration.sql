-- DropIndex
DROP INDEX "Product_brand_slug_idx";

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Booking" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "brand" TEXT NOT NULL DEFAULT 'LUT',
    "productId" TEXT,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "customerName" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "totalAmount" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'KWD',
    "address" TEXT,
    "city" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Booking_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Booking" ("address", "brand", "city", "createdAt", "currency", "customerEmail", "customerName", "customerPhone", "endDate", "id", "notes", "productId", "startDate", "status", "totalAmount", "updatedAt") SELECT "address", "brand", "city", "createdAt", "currency", "customerEmail", "customerName", "customerPhone", "endDate", "id", "notes", "productId", "startDate", "status", "totalAmount", "updatedAt" FROM "Booking";
DROP TABLE "Booking";
ALTER TABLE "new_Booking" RENAME TO "Booking";
CREATE INDEX "Booking_brand_createdAt_idx" ON "Booking"("brand", "createdAt");
CREATE INDEX "Booking_productId_startDate_endDate_idx" ON "Booking"("productId", "startDate", "endDate");
CREATE INDEX "Booking_status_idx" ON "Booking"("status");
CREATE UNIQUE INDEX "Booking_productId_startDate_endDate_key" ON "Booking"("productId", "startDate", "endDate");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- RedefineIndex
DROP INDEX "category_brand_slug_unique";
CREATE UNIQUE INDEX "Category_brand_slug_key" ON "Category"("brand", "slug");

-- RedefineIndex
DROP INDEX "product_brand_slug_unique";
CREATE UNIQUE INDEX "Product_brand_slug_key" ON "Product"("brand", "slug");
