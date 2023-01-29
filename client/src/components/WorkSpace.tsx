import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { EllipsisVerticalIcon } from "@heroicons/react/24/solid";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/outline";
import useOnClickOutside from "../hooks/useOnClickOutside";
import handleStopPropagation from "../utils/handleStopPropagation";
import { useAppDispatch, useAppSelector } from "../redux/store/hooks";
import { switchWorkSpace } from "../redux/slices/workspaceSlice";
import { useMutation, useQueryClient } from "react-query";
import axios from "../api/axios";

const Workspace: React.FC<any> = ({ logo, name, id, role }) => {
  const queryClient = useQueryClient();
  const popUpRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const { workspace, auth } = useAppSelector((state) => state);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  console.log("auth.user", auth.user);

  const deleteWorkspaceMutation = useMutation(
    async () => {
      const res = await axios.delete(
        `/workspace/${workspace.workspaceId}/${auth.user.id}`
      );
      console.log("res", res);
      return res.data;
    },
    {
      onSuccess: (success: any) => {
        queryClient.invalidateQueries("workspace-query");
        console.log("success", success);
      },
      onError: (error: any) => {
        console.log("error", error);
      },
    }
  );

  const isActive =
    workspace.workspaceId === id
      ? " border-custom-light-green z-10"
      : " border-transparent";

  console.log("isPopupVisible", isPopupVisible);

  const handleDeleteWorkspace = () => {
    setIsPopupVisible(false);
    deleteWorkspaceMutation.mutate();
  };

  useOnClickOutside(popUpRef, () => setIsPopupVisible(false));

  return (
    <motion.div
      layout
      whileHover={{ scale: 1.05 }}
      onClick={() => dispatch(switchWorkSpace({ workspaceId: id, role }))}
      className={`flex relative flex-col gap-3 bg-[#27292a] border-2   p-3 rounded-lg h-full cursor-pointer w-full ${isActive}   group hover:shadow  `}
    >
      <div className="absolute bg-custom-light-green  text-base top-4 -right-1 w-[100px] text-center">
        <span>{role}</span>
      </div>
      <figure className="overflow-hidden rounded-sm">
        <img
          src={logo}
          className="w-full h-[150px] object-cover  "
          alt="Workspace"
        />
      </figure>

      <div className="relative flex items-center justify-between">
        <h2 className="text-xl">{name}</h2>
        {role === "ADMIN" && (
          <motion.div
            whileTap={{ scale: 0.96 }}
            onClick={() => setIsPopupVisible(!isPopupVisible)}
            className=" items-center justify-center rounded-full overflow-hidden w-7 h-7 hover:bg-dark-gray group select-none hidden group-hover:flex"
          >
            <EllipsisVerticalIcon className="h-5 w-5 text-gray-400 group-hover:text-white " />
          </motion.div>
        )}
        {isPopupVisible && (
          <motion.div
            ref={popUpRef}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={handleStopPropagation}
            className="absolute flex flex-col gap-1 top-9 right-4 w-[200px]  bg-custom-light-dark border-2 border-dark-gray  rounded-md shadow-md  origin-top-right p-2"
          >
            <div className="flex  items-center gap-2 p-2 hover:bg-[#434343] rounded-md">
              <button className="text-sm flex items-center gap-2">
                <PencilIcon className="h-4" />
                Rename
              </button>
            </div>
            <div
              onClick={handleDeleteWorkspace}
              className="flex items-center gap-2 p-2 hover:bg-[#434343] rounded-md"
            >
              <button className="text-sm flex items-center gap-2 ">
                <TrashIcon className="h-4" />
                Delete
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Workspace;
