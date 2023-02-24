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
  handleDeleteTodoById,
  handleDeleteTodoCard,
  handleDeleteTodoContainer,
  handleGetTodoCommentLikeCount,
  handleTodoCardTitleUpdate,
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

// get requests
todoRouter.get(
  "/:workspaceId/todo-container",
  catchAsyncErrors(getAllTodoContainer)
);

todoRouter.get(
  "/:workspaceId/:todoContainerId/todo-card",
  catchAsyncErrors(getAllTodoCardInTodoContainer)
);

todoRouter.get(
  "/:todoContainerId/:todoCardId/todo",
  catchAsyncErrors(getAllTodosInTodoCard)
);

todoRouter.get("/:todoId/single-todo", catchAsyncErrors(getSingleTodo));

todoRouter.get(
  "/:userId/:commentId/comments/get-like-count",
  catchAsyncErrors(handleGetTodoCommentLikeCount)
);

// post requests
todoRouter.post(
  "/:userId/:workspaceId/create-todo-container",
  catchAsyncErrors(handleCreateTodoContainer)
);

todoRouter.post(
  "/:userId/:workspaceId/:todoContainerId/create-todo-card",
  catchAsyncErrors(handleCreateTodoCard)
);

todoRouter.post(
  "/:userId/:workspaceId/:todoContainerId/:todoCardId/create-todo",
  catchAsyncErrors(handleCreateTodo)
);

todoRouter.post(
  "/:userId/:workspaceId/:todoCardId/:todoId/update-todo-status",
  catchAsyncErrors(handleUpdateTodoStatus)
);

todoRouter.post(
  "/:todoId/:userId/comments",
  catchAsyncErrors(handleCreateTodoComment)
);

todoRouter.post(
  "/:todoId/:userId/comments/:commentId",
  catchAsyncErrors(handleTodoUpdateComment)
);

todoRouter.post(
  "/:userId/:commentId/comment/toggle-like",
  catchAsyncErrors(handleToggleTodoCommentLikes)
);

// delete routes
todoRouter.delete(
  "/:userId/:workspaceId/:todoContainerId/delete-todo-container",
  catchAsyncErrors(handleDeleteTodoContainer)
);

todoRouter.delete(
  "/:userId/:workspaceId/:todoCardId/:todoId/delete-single-todo",
  catchAsyncErrors(handleDeleteTodoById)
);

todoRouter.delete(
  "/:userId/:workspaceId/:todoContainerId/:todoCardId/delete-todo-card",
  catchAsyncErrors(handleDeleteTodoCard)
);

todoRouter.delete(
  "/:todoId/:userId/comments/:commentId",
  catchAsyncErrors(handleTodoDeleteComment)
);

// patch routes
todoRouter.patch(
  "/:userId/:workspaceId/:todoContainerId/update-todocontainer-title",
  catchAsyncErrors(handleTodoContainerTitleUpdate)
);

todoRouter.patch(
  "/:userId/:workspaceId/:todoContainerId/:todoCardId/update-todocard-title",
  catchAsyncErrors(handleTodoCardTitleUpdate)
);

todoRouter.patch(
  "/:userId/:workspaceId/:todoCardId/:todoId/update-todo-title",
  catchAsyncErrors(handleTodoTitleUpdate)
);

todoRouter.patch(
  "/:userId/:workspaceId/:todoCardId/:todoId/update-todo-description",
  catchAsyncErrors(handleTodoDescriptionUpdate)
);

todoRouter.patch(
  `/:userId/:workspaceId/:todoCardId/:todoId/update-todo-completion-date`,
  catchAsyncErrors(handleTodoCompletionUpdate)
);

todoRouter.patch(
  "/:userId/:workspaceId/:todoCardId/:todoId/update-todo-completed",
  catchAsyncErrors(handleTodoCompletedUpdate)
);

export default todoRouter;
