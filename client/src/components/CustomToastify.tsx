import { ToastContainer } from "react-toastify";

function CustomToastify() {
  return (
    <ToastContainer
      className="text-base"
      closeOnClick={true}
      autoClose={1000}
      theme="dark"
    />
  );
}

export default CustomToastify;
