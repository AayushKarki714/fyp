"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const todo_controller_1 = require("../controllers/todo.controller");
const catchAsyncErrors_1 = __importDefault(require("../utils/catchAsyncErrors"));
const todoRouter = express_1.default.Router();
// get requests
todoRouter.get("/:workspaceId/todo-container", (0, catchAsyncErrors_1.default)(todo_controller_1.getAllTodoContainer));
todoRouter.get("/:workspaceId/:todoContainerId/todo-card", (0, catchAsyncErrors_1.default)(todo_controller_1.getAllTodoCardInTodoContainer));
todoRouter.get("/:todoContainerId/:todoCardId/todo", (0, catchAsyncErrors_1.default)(todo_controller_1.getAllTodosInTodoCard));
todoRouter.get("/:todoId/single-todo", (0, catchAsyncErrors_1.default)(todo_controller_1.getSingleTodo));
todoRouter.get("/:userId/:commentId/comments/get-like-count", (0, catchAsyncErrors_1.default)(todo_controller_1.handleGetTodoCommentLikeCount));
// post requests
todoRouter.post("/:userId/:workspaceId/create-todo-container", (0, catchAsyncErrors_1.default)(todo_controller_1.handleCreateTodoContainer));
todoRouter.post("/:userId/:workspaceId/:todoContainerId/create-todo-card", (0, catchAsyncErrors_1.default)(todo_controller_1.handleCreateTodoCard));
todoRouter.post("/:userId/:workspaceId/:todoContainerId/:todoCardId/create-todo", (0, catchAsyncErrors_1.default)(todo_controller_1.handleCreateTodo));
todoRouter.post("/:userId/:workspaceId/:todoCardId/:todoId/update-todo-status", (0, catchAsyncErrors_1.default)(todo_controller_1.handleUpdateTodoStatus));
todoRouter.post("/:todoId/:userId/comments", (0, catchAsyncErrors_1.default)(todo_controller_1.handleCreateTodoComment));
todoRouter.post("/:todoId/:userId/comments/:commentId", (0, catchAsyncErrors_1.default)(todo_controller_1.handleTodoUpdateComment));
todoRouter.post("/:userId/:commentId/comment/toggle-like", (0, catchAsyncErrors_1.default)(todo_controller_1.handleToggleTodoCommentLikes));
// delete routes
todoRouter.delete("/:userId/:workspaceId/:todoContainerId/delete-todo-container", (0, catchAsyncErrors_1.default)(todo_controller_1.handleDeleteTodoContainer));
todoRouter.delete("/:userId/:workspaceId/:todoCardId/:todoId/delete-single-todo", (0, catchAsyncErrors_1.default)(todo_controller_1.handleDeleteTodoById));
todoRouter.delete("/:userId/:workspaceId/:todoContainerId/:todoCardId/delete-todo-card", (0, catchAsyncErrors_1.default)(todo_controller_1.handleDeleteTodoCard));
todoRouter.delete("/:todoId/:userId/comments/:commentId", (0, catchAsyncErrors_1.default)(todo_controller_1.handleTodoDeleteComment));
// patch routes
todoRouter.patch("/:userId/:workspaceId/:todoContainerId/update-todocontainer-title", (0, catchAsyncErrors_1.default)(todo_controller_1.handleTodoContainerTitleUpdate));
todoRouter.patch("/:userId/:workspaceId/:todoContainerId/:todoCardId/update-todocard-title", (0, catchAsyncErrors_1.default)(todo_controller_1.handleTodoCardTitleUpdate));
todoRouter.patch("/:userId/:workspaceId/:todoCardId/:todoId/update-todo-title", (0, catchAsyncErrors_1.default)(todo_controller_1.handleTodoTitleUpdate));
todoRouter.patch("/:userId/:workspaceId/:todoCardId/:todoId/update-todo-description", (0, catchAsyncErrors_1.default)(todo_controller_1.handleTodoDescriptionUpdate));
todoRouter.patch(`/:userId/:workspaceId/:todoCardId/:todoId/update-todo-completion-date`, (0, catchAsyncErrors_1.default)(todo_controller_1.handleTodoCompletionUpdate));
todoRouter.patch("/:userId/:workspaceId/:todoCardId/:todoId/update-todo-completed", (0, catchAsyncErrors_1.default)(todo_controller_1.handleTodoCompletedUpdate));
exports.default = todoRouter;
