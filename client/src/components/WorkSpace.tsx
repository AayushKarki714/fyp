import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { EllipsisVerticalIcon } from "@heroicons/react/24/solid";
import {
  TrashIcon,
  PencilIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import useOnClickOutside from "../hooks/useOnClickOutside";
import handleStopPropagation from "../utils/handleStopPropagation";
import { useAppDispatch, useAppSelector } from "../redux/store/hooks";
import { Role, switchWorkSpace } from "../redux/slices/workspaceSlice";
import { useMutation, useQueryClient } from "react-query";
import axios from "../api/axios";
import Overlay from "./Modals/Overlay";
import Modal from "./Modals/Modal";
import UpdateWorkspaceModal from "./Modals/UpdateWorkspaceModal";
import { toast } from "react-toastify";
import { formatRelative } from "date-fns";

const Workspace: React.FC<any> = ({
  logo,
  name,
  id,
  role,
  totalMember,
  adminImg,
  adminName,
  createdAt,
}) => {
  const queryClient = useQueryClient();
  const ref = useRef<HTMLDivElement>(null);
  const popUpRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const { workspace, auth } = useAppSelector((state) => state);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const dateFormat = formatRelative(new Date(createdAt), new Date());

  const deleteWorkspaceMutation = useMutation(
    async () => {
      const res = await axios.delete(
        `/workspace/${workspace.workspaceId}/${auth.user.id}`
      );
      return res.data;
    },

    {
      onSuccess: (data: any) => {
        queryClient.invalidateQueries("workspace-query");
        dispatch(switchWorkSpace({ workspaceId: "", role: Role.CLIENT }));
        console.log("data", data);
      },
      onError: (error: any) => {
        console.log("error", error);
        toast(error?.response?.data?.message);
      },
    }
  );

  const updateWorkspaceTitleMutation = useMutation(
    async (data: any) => {
      const res = await axios.patch(
        `/workspace/${workspace.workspaceId}/${auth.user.id}/update-workspace-name`,
        data
      );
      return res.data;
    },
    {
      onError: (error: any) => {
        toast(error?.response?.data?.message);
      },
      onSuccess: (data: any) => {
        setIsModalOpen(false);
        queryClient.invalidateQueries("workspace-query");
        console.log("data", data);
      },
    }
  );

  const isActive = workspace.workspaceId === id ? "shadow-green-shadow" : " ";

  const handleDeleteWorkspace = () => {
    setIsPopupVisible(false);
    deleteWorkspaceMutation.mutate();
  };

  useOnClickOutside(popUpRef, () => {
    if (ref?.current?.id === "ellipses-content") return;
    setIsPopupVisible(false);
  });

  const closeModal = () => setIsModalOpen(false);

  const onWorkspaceTitleUpdate = (data: any) => {
    updateWorkspaceTitleMutation.mutate(data);
  };
  return (
    <>
      <Overlay isOpen={isModalOpen} onClick={closeModal}>
        <Modal onClick={closeModal}>
          <UpdateWorkspaceModal name={name} onUpdate={onWorkspaceTitleUpdate} />
        </Modal>
      </Overlay>

      <motion.div
        whileHover={{ scale: 1.05 }}
        title={adminName}
        onMouseLeave={() => setIsPopupVisible(false)}
        onClick={() => dispatch(switchWorkSpace({ workspaceId: id, role }))}
        className={`flex gap-3 bg-[#27292a] relative  p-3 rounded-lg h-full cursor-pointer w-full ${isActive}  group hover:shadow-green-shadow overflow-hidden   `}
      >
        {/* created by admin Avatar */}
        <div
          title={adminName}
          className="absolute w-8 h-8 left-14 top-20 z-40 rounded-full overflow-hidden border-2 "
        >
          <img
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover "
            src={adminImg}
            alt={adminName}
            title={adminName}
          />
        </div>
        <div className="absolute bg-custom-light-green  text-sm -right-6 rotate-45 top-5  w-[100px] text-center">
          <span>{role}</span>
        </div>
        <div className="flex justify-center items-center">
          <div className="overflow-hidden border-2 border-custom-light-green rounded-full relative w-20 h-20 ">
            <img
              src={logo}
              className="w-full h-full rounded-full object-cover  "
              alt="Workspace"
            />
          </div>
        </div>
        <div className="flex flex-col w-full justify-center ">
          <div className="flex-grow flex flex-col justify-center gap-1">
            <h2 className="text-xl ">{name}</h2>
            <div className="flex items-center gap-1 text-sm ">
              <span>
                <UserCircleIcon className="h-4 w-4" />
              </span>
              <span>Total Members: {totalMember}</span>
            </div>
            <p className="text-sm text-custom-light-green">
              Created {dateFormat}
            </p>
          </div>
          <div className="items-center absolute flex justify-end  bottom-3 right-3  ">
            {role === "ADMIN" && (
              <motion.div
                ref={ref}
                id="ellipses-content"
                whileTap={{ scale: 0.96 }}
                onClick={() => setIsPopupVisible(!isPopupVisible)}
                className="flex items-center justify-center rounded-full overflow-hidden w-7 h-7 hover:bg-dark-gray group select-none opacity-0 group-hover:opacity-100"
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
                className="absolute flex flex-col gap-1 w-[200px] -top-24 right-4   bg-custom-light-dark border-2 border-dark-gray  rounded-md shadow-md  origin-bottom-right p-2"
              >
                <div
                  onClick={() => {
                    setIsModalOpen(true);
                    setIsPopupVisible(false);
                  }}
                  className="flex  items-center gap-2 p-2 hover:bg-[#434343] rounded-md"
                >
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
        </div>
      </motion.div>
    </>
  );
};

export default Workspace;
