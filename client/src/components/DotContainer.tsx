import React from "react";

interface DotProps {
  onClick: (event: React.MouseEvent<HTMLLIElement>) => void;
  index: number;
  current: number;
}

function Dot({ onClick, index, current }: DotProps) {
  return (
    <li
      className={`${
        current === index ? "w-10" : "w-3"
      }  h-3 cursor-pointer rounded-full`}
      style={{
        backgroundColor: current === index ? " #a1fe6b" : "  #ffffffab",
      }}
      onClick={onClick}
    ></li>
  );
}

function DotContainer({ images, onClick, current }: any) {
  return (
    <ul
      className="mx-auto flex gap-2 items-center justify-center"
      onClick={(event: React.MouseEvent) => {
        event.stopPropagation();
      }}
    >
      {images.map((_: any, index: number) => (
        <Dot
          key={index}
          index={index}
          current={current}
          onClick={() => onClick(index)}
        />
      ))}
    </ul>
  );
}

export { Dot };
export default DotContainer;
