-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_IdempotencyKey" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "orderId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" DATETIME NOT NULL,
    CONSTRAINT "IdempotencyKey_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Booking" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_IdempotencyKey" ("createdAt", "expiresAt", "id", "key", "orderId") SELECT "createdAt", "expiresAt", "id", "key", "orderId" FROM "IdempotencyKey";
DROP TABLE "IdempotencyKey";
ALTER TABLE "new_IdempotencyKey" RENAME TO "IdempotencyKey";
CREATE UNIQUE INDEX "IdempotencyKey_key_key" ON "IdempotencyKey"("key");
CREATE INDEX "IdempotencyKey_key_expiresAt_idx" ON "IdempotencyKey"("key", "expiresAt");
CREATE INDEX "IdempotencyKey_orderId_idx" ON "IdempotencyKey"("orderId");
CREATE INDEX "IdempotencyKey_expiresAt_idx" ON "IdempotencyKey"("expiresAt");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "Booking_brand_startDate_idx" ON "Booking"("brand", "startDate");

-- CreateIndex
CREATE INDEX "Booking_customerEmail_idx" ON "Booking"("customerEmail");
