import React, { useState } from "react";
import { toast } from "react-toastify";

interface Props {
  onSubmit: (title: string) => void;
}
const CreateGallery: React.FC<Props> = ({ onSubmit }) => {
  const [galleryTitle, setGalleryTitle] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!galleryTitle) {
      return toast("Please Enter a Title for the Gallery Container");
    }
    onSubmit(galleryTitle);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 w-96 rounded-md"
    >
      <label htmlFor="gallerytitle">Gallery Title:</label>
      <input
        id="gallerytitle"
        type="text"
        value={galleryTitle}
        placeholder="Enter a gallery title..."
        className="bg-[#09090a] rounded text-base p-2"
        onChange={(event) => setGalleryTitle(event.target.value)}
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

export default CreateGallery;
