import React from "react";
import Overlay from "./Overlay";
import Modal from "./Modal";

interface Props {
  message: string;
  onConfirm: () => any;
  onCancel: () => any;
  isVisible: boolean;
}

const DeleteConfirmation: React.FC<Props> = ({
  isVisible,

  message,
  onConfirm,
  onCancel,
}) => {
  return (
    <Overlay isOpen={isVisible} onClick={onCancel}>
      <Modal close={false}>
        <div className="p-2 flex items-center flex-col justify-center gap-6  h-[200px] w-[450px]">
          <h2 className="text-2xl text-center">{message}</h2>
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={onConfirm}
              className="bg-green-600 px-4 w-24 py-2 flex-grow rounded-md "
            >
              Yes
            </button>
            <button
              onClick={onCancel}
              className="bg-red-600 px-4 py-2 w-24 flex-grow rounded-md"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </Overlay>
  );
};

export default DeleteConfirmation;
