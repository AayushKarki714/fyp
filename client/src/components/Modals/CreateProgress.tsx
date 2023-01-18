import React, { useState } from "react";

interface Props {
  onSubmit: (data: string) => void;
}

const CreateProgress: React.FC<Props> = ({ onSubmit }) => {
  const [progressTitle, setProgressTitle] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(progressTitle);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 w-96 rounded-md"
    >
      <label htmlFor="progress-title">Progress Title:</label>
      <input
        id="progress-title"
        type="text"
        value={progressTitle}
        placeholder="Enter a progress title..."
        className="bg-[#09090a] rounded text-base p-2"
        onChange={(event) => setProgressTitle(event.target.value)}
      />
      <button
        type="submit"
        className="bg-custom-light-green px-4 py-2 rounded-md text-base"
      >
        Submit
      </button>
    </form>
  );
};

export default CreateProgress;
