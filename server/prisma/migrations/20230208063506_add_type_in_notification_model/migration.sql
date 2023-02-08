-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('INVITATION', 'NORMAL');

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "notificationType" "NotificationType" NOT NULL DEFAULT 'NORMAL';
