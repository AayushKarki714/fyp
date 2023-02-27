/*
  Warnings:

  - Added the required column `chatId` to the `Member` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ChatType" AS ENUM ('ALL', 'LANCERS', 'CLIENTS');

-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "chatId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Chat" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "type" "ChatType" NOT NULL,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatMessage" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,
    "memberId" TEXT,

    CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;
