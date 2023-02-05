import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAppSelector } from "../redux/store/hooks";
import { PlusIcon } from "@heroicons/react/24/outline";
import Workspace from "../components/WorkSpace";
import axios from "../api/axios";
import { useQuery } from "react-query";

const Dashboard: React.FC = () => {
  let navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const { data, isLoading } = useQuery("workspace-query", async () => {
    const res = await axios.get(`/workspace/workspaces/${user.id}`);
    return res.data;
  });

  console.log(data, "data");

  const handleRedirect = () => {
    navigate("/create-workspace");
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-2xl md:text-3xl">
        Welcome to the Dashboard, {user?.displayName}
      </h2>
      <motion.ul className="grid grid-cols-responsive auto-rows-[150px] gap-6 p-3 ">
        {data?.data.map((item: any) => (
          <Workspace
            key={item.workspaceId}
            totalMember={item.totalMember}
            adminName={item.workspace.admin.name}
            adminImg={item.workspace.admin.photo}
            name={item.workspace.name}
            logo={item.workspace.logo}
            createdAt={item.workspace.createdAt}
            role={item.role}
            id={item.workspaceId}
          />
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
