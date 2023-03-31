import React from "react";

import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useSystemAdmin } from "../context/AdminContext";
import { useMutation, useQuery } from "react-query";
import systemAxios from "../api/systemAxios";
import Spinner from "../components/Spinner/Spinner";
import { Role } from "../redux/slices/workspaceSlice";

function WorkspaceDetailed() {
  const navigate = useNavigate();
  const { workspaceId } = useParams();
  const { admin } = useSystemAdmin();

  const { data: workspaceData, isLoading } = useQuery(
    `workspace-${workspaceId}`,
    async () => {
      const res = await systemAxios.get(
        `/system-admin/${workspaceId}/workspace`,
        {
          headers: {
            authorization: `Bearer ${(admin as any).token}`,
          },
        }
      );
      return res.data?.data;
    }
  );

  const { mutate: deleteWorkspace } = useMutation(
    async () => {
      const res = await systemAxios.delete(
        `/system-admin/${workspaceId}/delete-workspace`,
        { headers: { authorization: `Bearer ${(admin as any).token}` } }
      );
      return res.data;
    },
    {
      onSuccess: (data) => {
        console.log(data);
        navigate("/system/admin");
      },
      onError: (error) => {
        console.log(error);
      },
    }
  );

  if (!admin) return <Navigate to={"/system/admin/login"} replace />;
  if (isLoading) return <Spinner isLoading={isLoading} />;
  console.log({ workspaceData });

  return (
    <div className=" h-screen">
      <div className=" mt-20 border-[2px] px-6 py-3 rounded-md border-custom-light-dark shadow-custom-light-green  w-[80%] mx-auto flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <figure className="w-20 h-20 rounded-full overflow-hidden border-[2px] border-custom-light-green ">
            <img
              src={workspaceData?.logo}
              alt={workspaceData?.name}
              className="w-full h-full object-cover"
            />
          </figure>
          <h2 className="text-3xl">{workspaceData?.name}</h2>
        </div>
        <div className="flex flex-col gap-3">
          <h2 className="text-custom-light-green">All Members:</h2>
          <div className="flex flex-col gap-3">
            {workspaceData?.Member.map((member: any, index: number) => {
              const applyBorder = workspaceData?.Member[index + 1]
                ? true
                : false;
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
        <button
          onClick={() => deleteWorkspace()}
          className="px-6 py-2 bg-red-600 text-white rounded-md"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default WorkspaceDetailed;
