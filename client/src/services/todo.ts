import { makeRequest, makeRequestFn } from "../api/makeRequest";
import {
  GET_OPTIONS,
  DELETE_OPTIONS,
  POST_OPTIONS,
  PATCH_OPTIONS,
} from "../utils/options";

interface ICreateTodoContainer {
  userId: string;
  workspaceId: string;
}

interface IGetTodoCards {
  workspaceId: string;
  todoContainerId: string;
}

function getTodoCards({ workspaceId, todoContainerId }: IGetTodoCards) {
  return makeRequest(
    `/todo/${workspaceId}/${todoContainerId}/todo-card`,
    GET_OPTIONS
  );
}

function createTodoContainer({ userId, workspaceId }: ICreateTodoContainer) {
  return makeRequestFn(`/todo/${userId}/${workspaceId}/create-todo-container`, {
    method: "POST",
  });
}

interface ITodoContainer extends ICreateTodoContainer {
  todoContainerId: string;
}

function deleteTodoContainer({
  userId,
  workspaceId,
  todoContainerId,
}: ITodoContainer) {
  return makeRequestFn(
    `/todo/${userId}/${workspaceId}/${todoContainerId}/delete-todo-container`,
    DELETE_OPTIONS
  );
}

function updateTodoContainerTitle({
  userId,
  workspaceId,
  todoContainerId,
}: ITodoContainer) {
  return makeRequestFn(
    `/todo/${userId}/${workspaceId}/${todoContainerId}/update-todocontainer-title`,
    {
      method: "PATCH",
    }
  );
}

interface ITodoCard extends ITodoContainer {
  todoCardId: string;
}

function createTodo({
  todoCardId,
  todoContainerId,
  workspaceId,
  userId,
}: ITodoCard) {
  return makeRequestFn(
    `/todo/${userId}/${workspaceId}/${todoContainerId}/${todoCardId}/create-todo`,
    POST_OPTIONS
  );
}

function deleteTodoCard({
  userId,
  workspaceId,
  todoCardId,
  todoContainerId,
}: ITodoCard) {
  return makeRequestFn(
    `/todo/${userId}/${workspaceId}/${todoContainerId}/${todoCardId}/delete-todo-card`,
    DELETE_OPTIONS
  );
}

function updateTodoCardTitle({
  workspaceId,
  userId,
  todoCardId,
  todoContainerId,
}: ITodoCard) {
  return makeRequestFn(
    `/todo/${userId}/${workspaceId}/${todoContainerId}/${todoCardId}/update-todocard-title`,
    PATCH_OPTIONS
  );
}

export {
  getTodoCards,
  createTodoContainer,
  createTodo,
  deleteTodoContainer,
  deleteTodoCard,
  updateTodoContainerTitle,
  updateTodoCardTitle,
};
