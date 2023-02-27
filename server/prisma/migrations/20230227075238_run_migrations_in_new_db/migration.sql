-- DropForeignKey
ALTER TABLE "ChatWithMember" DROP CONSTRAINT "ChatWithMember_chatId_fkey";

-- DropForeignKey
ALTER TABLE "ChatWithMember" DROP CONSTRAINT "ChatWithMember_memberId_fkey";

-- AddForeignKey
ALTER TABLE "ChatWithMember" ADD CONSTRAINT "ChatWithMember_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatWithMember" ADD CONSTRAINT "ChatWithMember_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;
