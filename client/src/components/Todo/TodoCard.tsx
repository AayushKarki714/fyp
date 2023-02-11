import React, { useState, useRef, RefObject } from "react";
import axios from "../../api/axios";
import { useQueryClient, useQuery, useMutation } from "react-query";
import useOnClickOutside from "../../hooks/useOnClickOutside";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { ITodo } from "../../types/types";
import Todo from "./Todo";
import { useDrop } from "react-dnd";
import { ItemTypes } from "../../utils/ItemTypes";
import { toast } from "react-toastify";
import { useAppSelector } from "../../redux/store/hooks";
import { Role } from "../../redux/slices/workspaceSlice";
import verifyRole from "../../utils/verifyRole";
import {
  createTodo,
  deleteTodoCard,
  updateTodoCardTitle,
} from "../../services/todo";

interface Props {
  id: string;
  title: string;
  todoContainerId: string;
}

const TodoCard: React.FC<Props> = ({
  title,
  id: todoCardId,
  todoContainerId,
}) => {
  const queryClient = useQueryClient();
  const [editMode, setEditMode] = useState<boolean>(false);
  const [todoCardTitle, setTodoCardTitle] = useState<string>(title);
  const [showAddTodo, setShowAddTodo] = useState<boolean>(false);
  const [todoTitle, setTodoTitle] = useState<string>("");
  const todoCardRef = useRef(null) as RefObject<HTMLFormElement>;
  const todoCardFormRef = useRef<HTMLFormElement>(null);
  const {
    user: { id: userId },
  } = useAppSelector((state) => state.auth);
  const { workspaceId, role } = useAppSelector((state) => state.workspace);

  const todoQuery = useQuery(["todo-query", todoCardId], async () => {
    const res = await axios.get(`/todo/${todoContainerId}/${todoCardId}/todo`);
    return res?.data;
  });

  const todoUpdateMutation = useMutation(
    async ({ todoId, prevTodoCardId }: any) => {
      const res = await axios.post(
        `/todo/${userId}/${workspaceId}/${todoCardId}/${todoId}/update-todo-status`,
        {
          status: title,
        }
      );
      return { ...res, prevTodoCardId };
    },
    {
      onMutate: async (newTodo) => {
        await queryClient.cancelQueries(["todo-query", todoCardId]);
        await queryClient.cancelQueries(["todo-query", newTodo.prevTodoCardId]);
        const snapshotOfPrevTodoCard: any = queryClient.getQueryData([
          "todo-query",
          newTodo.prevTodoCardId,
        ]);

        const snapshotOfCurrTodoCard = queryClient.getQueryData([
          "todo-query",
          todoCardId,
        ]);
        const updateTodo = snapshotOfPrevTodoCard?.data?.find(
          (todo: any) => todo.id === newTodo.todoId
        );
        updateTodo.status = title;
        updateTodo.todoCardId = todoCardId;
        queryClient.setQueryData(
          ["todo-query", newTodo.prevTodoCardId],
          (old: any) => {
            return old?.data?.filter((t: any) => t.id !== newTodo.todoId);
          }
        );
        queryClient.setQueryData(["todo-query", todoCardId], (old: any) => [
          ...old?.data,
          updateTodo,
        ]);

        return {
          snapshotOfPrevTodoCard,
          snapshotOfCurrTodoCard,
        };
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries(["todo-query", todoCardId]);
        queryClient.invalidateQueries(["todo-query", data.prevTodoCardId]);
      },
      onError: (error: any, data: any, context: any) => {
        queryClient.setQueryData(
          ["todo-query", todoCardId],
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

  const deleteTodoCardMutation = useMutation(
    deleteTodoCard({ workspaceId, userId, todoContainerId, todoCardId }),
    {
      onSuccess: (data: any) => {
        queryClient.invalidateQueries(["todo-card-query", todoContainerId]);
        toast(data?.message);
      },
      onError: (error: any) => {},
    }
  );

  const updateTitleMutation = useMutation(
    updateTodoCardTitle({ workspaceId, todoCardId, todoContainerId, userId }),
    {
      onSuccess: (data: any) => {
        setEditMode(false);
        queryClient.invalidateQueries(["todo-card-query", todoContainerId]);
        toast(data?.message);
      },
      onError: (error: any) => {},
    }
  );

  const [{ isOver }, drop] = useDrop(() => ({
    accept: `${ItemTypes.Todo}--${todoContainerId}`,
    drop: (data: any) => {
      // if the todo is dropped in the same card then don't do anything at all
      if (data.todoCardId === todoCardId) return;
      todoUpdateMutation.mutate({
        todoId: data.id,
        prevTodoCardId: data.todoCardId,
      });
    },
    collect: (monitor) => ({ isOver: !!monitor.isOver() }),
  }));

  const todoMutation = useMutation(
    createTodo({ workspaceId, userId, todoCardId, todoContainerId }),
    {
      onError: (data: any) => {
        toast(data?.response?.data?.message);
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries(["todo-query", todoCardId]);
        toast(data?.message);
      },
    }
  );

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!todoTitle) return;
    todoMutation.mutate({ text: todoTitle, status: title });
    setTodoTitle("");
  };

  const handleDeleteTodoCard = () => {
    deleteTodoCardMutation.mutate({});
  };

  const handleTodoCardTitleUpdate = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    if (!todoCardTitle) return toast("Please Fill the Required Fields");
    updateTitleMutation.mutate({ title: todoCardTitle });
  };

  useOnClickOutside(todoCardFormRef, () => {
    setShowAddTodo(false);
  });

  useOnClickOutside(todoCardRef, () => {
    setTodoCardTitle(title);
    setEditMode(false);
  });

  const todoData = todoQuery.data?.data || [];
  const isAllowed = verifyRole(role, [Role.ADMIN, Role.LANCER]);

  return (
    <>
      <div
        ref={isAllowed ? drop : null}
        className={`flex parent flex-col gap-2 bg-custom-black border-2 ${
          isOver
            ? "border-custom-light-green border-dotted"
            : "border-dark-gray"
        } rounded-md p-3 `}
      >
        <div className="flex items-center justify-between  ">
          {isAllowed && editMode ? (
            <form ref={todoCardRef} onSubmit={handleTodoCardTitleUpdate}>
              <input
                type="text"
                value={todoCardTitle}
                onChange={(event) => setTodoCardTitle(event.target.value)}
                className="outline-none bg-custom-light-dark px-2 py-1 text-base rounded-sm text-white"
              />
            </form>
          ) : (
            <h2 onClick={() => setEditMode(true)} className="text-2xl">
              {title}
            </h2>
          )}
          {isAllowed && (
            <button
              onClick={handleDeleteTodoCard}
              className=" child hover:text-custom-light-green"
            >
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
                ref={todoCardFormRef}
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
