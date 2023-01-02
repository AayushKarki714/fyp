import React, { useEffect } from "react";
import { useQuery } from "react-query";
import { Routes, Route } from "react-router-dom";
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

const Login = React.lazy(() => import("./pages/Login"));
const NotFound = React.lazy(() => import("./pages/404"));
const Home = React.lazy(() => import("./pages/Home"));

const App: React.FC = () => {
  const dispatch = useAppDispatch();

  const { data } = useQuery(
    "user-data",
    async function () {
      const res = await axios.get("/auth/user");
      return res.data;
    },
    {}
  );

  useEffect(() => {
    if (data?.user) {
      dispatch(updateUser(data?.user));
    }
  }, [data?.user, dispatch]);

  return (
    <main className="h-screen overflow-hidden bg-[#18191a] font-poppins text-base">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />}>
          <Route element={<NestedLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="chat" element={<Chat />} />
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
