import React, { useEffect } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import systemAxios from "../api/systemAxios";
import Spinner from "../components/Spinner/Spinner";
import { useSystemAdmin } from "../context/AdminContext";

function SystemAdmin() {
  const navigate = useNavigate();
  const { setAdmin, admin } = useSystemAdmin();
  const { data, isLoading } = useQuery("system-admin", async () => {
    const res = await systemAxios.get("/system-admin");
    return res.data;
  });

  useEffect(() => {
    if (!admin && data) {
      setAdmin(data?.data);
    }
  }, [admin, data, setAdmin]);

  const handleLogout = () => {
    navigate("/system/admin/login");
    localStorage.removeItem("token");
    setAdmin(null);
  };

  if (isLoading) return <Spinner isLoading={isLoading} />;
  return (
    <div>
      <h1 className="text-4xl">
        Welcome to the Admin Dashboard,{admin?.username}
      </h1>
      <button
        onClick={handleLogout}
        className="bg-red-500 px-6 py-2 rounded-md hover:brightness-90"
      >
        logout
      </button>
    </div>
  );
}

export default SystemAdmin;
