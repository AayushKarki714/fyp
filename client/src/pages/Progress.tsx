import React, { useState } from "react";
import { PlusCircleIcon } from "@heroicons/react/24/outline";

import Modal from "../components/Modals/Modal";
import Overlay from "../components/Modals/Overlay";
import ProgressModal from "../components/Modals/ProgressModal";

interface ProgressBarProps {
  width: number;
  text: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ width, text }) => {
  return (
    <>
      <p className="text-lg self-center">{text}</p>
      <div className="relative w-full h-[40px] overflow-hidden">
        <div
          style={{ width: `${width}%` }}
          title={`${width}%`}
          className="absolute left-0 top-0 h-full bg-custom-light-green rounded-md "
        />
      </div>
    </>
  );
};

interface ProgressContainerProps {
  text: string;
}

const ProgressContainer: React.FC<ProgressContainerProps> = ({ text }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Overlay
        isOpen={isOpen}
        onClick={() => {
          setIsOpen(false);
        }}
      >
        <Modal onClick={() => setIsOpen(false)}>
          <ProgressModal />
        </Modal>
      </Overlay>
      <div className="flex flex-col gap-4 border-2 border-custom-light-dark rounded-md p-3 group">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl">{text}</h2>
          <button
            onClick={() => setIsOpen(true)}
            className="hidden group-hover:block text-sm text-gray-300 hover:text-custom-light-green"
          >
            <PlusCircleIcon className="h-5" />
          </button>
        </div>
        <div className="grid  gap-2">
          <ProgressBar width={100} text="React" />
          <ProgressBar width={80} text="Golang" />
          <ProgressBar width={50} text="Typscript" />
          <ProgressBar width={30} text="Pre-react" />
        </div>
      </div>
    </>
  );
};

const Progress: React.FC = () => {
  return (
    <div className="flex flex-col gap-4">
      <ProgressContainer text="Front-end" />
      <ProgressContainer text="Back-end" />
      <ProgressContainer text="Dev-Ops" />
    </div>
  );
};

export default Progress;
