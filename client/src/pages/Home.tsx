import React from "react";
import { Outlet } from "react-router-dom";
import CustomToastify from "../components/CustomToastify";
import NavBar from "../components/NavBar";
import ProtectedRoute from "../components/ProtectedRoute";

const Home: React.FC = () => {
  return (
    <ProtectedRoute>
      <CustomToastify />
      <section className=" flex flex-col  h-full">
        <NavBar />
        <div className="flex flex-grow ">
          <Outlet />
        </div>
      </section>
    </ProtectedRoute>
  );
};

export default Home;
