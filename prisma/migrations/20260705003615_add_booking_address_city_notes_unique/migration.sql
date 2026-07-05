-- AlterTable
-- SQLite does not fully support ALTER TABLE ADD COLUMN with all constraints,
-- but Prisma emits additive ALTER TABLE statements for nullable columns.
ALTER TABLE "Booking" ADD COLUMN "address" TEXT;
ALTER TABLE "Booking" ADD COLUMN "city" TEXT;
ALTER TABLE "Booking" ADD COLUMN "notes" TEXT;

-- CreateIndex
-- Named unique constraint preventing double-booking of the same product
-- for an overlapping (or identical) [productId, startDate, endDate] range.
CREATE UNIQUE INDEX "no_double_booking" ON "Booking"("productId", "startDate", "endDate");
