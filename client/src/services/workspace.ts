import { makeRequest, makeRequestFn } from "../api/makeRequest";
import { DELETE_OPTIONS, POST_OPTIONS } from "../utils/options";

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

interface RemoveMemberProps extends Props {
  memberId: string;
}

function removeMember({ userId, workspaceId, memberId }: RemoveMemberProps) {
  return makeRequestFn(
    `/workspace/${userId}/${workspaceId}/${memberId}/delete-member`,
    DELETE_OPTIONS
  );
}

export { createWorkspace, addMember, removeMember };
