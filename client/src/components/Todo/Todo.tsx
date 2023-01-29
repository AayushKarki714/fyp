import React, { useState } from "react";
import Modal from "../Modals/Modal";
import Overlay from "../Modals/Overlay";
import { useDrag } from "react-dnd/dist/hooks";
import { ItemTypes } from "../../utils/ItemTypes";
import { motion } from "framer-motion";

interface TodoProps {
  title: string;
  todo: object;
  todoContainerId: string;
}

const Todo: React.FC<TodoProps> = ({ title, todo, todoContainerId }) => {
  const [editTitleMode, setEditTitleMode] = useState<boolean>(false);
  const [editTodoTitle, setEditTodoTitle] = useState<string>(title);
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

  return (
    <>
      <Overlay isOpen={isOpen} onClick={closeModal}>
        <Modal onClick={closeModal}>
          <div className="w-[400px] h-[400px]">
            {editTitleMode ? (
              <input
                id="edit-todo-title"
                value={editTodoTitle}
                onChange={(event) => setEditTodoTitle(event.target.value)}
                className="bg-transparent border-none outline-none text-base text-white"
              />
            ) : (
              <h2 onDoubleClick={() => setEditTitleMode(true)}>{title}</h2>
            )}
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
