import React, { useState } from "react";
import { FolderPlusIcon } from "@heroicons/react/24/outline";
import Overlay from "../components/Modals/Overlay";
import Modal from "../components/Modals/Modal";
import CreateTodo from "../components/Modals/CreateTodo";
import useNavigateToDashboard from "../hooks/useNavigateToDashboard";
import { useAppSelector } from "../redux/store/hooks";
import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "../api/axios";
import {
  CreateTodoContainerPayload,
  ITodoContainerPayload,
} from "../types/types";
import TodoContainer from "../components/Todo/TodoContainer";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { toast } from "react-toastify";

const TodoPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const { workspaceId } = useAppSelector((state) => state.workspace);

  const todoContainerQuery = useQuery(
    "todo-container-query",
    async () => {
      const res = await axios.get(`/todo/${workspaceId}/todo-container`);
      return res.data;
    },
    { enabled: !!workspaceId }
  );

  const todoContainerMutation = useMutation(
    async (payload: CreateTodoContainerPayload) => {
      const res = await axios.post(
        `/todo/${workspaceId}/create-todo-container`,
        payload
      );
      return res;
    },
    {
      onError: (error: any) => {
        toast(error?.response?.data?.message);
        console.log("error", error);
      },
      onSuccess: (data) => {
        if (data?.status === 201) {
          queryClient.invalidateQueries("todo-container-query");
          setIsOpen(false);
          toast(data?.data?.message, { position: "bottom-right" });
        }
      },
    }
  );

  const handleOnCreateTodoContainer = (data: CreateTodoContainerPayload) => {
    todoContainerMutation.mutate(data);
  };

  useNavigateToDashboard();

  if (todoContainerQuery.isLoading) {
    return <h1>loading...</h1>;
  }

  const todoContainerData = todoContainerQuery.data?.data || [];

  return (
    <>
      <section className="flex flex-col gap-3">
        <button
          className="flex items-center justify-center p-2 w-10 h-10 rounded-full ml-auto text-gray-400 hover:text-custom-light-green"
          onClick={() => setIsOpen(true)}
        >
          <FolderPlusIcon className="h-6" />
        </button>
        <Overlay isOpen={isOpen} onClick={() => setIsOpen(false)}>
          <Modal onClick={() => setIsOpen(false)}>
            <CreateTodo onSubmit={handleOnCreateTodoContainer} />
          </Modal>
        </Overlay>
        <DndProvider backend={HTML5Backend}>
          <div className="flex flex-col gap-4">
            {todoContainerData.map(({ id, title }: ITodoContainerPayload) => {
              return <TodoContainer key={id} id={id} text={title} />;
            })}
          </div>
        </DndProvider>
      </section>
    </>
  );
};

export default TodoPage;
