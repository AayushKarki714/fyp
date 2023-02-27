import React, { useState, useEffect, useRef, RefObject } from "react";
import { PhotoIcon } from "@heroicons/react/24/outline";
import {
  InformationCircleIcon,
  FaceSmileIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/solid";
import EmojiPicker, {
  EmojiClickData,
  EmojiStyle,
  Theme,
} from "emoji-picker-react";
import { motion } from "framer-motion";
import useOnClickOutside from "../hooks/useOnClickOutside";
import handleStopPropagation from "../utils/handleStopPropagation";
import useNavigateToDashboard from "../hooks/useNavigateToDashboard";
import ChatType from "../utils/ChatTab";
import { useQuery } from "react-query";
import axios from "../api/axios";
import { useAppSelector } from "../redux/store/hooks";

function ChatTab() {
  const emojiRef = useRef(null) as RefObject<HTMLDivElement>;
  const [messages, setMessages] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("");
  const [showPicker, setShowPicker] = useState<boolean>(false);

  const handleMessageSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!message) return;
    setMessage("");
    setMessages([...messages, message]);
  };

  const onEmojiClick = (emojiObject: EmojiClickData, event: MouseEvent) => {
    setMessage(message + emojiObject.emoji);
  };

  const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  useOnClickOutside(emojiRef, () => {
    setShowPicker(false);
  });

  useEffect(() => {
    console.log("mounted baby");
  }, []);

  return (
    <div className="flex-grow flex flex-col">
      <div className="basis-16 flex-shrink-0 flex p-3 items-center justify-end  bg-custom-black border-b-2 border-dark-gray">
        <div className="flex itemis-center justify-center">
          <button className="text-gray-400 hover:text-white">
            <InformationCircleIcon className="h-8 w-8" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2 flex-grow bg-custom-black p-3 overflow-y-auto custom-scrollbar">
        {messages.map((mssg: any, index: any) => (
          <div
            className="flex text-base  max-w-[300px] shadow-sm odd:self-start even:self-end"
            key={index}
          >
            <p className="bg-dark-gray p-2 rounded-2xl">{mssg}</p>
          </div>
        ))}
      </div>
      <div className="relative flex items-center gap-3 p-2 border-t-2 border-dark-gray">
        <label className="flex items-center cursor-pointer">
          <input className="w-0 h-0" type="file" accept="image/*" />
          <PhotoIcon className="h-6" />
        </label>

        <form
          id="submit-message"
          className="flex items-center flex-grow"
          onSubmit={handleMessageSubmit}
        >
          <input
            type="text"
            value={message}
            onChange={handleMessageChange}
            className="py-2 pl-2 pr-10 border-2  border-dark-gray w-full bg-custom-light-dark text-gray-300 focus:outline-none text-sm rounded-2xl"
          />
        </form>

        <div
          ref={emojiRef}
          className="absolute right-12 flex items-center justify-center rounded-lg cursor-pointer"
          onClick={() => setShowPicker(!showPicker)}
        >
          <FaceSmileIcon className="h-5 text-gray-400" />

          {showPicker && (
            <div
              onClick={handleStopPropagation}
              className="absolute bottom-16 right-12 text-base origin-bottom-right"
            >
              <EmojiPicker
                width={300}
                height={300}
                theme={Theme.DARK}
                searchDisabled={true}
                skinTonesDisabled={true}
                previewConfig={{
                  showPreview: false,
                }}
                lazyLoadEmojis={true}
                emojiStyle={EmojiStyle.FACEBOOK}
                autoFocusSearch={false}
                onEmojiClick={onEmojiClick}
              />
            </div>
          )}
        </div>

        <motion.button
          type="submit"
          form="submit-message"
          whileTap={{ scale: 0.94 }}
          className="flex items-center justify-center rounded-lg cursor-pointer"
        >
          <PaperAirplaneIcon className="h-5 text-gray-400 " />
        </motion.button>
      </div>
    </div>
  );
}

interface SwitchChatTabProps {
  children: React.ReactNode;
  selectedChatTab: ChatType;
  chatTabType: ChatType;
  setSelectedChatTab: React.Dispatch<React.SetStateAction<ChatType>>;
}

const SwitchChatTab: React.FC<SwitchChatTabProps> = ({
  children,
  selectedChatTab,
  setSelectedChatTab,
  chatTabType,
}) => {
  const isActive = selectedChatTab === chatTabType;
  return (
    <button
      className={`px-4 py-2 text-base text-left rounded-md ${
        isActive
          ? "bg-custom-light-green"
          : "bg-custom-light-dark text-gray-300"
      }`}
      onClick={() => setSelectedChatTab(chatTabType)}
    >
      {children}
    </button>
  );
};

const Chat: React.FC = () => {
  const [selectedChatTab, setSelectedChatTab] = useState<ChatType>(
    ChatType.ALL
  );
  const { workspaceId } = useAppSelector((state) => state.workspace);
  const {
    user: { id: userId },
  } = useAppSelector((state) => state.auth);

  const { data: chats, isLoading } = useQuery(
    "all-chat",
    async () => {
      const res = await axios.get(
        `/chat/${userId}/${workspaceId}/get-all-chat`
      );
      return res?.data?.data;
    },
    { enabled: Boolean(workspaceId) }
  );

  useNavigateToDashboard();

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="h-full flex rounded-md overflow-hidden border-2  border-custom-light-dark">
      <div className="basis-56 flex flex-col bg-custom-black border-r-2 border-dark-gray  p-2 gap-2 text-xl">
        {chats?.map((chat: any) => {
          return (
            <SwitchChatTab
              key={chat.type}
              selectedChatTab={selectedChatTab}
              chatTabType={chat.type}
              setSelectedChatTab={setSelectedChatTab}
            >
              {chat.type}
            </SwitchChatTab>
          );
        })}
      </div>
      <ChatTab />
    </div>
  );
};

export default Chat;
