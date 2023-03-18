import React from "react";
import { useQuery } from "react-query";

function SystemAdminDashboard() {
  const { data } = useQuery("total-count", async () => {});
  return (
    <div>
      <div>
        <h2>Total Users</h2>
      </div>
      <div>
        <h2>Total Workspaces</h2>
      </div>
    </div>
  );
}

export default SystemAdminDashboard;
