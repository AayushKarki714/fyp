import React, { useEffect } from "react";
import { useQuery } from "react-query";
import { Routes, Route } from "react-router-dom";
import axios from "./api/axios";
import Login from "./pages/Login";
import NotFound from "./pages/404";
import Dashboard from "./components/Dashboard";
import Home from "./pages/Home";
import Chat from "./components/Chat";
import Todo from "./components/Todo";
import Gallery from "./components/Gallery";
import Progress from "./components/Progress";
import CreateWorkspace from "./components/CreateWorkspace";
import NestedLayout from "./components/NestedLayout";

import { useAppDispatch } from "./redux/store/hooks";
import { updateUser } from "./redux/slices/authSlice";
import Setting from "./components/Setting";

const App: React.FC = () => {
  const dispatch = useAppDispatch();

  const { data } = useQuery("user-data", async function () {
    const res = await axios.get("/auth/user");
    return res.data;
  });

  useEffect(() => {
    if (data?.user) {
      dispatch(updateUser(data?.user));
    }
  }, [data?.user, dispatch]);

  return (
    <main className="h-screen overflow-hidden bg-[#18191a] text-white font-poppins">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />}>
          <Route element={<NestedLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="chat" element={<Chat />} />
            <Route path="todo" element={<Todo />} />
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
