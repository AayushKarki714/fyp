import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../redux/store/hooks";
import { useSystemAdmin } from "../context/AdminContext";

interface Props {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const location = useLocation();
  const { admin } = useSystemAdmin();
  const { user } = useAppSelector((state) => state.auth);

  if (admin) return <Navigate to="/system/admin/login" replace={true} />;

  if (!user)
    return (
      <Navigate
        to="/login"
        replace={true}
        state={{ from: { pathname: location.pathname } }}
      />
    );

  return <React.Fragment>{children}</React.Fragment>;
};

export default ProtectedRoute;
