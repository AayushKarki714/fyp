/*
  Warnings:

  - You are about to drop the `_ChatToMember` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ChatToMember" DROP CONSTRAINT "_ChatToMember_A_fkey";

-- DropForeignKey
ALTER TABLE "_ChatToMember" DROP CONSTRAINT "_ChatToMember_B_fkey";

-- DropTable
DROP TABLE "_ChatToMember";

-- CreateTable
CREATE TABLE "ChatWithMember" (
    "chatId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,

    CONSTRAINT "ChatWithMember_pkey" PRIMARY KEY ("chatId","memberId")
);

-- AddForeignKey
ALTER TABLE "ChatWithMember" ADD CONSTRAINT "ChatWithMember_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatWithMember" ADD CONSTRAINT "ChatWithMember_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
