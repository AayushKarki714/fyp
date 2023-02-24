import React, { useState } from "react";
import Modal from "../Modals/Modal";
import Overlay from "../Modals/Overlay";
import { useDrag } from "react-dnd/dist/hooks";
import { ItemTypes } from "../../utils/ItemTypes";
import "react-datepicker/dist/react-datepicker.css";
import TodoEditModal from "../Modals/TodoEditModal";
import { motion } from "framer-motion";
import {
  ChatBubbleLeftEllipsisIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { differenceInDays, format } from "date-fns";
import { useMutation, useQueryClient } from "react-query";
import axios from "../../api/axios";
import { useAppSelector } from "../../redux/store/hooks";
import { toast } from "react-toastify";
import { Role } from "../../redux/slices/workspaceSlice";
import verifyRole from "../../utils/verifyRole";

interface Props {
  id: string;
  todoCardId: string;
  title: string;
  todo: any;
  todoContainerId: string;
  createdAt: Date;
  completed: boolean;
  completionDate: Date;
  totalComments: number;
  photo: string;
  createdUsername: string;
}

const Todo: React.FC<Props> = ({
  id,
  title,
  todoCardId,
  todo,
  todoContainerId,
  createdAt,
  completionDate,
  completed,
  totalComments,
  photo,
  createdUsername,
}) => {
  const queryClient = useQueryClient();

  const [isChecked, setIsChecked] = useState<boolean>(completed);
  const [isHoveredDate, setIsHoveredDate] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAppSelector((state) => state.auth);
  const { workspaceId, role } = useAppSelector((state) => state.workspace);
  const isAllowed = verifyRole(role, [Role.ADMIN, Role.LANCER]);

  const closeModal = () => {
    setIsOpen(false);
  };

  const completeUpdateMutation = useMutation(
    async (payload: { completed: boolean }) => {
      const res = await axios.patch(
        `/todo/${user.id}/${workspaceId}/${todoCardId}/${id}/update-todo-completed`,
        payload
      );
      return res.data;
    },
    {
      onError: (error: any) => {
        queryClient.invalidateQueries(["todo-query", todoCardId]);
        toast(error?.response?.data?.message);
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries(["todo-query", todoCardId]);
      },
    }
  );

  const [{ isDragging }, drag] = useDrag(() => ({
    type: `${ItemTypes.Todo}--${todoContainerId}`,
    item: { ...todo },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  let daysLeft;
  let dateClassName = "";
  let dateInDayMonthFormat = "";

  if (completionDate) {
    const formattedCompletionDate = new Date(completionDate);
    const formattedCreatedAtDate = new Date(createdAt);
    const monthFormat = format(formattedCompletionDate, "LLL");
    const dayFormat = format(formattedCompletionDate, "dd");

    dateInDayMonthFormat = `${monthFormat} ${dayFormat}`;

    const remainingDays = differenceInDays(
      formattedCompletionDate,
      formattedCreatedAtDate
    );
    daysLeft = `${remainingDays} ${remainingDays > 1 ? "days" : "day"}`;

    if (completed) {
      dateClassName = "bg-green-600";
    } else if (remainingDays >= 15) {
      dateClassName = "bg-blue-600";
    } else if (remainingDays >= 10) {
      dateClassName = "bg-purple-600";
    } else if (remainingDays >= 5) {
      dateClassName = "bg-yellow-600";
    } else if (remainingDays > 0) {
      dateClassName = "bg-orange-600";
    } else {
      dateClassName = "bg-red-600";
    }
  } else {
    daysLeft = null;
  }

  const handleCheckChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setIsChecked(checked);
    completeUpdateMutation.mutate({ completed: checked });
  };

  return (
    <>
      <Overlay isOpen={isOpen} onClick={closeModal}>
        <Modal onClick={closeModal}>
          <TodoEditModal
            photo={photo}
            closeModal={closeModal}
            createdUsername={createdUsername}
            completed={completed}
            dateInDayMonthFormat={dateInDayMonthFormat}
            daysLeft={daysLeft}
            dateClass={dateClassName}
            title={title}
            todo={todo}
          />
        </Modal>
      </Overlay>
      <motion.div>
        <div
          ref={isAllowed ? drag : null}
          onDoubleClick={() => setIsOpen(true)}
          className={`relative flex flex-col gap-1 select-none   text-base ${
            isDragging ? "bg-custom-light-green " : "bg-custom-light-dark"
          } px-3 py-2  rounded-md hover:shadow cursor-pointer group`}
        >
          <p>{title}</p>
          {completionDate ? (
            <div className="text-xs flex gap-2 items-center">
              <button
                onMouseEnter={() => isAllowed && setIsHoveredDate(true)}
                onMouseLeave={() => isAllowed && setIsHoveredDate(false)}
                className={`flex items-center ${dateClassName}  gap-1 p-2 rounded-md `}
                title={daysLeft || ""}
              >
                {isAllowed && isHoveredDate ? (
                  <input
                    type="checkbox"
                    checked={isAllowed ? isChecked : false}
                    className="h-4 w-4 focus:ring-offset-0 border-white border-2  rounded-md bg-transparent focus:outline-none checked:outline-none checked:bg-green-600 hover:checked:bg-green-600  hover:checked:border-white checked:border-white active:outline-none focus:ring-transparent"
                    onChange={isAllowed ? handleCheckChange : () => {}}
                  />
                ) : (
                  <ClockIcon className="h-4 w-4 " />
                )}
                {dateInDayMonthFormat}
              </button>
              <button className="flex items-center gap-1 hover:bg-custom-black hover:text-custom-light-green p-2 rounded-md">
                <ChatBubbleLeftEllipsisIcon className="h-4 w-4 " />
                {totalComments}
              </button>
            </div>
          ) : null}
        </div>
      </motion.div>
    </>
  );
};

export default Todo;
