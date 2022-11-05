import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

function NestedLayout() {
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);

  return (
    <React.Fragment>
      <Sidebar isSideBarOpen={isSideBarOpen} />
      <div className="hidden md:flex items-center flex-shrink-0 w-6 group">
        <button
          className="hidden w-2 h-10 rounded-full ml-2 bg-[#333] hover:bg-gray-300 group-hover:block"
          onClick={() => {
            setIsSideBarOpen(!isSideBarOpen);
          }}
        ></button>
      </div>

      {/* 100vh - 10vh where 10vh is the height of the NavBar */}
      <div className="custom-scrollbar bg-custom-black flex-grow h-[90vh] px-4 pt-4 pb-6 text-4xl overflow-y-auto">
        <Outlet />
      </div>
    </React.Fragment>
  );
}

export default NestedLayout;
