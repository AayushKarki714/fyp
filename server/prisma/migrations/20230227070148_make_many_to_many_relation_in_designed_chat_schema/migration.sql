/*
  Warnings:

  - You are about to drop the column `chatId` on the `Member` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Member" DROP CONSTRAINT "Member_chatId_fkey";

-- AlterTable
ALTER TABLE "Member" DROP COLUMN "chatId";

-- CreateTable
CREATE TABLE "_ChatToMember" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ChatToMember_AB_unique" ON "_ChatToMember"("A", "B");

-- CreateIndex
CREATE INDEX "_ChatToMember_B_index" ON "_ChatToMember"("B");

-- AddForeignKey
ALTER TABLE "_ChatToMember" ADD CONSTRAINT "_ChatToMember_A_fkey" FOREIGN KEY ("A") REFERENCES "Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChatToMember" ADD CONSTRAINT "_ChatToMember_B_fkey" FOREIGN KEY ("B") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;
