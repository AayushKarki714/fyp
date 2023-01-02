import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../redux/store/hooks";

const Login: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const location = useLocation();
  const redirectPath = location.state?.from?.pathname || "/dashboard";

  const google = () => {
    window.open("http://localhost:8000/auth/google", "_self");
  };

  if (user) {
    return <Navigate to={redirectPath} replace={true} />;
  }

  return (
    <section className="h-full flex">
      {/* left */}
      <div className="flex-grow">
        <img
          className="w-full h-full object-cover"
          // src="https://images.unsplash.com/photo-1558403194-611308249627?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTF8fHRlYW18ZW58MHx8MHx8&auto=format&fit=crop&w=700&q=60"
          src="https://images.unsplash.com/photo-1664575599730-0814817939de?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
          alt=""
        />
      </div>
      {/* right */}
      <div className="w-[32rem] flex flex-col gap-6 items-center justify-center">
        <h1 className="text-2xl ">Login to the ProjectZone</h1>
        <button
          className="flex items-center gap-2 bg-[#27292a] px-3 py-2 rounded-md shadow-sm hover:shadow-md hover:bg-opacity-90"
          onClick={google}
        >
          <img
            className="google-icon"
            src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
            alt="google"
          />
          Sign in with google
        </button>
      </div>
    </section>
  );
};

export default Login;
