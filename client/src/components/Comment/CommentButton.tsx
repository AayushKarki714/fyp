interface Props {
  children?: React.ReactNode;
  Icon: Function;
  color?: string;
  onClick?: (data: any) => void;
  activeClass?: string;
  type?: "button" | "submit";
}

function CommentButton({
  type = "button",
  children,
  Icon,
  color = "",
  activeClass = "",
  onClick = () => {},
}: Props) {
  return (
    <button
      onClick={onClick}
      type={type}
      className={`text-xs flex items-center gap-1 ${color}  `}
    >
      <Icon className={`h-3 w-3 ${activeClass}`} />
      <span>{children}</span>
    </button>
  );
}

export default CommentButton;
