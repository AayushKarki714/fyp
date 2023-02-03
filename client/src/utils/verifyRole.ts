import { Role } from "../redux/slices/workspaceSlice";

function verifyRole(role: Role, allowedRoles: Role[]) {
  return allowedRoles.includes(role);
}

export default verifyRole;
