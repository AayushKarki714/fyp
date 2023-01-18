-- CreateTable
CREATE TABLE "ProgressContainer" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,

    CONSTRAINT "ProgressContainer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Progress" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "progressPercent" TEXT NOT NULL,
    "progressContainerId" TEXT NOT NULL,

    CONSTRAINT "Progress_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProgressContainer" ADD CONSTRAINT "ProgressContainer_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Progress" ADD CONSTRAINT "Progress_progressContainerId_fkey" FOREIGN KEY ("progressContainerId") REFERENCES "ProgressContainer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
