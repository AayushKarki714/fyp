import React from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useSystemAdmin } from "../context/AdminContext";
import systemAxios from "../api/systemAxios";
import { useMutation, useQuery } from "react-query";
import Spinner from "../components/Spinner/Spinner";

function UserDetailed() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { admin } = useSystemAdmin();

  const { data: userData, isLoading } = useQuery(`user-${userId}`, async () => {
    const res = await systemAxios.get(`/system-admin/${userId}/user`, {
      headers: {
        authorization: `Bearer ${(admin as any).token}`,
      },
    });
    return res.data?.data;
  });

  const { mutate: deleteWorkspace } = useMutation(
    async () => {
      const res = await systemAxios.delete(
        `/system-admin/${userId}/delete-user`,
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
  console.log({ userData });

  return <div>Hello</div>;
}

export default UserDetailed;
