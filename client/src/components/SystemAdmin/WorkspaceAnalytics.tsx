import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import systemAxios from "../../api/systemAxios";
import { useSystemAdmin } from "../../context/AdminContext";
import Spinner from "../Spinner/Spinner";
import AdditionalWorkspaceDetails from "./AdditionalWorkspaceDetails";

const DeleteWorkspaceCard = ({ name, id, logo, index }: any) => {
  const { admin } = useSystemAdmin();
  const [expand, setExpand] = useState(false);
  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    async () => {
      const res = await systemAxios.delete(
        `/system-admin/${id}/delete-workspace`,
        { headers: { authorization: `Bearer ${(admin as any).token}` } }
      );
      return res.data;
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries("workspace-analytics");
        console.log(data);
      },
      onError: (error) => {
        console.log(error);
      },
    }
  );
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.1 * index, duration: 0.3 }}
      className="bg-custom-light-dark flex items-center flex-col gap-3 p-6 rounded-md"
    >
      <img
        className="w-28 h-28 rounded-full border-2 border-custom-light-green"
        referrerPolicy="no-referrer"
        src={logo}
        alt={name}
      />
      <h2 className="text-4xl">{name}</h2>
      <button
        onClick={() => mutate()}
        className="bg-red-600 self-stretch px-6 py-2 text-white rounded-md"
      >
        Delete
      </button>
      <button
        onClick={() => setExpand((prevVal) => !prevVal)}
        className="flex text-gray-300 opacity-70 self-end items-center gap-1 text-xs mt-4 hover:text-custom-light-green"
      >
        <span>
          {expand ? (
            <ChevronUpIcon className="h-4 w-4" />
          ) : (
            <ChevronDownIcon className="h-4 w-4 " />
          )}
        </span>
        View Details
      </button>
      {expand && <AdditionalWorkspaceDetails workspaceId={id} />}
    </motion.div>
  );
};

function WorkspaceAnalytics() {
  const { admin } = useSystemAdmin();
  const { data, isLoading } = useQuery("workspace-analytics", async () => {
    const res = await systemAxios.get("/system-admin/all/workspaces", {
      headers: { authorization: `Bearer ${(admin as any).token}` },
    });
    return res.data?.data;
  });

  if (isLoading) return <Spinner isLoading={isLoading} />;
  return (
    <div className="grid items-start grid-cols-responsive-todo gap-6 pb-5">
      <AnimatePresence>
        {data.map((workspace: any, index: number) => {
          return (
            <DeleteWorkspaceCard
              key={workspace.id}
              index={index}
              id={workspace.id}
              logo={workspace.logo}
              members={workspace.Member}
              name={workspace.name}
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
}

export default WorkspaceAnalytics;
