import React, { useEffect, useState } from "react";
import NProgress from "nprogress";
import { useLocation } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

NProgress.configure({ showSpinner: false });

const CustomSwitch: React.FC<Props> = ({ children }) => {
  const { pathname } = useLocation();
  const [location, setLocation] = useState("");

  useEffect(() => {
    setLocation(pathname);
    NProgress.start();
  }, [pathname]);

  useEffect(() => {
    NProgress.done();
  }, [location]);

  return <>{children}</>;
};

export default CustomSwitch;
