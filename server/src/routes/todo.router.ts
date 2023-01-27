import express from "express";
import {
  getAllTodoCardInTodoContainer,
  getAllTodoContainer,
  getAllTodosInTodoCard,
  handleCreateTodo,
  handleCreateTodoCard,
  handleCreateTodoContainer,
} from "../controllers/todo.controller";

const todoRouter = express.Router();

todoRouter.post(
  "/:workspaceId/create-todo-container",
  handleCreateTodoContainer
);

todoRouter.get("/:workspaceId/todo-container", getAllTodoContainer);

todoRouter.post(
  "/:workspaceId/:todoContainerId/create-todo-card",
  handleCreateTodoCard
);

todoRouter.get(
  "/:workspaceId/:todoContainerId/todo-card",
  getAllTodoCardInTodoContainer
);

todoRouter.post(
  "/:workspaceId/:todoContainerId/create-todo-card",
  handleCreateTodoCard
);

todoRouter.post("/:todoContainerId/:todoCardId/create-todo", handleCreateTodo);
todoRouter.get("/:todoContainerId/:todoCardId/todo", getAllTodosInTodoCard);
todoRouter.post("/:todoContainerId/:todoCardId/create-todo", handleCreateTodo);

export default todoRouter;
