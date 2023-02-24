import React, { useRef, useState } from "react";
import { useAppSelector } from "../../redux/store/hooks";
import { useQueryClient, useQuery, useMutation } from "react-query";
import TodoCard from "./TodoCard";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import useOnClickOutside from "../../hooks/useOnClickOutside";
import verifyRole from "../../utils/verifyRole";
import { Role } from "../../redux/slices/workspaceSlice";
import {
  createTodoCard,
  deleteTodoContainer,
  updateTodoContainerTitle,
} from "../../services/todo";
import axios from "../../api/axios";

interface TodoContainerProps {
  id: string;
  text: string;
  createdByUserId: string;
  photo: string;
  createdUsername: string;
}

const TodoContainer: React.FC<TodoContainerProps> = ({
  text,
  id: todoContainerId,
  photo,
  createdByUserId,
  createdUsername,
}) => {
  const queryClient = useQueryClient();
  const todoContainerRef = useRef<HTMLDivElement>(null);
  const [todoCardTitle, setTodoCardTitle] = useState<string>("");
  const [todoContainerTitle, setTodoContainerTitle] = useState<string>(
    text || ""
  );
  const [editMode, setEditMode] = useState<boolean>(false);
  const [showTodoCard, setShowTodoCard] = useState<boolean>(false);
  const {
    user: { id: userId },
  } = useAppSelector((state) => state.auth);
  const { workspaceId, role } = useAppSelector((state) => state.workspace);
  const isAllowed = verifyRole(role, [Role.ADMIN, Role.LANCER]);

  const { data: todoCardData, isLoading } = useQuery(
    ["todo-card-query", todoContainerId],
    async () => {
      const res = await axios.get(
        `/todo/${workspaceId}/${todoContainerId}/todo-card`
      );
      return res?.data?.data;
    }
  );

  const deleteTodoContainerMutation = useMutation(
    deleteTodoContainer({
      userId,
      workspaceId,
      todoContainerId,
      createdByUserId,
    }),
    {
      onError: (error: any) => {
        console.log({ error });
        toast(error?.response?.data?.message);
      },
      onSuccess: (data: any) => {
        console.log({ data });
        queryClient.invalidateQueries("todo-container-query");
        toast(data?.message);
      },
    }
  );

  const updateTodoContainerTitleMutation = useMutation(
    updateTodoContainerTitle({ userId, workspaceId, todoContainerId }),
    {
      onError: (error: any) => {
        toast(error?.response?.data?.message);
      },
      onSuccess: (data: any) => {
        queryClient.invalidateQueries("todo-container-query");
        setEditMode(false);
        toast(data?.message);
      },
    }
  );

  const todoCardMutation = useMutation(
    createTodoCard({ userId, todoContainerId, workspaceId }),
    {
      onSuccess: (data) => {
        setTodoCardTitle("");
        queryClient.invalidateQueries(["todo-card-query", todoContainerId]);
        toast(data?.message);
      },
      onError: (error: any) => {
        toast(error?.response?.data?.message);
      },
    }
  );

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!todoCardTitle) return toast("Please Fill the Required Fields*");
    todoCardMutation.mutate({ title: todoCardTitle });
  };

  const handleDeleteTodoContainer = () => {
    deleteTodoContainerMutation.mutate({});
  };

  const handleTodoContainerTitleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    if (!todoContainerTitle)
      return toast("TodoContainer Title can't be Empty!!", {
        position: "top-center",
      });
    updateTodoContainerTitleMutation.mutate({ title: todoContainerTitle });
  };

  useOnClickOutside(todoContainerRef, () => {
    setEditMode(false);
    setTodoContainerTitle(text);
  });

  if (isLoading) {
    return <h1>loading...</h1>;
  }

  return (
    <>
      <div
        ref={todoContainerRef}
        className="group flex flex-col gap-4 border-2 border-custom-light-dark p-3 pb-2 rounded-md "
      >
        <div className="text-2xl flex justify-between items-center">
          {isAllowed && editMode ? (
            <form onSubmit={handleTodoContainerTitleSubmit}>
              <input
                type="text"
                value={todoContainerTitle}
                onChange={(event) => setTodoContainerTitle(event.target.value)}
                className="outline-none bg-custom-light-dark px-2 py-1 text-base rounded-sm text-white"
              />
            </form>
          ) : (
            <h2 onClick={() => setEditMode(true)} className="text-2xl">
              {text}
            </h2>
          )}
          {/* {isAllowed && ( */}
          <div>
            <button
              onClick={handleDeleteTodoContainer}
              className="hidden group-hover:block text-sm text-gray-400 hover:text-custom-light-green"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
          {/* )} */}
        </div>
        <div className="grid grid-cols-responsive-todo items-start gap-3">
          {todoCardData.map(({ id, title, todoContainerId }: any) => (
            <TodoCard
              key={id}
              id={id}
              title={title}
              todoContainerId={todoContainerId}
            />
          ))}

          {isAllowed &&
            (showTodoCard ? (
              <form onSubmit={handleFormSubmit} className="flex flex-col gap-2">
                <textarea
                  autoFocus
                  value={todoCardTitle}
                  placeholder="Enter a title for todo card..."
                  onChange={(event) => setTodoCardTitle(event.target.value)}
                  className="w-full resize-none h-16 rounded-md bg-custom-light-dark px-3 py-2 text-base custom-scrollbar text-gray-300 shadow"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="bg-custom-light-green  px-4 py-2 rounded-md text-black font-medium text-base"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowTodoCard(false)}
                    className="bg-custom-light-green  px-4 py-2 rounded-md text-black font-medium text-base"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setShowTodoCard(true)}
                className="flex gap-3 text-black px-4 py-2 items-center justify-center bg-custom-light-green text-base rounded-md"
              >
                <PlusIcon className="h-5 w-5" />
                Add a Todo Card
              </button>
            ))}
        </div>
        <div className="flex items-center justify-end gap-3 text-base">
          <p className="text-gray-400 hover:text-white">
            Created by {createdUsername}{" "}
          </p>
          <div className="h-8 w-8 rounded-full overflow-x-hidden">
            <img
              src={photo}
              alt={createdUsername}
              className="w-full h-full object-containj"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default TodoContainer;
