import React from "react";
import useNavigateToDashboard from "../hooks/useNavigateToDashboard";
import { useAppSelector } from "../redux/store/hooks";

const Setting = () => {
  const { workspaceId } = useAppSelector((state) => state.workspace);
  console.log(workspaceId);

  useNavigateToDashboard();

  return <div>Setting</div>;
};

export default Setting;
