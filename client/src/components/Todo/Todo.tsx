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

interface TodoProps {
  title: string;
  todo: any;
  todoContainerId: string;
  createdAt: Date;
  completionDate: Date;
}

const Todo: React.FC<TodoProps> = ({
  title,
  todo,
  todoContainerId,
  createdAt,
  completionDate,
}) => {
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [isHoveredDate, setIsHoveredDate] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);

  const closeModal = () => {
    setIsOpen(false);
  };
  const [{ isDragging }, drag] = useDrag(() => ({
    type: `${ItemTypes.Todo}--${todoContainerId}`,
    item: { ...todo },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));
  let display;
  const displayStyles = { backgroundColor: "#18191a", color: "#8ad85c" };
  if (completionDate) {
    display =
      differenceInDays(new Date(completionDate), new Date(createdAt)) + " days";
  } else {
    display = null;
  }

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
            <div className="text-xs flex gap-2 items-center">
              <button
                onMouseEnter={() => setIsHoveredDate(true)}
                onMouseLeave={() => setIsHoveredDate(false)}
                className="flex items-center gap-1 hover:bg-custom-black hover:text-custom-light-green p-1 rounded-md"
                style={displayStyles}
              >
                {isHoveredDate ? (
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(event) => setIsChecked(event.target.checked)}
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
