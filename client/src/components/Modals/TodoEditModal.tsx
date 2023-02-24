import React, { useRef, useState, useMemo } from "react";
import { addMonths, formatDistance, formatRelative } from "date-fns";
import useOnClickOutside from "../../hooks/useOnClickOutside";
import DatePicker from "react-datepicker";
import {
  CalendarDaysIcon,
  CheckCircleIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "../../api/axios";
import { toast } from "react-toastify";
import "../../styles/datepicker.css";
import CommentForm from "../Comment/CommentForm";
import { useAppSelector } from "../../redux/store/hooks";
import CommentList from "../Comment/CommentList";
import { Role } from "../../redux/slices/workspaceSlice";
import verifyRole from "../../utils/verifyRole";

interface ITitlePayload {
  text: string;
}

interface IDescriptionPayload {
  description: string;
}

interface ICompletionDatePayload {
  completionDate: Date;
}

interface Props {
  title: string;
  todo: any;
  dateInDayMonthFormat: string;
  daysLeft: string | null;
  dateClass: string;
  completed: boolean;
  photo: string;
  createdUsername: string;
  closeModal: () => any;
}

function TodoEditModal({
  todo,
  title,
  dateInDayMonthFormat,
  daysLeft,
  createdUsername,
  photo,
  dateClass,
  completed,
  closeModal,
}: Props) {
  const queryClient = useQueryClient();
  const descriptionRef = useRef<any>(null);
  const {
    createdAt,
    completionDate,
    description,
    id: todoId,
    todoCardId,
  } = todo;
  const [startDate] = useState<Date>(new Date(createdAt));
  const [endDate, setEndDate] = useState<Date>(() => {
    return completionDate ? new Date(completionDate) : new Date();
  });
  const [editTitleMode, setEditTitleMode] = useState<boolean>(false);
  const [editTodoTitle, setEditTodoTitle] = useState<string>(title);
  const [todoDescription, setTodoDescription] = useState<string>(
    description || ""
  );
  const { user } = useAppSelector((state) => state.auth);
  const { workspaceId, role } = useAppSelector((state) => state.workspace);
  const isAllowed = verifyRole(role, [Role.ADMIN, Role.LANCER]);

  const [editDescriptionMode, setEditDescriptionMode] = useState<boolean>(
    !description
  );

  const updateTitleMutation = useMutation(
    async (payload: ITitlePayload) => {
      const res = await axios.patch(
        `/todo/${user.id}/${workspaceId}/${todoCardId}/${todoId}/update-todo-title`,
        payload
      );
      return res.data;
    },
    {
      onError: (error: any) => {
        setEditTodoTitle(title);
        toast(error?.response?.data?.message);
      },
      onSuccess: (data) => {
        setEditTitleMode(false);
        queryClient.invalidateQueries(["todo-query", todoCardId]);
        toast(data?.message, { position: "top-center" });
      },
    }
  );

  const updateDescriptionMutation = useMutation(
    async (payload: IDescriptionPayload) => {
      const res = await axios.patch(
        `/todo/${user.id}/${workspaceId}/${todoCardId}/${todoId}/update-todo-description `,
        payload
      );
      return res.data;
    },
    {
      onError: (error: any) => {
        toast(error?.response?.data?.message);
      },
      onSuccess: (data) => {
        setEditDescriptionMode(false);
        queryClient.invalidateQueries(["todo-query", todoCardId]);
        toast(data?.message, { position: "top-center" });
      },
    }
  );

  const updateCompletionMutation = useMutation(
    async (payload: ICompletionDatePayload) => {
      const res = await axios.patch(
        `/todo/${user.id}/${workspaceId}/${todoCardId}/${todoId}/update-todo-completion-date `,
        payload
      );
      return res.data;
    },
    {
      onError: (error: any) => {
        toast(error?.response?.data?.message);
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries(["todo-query", todoCardId]);
        toast(data?.message, { position: "top-center" });
      },
    }
  );

  const deleteTodoMutation = useMutation(
    async () => {
      const res = await axios.delete(
        `/todo/${user.id}/${workspaceId}/${todoCardId}/${todoId}/delete-single-todo`
      );
      return res.data;
    },
    {
      onError(error: any) {
        console.log("error", error);
      },
      onSuccess(data) {
        closeModal();
        queryClient.invalidateQueries("todo-query", todoCardId);
        console.log("data", data);
      },
    }
  );

  const { data: commentsData } = useQuery(
    ["single-todo", todo.id],
    async () => {
      const res = await axios.get(`/todo/${todo.id}/single-todo`);
      return res.data?.data;
    }
  );

  const commentsByParentId = useMemo(() => {
    const group: Record<any, any> = {};
    commentsData?.comments.forEach((comment: any) => {
      group[comment.parentId] ||= [];
      group[comment.parentId].push(comment);
    });
    return group;
  }, [commentsData?.comments]);

  function getReplies(parentId: string) {
    return commentsByParentId[parentId];
  }

  let rootComments = commentsByParentId["null"];

  const handleTodoTitleUpdate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editTodoTitle)
      return toast("Edited Todo title can't be Empty!!", {
        position: "top-center",
      });
    updateTitleMutation.mutate({ text: editTodoTitle });
  };

  const handleTodoDescriptionlUpdate = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    if (!todoDescription)
      return toast("Edited Todo description can't be Empty!!", {
        position: "top-center",
      });
    updateDescriptionMutation.mutate({ description: todoDescription });
  };

  const changeDate = (date: Date) => {
    setEndDate(date);
    updateCompletionMutation.mutate({ completionDate: date });
  };

  const formatTime = formatRelative(new Date(createdAt), new Date());

  const createdCommentMutation = useMutation(
    async (data: any) => {
      const res = await axios.post(
        `/todo/${todo.id}/${user.id}/comments`,
        data
      );
      return res.data;
    },
    {
      onError: (error) => {
        console.log("error", error);
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries("todo-query", todo.todoCardId);
        queryClient.invalidateQueries(["single-todo", todo.id]);
      },
    }
  );

  const handleCreateComment = (data: any) => {
    createdCommentMutation.mutate(data);
  };

  useOnClickOutside(descriptionRef, () => {
    if (description) {
      setTodoDescription(description);
      setEditDescriptionMode(false);
    }
  });

  return (
    <div className="custom-scrollbar w-[550px] p-2 h-[400px] overflow-y-auto">
      <div className="flex flex-col gap-2 mb-4">
        {isAllowed && editTitleMode ? (
          <form onSubmit={handleTodoTitleUpdate}>
            <input
              id="edit-todo-title"
              value={editTodoTitle}
              onChange={(event) => setEditTodoTitle(event.target.value)}
              className="bg-transparent border-none outline-none text-white text-2xl w-full "
            />
          </form>
        ) : (
          <h2 className="text-2xl" onDoubleClick={() => setEditTitleMode(true)}>
            {title}
          </h2>
        )}
      </div>

      <button
        className={`flex items-center gap-1 px-4 py-2 rounded-md hover:brightness-90 ${
          completed ? "bg-green-600" : "bg-red-600"
        } text-white mb-4`}
        title={`${dateInDayMonthFormat} (${daysLeft} Left)`}
      >
        {completed ? (
          <>
            <CheckCircleIcon className="h-5 w-5 " />
            Completed
          </>
        ) : (
          <>
            <ClockIcon className="h-5 w-5 " />
            Due
          </>
        )}
      </button>
      <div className="flex gap-1 text-custom-light-green mb-2">
        <p>Created {formatTime}</p>
      </div>
      <div className="mb-3 text-gray-400">
        <button
          onClick={() => deleteTodoMutation.mutate()}
          className="text-xs hover:text-red-600"
        >
          Delete
        </button>
      </div>
      <form
        onSubmit={handleTodoDescriptionlUpdate}
        className="flex flex-col  mb-4 "
      >
        <label
          htmlFor="todo-description"
          className="hover:text-custom-light-green"
        >
          Description:{" "}
        </label>
        {isAllowed && editDescriptionMode ? (
          <div ref={descriptionRef}>
            <textarea
              id="todo-description "
              value={todoDescription}
              placeholder="Enter a detailed description of the todo..."
              className="w-full mt-2 resize-none h-24 rounded-md bg-custom-light-dark px-3 py-2 text-base custom-scrollbar text-gray-300 shadow"
              onChange={(event) => setTodoDescription(event.target.value)}
            />
            <div className="flex justify-end items-center gap-3 mt-2">
              <button
                type="submit"
                className="bg-[#8ad85c]  text-black px-4 py-1 rounded-md font-medium disabled:cursor-not-allowed disabled:bg-slate-400 hover:opacity-90"
              >
                Save
              </button>
              {description && (
                <button
                  onClick={() => {
                    setTodoDescription(description);
                    setEditDescriptionMode(false);
                  }}
                  className="bg-[#8ad85c] text-black px-4 py-1 rounded-md font-medium disabled:cursor-not-allowed disabled:bg-slate-400 hover:opacity-90"
                >
                  cancel
                </button>
              )}
            </div>
          </div>
        ) : (
          <div
            className="mt-1 text-gray-400"
            onClick={() => setEditDescriptionMode(true)}
          >
            <p>{todoDescription}</p>
          </div>
        )}
      </form>
      <div className="flex flex-col gap-2">
        <label
          htmlFor="date-picker"
          className="flex gap-2 items-center group hover:text-custom-light-green"
        >
          Date Picker
          <span>
            <CalendarDaysIcon className="h-5 w-5 group-hover:text-custom-light-green" />
          </span>
        </label>
        <DatePicker
          id="date-picker"
          selected={endDate}
          endDate={endDate}
          disabled={isAllowed ? false : true}
          dateFormat="yyyy/MM/dd"
          minDate={new Date()}
          onChange={changeDate}
          className="bg-custom-light-dark px-4 py-2  rounded-md"
          startDate={startDate}
          placeholderText="Pick a Completion Date:"
          maxDate={addMonths(new Date(createdAt), 1)}
          selectsEnd
        />
      </div>
      <div className="text-gray-400 flex justify-end mt-3 gap-2 items-center">
        <span>by {createdUsername}</span>
        <div>
          <div className="h-8 w-8 rounded-full overflow-hidden">
            <img
              className="h-full w-full object-cover"
              src={photo}
              alt={createdUsername}
            />
          </div>
        </div>
      </div>
      <div className=" mt-8">
        <h2 className="text-2xl text-gray-400">Comments:</h2>
        {rootComments != null && rootComments.length > 0 && (
          <div className="mt-2 flex flex-col gap-4">
            <CommentList
              todo={todo}
              todoId={todo.id}
              getReplies={getReplies}
              comments={rootComments}
            />
          </div>
        )}
        <CommentForm autoFocus onSubmit={handleCreateComment} />
      </div>
    </div>
  );
}

export default TodoEditModal;
