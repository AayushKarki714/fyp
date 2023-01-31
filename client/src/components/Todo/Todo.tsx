import React, { useState } from "react";
import Modal from "../Modals/Modal";
import Overlay from "../Modals/Overlay";
import { useDrag } from "react-dnd/dist/hooks";
import { ItemTypes } from "../../utils/ItemTypes";
import "react-datepicker/dist/react-datepicker.css";
import TodoEditModal from "../Modals/TodoEditModal";
import { motion } from "framer-motion";
import {
  ChatBubbleLeftEllipsisIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { differenceInDays } from "date-fns";
import { useMutation } from "react-query";
import axios from "../../api/axios";
import handleStopPropagation from "../../utils/handleStopPropagation";

interface TodoProps {
  title: string;
  todo: any;
  todoContainerId: string;
  createdAt: Date;
  completed: boolean;
  completionDate: Date;
}

const Todo: React.FC<TodoProps> = ({
  title,
  todo,
  todoContainerId,
  createdAt,
  completionDate,
  completed,
}) => {
  const [isChecked, setIsChecked] = useState<boolean>(completed);
  const [isHoveredDate, setIsHoveredDate] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);

  const closeModal = () => {
    setIsOpen(false);
  };

  const completeUpdateMutation = useMutation(
    async (payload: { completed: boolean }) => {
      const res = await axios.patch(
        `/todo/${todo.todoCardId}/${todo.id}/update-todo-completed`,
        payload
      );
      return res.data;
    },
    {
      onError: (error) => {
        console.log("error", error);
      },
      onSuccess: (data) => {
        console.log("data", data);
      },
    }
  );

  const [{ isDragging }, drag] = useDrag(() => ({
    type: `${ItemTypes.Todo}--${todoContainerId}`,
    item: { ...todo },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));
  let display;
  let dateClassName = "";
  if (completionDate) {
    const remainingDays = differenceInDays(
      new Date(completionDate),
      new Date(createdAt)
    );
    display = `${remainingDays} days`;
    if (remainingDays > 15) {
      dateClassName = "bg-green-600";
    } else if (remainingDays > 10) {
      dateClassName = "bg-yellow-600";
    } else if (remainingDays > 4) {
      dateClassName = "bg-orange-600";
    } else {
      dateClassName = "bg-red-600";
    }
  } else {
    display = null;
  }

  const handleCheckChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setIsChecked(checked);
    completeUpdateMutation.mutate({ completed: checked });
  };

  console.log("display", display);
  return (
    <>
      <Overlay isOpen={isOpen} onClick={closeModal}>
        <Modal onClick={closeModal}>
          <TodoEditModal title={title} todo={todo} />
        </Modal>
      </Overlay>
      <motion.div>
        <div
          ref={drag}
          onDoubleClick={() => setIsOpen(true)}
          className={`relative flex flex-col gap-1   text-base ${
            isDragging ? "bg-custom-light-green " : "bg-custom-light-dark"
          } px-3 py-2  rounded-md hover:shadow cursor-pointer group`}
        >
          <p>{title}</p>
          {completionDate ? (
            <div
              onClick={handleStopPropagation}
              className="text-xs flex gap-2 items-center"
            >
              <button
                onMouseEnter={() => setIsHoveredDate(true)}
                onMouseLeave={() => setIsHoveredDate(false)}
                className={`flex items-center ${dateClassName} gap-1 p-1 rounded-md `}
              >
                {isHoveredDate ? (
                  <input
                    type="checkbox"
                    checked={isChecked}
                    className="w-4 h-4 bg-red-600 outline-none"
                    onChange={handleCheckChange}
                  />
                ) : (
                  <ClockIcon className="h-4 w-4 " />
                )}
                {display}
              </button>
              <button className="flex items-center gap-1 hover:bg-custom-black hover:text-custom-light-green p-1 rounded-md">
                <ChatBubbleLeftEllipsisIcon className="h-4 w-4 " />
                12
              </button>
            </div>
          ) : null}
        </div>
      </motion.div>
    </>
  );
};

export default Todo;
