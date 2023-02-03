import React, { useState, useRef } from "react";
import axios from "../../api/axios";
import { useQueryClient, useQuery, useMutation } from "react-query";
import useOnClickOutside from "../../hooks/useOnClickOutside";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { ITodo, ITodoPayload } from "../../types/types";
import Todo from "./Todo";
import { useDrop } from "react-dnd";
import { ItemTypes } from "../../utils/ItemTypes";
import { toast } from "react-toastify";
import { useAppSelector } from "../../redux/store/hooks";
import { Role } from "../../redux/slices/workspaceSlice";
import verifyRole from "../../utils/verifyRole";
import { visitLexicalEnvironment } from "typescript";

interface Props {
  id: string;
  title: string;
  todoContainerId: string;
}

const TodoCard: React.FC<Props> = ({ title, id, todoContainerId }) => {
  const queryClient = useQueryClient();
  const [showAddTodo, setShowAddTodo] = useState(false);
  const [todoTitle, setTodoTitle] = useState("");
  const todoCardRef = useRef<any>(null);
  const { user } = useAppSelector((state) => state.auth);
  const { workspaceId, role } = useAppSelector((state) => state.workspace);
  const isAllowed = verifyRole(role, [Role.ADMIN, Role.LANCER]);

  const todoQuery = useQuery(["todo-query", id], async () => {
    const { data } = await axios.get(`/todo/${todoContainerId}/${id}/todo`);
    return data?.data;
  });

  const todoUpdateMutation = useMutation(
    async ({ todoId, prevTodoCardId }: any) => {
      const res = await axios.post(
        `/todo/${user.id}/${workspaceId}/${id}/${todoId}/update-todo-status`,
        {
          status: title,
        }
      );
      return { ...res, prevTodoCardId };
    },
    {
      onMutate: async (newTodo) => {
        await queryClient.cancelQueries(["todo-query", id]);
        await queryClient.cancelQueries(["todo-query", newTodo.prevTodoCardId]);
        const snapshotOfPrevTodoCard: any = queryClient.getQueryData([
          "todo-query",
          newTodo.prevTodoCardId,
        ]);
        const snapshotOfCurrTodoCard = queryClient.getQueryData([
          "todo-query",
          id,
        ]);
        const updateTodo = snapshotOfPrevTodoCard.find(
          (todo: any) => todo.id === newTodo.todoId
        );
        updateTodo.status = title;
        updateTodo.todoCardId = id;
        queryClient.setQueryData(
          ["todo-query", newTodo.prevTodoCardId],
          (old: any) => old.filter((t: any) => t.id !== newTodo.todoId)
        );
        queryClient.setQueryData(["todo-query", id], (old: any) => [
          ...old,
          updateTodo,
        ]);

        return {
          snapshotOfPrevTodoCard,
          snapshotOfCurrTodoCard,
        };
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries(["todo-query", id]);
        queryClient.invalidateQueries(["todo-query", data.prevTodoCardId]);
      },
      onError: (error: any, data: any, context: any) => {
        queryClient.setQueryData(
          ["todo-query", id],
          context.snapshotOfCurrTodoCard
        );

        queryClient.setQueryData(
          ["todo-query", data.prevTodoCardId],
          context.snapshotOfPrevTodoCard
        );
        toast(error.message);
      },
    }
  );

  const [{ isOver }, drop] = useDrop(() => ({
    accept: `${ItemTypes.Todo}--${todoContainerId}`,
    drop: (data: any) => {
      // if the todo is dropped in the same card then don't do anything at all
      if (data.todoCardId === id) return;
      todoUpdateMutation.mutate({
        todoId: data.id,
        prevTodoCardId: data.todoCardId,
      });
    },
    collect: (monitor) => ({ isOver: !!monitor.isOver() }),
  }));

  const todoMutation = useMutation(
    async (payload: ITodoPayload) => {
      const res = await axios.post(
        `/todo/${user.id}/${workspaceId}/${todoContainerId}/${id}/create-todo`,
        payload
      );
      return res;
    },
    {
      onError: (data: any) => {
        toast(data?.response?.data?.message);
      },
      onSuccess: (data) => {
        if (data.status === 201) {
          queryClient.invalidateQueries(["todo-query", id]);
          toast(data?.data?.message);
        }
      },
    }
  );

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!todoTitle) return;
    todoMutation.mutate({ text: todoTitle, status: title });
    setTodoTitle("");
  };

  useOnClickOutside(todoCardRef, () => {
    setShowAddTodo(false);
  });

  const todoData = todoQuery.data || [];

  return (
    <>
      <div
        ref={isAllowed ? drop : null}
        className={`flex flex-col gap-2 bg-custom-black border-2 ${
          isOver
            ? "border-custom-light-green border-dotted"
            : "border-dark-gray"
        } rounded-md p-3 group`}
      >
        <div className="flex items-center justify-between  ">
          <h2 className="text-lg">{title}</h2>
          {isAllowed && (
            <button className="hidden  group-hover:block hover:text-custom-light-green">
              <TrashIcon className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="flex flex-col gap-3">
          {todoData.map((todo: ITodo) => (
            <Todo
              key={todo.id}
              id={todo.id}
              todoCardId={todo.todoCardId}
              title={todo.text}
              todo={todo}
              createdAt={todo.createdAt}
              completed={todo.completed}
              todoContainerId={todoContainerId}
              completionDate={todo.completionDate}
              totalComments={todo?._count.comments}
            />
          ))}
          {isAllowed &&
            (showAddTodo ? (
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
            ))}
        </div>
      </div>
    </>
  );
};

export default TodoCard;
