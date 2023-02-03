import express from "express";
import {
  getAllTodoCardInTodoContainer,
  getAllTodoContainer,
  getAllTodosInTodoCard,
  getSingleTodo,
  handleCreateTodo,
  handleCreateTodoCard,
  handleCreateTodoComment,
  handleCreateTodoContainer,
  handleDeleteTodoContainer,
  handleGetTodoCommentLikeCount,
  handleTodoCompletedUpdate,
  handleTodoCompletionUpdate,
  handleTodoContainerTitleUpdate,
  handleTodoDeleteComment,
  handleTodoDescriptionUpdate,
  handleTodoTitleUpdate,
  handleTodoUpdateComment,
  handleToggleTodoCommentLikes,
  handleUpdateTodoStatus,
} from "../controllers/todo.controller";
import catchAsyncErrors from "../utils/catchAsyncErrors";

const todoRouter = express.Router();

todoRouter.post(
  "/:userId/:workspaceId/create-todo-container",
  catchAsyncErrors(handleCreateTodoContainer)
);

todoRouter.get(
  "/:workspaceId/todo-container",
  catchAsyncErrors(getAllTodoContainer)
);

todoRouter.post(
  "/:workspaceId/:todoContainerId/create-todo-card",
  catchAsyncErrors(handleCreateTodoCard)
);

todoRouter.get(
  "/:workspaceId/:todoContainerId/todo-card",
  catchAsyncErrors(getAllTodoCardInTodoContainer)
);

todoRouter.post(
  "/:workspaceId/:todoContainerId/create-todo-card",
  catchAsyncErrors(handleCreateTodoCard)
);

todoRouter.post(
  "/:todoContainerId/:todoCardId/create-todo",
  catchAsyncErrors(handleCreateTodo)
);
todoRouter.get(
  "/:todoContainerId/:todoCardId/todo",
  catchAsyncErrors(getAllTodosInTodoCard)
);
todoRouter.post(
  "/:todoContainerId/:todoCardId/create-todo",
  catchAsyncErrors(handleCreateTodo)
);

todoRouter.post(
  "/:todoCardId/:todoId/update-todo-status",
  catchAsyncErrors(handleUpdateTodoStatus)
);

todoRouter.delete(
  "/:todoContainerId/delete-todo-container",
  catchAsyncErrors(handleDeleteTodoContainer)
);

todoRouter.patch(
  "/:todoContainerId/update-todocontainer-title",
  catchAsyncErrors(handleTodoContainerTitleUpdate)
);

todoRouter.patch(
  "/:todoCardId/:todoId/update-todo-title",
  catchAsyncErrors(handleTodoTitleUpdate)
);

todoRouter.patch(
  "/:todoCardId/:todoId/update-todo-description",
  catchAsyncErrors(handleTodoDescriptionUpdate)
);

todoRouter.patch(
  "/:todoCardId/:todoId/update-todo-completion-date",
  catchAsyncErrors(handleTodoCompletionUpdate)
);

todoRouter.patch(
  "/:todoCardId/:todoId/update-todo-completed",
  catchAsyncErrors(handleTodoCompletedUpdate)
);

todoRouter.get("/:todoId/single-todo", catchAsyncErrors(getSingleTodo));
todoRouter.post(
  "/:todoId/:userId/comments",
  catchAsyncErrors(handleCreateTodoComment)
);
todoRouter.post(
  "/:todoId/:userId/comments/:commentId",
  catchAsyncErrors(handleTodoUpdateComment)
);
todoRouter.delete(
  "/:todoId/:userId/comments/:commentId",
  catchAsyncErrors(handleTodoDeleteComment)
);

todoRouter.get(
  "/:userId/:commentId/comments/get-like-count",
  catchAsyncErrors(handleGetTodoCommentLikeCount)
);

todoRouter.post(
  "/:userId/:commentId/comment/toggle-like",
  catchAsyncErrors(handleToggleTodoCommentLikes)
);

export default todoRouter;
