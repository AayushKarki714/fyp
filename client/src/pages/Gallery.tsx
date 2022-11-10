import React from "react";
import { PlusCircleIcon } from "@heroicons/react/24/outline";

interface GalleryContainerProps {
  text: string;
}

const GalleryContainer: React.FC<GalleryContainerProps> = ({ text }) => {
  return (
    <div className="flex flex-col border-2 p-3 border-custom-light-dark gap-4 rounded-md">
      <div className="flex flex-col gap-4 rounded-md  group">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl">{text}</h2>
        </div>
      </div>
      <div className="grid gap-2 auto-rows-[200px] grid-cols-responsive-gallery">
        <div className="rounded-md overflow-hidden cursor-pointer">
          <img
            src="https://images.unsplash.com/photo-1510146758428-e5e4b17b8b6a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8dGVhbXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60"
            alt="Explore"
            className="object-cover w-full h-full"
          />
        </div>
        <label className="cursor-pointer flex items-center justify-center bg-custom-light-dark group rounded-md hover:shadow">
          <PlusCircleIcon className="h-12 text-gray-400 group-hover:text-custom-light-green" />
          <input className="w-0 h-0" type="file" accept="image/*" />
        </label>
      </div>
    </div>
  );
};

const Gallery: React.FC = () => {
  return (
    <div className="flex flex-col gap-4">
      <GalleryContainer text="Front-End" />
      <GalleryContainer text="Back-End" />
      <GalleryContainer text="Dev-Ops" />
    </div>
  );
};

export default Gallery;
