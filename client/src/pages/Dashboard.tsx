import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAppSelector } from "../redux/store/hooks";
import { PlusIcon } from "@heroicons/react/24/outline";
import Workspace from "../components/WorkSpace";

const workspaceData = [
  {
    id: "32424q",
    text: "Uber",
    img: "https://images.unsplash.com/photo-1665686440627-936e9700a100?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
  },
  {
    id: "sfdasz",
    text: "Apple",
    img: "https://images.unsplash.com/photo-1665686440627-936e9700a100?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
  },
  {
    id: "lkljk",
    text: "Microsoft",
    img: "https://images.unsplash.com/photo-1665686440627-936e9700a100?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
  },
  {
    id: "sdfsakl;lk",
    text: "Amazon",
    img: "https://images.unsplash.com/photo-1665686440627-936e9700a100?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
  },
  {
    id: "dfsjklsadk",
    text: "Netlify",
    img: "https://images.unsplash.com/photo-1665686440627-936e9700a100?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
  },
];

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
      <motion.ul className="grid grid-cols-responsive auto-rows-[220px] gap-3 p-3 ">
        {workspaceData.map((data, index) => (
          <Workspace key={data.id} {...data} />
        ))}

        <motion.button
          whileHover={{ scale: 1.04 }}
          onClick={handleRedirect}
          className="flex items-center justify-center bg-[#27292a] h-full rounded-lg"
        >
          <PlusIcon className="h-12 " />
        </motion.button>
      </motion.ul>
    </section>
  );
};

export default Dashboard;
