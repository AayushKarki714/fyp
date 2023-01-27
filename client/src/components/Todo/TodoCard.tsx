import React, { useState, useRef } from "react";
import axios from "../../api/axios";
import { useQueryClient, useQuery, useMutation } from "react-query";
import cogoToast from "cogo-toast";
import useOnClickOutside from "../../hooks/useOnClickOutside";
import { PlusIcon } from "@heroicons/react/24/outline";
import { ITodo, ITodoPayload } from "../../types/types";
import Todo from "./Todo";
import { useDrop } from "react-dnd";
import { ItemTypes } from "../../utils/ItemTypes";

interface TodoCardProps {
  id: string;
  title: string;
  todoContainerId: string;
}

const TodoCard: React.FC<TodoCardProps> = ({ title, id, todoContainerId }) => {
  const queryClient = useQueryClient();
  const [showAddTodo, setShowAddTodo] = useState(false);
  const [todoTitle, setTodoTitle] = useState("");
  const todoCardRef = useRef<any>(null);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: `${ItemTypes.Todo}--${todoContainerId}`,
    drop: (data: any) => {
      // if the todo is dropped in the same card then don't do anything at all
      if (data.todoCardId === id) return;

      console.log("inside the drop data", data);
    },
    collect: (monitor) => ({ isOver: !!monitor.isOver() }),
  }));

  const todoQuery = useQuery(["todo-query", id], async () => {
    const res = await axios.get(`/todo/${todoContainerId}/${id}/todo`);
    return res.data;
  });

  const todoMutation = useMutation(
    async (payload: ITodoPayload) => {
      const res = await axios.post(
        `/todo/${todoContainerId}/${id}/create-todo`,
        payload
      );
      return res;
    },
    {
      onError: (data) => {
        console.log("error", data);
      },
      onSuccess: (data) => {
        if (data.status === 201) {
          queryClient.invalidateQueries(["todo-query", id]);
          cogoToast.success(data?.data?.message);
        }
      },
    }
  );

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!todoTitle) return;
    todoMutation.mutate({ text: todoTitle });
    setTodoTitle("");
  };

  useOnClickOutside(todoCardRef, () => {
    setShowAddTodo(false);
  });

  if (todoQuery.isLoading) {
    return <h1>loading...</h1>;
  }
  const todoData = todoQuery.data?.data || [];

  return (
    <div
      ref={drop}
      className={`flex flex-col gap-2 bg-custom-black border-2 ${
        isOver ? "border-custom-light-green border-dotted" : "border-dark-gray"
      } rounded-md p-3`}
    >
      <h2 className="text-lg">{title}</h2>
      <div className="flex flex-col gap-3">
        {todoData.map((todo: ITodo) => (
          <Todo
            key={todo.id}
            title={todo.text}
            todo={todo}
            todoContainerId={todoContainerId}
          />
        ))}
        {showAddTodo ? (
          <form
            ref={todoCardRef}
            onSubmit={handleSubmit}
            className="flex flex-col gap-2"
          >
            <textarea
              autoFocus
              value={todoTitle}
              placeholder="Enter a todo..."
              className="w-full resize-none h-16 rounded-md bg-custom-light-dark px-3 py-2 text-base custom-scrollbar text-gray-300 shadow"
              onChange={(event) => setTodoTitle(event.target.value)}
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
                onClick={() => {
                  setShowAddTodo(false);
                }}
                className="bg-custom-light-green  px-4 py-2 rounded-md text-black font-medium text-base"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            className="flex mt-3 self-start items-center  gap-1 text-base hover:text-custom-light-green"
            onClick={(event) => {
              setShowAddTodo(true);
            }}
          >
            <PlusIcon className="h-5" />
            Add a Todo
          </button>
        )}
      </div>
    </div>
  );
};

export default TodoCard;
