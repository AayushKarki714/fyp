import React, { useState } from "react";

const CreateTodo: React.FC = () => {
  const [todoTitle, setTodoTitle] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 w-96 rounded-md"
    >
      <label htmlFor="gallerytitle">Todo Title:</label>
      <input
        id="gallerytitle"
        type="text"
        value={todoTitle}
        placeholder="Enter a todo title..."
        className="bg-[#09090a] rounded text-base p-2"
        onChange={(event) => setTodoTitle(event.target.value)}
      />
      <button
        type="submit"
        className="bg-custom-light-green px-4 py-2 rounded-md text-base text-custom-black font-bold"
      >
        Submit
      </button>
    </form>
  );
};

export default CreateTodo;
