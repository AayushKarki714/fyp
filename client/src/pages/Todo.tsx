import React, { useState } from "react";
import {
  FolderPlusIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
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
import { Role } from "../redux/slices/workspaceSlice";
import verifyRole from "../utils/verifyRole";
import { createTodoContainer } from "../services/todo";
import ColorIndicator from "../components/ColorIndicator/ColorIndicator";
import { isVisible } from "@testing-library/user-event/dist/utils";
import { AnimatePresence } from "framer-motion";

const TodoPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { user } = useAppSelector((state) => state.auth);
  const [showInformation, setShowInformation] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);
  const { workspaceId, role } = useAppSelector((state) => state.workspace);

  const { data: todoContainerData, isLoading } = useQuery(
    "todo-container-query",
    async () => {
      const res = await axios.get(`/todo/${workspaceId}/todo-container`);
      return res.data?.data;
    },
    { enabled: !!workspaceId }
  );

  const todoContainerMutation = useMutation(
    createTodoContainer({ userId: user.id, workspaceId }),
    {
      onError: (error: any) => {
        toast(error?.response?.data?.message);
        console.log("error", error);
      },
      onSuccess: (data: any) => {
        queryClient.invalidateQueries("todo-container-query");
        setIsOpen(false);
        toast(data?.message);
      },
    }
  );

  const handleOnCreateTodoContainer = (data: CreateTodoContainerPayload) => {
    todoContainerMutation.mutate(data);
  };

  useNavigateToDashboard();

  if (isLoading) {
    return <h1>loading...</h1>;
  }

  const isAllowed = verifyRole(role, [Role.ADMIN, Role.LANCER]);

  return (
    <>
      <section className="relative  flex flex-col gap-3">
        <div className="flex gap-3 justify-end text-gray-400 ">
          <button
            className="hover:text-custom-light-green"
            onMouseLeave={() => setShowInformation(false)}
            onMouseEnter={() => setShowInformation(true)}
          >
            <InformationCircleIcon className="h-6 w-6" />
          </button>
          {isAllowed && (
            <button
              className="flex items-center justify-center p-2 w-10 h-10 rounded-full  text-gray-400 hover:text-custom-light-green"
              onClick={() => setIsOpen(true)}
            >
              <FolderPlusIcon className="h-6" />
            </button>
          )}
        </div>
        {showInformation && (
          <AnimatePresence>
            <ColorIndicator
              onMouseEnter={() => setShowInformation(true)}
              onMouseLeave={() => setShowInformation(false)}
            />
          </AnimatePresence>
        )}
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
