import React, { useRef, useState } from "react";
import {
  FolderPlusIcon,
  PlusIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import Overlay from "../components/Modals/Overlay";
import Modal from "../components/Modals/Modal";
import CreateTodo from "../components/Modals/CreateTodo";
import useOnClickOutside from "../hooks/useOnClickOutside";

interface TodoContainerProps {
  text: string;
}

interface TodoProps {
  title: string;
}

const Todo: React.FC<TodoProps> = ({ title }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [todotext, setTodoText] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);
  const [showInput, setShowInput] = useState(false);

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
    </>
  );
};

interface TodoCardProps {
  text: string;
}

interface ITodo {
  title: string;
}

const TodoCard: React.FC<TodoCardProps> = ({ text }) => {
  const [todos, setTodos] = useState<ITodo[]>([]);
  const [showAddTodo, setShowAddTodo] = useState(false);
  const [title, setTitle] = useState("");
  const todoCardRef = useRef<any>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!title) return;
    setTodos([...todos, { title }]);
    setTitle("");
  };

  useOnClickOutside(todoCardRef, () => {
    setShowAddTodo(false);
  });

  return (
    <div className="flex flex-col gap-2 bg-custom-black border-2 border-dark-gray rounded-md p-3">
      <h2 className="text-lg">{text}</h2>
      <div className="flex flex-col gap-3">
        {todos.map((todo, index) => (
          <Todo key={index} title={todo.title} />
        ))}
        {showAddTodo ? (
          <form
            ref={todoCardRef}
            onSubmit={handleSubmit}
            className="flex flex-col gap-2"
          >
            <textarea
              autoFocus
              value={title}
              placeholder="Enter a todo..."
              className="w-full resize-none h-16 rounded-md bg-custom-light-dark px-3 py-2 text-base custom-scrollbar text-gray-300 shadow"
              onChange={(event) => setTitle(event.target.value)}
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

const TodoContainer: React.FC<TodoContainerProps> = ({ text }) => {
  return (
    <div className="flex flex-col gap-3 border-2 border-custom-light-dark p-3 rounded-md ">
      <h2 className="text-2xl">{text}</h2>
      <div className="grid grid-cols-responsive-todo items-start gap-3">
        <TodoCard text="Start" />
        <TodoCard text="Progress" />
        <TodoCard text="Done" />
      </div>
    </div>
  );
};

const TodoPage: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="flex flex-col gap-3">
      <button
        className="flex items-center justify-center p-2 w-10 h-10 rounded-full ml-auto text-gray-400 hover:text-custom-light-green"
        onClick={() => setIsOpen(true)}
      >
        <FolderPlusIcon className="h-6" />
      </button>
      <Overlay
        isOpen={isOpen}
        onClick={() => {
          setIsOpen(false);
        }}
      >
        <Modal onClick={() => setIsOpen(false)}>
          <CreateTodo />
        </Modal>
      </Overlay>
      <div className="flex flex-col gap-4">
        <TodoContainer text="Front-end" />
        <TodoContainer text="Back-end" />
        <TodoContainer text="Dev-ops" />
      </div>
    </section>
  );
};

export default TodoPage;
