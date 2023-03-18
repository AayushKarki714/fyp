import React, { useState } from "react";
import { motion } from "framer-motion";
import systemAxios from "../api/systemAxios";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { useAppSelector } from "../redux/store/hooks";
import { Navigate, useNavigate } from "react-router-dom";
import CustomToastify from "../components/CustomToastify";
import { useSystemAdmin } from "../context/AdminContext";

type FormItemProps = {
  label: string;
  value: string;
  id: string;
  type?: "text" | "password";
  placeholder?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};
function FormItem({
  label,
  value,
  onChange,
  type = "text",
  id,
  placeholder = "",
}: FormItemProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-custom-light-green" htmlFor={id}>
        {label}:
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="bg-[#09090a] rounded px-3 py-2"
      />
    </div>
  );
}

function SystemAdminForm() {
  const { admin, setAdmin } = useSystemAdmin();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { mutate } = useMutation(
    async (payload: any) => {
      const res = await systemAxios.post("/system-admin/login", payload);
      console.log(res.data);
      return res.data;
    },
    {
      onSuccess: (data) => {
        toast(data?.message);
        setUsername("");
        setPassword("");
        setAdmin(data?.data);
        navigate("/system/admin/");
      },
      onError: (error: any) => {
        console.log(error?.response?.data?.message);
        toast(error?.response?.data?.message);
      },
    }
  );

  const handleAdminLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!username || !password) return toast("Missing the Required Fields");
    mutate({ username, password });
  };

  if (admin) return <Navigate to="/system/admin" replace={true} />;

  return (
    <motion.form
      initial={{ y: "100%", opacity: 0 }}
      animate={{ y: "0%", opacity: 1 }}
      onSubmit={handleAdminLogin}
      className=" flex flex-col gap-6  shadow-lg border-2 bg-black border-custom-light-green  w-80 px-6 pt-12 pb-6 rounded-md  "
    >
      <FormItem
        id="adminName"
        label="Username"
        placeholder="Enter a Username..."
        value={username}
        onChange={(event) => setUsername(event.target.value)}
      />
      <FormItem
        id="password"
        label="Password"
        placeholder="Enter a Password..."
        value={password}
        type="password"
        onChange={(event) => setPassword(event.target.value)}
      />
      <button className="text-black bg-custom-light-green px-4 py-2 rounded-md">
        Login
      </button>
    </motion.form>
  );
}

function SystemAdmin() {
  const { user } = useAppSelector((state) => state.auth);
  if (user) return <Navigate to={"/login"} replace={true} />;
  return (
    <section className="grid place-content-center w-full h-full">
      <CustomToastify />
      <SystemAdminForm />
    </section>
  );
}

export default SystemAdmin;
