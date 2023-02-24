import prisma from "./prisma";
import Api403Error from "./api403Error";
import { Role } from "@prisma/client";

async function verifyRole(
  role: Role[],
  workspaceId: string,
  userId: string
): Promise<any> {
  const findUser = await prisma.member.findUnique({
    where: { workspaceId_userId: { workspaceId, userId } },
  });
  const assignedRole = findUser!.role;

  const isAllowed = role.includes(assignedRole);

  if (!isAllowed) {
    throw new Api403Error(
      `Member with the role: ${assignedRole} is restricted to perform the Following Tasks`
    );
  }
  return assignedRole;
}

export default verifyRole;
