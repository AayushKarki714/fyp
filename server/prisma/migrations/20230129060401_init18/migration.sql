-- DropForeignKey
ALTER TABLE "Todo" DROP CONSTRAINT "Todo_todoCardId_fkey";

-- DropForeignKey
ALTER TABLE "TodoCard" DROP CONSTRAINT "TodoCard_todoContainerId_fkey";

-- DropForeignKey
ALTER TABLE "TodoContainer" DROP CONSTRAINT "TodoContainer_workspaceId_fkey";

-- AddForeignKey
ALTER TABLE "TodoContainer" ADD CONSTRAINT "TodoContainer_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TodoCard" ADD CONSTRAINT "TodoCard_todoContainerId_fkey" FOREIGN KEY ("todoContainerId") REFERENCES "TodoContainer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Todo" ADD CONSTRAINT "Todo_todoCardId_fkey" FOREIGN KEY ("todoCardId") REFERENCES "TodoCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;
