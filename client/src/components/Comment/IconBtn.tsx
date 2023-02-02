function IconBtn({ Icon, isActive, color, children = null, ...props }: any) {
  console.log("children", children);
  return (
    <button
      className={`btn icon-btn ${isActive ? "icon-btn-active" : ""} ${
        color || ""
      }`}
      {...props}
    >
      <span className={`${children != null ? "mr-1" : ""}`}>like me</span>
      {children}
    </button>
  );
}

export default IconBtn;
