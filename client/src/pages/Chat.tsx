import React, { useEffect } from "react";
import useNavigateToDashboard from "../hooks/useNavigateToDashboard";
import { useQuery } from "react-query";
import axios from "../api/axios";
import { useAppDispatch, useAppSelector } from "../redux/store/hooks";
import ChatTab from "../components/Chat/ChatTab";
import SwitchChatTab from "../components/Chat/SwitchChatTab";
import { Role } from "../redux/slices/workspaceSlice";
import { switchChat } from "../redux/slices/chatSlice";
import ChatType from "../utils/ChatTab";
import Spinner from "../components/Spinner/Spinner";

interface ChatProps {
  socket: any;
}

const Chat: React.FC<ChatProps> = ({ socket }) => {
  const dispatch = useAppDispatch();
  const { id: chatId } = useAppSelector((state) => state.chat);
  const { workspaceId, role } = useAppSelector((state) => state.workspace);
  let allowedAccess = ["ALL", "LANCERS", "CLIENTS"];
  if (role === Role.LANCER) allowedAccess = ["LANCERS", "ALL"];
  else if (role === Role.CLIENT) allowedAccess = ["CLIENTS", "ALL"];

  const {
    user: { id: userId },
  } = useAppSelector((state) => state.auth);

  const { data: chats, isLoading } = useQuery(
    ["all-chat", workspaceId, role],
    async () => {
      const res = await axios.get(
        `/chat/${userId}/${workspaceId}/get-all-chat`
      );
      return res?.data?.data;
    },
    { enabled: Boolean(workspaceId) }
  );

  useNavigateToDashboard();

  useEffect(() => {
    if (chatId === null && chats?.length > 0) {
      dispatch(switchChat(chats[0]));
    }
  }, [chatId, chats, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(switchChat({ id: null, type: ChatType.ALL }));
    };
  }, [dispatch]);

  if (isLoading) {
    return <Spinner isLoading={isLoading} />;
  }

  return (
    <div className="h-full flex rounded-md overflow-hidden border-2  border-custom-light-dark">
      <div
        className={` flex basis-40 flex-col bg-custom-black border-r-2 border-dark-gray  p-2 gap-2 text-xl`}
      >
        <div className="flex flex-col gap-3">
          {chats?.map((chat: any) => {
            return (
              <SwitchChatTab
                key={chat.type}
                chat={chat}
                allowedAccess={allowedAccess}
                chatId={chat.id}
                chatTabType={chat.type}
              >
                {chat.type}
              </SwitchChatTab>
            );
          })}
        </div>
      </div>
      {chatId && <ChatTab socket={socket} />}
    </div>
  );
};

export default Chat;
