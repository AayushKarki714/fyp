import { TrashIcon } from "@heroicons/react/24/outline";
import { useQuery } from "react-query";
import systemAxios from "../../api/systemAxios";
import { useSystemAdmin } from "../../context/AdminContext";
import { Role } from "../../redux/slices/workspaceSlice";

interface AdditionalWorkspaceDetailsProps {
  workspaceId: string;
}

const AdditionalWorkspaceDetails: React.FC<AdditionalWorkspaceDetailsProps> = ({
  workspaceId,
}) => {
  const { admin } = useSystemAdmin();
  const { data, isLoading } = useQuery(
    ["additionaWorkspaceDetails", workspaceId],
    async () => {
      const res = await systemAxios.get(
        `/system-admin/${workspaceId}/additional-details`,
        {
          headers: { authorization: `Bearer ${(admin as any).token}` },
        }
      );
      return res.data?.data;
    }
  );
  if (isLoading) return <h1>Loading...</h1>;
  return (
    <div className="self-stretch  flex flex-col gap-2">
      <div>
        <p className="flex items-center gap-2 text-gray-300 hover:text-custom-light-green">
          <span>GalleryContainer :</span>
          <span>{data?.galleryContainerCount}</span>
        </p>
      </div>
      <div>
        <p className="flex items-center gap-2 text-gray-300 hover:text-custom-light-green">
          <span>TodoContainer :</span>
          <span>{data?.todoContainerCount}</span>
        </p>
      </div>
      <div>
        <p className="flex items-center gap-2 text-gray-300 hover:text-custom-light-green">
          <span>ProgressContainer :</span>
          <span>{data?.progressContainerCount}</span>
        </p>
      </div>
      <div className="mt-4 flex flex-col gap-2 text-gray-300">
        <h2>Members:</h2>
        <div className="flex flex-col gap-3">
          {data?.members.map((member: any, index: number) => {
            const applyBorder = data?.members[index + 1] ? true : false;
            return (
              <div
                key={member.user.id}
                className={`flex items-center gap-2 pb-3 ${
                  applyBorder ? "border-b-[1px]" : ""
                } border-custom-light-green`}
              >
                <figure className="w-12 h-12 rounded-full overflow-hidden ">
                  <img
                    className="w-full h-full object-cover"
                    src={member.user.photo}
                    alt={member.user.userName}
                  />
                </figure>
                <div className="flex flex-col gap-1 items-start  flex-grow ">
                  <p>{member.user.userName}</p>
                  <p
                    className={`text-xs px-4 py-1 ${
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
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdditionalWorkspaceDetails;
