import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAppSelector } from "../redux/store/hooks";
import { PlusIcon } from "@heroicons/react/24/outline";

function SingleWorkspace() {
  return (
    <motion.li
      layout
      whileHover={{ scale: 1.04 }}
      className="bg-[#27292a] p-3 rounded-lg  h-[200px] cursor-pointer w-full"
    >
      <figure className="overflow-hidden rounded-sm">
        <img
          src="https://images.unsplash.com/photo-1665686440627-936e9700a100?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
          className="w-full h-[150px] object-cover  "
          alt="Workspace"
        />
      </figure>
      <h2 className=" text-xl">This is WorkSpace</h2>
    </motion.li>
  );
}

const Dashboard: React.FC = () => {
  let navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const handleRedirect = () => {
    navigate("/create-workspace");
  };

  return (
    <section className="flex flex-col gap-4">
      <h2>Welcome to the Dashboard, {user?.displayName}</h2>
      <motion.ul className="grid grid-cols-responsive gap-3 p-3 ">
        {new Array(5).fill(0).map((el, index) => (
          <SingleWorkspace key={index} />
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
