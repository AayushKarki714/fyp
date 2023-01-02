import React from "react";
import { motion } from "framer-motion";
import { XCircleIcon } from "@heroicons/react/24/outline";
import handleStopPropagation from "../../utils/handleStopPropagation";

interface Props {
  onClick: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<Props> = ({ onClick, children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      onClick={handleStopPropagation}
      className="flex flex-col gap-3 bg-custom-black  p-4 rounded-md shadow-md border-2 border-dark-gray "
    >
      <button
        onClick={onClick}
        className="self-end text-gray-300 hover:text-custom-light-green"
      >
        <XCircleIcon className="h-6" />
      </button>
      {children}
    </motion.div>
  );
};

export default Modal;
