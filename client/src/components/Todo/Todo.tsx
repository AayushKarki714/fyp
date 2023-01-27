import React, { useState, useRef } from "react";
import useOnClickOutside from "../../hooks/useOnClickOutside";
import Modal from "../Modals/Modal";
import Overlay from "../Modals/Overlay";
import { PencilIcon } from "@heroicons/react/24/outline";
import { useDrag } from "react-dnd/dist/hooks";
import { ItemTypes } from "../../utils/ItemTypes";

interface TodoProps {
  title: string;
  todo: object;
  todoContainerId: string;
}

const Todo: React.FC<TodoProps> = ({ title, todo, todoContainerId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [todotext, setTodoText] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);
  const [showInput, setShowInput] = useState(false);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: `${ItemTypes.Todo}--${todoContainerId}`,
    item: { ...todo },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const closeModal = () => {
    setIsOpen(false);
  };

  useOnClickOutside(inputRef, () => {
    setShowInput(false);
  });

  return (
    <>
      <Overlay isOpen={isOpen} onClick={closeModal}>
        <Modal onClick={closeModal}>this is {title}</Modal>
      </Overlay>
      <div ref={drag}>
        {showInput ? (
          <input
            type="text"
            ref={inputRef}
            value={todotext}
            className="text-black"
            onChange={(event) => setTodoText(event.target.value)}
          />
        ) : (
          <p
            onDoubleClick={() => setIsOpen(true)}
            className="relative flex items-center text-base bg-custom-light-dark px-3 py-2  rounded-md hover:shadow cursor-pointer group"
          >
            {title}
            <span
              onClick={() => setShowInput(true)}
              className="absolute right-2 top-2 bg-dark-gray p-1 hidden rounded-md  group-hover:block text-gray-400"
            >
              <PencilIcon className="h-4" />
            </span>
          </p>
        )}
      </div>
    </>
  );
};

export default Todo;
