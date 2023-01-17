import cogoToast from "cogo-toast";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../redux/store/hooks";

function useNavigateToDashboard() {
  const navigate = useNavigate();
  const { workspaceId } = useAppSelector((state) => state.workspace);
  useEffect(() => {
    if (!workspaceId) {
      cogoToast.info("Please Select Workspace First");
      navigate("/dashboard", { replace: true });
    }
  }, [navigate, workspaceId]);
}

export default useNavigateToDashboard;
