import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { EllipsisVerticalIcon } from "@heroicons/react/24/solid";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/outline";
import useOnClickOutside from "../hooks/useOnClickOutside";
import handleStopPropagation from "../utils/handleStopPropagation";
import { useAppDispatch, useAppSelector } from "../redux/store/hooks";
import { switchWorkSpace } from "../redux/slices/workspaceSlice";

const Workspace: React.FC<any> = ({ img, text, id }) => {
  const popUpRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const { workspaceId } = useAppSelector((state) => state.workspace);
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  useOnClickOutside(popUpRef, () => setIsPopupVisible(false));
  const isActive =
    workspaceId === id
      ? " border-custom-light-green z-10"
      : " border-transparent";

  return (
    <motion.div
      layout
      whileHover={{ scale: 1.04 }}
      onClick={() => dispatch(switchWorkSpace({ workspaceId: id }))}
      className={`flex flex-col gap-3 bg-[#27292a]  border-2 p-3 rounded-lg h-full cursor-pointer w-full  ${isActive} group `}
    >
      <figure className="overflow-hidden rounded-sm">
        <img
          src={img}
          className="w-full h-[150px] object-cover  "
          alt="Workspace"
        />
      </figure>

      <div className="relative flex items-center justify-between">
        <h2 className="text-xl">{text}</h2>
        <motion.div
          ref={popUpRef}
          whileTap={{ scale: 0.96 }}
          onClick={() => setIsPopupVisible(!isPopupVisible)}
          className=" items-center justify-center rounded-full overflow-hidden w-7 h-7 hover:bg-dark-gray group select-none hidden group-hover:flex"
        >
          <EllipsisVerticalIcon className="h-5 w-5 text-gray-400 group-hover:text-white " />
        </motion.div>

        {isPopupVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={handleStopPropagation}
            className="absolute flex flex-col gap-1 top-9 right-4 w-[200px]  bg-custom-light-dark border-2 border-dark-gray  rounded-md shadow-md  origin-top-right p-2"
          >
            <div className="flex items-center gap-2 p-2 hover:bg-[#434343] rounded-md">
              <PencilIcon className="h-4" />
              <p className="text-sm">Rename</p>
            </div>
            <div className="flex items-center gap-2 p-2 hover:bg-[#434343] rounded-md">
              <TrashIcon className="h-4" />
              <p className="text-sm">Delete</p>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Workspace;
