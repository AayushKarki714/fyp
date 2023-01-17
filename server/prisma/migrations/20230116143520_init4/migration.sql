-- CreateTable
CREATE TABLE "GalleryContainer" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,

    CONSTRAINT "GalleryContainer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Photo" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "galleryContainerId" TEXT NOT NULL,

    CONSTRAINT "Photo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GalleryContainer" ADD CONSTRAINT "GalleryContainer_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_galleryContainerId_fkey" FOREIGN KEY ("galleryContainerId") REFERENCES "GalleryContainer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
