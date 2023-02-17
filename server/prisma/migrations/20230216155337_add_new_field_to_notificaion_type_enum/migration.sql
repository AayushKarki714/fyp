-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "NotificationType" ADD VALUE 'WORKSPACE_TITLE_UPDATE';
ALTER TYPE "NotificationType" ADD VALUE 'DELETE_WORKSPACE';

-- DropForeignKey
ALTER TABLE "Invitation" DROP CONSTRAINT "Invitation_recieverId_fkey";

-- DropForeignKey
ALTER TABLE "Invitation" DROP CONSTRAINT "Invitation_senderId_fkey";

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_recieverId_fkey" FOREIGN KEY ("recieverId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;
