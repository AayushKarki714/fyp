-- DropForeignKey
ALTER TABLE "GalleryContainer" DROP CONSTRAINT "GalleryContainer_createdByUserId_fkey";

-- DropForeignKey
ALTER TABLE "Photo" DROP CONSTRAINT "Photo_uploadedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "Progress" DROP CONSTRAINT "Progress_createdByUserId_fkey";

-- DropForeignKey
ALTER TABLE "ProgressContainer" DROP CONSTRAINT "ProgressContainer_createdByUserId_fkey";

-- DropForeignKey
ALTER TABLE "Todo" DROP CONSTRAINT "Todo_createdByUserId_fkey";

-- DropForeignKey
ALTER TABLE "TodoCard" DROP CONSTRAINT "TodoCard_createdByUserId_fkey";

-- DropForeignKey
ALTER TABLE "TodoContainer" DROP CONSTRAINT "TodoContainer_createdByUserId_fkey";

-- AddForeignKey
ALTER TABLE "GalleryContainer" ADD CONSTRAINT "GalleryContainer_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgressContainer" ADD CONSTRAINT "ProgressContainer_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Progress" ADD CONSTRAINT "Progress_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_uploadedByUserId_fkey" FOREIGN KEY ("uploadedByUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TodoContainer" ADD CONSTRAINT "TodoContainer_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TodoCard" ADD CONSTRAINT "TodoCard_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Todo" ADD CONSTRAINT "Todo_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
