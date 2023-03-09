import { EllipsisVerticalIcon } from "@heroicons/react/24/solid";
import { formatRelative } from "date-fns";
import React, { useRef, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import axios from "../../api/axios";
import useOnClickOutside from "../../hooks/useOnClickOutside";
import { Role } from "../../redux/slices/workspaceSlice";
import { useAppSelector } from "../../redux/store/hooks";

interface Props {
  message: string;
  photo: string;
  userName: string;
  isLoggedUser: boolean;
  isNextMessageOfSameUser: boolean;
  createdAt: Date;
  chatMessageId: string;
}

interface ChatMessageProps {
  chatMessageId: string;
  setIsChatOptionsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatMessageOptions: React.FC<ChatMessageProps> = ({
  chatMessageId,
  setIsChatOptionsVisible,
}) => {
  const queryClient = useQueryClient();
  const {
    user: { id: userId },
  } = useAppSelector((state) => state.auth);
  const { workspaceId } = useAppSelector((state) => state.workspace);
  const { id: chatId } = useAppSelector((state) => state.chat);

  const { mutate: deleteChatMessageMutate } = useMutation(
    async () => {
      const res = await axios.delete(
        `/chat/${userId}/${workspaceId}/${chatMessageId}/delete-chat-message`
      );
      return res.data;
    },
    {
      onSuccess(data) {
        queryClient.invalidateQueries({ queryKey: ["chat-messages", chatId] });
        setIsChatOptionsVisible(false);
        console.log("data", data);
      },
      onError(error: any) {
        toast(error?.response?.data?.message);
      },
    }
  );

  return (
    <div className="bg-custom-light-dark p-2 -left-[45px] -top-16 flex flex-col gap-2 items-start absolute  w-28  rounded-md">
      <div className="w-full">
        <button
          onClick={() => {
            deleteChatMessageMutate();
          }}
          className="hover:bg-[#434343]
        w-full p-1 rounded-md"
        >
          Remove
        </button>
      </div>
      <div className="absolute center-angled-triangle -bottom-3 left-[50%] right-[50%] -translate-x-[50%]  bg-custom-light-dark w-4 h-4"></div>
    </div>
  );
};

const ChatMessage: React.FC<Props> = ({
  message,
  photo,
  userName,
  isNextMessageOfSameUser,
  isLoggedUser,
  createdAt,
  chatMessageId,
}) => {
  const [isChatOptionsVisible, setIsChatOptionsVisible] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { role } = useAppSelector((state) => state.workspace);

  const messageRef = useRef<any>(null);
  const dateFormat = formatRelative(new Date(createdAt), new Date());

  useOnClickOutside(messageRef, () => {
    setIsChatOptionsVisible(false);
  });

  return (
    <div
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      className={`flex items-center gap-2 mt-1
       ${isLoggedUser ? "self-end" : "self-start"}
      ${!isNextMessageOfSameUser ? "mb-12" : "mb-1"} 
      relative `}
    >
      {isLoggedUser ? null : (
        <div
          title={`${isNextMessageOfSameUser}`}
          className="w-10 h-10 rounded-full overflow-hidden self-end"
        >
          {!isNextMessageOfSameUser && (
            <img
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              src={
                photo ??
                "https://images.unsplash.com/file-1662566326028-7013d2f857a6image?dpr=2&auto=format&fit=crop&w=416&q=60"
              }
              alt={userName ?? "deleted User"}
              title={userName ?? "Deleted User"}
            />
          )}
        </div>
      )}
      <div
        className={`flex items-center gap-12  text-base ${
          isLoggedUser ? "-order-1" : ""
        } `}
      >
        {role === Role.ADMIN && (
          <div
            ref={messageRef}
            className={` relative ${isLoggedUser ? "" : "order-4"}`}
          >
            {isVisible ? (
              <div className={`${isLoggedUser ? "" : "order-4"}`}>
                <button
                  onClick={() => setIsChatOptionsVisible((prev) => !prev)}
                  className="hover:bg-custom-light-dark flex items-center justify-center rounded-full p-1"
                >
                  <EllipsisVerticalIcon className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className={`${isLoggedUser ? "" : "order-4"}`}>
                <button className="hover:bg-custom-light-dark flex items-center justify-center rounded-full p-1 invisible">
                  <EllipsisVerticalIcon className="h-5 w-5" />
                </button>
              </div>
            )}
            {isChatOptionsVisible && (
              <ChatMessageOptions
                setIsChatOptionsVisible={setIsChatOptionsVisible}
                chatMessageId={chatMessageId}
              />
            )}
          </div>
        )}
        <p
          className={`py-2 px-3  rounded-2xl max-w-[220px] ${
            isLoggedUser ? "bg-custom-light-green" : "bg-custom-light-dark"
          }`}
          title={dateFormat}
        >
          {message}
        </p>
      </div>
    </div>
  );
};

export default ChatMessage;
