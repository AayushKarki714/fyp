import React, { useEffect } from "react";
import { useQuery } from "react-query";
import { Routes, Route, useLocation } from "react-router-dom";
import axios from "./api/axios";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import Gallery from "./pages/Gallery";
import Progress from "./pages/Progress";
import CreateWorkspace from "./pages/CreateWorkspace";
import NestedLayout from "./components/NestedLayout";
import { useAppDispatch } from "./redux/store/hooks";
import { updateUser } from "./redux/slices/authSlice";
import Setting from "./pages/Setting";
import TodoPage from "./pages/Todo";
import "./styles/comments.css";
import socket from "./api/socket";
import SystemAdminLogin from "./pages/SystemAdminLogin";
import SystemAdmin from "./pages/SystemAdmin";
import AdminContextProvider from "./context/AdminContext";
import WorkspaceDetailed from "./pages/WorkspaceDetailed";
import UserDetailed from "./pages/UserDetailed";

const Login = React.lazy(() => import("./pages/Login"));
const NotFound = React.lazy(() => import("./pages/404"));
const Home = React.lazy(() => import("./pages/Home"));

const App: React.FC = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();

  const { data } = useQuery(
    "user-data",
    async function () {
      const res = await axios.get("/auth/user");
      return res.data;
    },
    { enabled: !location.pathname.includes("system") }
  );

  useEffect(() => {
    if (data?.user) {
      dispatch(updateUser(data?.user));
    }
  }, [data?.user, dispatch]);

  return (
    <main className="h-screen overflow-hidden bg-[#18191a] font-poppins text-base">
      {/* All the System Admin Related code are here */}
      <Routes>
        <Route
          path="/system/admin/login"
          element={
            <AdminContextProvider>
              <SystemAdminLogin />
            </AdminContextProvider>
          }
        />
        <Route
          path="/system/admin"
          element={
            <AdminContextProvider>
              <SystemAdmin />
            </AdminContextProvider>
          }
        />
        <Route
          path="/system/admin/workspace/:workspaceId"
          element={
            <AdminContextProvider>
              <WorkspaceDetailed />
            </AdminContextProvider>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />}>
          <Route element={<NestedLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="chat" element={<Chat socket={socket} />} />
            <Route path="todo" element={<TodoPage />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="progress" element={<Progress />} />
            <Route path="setting" element={<Setting />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="create-workspace" element={<CreateWorkspace />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
  );
};

export default App;
