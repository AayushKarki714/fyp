import React, { useState } from "react";
import axios from "../../api/axios";
import { useAppSelector } from "../../redux/store/hooks";
import { useQueryClient, useQuery, useMutation } from "react-query";
import cogoToast from "cogo-toast";
import TodoCard from "./TodoCard";
import { ITodoCardPayload } from "../../types/types";
import { PlusIcon } from "@heroicons/react/24/outline";

interface TodoContainerProps {
  id: string;
  text: string;
}

const TodoContainer: React.FC<TodoContainerProps> = ({ text, id }) => {
  const queryClient = useQueryClient();
  const [todoCardTitle, setTodoCardTitle] = useState<string>("");
  const [showTodoCard, setShowTodoCard] = useState<boolean>(false);
  const { workspaceId } = useAppSelector((state) => state.workspace);

  const todoCardQuery = useQuery(["todo-card-query", id], async () => {
    const res = await axios.get(`/todo/${workspaceId}/${id}/todo-card`);
    return res.data;
  });

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
          cogoToast.success(data?.data?.message);
        }
      },
      onError: (error) => {
        console.log("error", error);
      },
    }
  );

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!todoCardTitle)
      return cogoToast.error("Please Fill the Required Fields*");
    todoCardMutation.mutate({ title: todoCardTitle });
  };

  if (todoCardQuery.isLoading) {
    return <h1>loading...</h1>;
  }
  const todoCardData = todoCardQuery?.data?.data || [];

  return (
    <div className="flex flex-col gap-3 border-2 border-custom-light-dark p-3 rounded-md ">
      <h2 className="text-2xl">{text}</h2>
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
  );
};

export default TodoContainer;
