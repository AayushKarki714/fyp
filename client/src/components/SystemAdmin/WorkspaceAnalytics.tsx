import { useState } from "react";
import { useQuery } from "react-query";
import systemAxios from "../../api/systemAxios";
import { useSystemAdmin } from "../../context/AdminContext";
import Spinner from "../Spinner/Spinner";

const DeleteWorkspaceCard = ({ members, name, id, logo }: any) => {
  const [expand, setExpand] = useState(false);
  return (
    <div className="bg-custom-light-dark p-6 rounded-md">
      <img
        className="w-12 h-12 rounded-full border-2 border-custom-light-green"
        referrerPolicy="no-referrer"
        src={logo}
        alt={name}
      />
      <h2>{name}</h2>
      <button className="bg-red-600 px-6 py-2 text-white rounded-md">
        Delete
      </button>
      <button>View Details</button>
    </div>
  );
};

function WorkspaceAnalytics() {
  const { admin } = useSystemAdmin();
  const { data, isLoading } = useQuery("workspace-analytics", async () => {
    const res = await systemAxios.get("/system-admin/all/workspaces", {
      headers: { authorization: `Bearer ${(admin as any).token}` },
    });
    return res.data?.data;
  });

  if (isLoading) return <Spinner isLoading={isLoading} />;
  return (
    <div className="flex flex-col gap-6">
      {data.map((workspace: any) => {
        return (
          <DeleteWorkspaceCard
            key={workspace.id}
            id={workspace.id}
            logo={workspace.logo}
            members={workspace.Member}
            name={workspace.name}
          />
        );
      })}
    </div>
  );
}

export default WorkspaceAnalytics;
