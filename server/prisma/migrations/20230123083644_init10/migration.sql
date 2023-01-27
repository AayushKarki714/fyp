-- CreateTable
CREATE TABLE "TodoContainer" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TodoContainer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TodoCard" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "todoContainerId" TEXT NOT NULL,

    CONSTRAINT "TodoCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Todo" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "todoCardId" TEXT NOT NULL,

    CONSTRAINT "Todo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TodoContainer" ADD CONSTRAINT "TodoContainer_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TodoCard" ADD CONSTRAINT "TodoCard_todoContainerId_fkey" FOREIGN KEY ("todoContainerId") REFERENCES "TodoContainer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Todo" ADD CONSTRAINT "Todo_todoCardId_fkey" FOREIGN KEY ("todoCardId") REFERENCES "TodoCard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
