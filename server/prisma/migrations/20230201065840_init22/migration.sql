/*
  Warnings:

  - A unique constraint covering the columns `[id,todoContainerId]` on the table `TodoCard` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TodoCard_id_todoContainerId_key" ON "TodoCard"("id", "todoContainerId");
