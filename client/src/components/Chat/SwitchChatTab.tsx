import { switchChat } from "../../redux/slices/chatSlice";
import { useAppDispatch, useAppSelector } from "../../redux/store/hooks";
import ChatType from "../../utils/ChatTab";

interface SwitchChatTabProps {
  children: React.ReactNode;
  chatTabType: ChatType;
  chat: any;
  chatId: string;
  allowedAccess: any;
}

const SwitchChatTab: React.FC<SwitchChatTabProps> = ({
  children,
  chat,
  chatId,
  chatTabType,
  allowedAccess,
}) => {
  const dispatch = useAppDispatch();
  const { id: selectedChatId } = useAppSelector((state) => state.chat);

  const handleSwitchChat = (data: any) => {
    dispatch(switchChat(data));
  };

  if (!allowedAccess.includes(chat.type)) {
    return null;
  }

  const isActive = chatId === selectedChatId;
  return (
    <button
      className={`py-2 px-3 rounded-md  text-base text-left  ${
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
