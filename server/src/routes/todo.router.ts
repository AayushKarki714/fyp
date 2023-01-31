import express from "express";
import {
  getAllTodoCardInTodoContainer,
  getAllTodoContainer,
  getAllTodosInTodoCard,
  handleCreateTodo,
  handleCreateTodoCard,
  handleCreateTodoContainer,
  handleDeleteTodoContainer,
  handleTodoCompletedUpdate,
  handleTodoCompletionUpdate,
  handleTodoContainerTitleUpdate,
  handleTodoDescriptionUpdate,
  handleTodoTitleUpdate,
  handleUpdateTodoStatus,
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

todoRouter.post(
  "/:todoCardId/:todoId/update-todo-status",
  handleUpdateTodoStatus
);

todoRouter.delete(
  "/:todoContainerId/delete-todo-container",
  handleDeleteTodoContainer
);

todoRouter.patch(
  "/:todoContainerId/update-todocontainer-title",
  handleTodoContainerTitleUpdate
);

todoRouter.patch(
  "/:todoCardId/:todoId/update-todo-title",
  handleTodoTitleUpdate
);

todoRouter.patch(
  "/:todoCardId/:todoId/update-todo-description",
  handleTodoDescriptionUpdate
);

todoRouter.patch(
  "/:todoCardId/:todoId/update-todo-completion-date",
  handleTodoCompletionUpdate
);

todoRouter.patch(
  "/:todoCardId/:todoId/update-todo-completed",
  handleTodoCompletedUpdate
);

export default todoRouter;
