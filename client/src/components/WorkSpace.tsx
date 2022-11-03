import React from "react";
import { motion } from "framer-motion";

const Workspace: React.FC = () => {
  return (
    <motion.div
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
    </motion.div>
  );
};

export default Workspace;
