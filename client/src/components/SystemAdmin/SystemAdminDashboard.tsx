import { useQuery } from "react-query";
import systemAxios from "../../api/systemAxios";
import { useSystemAdmin } from "../../context/AdminContext";
import Spinner from "../Spinner/Spinner";
import UserChart from "./UserChart";
import WorkspaceChart from "./WorkspaceChart";

function SystemAdminDashboard() {
  const { admin } = useSystemAdmin();

  const { data, isLoading } = useQuery("total-count", async () => {
    const res = await systemAxios.get("/system-admin/workspace/user/count", {
      headers: {
        authorization: `Bearer ${(admin as any).token}`,
      },
    });
    return res.data?.data;
  });

  const { data: userChartData, isLoading: isUserChartDataLoading } = useQuery(
    "user-chart-data",
    async () => {
      const res = await systemAxios.get("/system-admin/userbymonth", {
        headers: {
          authorization: `Bearer ${(admin as any).token}`,
        },
      });
      return res.data?.data;
    }
  );

  const { data: workspaceChartData, isLoading: isWorkspaceChartLoading } =
    useQuery("workspace-chart-data", async () => {
      const res = await systemAxios.get("/system-admin/workspacebyMonth", {
        headers: {
          authorization: `Bearer ${(admin as any).token}`,
        },
      });
      return res.data?.data;
    });

  if (isLoading) return <Spinner isLoading={isLoading} />;
  if (isUserChartDataLoading)
    return <Spinner isLoading={isUserChartDataLoading} />;
  if (isWorkspaceChartLoading)
    return <Spinner isLoading={isWorkspaceChartLoading} />;
  return (
    <div>
      <div className="flex gap-8 items-center justify-center">
        <div className="flex gap-2 flex-col items-center">
          <h2 className="text-xl text-gray-400">Total Users</h2>
          <p className="text-5xl text-custom-light-green">
            {String(data?.userCount).padStart(2, "0")}
          </p>
        </div>
        <div className="flex flex-col gap-2 items-center">
          <h2 className="text-xl text-gray-400">Total Workspaces</h2>
          <p className="text-5xl text-custom-light-green">
            {String(data?.workspaceCount).padStart(2, "0")}
          </p>
        </div>
      </div>
      <UserChart data={userChartData} />
      <WorkspaceChart data={workspaceChartData} />
    </div>
  );
}

export default SystemAdminDashboard;
