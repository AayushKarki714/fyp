import { useQuery } from "react-query";
import axios from "../../api/axios";
import { useAppSelector } from "../../redux/store/hooks";

const MembersList: React.FC = () => {
  const { workspaceId } = useAppSelector((state) => state.workspace);
  const { id: userId } = useAppSelector((state) => state.auth.user);
  const { id: chatId, type: chatType } = useAppSelector((state) => state.chat);
  const { data: membersData, isLoading } = useQuery(
    "members-query",
    async () => {
      const res = await axios.get(
        `/chat/${userId}/${workspaceId}/${chatId}/${chatType}/all-members`
      );
      return res.data?.data;
    }
  );

  console.log("membersData", membersData);

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
            <div>
              <p>{member.user.userName}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MembersList;
