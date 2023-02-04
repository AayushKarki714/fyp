import { makeRequest } from "../api/makeRequest";

async function createWorkspace(data: any) {
  return await makeRequest("/workspace/create-workspace", {
    method: "POST",
    data: data,
  });
}

export { createWorkspace };
