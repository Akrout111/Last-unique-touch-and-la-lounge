-- CreateTable
CREATE TABLE "ContactMessage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "brand" TEXT NOT NULL DEFAULT 'LUT',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "ContactMessage_brand_createdAt_idx" ON "ContactMessage"("brand", "createdAt");

-- CreateIndex
CREATE INDEX "ContactMessage_email_idx" ON "ContactMessage"("email");
