import { useRef, useState, RefObject } from "react";
import { motion } from "framer-motion";
import { useAppSelector } from "../../redux/store/hooks";
import useOnClickOutside from "../../hooks/useOnClickOutside";
import Overlay from "../Modals/Overlay";
import Modal from "../Modals/Modal";
import MembersList from "./MembersList";
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
import { PhotoIcon } from "@heroicons/react/24/outline";
import handleStopPropagation from "../../utils/handleStopPropagation";
import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "../../api/axios";
import ChatMessage from "./ChatMessage";

interface ChatTabProps {}

const ChatTab: React.FC<ChatTabProps> = () => {
  const queryClient = useQueryClient();
  const [message, setMessage] = useState<string>("");
  const [isMembersModalOpen, setIsMembersModalOpen] = useState<boolean>(false);
  const { id: chatId, type: chatType } = useAppSelector((state) => state.chat);
  const emojiRef = useRef(null) as RefObject<HTMLDivElement>;
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const {
    user: { id: userId },
  } = useAppSelector((state) => state.auth);
  const { memberId, workspaceId } = useAppSelector((state) => state.workspace);

  const onEmojiClick = (emojiObject: EmojiClickData, event: MouseEvent) => {
    setMessage(message + emojiObject.emoji);
  };

  const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const { mutate: sendMessageMutate } = useMutation(
    async (data: any) => {
      const res = await axios.post(
        `/chat/${userId}/${workspaceId}/${chatId}/send-message-chat`,
        data
      );
      return res.data;
    },
    {
      onError(error) {
        console.log("error", error);
      },
      onSuccess(data) {
        queryClient.invalidateQueries({ queryKey: ["chat-messages", chatId] });
        console.log("data", data);
      },
    }
  );

  const { data: chatMessages, isLoading } = useQuery(
    ["chat-messages", chatId],
    async () => {
      const res = await axios.get(
        `/chat/${userId}/${workspaceId}/${chatId}/${chatType}/get-messages-chat`
      );
      return res.data?.data;
    },
    { enabled: Boolean(userId && workspaceId && chatId && chatType) }
  );

  const handleMessageSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!message) return;
    sendMessageMutate({ message, memberId, chatType });
    setMessage("");
  };

  useOnClickOutside(emojiRef, () => {
    setShowPicker(false);
  });

  if (isLoading) return <h2>Loading...</h2>;
  console.log({ chatMessages });

  return (
    <>
      <Overlay
        isOpen={isMembersModalOpen}
        onClick={() => setIsMembersModalOpen(false)}
      >
        <Modal onClick={() => setIsMembersModalOpen(false)}>
          <MembersList />
        </Modal>
      </Overlay>
      <div className="flex-grow flex flex-col">
        <div className="basis-16 flex-shrink-0 flex p-3 items-center justify-end  bg-custom-black border-b-2 border-dark-gray">
          <div className="flex itemis-center justify-center">
            <button
              onClick={() => setIsMembersModalOpen(true)}
              className="text-gray-400 hover:text-white"
            >
              <InformationCircleIcon className="h-8 w-8" />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3 flex-grow bg-custom-black p-3 overflow-y-auto custom-scrollbar">
          {chatMessages?.map((message: any) => (
            <ChatMessage
              key={message.id}
              isLoggedUser={message.member.userId === userId}
              message={message.message}
              photo={message.member.user.photo}
              userName={message.member.user.userName}
            />
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
    </>
  );
};

export default ChatTab;
