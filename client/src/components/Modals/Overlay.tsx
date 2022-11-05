import React from "react";
import ReactDOM from "react-dom";

interface Props {
  children: React.ReactNode;
  isOpen: boolean;
  onClick: () => void;
}

const container = document.getElementById("modal") as HTMLDivElement;

const Overlay: React.FC<Props> = ({ children, isOpen, onClick }) => {
  return ReactDOM.createPortal(
    <>
      {isOpen ? (
        <div
          onClick={onClick}
          className="fixed flex justify-center items-center top-0 left-0 right-0 bottom-0 bg-[#000000cb]"
        >
          {children}
        </div>
      ) : null}
    </>,
    container
  );
};

export default Overlay;
