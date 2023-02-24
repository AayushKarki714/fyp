/*
  Warnings:

  - Added the required column `createdByUserId` to the `GalleryContainer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uploadedByUserId` to the `Photo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GalleryContainer" ADD COLUMN     "createdByUserId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Photo" ADD COLUMN     "uploadedByUserId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "GalleryContainer" ADD CONSTRAINT "GalleryContainer_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_uploadedByUserId_fkey" FOREIGN KEY ("uploadedByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
