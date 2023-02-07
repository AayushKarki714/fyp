import { makeRequest, makeRequestFn } from "../api/makeRequest";
import { POST_OPTIONS } from "../utils/options";

async function createWorkspace(data: any) {
  return await makeRequest("/workspace/create-workspace", {
    method: "POST",
    data: data,
  });
}

interface Props {
  userId: string;
  workspaceId: string;
}

function addMember({ userId, workspaceId }: Props) {
  return makeRequestFn(
    `/workspace/${userId}/${workspaceId}/add-members`,
    POST_OPTIONS
  );
}

export { createWorkspace, addMember };
