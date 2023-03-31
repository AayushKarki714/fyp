import { useQuery } from "react-query";
import axios from "../../api/axios";
import { Role } from "../../redux/slices/workspaceSlice";
import { useAppSelector } from "../../redux/store/hooks";

const MembersList: React.FC = () => {
  const { workspaceId } = useAppSelector((state) => state.workspace);
  const { id: userId } = useAppSelector((state) => state.auth.user);
  const { id: chatId, type: chatType } = useAppSelector((state) => state.chat);
  const { data: membersData, isLoading } = useQuery(
    `members-query-${chatId}-${chatType}`,
    async () => {
      const res = await axios.get(
        `/chat/${userId}/${workspaceId}/${chatId}/${chatType}/all-members`
      );
      return res?.data?.data;
    }
  );

  if (isLoading) return <h1>Loading...</h1>;
  return (
    <div className="flex flex-col gap-4 w-[350px]">
      {membersData?.map(({ member }: any) => (
        <div
          key={member.id}
          className="border-b-2 border-custom-light-dark  pb-2"
        >
          <div className="flex gap-2 items-center">
            <div className="w-12 h-12 rounded-full overflow-hidden">
              <img
                referrerPolicy="no-referrer"
                src={member?.user?.photo}
                alt={member?.user?.userName && "Deleted User 😢"}
              />
            </div>
            <div className="flex flex-col gap-2">
              <p>{member.user.userName}</p>
              <p
                className={`text-xs self-start px-4 py-1 ${
                  member.role === Role.ADMIN
                    ? "bg-red-600"
                    : member.role === Role.LANCER
                    ? "bg-custom-light-green"
                    : "bg-blue-600"
                }  text-white rounded-md`}
              >
                {member.role}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MembersList;
