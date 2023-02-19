interface ColorBoxProps {
  color: string;
  children: React.ReactNode;
}

const ColorBox: React.FC<ColorBoxProps> = ({ color, children }) => {
  return (
    <div className="flex gap-2 items-center">
      <div className={`w-6 h-6 rounded-full ${color}`}></div>
      <p className="text-xs">{children}</p>
    </div>
  );
};

export default ColorBox;
