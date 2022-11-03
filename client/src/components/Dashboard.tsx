import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAppSelector } from "../redux/store/hooks";
import { PlusIcon } from "@heroicons/react/24/outline";
import Workspace from "./WorkSpace";

const Dashboard: React.FC = () => {
  let navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const handleRedirect = () => {
    navigate("/create-workspace");
  };

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-2xl md:text-3xl">
        Welcome to the Dashboard, {user?.displayName}
      </h2>
      <motion.ul className="grid grid-cols-responsive gap-3 p-3 ">
        {new Array(5).fill(0).map((el, index) => (
          <Workspace key={index} />
        ))}
        <motion.button
          whileHover={{ scale: 1.04 }}
          onClick={handleRedirect}
          className="flex items-center justify-center bg-[#27292a] w-full h-[200px] rounded-lg"
        >
          <PlusIcon className="h-12 " />
        </motion.button>
      </motion.ul>
    </section>
  );
};

export default Dashboard;
