import React, { useRef, useState } from "react";
import Modal from "../Modals/Modal";
import Overlay from "../Modals/Overlay";
import { useDrag } from "react-dnd/dist/hooks";
import { ItemTypes } from "../../utils/ItemTypes";
import { motion } from "framer-motion";
import { addMonths, formatDistance } from "date-fns";
import useOnClickOutside from "../../hooks/useOnClickOutside";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaceSmileIcon, PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";

interface TodoProps {
  title: string;
  todo: any;
  todoContainerId: string;
}

const Todo: React.FC<TodoProps> = ({ title, todo, todoContainerId }) => {
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const { createdAt, completionDate, description } = todo;
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

  const [isOpen, setIsOpen] = useState(false);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: `${ItemTypes.Todo}--${todoContainerId}`,
    item: { ...todo },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const closeModal = () => {
    setEditTitleMode(false);
    setIsOpen(false);
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
    <>
      <Overlay isOpen={isOpen} onClick={closeModal}>
        <Modal onClick={closeModal}>
          <div className="w-[550px] h-[400px]">
            <div className="flex flex-col gap-2 mb-4">
              {editTitleMode ? (
                <input
                  id="edit-todo-title"
                  value={editTodoTitle}
                  onChange={(event) => setEditTodoTitle(event.target.value)}
                  className="bg-transparent border-none outline-none text-white text-2xl"
                />
              ) : (
                <h2
                  className="text-2xl"
                  onDoubleClick={() => setEditTitleMode(true)}
                >
                  {title}
                </h2>
              )}
            </div>
            <h3 className="text-custom-light-green mb-4">
              Created {formatTime}
            </h3>
            <div className="flex flex-col  mb-4 ">
              <label
                htmlFor="todo-description"
                className="hover:text-custom-light-green"
              >
                Description:{" "}
              </label>
              {editDescriptionMode ? (
                <textarea
                  ref={descriptionRef}
                  autoFocus
                  id="todo-description "
                  value={todoDescription}
                  placeholder="Enter a detailed description of the todo..."
                  className="w-full mt-2 resize-none h-24 rounded-md bg-custom-light-dark px-3 py-2 text-base custom-scrollbar text-gray-300 shadow"
                  onChange={(event) => setTodoDescription(event.target.value)}
                />
              ) : (
                <div
                  className="mt-1"
                  onClick={() => setEditDescriptionMode(true)}
                >
                  <p>{todoDescription}</p>
                </div>
              )}
            </div>
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
        </Modal>
      </Overlay>
      <motion.div>
        <p
          ref={drag}
          onDoubleClick={() => setIsOpen(true)}
          className={`relative flex items-center text-base ${
            isDragging ? "bg-custom-light-green " : "bg-custom-light-dark"
          } px-3 py-2  rounded-md hover:shadow cursor-pointer group`}
        >
          {title}
        </p>
      </motion.div>
    </>
  );
};

export default Todo;
