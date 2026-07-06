-- AlterTable: Add brand column to Booking (defaults to LUT for existing rows)
ALTER TABLE "Booking" ADD COLUMN "brand" TEXT NOT NULL DEFAULT 'LUT';

-- CreateIndex: compound unique for multi-tenant slugs
CREATE UNIQUE INDEX IF NOT EXISTS "product_brand_slug_unique" ON "Product"("brand", "slug");
CREATE INDEX IF NOT EXISTS "Product_brand_slug_idx" ON "Product"("brand", "slug");
CREATE UNIQUE INDEX IF NOT EXISTS "category_brand_slug_unique" ON "Category"("brand", "slug");
CREATE INDEX IF NOT EXISTS "Category_brand_slug_idx" ON "Category"("brand", "slug");

-- Drop old single-column unique indexes (if they exist)
DROP INDEX IF EXISTS "Product_slug_key";
DROP INDEX IF EXISTS "Category_slug_key";
