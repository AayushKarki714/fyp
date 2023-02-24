/*
  Warnings:

  - Added the required column `createdByUserId` to the `TodoCard` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TodoCard" ADD COLUMN     "createdByUserId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "TodoCard" ADD CONSTRAINT "TodoCard_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
