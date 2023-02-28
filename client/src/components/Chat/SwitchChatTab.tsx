import { switchChat } from "../../redux/slices/chatSlice";
import { useAppDispatch, useAppSelector } from "../../redux/store/hooks";
import ChatType from "../../utils/ChatTab";

interface SwitchChatTabProps {
  children: React.ReactNode;
  chatTabType: ChatType;
  chat: any;
  chatId: string;
}

const SwitchChatTab: React.FC<SwitchChatTabProps> = ({
  children,
  chat,
  chatId,
  chatTabType,
}) => {
  const dispatch = useAppDispatch();
  const { id: selectedChatId } = useAppSelector((state) => state.chat);

  const handleSwitchChat = (data: any) => {
    dispatch(switchChat(data));
  };

  const isActive = chatId === selectedChatId;
  return (
    <button
      className={`py-2 px-3  text-base text-left  ${
        isActive
          ? "bg-custom-light-green"
          : "bg-custom-light-dark text-gray-300"
      }`}
      title={chatTabType}
      onClick={() => handleSwitchChat(chat)}
    >
      {children}
    </button>
  );
};

export default SwitchChatTab;
