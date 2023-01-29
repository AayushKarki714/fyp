-- DropForeignKey
ALTER TABLE "GalleryContainer" DROP CONSTRAINT "GalleryContainer_workspaceId_fkey";

-- DropForeignKey
ALTER TABLE "Member" DROP CONSTRAINT "Member_userId_fkey";

-- DropForeignKey
ALTER TABLE "Member" DROP CONSTRAINT "Member_workspaceId_fkey";

-- DropForeignKey
ALTER TABLE "Photo" DROP CONSTRAINT "Photo_galleryContainerId_fkey";

-- DropForeignKey
ALTER TABLE "Progress" DROP CONSTRAINT "Progress_progressContainerId_fkey";

-- DropForeignKey
ALTER TABLE "ProgressContainer" DROP CONSTRAINT "ProgressContainer_workspaceId_fkey";

-- DropForeignKey
ALTER TABLE "Workspace" DROP CONSTRAINT "Workspace_adminId_fkey";

-- AddForeignKey
ALTER TABLE "Workspace" ADD CONSTRAINT "Workspace_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GalleryContainer" ADD CONSTRAINT "GalleryContainer_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgressContainer" ADD CONSTRAINT "ProgressContainer_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Progress" ADD CONSTRAINT "Progress_progressContainerId_fkey" FOREIGN KEY ("progressContainerId") REFERENCES "ProgressContainer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_galleryContainerId_fkey" FOREIGN KEY ("galleryContainerId") REFERENCES "GalleryContainer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
