import React from "react";

interface Props {
  message: string;
  photo: string;
  userName: string;
  isLoggedUser: boolean;
}

const ChatMessage: React.FC<Props> = ({
  message,
  photo,
  userName,
  isLoggedUser,
}) => {
  return (
    <div
      className={`flex items-center gap-2 ${
        isLoggedUser ? "self-end" : "self-start"
      }`}
    >
      <div className="w-12 h-12 rounded-full overflow-hidden self-end">
        <img
          className="w-full h-full object-cover"
          src={photo}
          alt={userName}
          title={userName}
        />
      </div>
      <div className={`text-base ${isLoggedUser ? "-order-1" : ""} `}>
        <p
          className={`py-2 px-4  rounded-2xl max-w-[220px] ${
            isLoggedUser ? "bg-custom-light-green" : "bg-custom-light-dark"
          }`}
        >
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Praesentium,
          distinctio minus dolorum repellat enim sint accusamus quis numquam,
          alias aspernatur a iusto dolorem nam doloremque perspiciatis incidunt
          eaque. Itaque, rerum!
        </p>
      </div>
    </div>
  );
};

export default ChatMessage;
