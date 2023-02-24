/*
  Warnings:

  - Added the required column `createdByUserId` to the `TodoContainer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TodoContainer" ADD COLUMN     "createdByUserId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "TodoContainer" ADD CONSTRAINT "TodoContainer_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
