import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { addMonths, formatDistance } from "date-fns";
import useOnClickOutside from "../../hooks/useOnClickOutside";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaceSmileIcon, PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import { useMutation, useQueryClient } from "react-query";
import axios from "../../api/axios";
import { toast } from "react-toastify";

interface Props {
  title: string;
  todo: any;
}

interface ITitlePayload {
  text: string;
}

interface IDescriptionPayload {
  description: string;
}

function TodoEditModal({ todo, title }: Props) {
  const queryClient = useQueryClient();
  const descriptionRef = useRef<any>(null);
  const {
    createdAt,
    completionDate,
    description,
    id: todoId,
    todoCardId,
  } = todo;
  const [startDate, setStartDate] = useState<Date | null>(new Date(createdAt));
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [editTitleMode, setEditTitleMode] = useState<boolean>(false);
  const [editTodoTitle, setEditTodoTitle] = useState<string>(title);
  const [todoDescription, setTodoDescription] = useState<string>(
    description || ""
  );
  const [editDescriptionMode, setEditDescriptionMode] = useState<boolean>(
    !description
  );

  const updateTitleMutation = useMutation(
    async (payload: ITitlePayload) => {
      const res = await axios.patch(
        `/todo/${todoCardId}/${todoId}/update-todo-title`,
        payload
      );
      return res.data;
    },
    {
      onError: (error) => {
        console.log("error", error);
      },
      onSuccess: (data) => {
        setEditTitleMode(false);
        queryClient.invalidateQueries(["todo-query", todoCardId]);
        toast(data?.message, { position: "top-center" });
        console.log("data", data);
      },
    }
  );
  const updateDescriptionMutation = useMutation(
    async (payload: IDescriptionPayload) => {
      const res = await axios.patch(
        `/todo/${todoCardId}/${todoId}/update-todo-description `,
        payload
      );
      return res.data;
    },
    {
      onError: (error) => {
        console.log("error", error);
      },
      onSuccess: (data) => {
        setEditDescriptionMode(false);
        queryClient.invalidateQueries(["todo-query", todoCardId]);
        toast(data?.message, { position: "top-center" });
        console.log("data", data);
      },
    }
  );

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
    console.log(
      "This is the only thing that could be done and the nicest thing that could be done is the only one"
    );
    if (!todoDescription)
      return toast("Edited Todo description can't be Empty!!", {
        position: "top-center",
      });
    updateDescriptionMutation.mutate({ description: todoDescription });
  };

  const formatTime = formatDistance(new Date(createdAt), new Date(), {
    addSuffix: true,
  });

  useOnClickOutside(descriptionRef, () => {
    if (description) {
      setTodoDescription(description);
      setEditDescriptionMode(false);
    }
  });

  return (
    <div className="w-[550px] h-[400px]">
      <div className="flex flex-col gap-2 mb-4">
        {editTitleMode ? (
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
      <h3 className="text-custom-light-green mb-4">Created {formatTime}</h3>
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
        {editDescriptionMode ? (
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
                className="bg-[#8ad85c] text-black px-4 py-1 rounded-md font-medium disabled:cursor-not-allowed disabled:bg-slate-400 hover:opacity-90"
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
          className="bg-custom-light-dark px-4 py-2  rounded-md"
          id="date-picker"
          selected={endDate}
          startDate={startDate}
          placeholderText="Pick a Completion Date:"
          minDate={new Date(createdAt)}
          maxDate={addMonths(new Date(createdAt), 1)}
          endDate={endDate}
          selectsEnd
          onChange={(endDate: any) => {
            setEndDate(endDate);
          }}
        />
      </div>
      <div>
        <form>
          <input type="text" placeholder="Enter a comment in todo" />
          <div className="flex gap-2 items-center">
            <button>
              <FaceSmileIcon className="h-5 w-5 text-gray-400" />
            </button>
            <motion.button
              whileTap={{ scale: 0.94 }}
              className="flex items-center justify-center rounded-lg cursor-pointer"
            >
              <PaperAirplaneIcon className="h-5 text-gray-400 " />
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TodoEditModal;
