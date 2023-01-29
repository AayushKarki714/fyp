import React, { useRef, useState } from "react";
import axios from "../../api/axios";
import { useAppSelector } from "../../redux/store/hooks";
import { useQueryClient, useQuery, useMutation } from "react-query";
import TodoCard from "./TodoCard";
import { ITodoCardPayload } from "../../types/types";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import useOnClickOutside from "../../hooks/useOnClickOutside";

interface TodoContainerProps {
  id: string;
  text: string;
}

const TodoContainer: React.FC<TodoContainerProps> = ({ text, id }) => {
  const queryClient = useQueryClient();
  const todoContainerRef = useRef<HTMLDivElement>(null);
  const [todoCardTitle, setTodoCardTitle] = useState<string>("");
  const [todoContainerTitle, setTodoContainerTitle] = useState<string>(
    text || ""
  );
  const [editMode, setEditMode] = useState<boolean>(false);
  const [showTodoCard, setShowTodoCard] = useState<boolean>(false);
  const { workspaceId } = useAppSelector((state) => state.workspace);

  const todoCardQuery = useQuery(["todo-card-query", id], async () => {
    const res = await axios.get(`/todo/${workspaceId}/${id}/todo-card`);
    return res.data;
  });

  const deleteTodoContainerMutation = useMutation(
    async () => {
      const res = await axios.delete(`/todo/${id}/delete-todo-container`);
      return res.data;
    },
    {
      onError: (error: any) => {
        console.log("error", error);
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries("todo-container-query");
        toast(data?.message, { position: "bottom-right" });
      },
    }
  );

  const updateTodoContainerTitleMutation = useMutation(
    async (payload: any) => {
      const res = await axios.patch(
        `/todo/${id}/update-todocontainer-title`,
        payload
      );
      return res;
    },
    {
      onError: (data) => {
        console.log("error", data);
      },
      onSuccess: (data) => {
        if (data.status === 200) {
          queryClient.invalidateQueries("todo-container-query");
          setEditMode(false);
          toast(data?.data?.message, { position: "bottom-right" });
        }
      },
    }
  );

  const todoCardMutation = useMutation(
    async (payload: ITodoCardPayload) => {
      const res = await axios.post(
        `/todo/${workspaceId}/${id}/create-todo-card`,
        payload
      );
      return res;
    },
    {
      onSuccess: (data) => {
        if (data.status === 201) {
          setTodoCardTitle("");
          queryClient.invalidateQueries(["todo-card-query", id]);
          toast(data?.data?.message);
        }
      },
      onError: (error) => {
        console.log("error", error);
      },
    }
  );

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!todoCardTitle) return toast("Please Fill the Required Fields*");
    todoCardMutation.mutate({ title: todoCardTitle });
  };

  const handleDeleteTodoContainer = () => {
    deleteTodoContainerMutation.mutate();
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

  if (todoCardQuery.isLoading) {
    return <h1>loading...</h1>;
  }
  const todoCardData = todoCardQuery?.data?.data || [];

  return (
    <>
      <div
        ref={todoContainerRef}
        className="group flex flex-col gap-4 border-2 border-custom-light-dark p-3 rounded-md "
      >
        <div className="text-2xl flex justify-between items-center">
          {editMode ? (
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
          <div>
            <button
              onClick={handleDeleteTodoContainer}
              className="hidden group-hover:block text-sm text-gray-300 hover:text-custom-light-green"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
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

          {showTodoCard ? (
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
          )}
        </div>
      </div>
    </>
  );
};

export default TodoContainer;
