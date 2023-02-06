import { Request, Response, NextFunction } from "express";
import path from "path";
import prisma from "../utils/prisma";
import checkIfUserIdMatches from "../utils/checkIfUserIdMatches";
import verifyRole from "../utils/verifyRole";
import { Role } from "@prisma/client";
import { pid } from "process";
import BaseError from "../utils/baseError";

async function handleCreateWorkspace(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { name, lancerValues, clientValues, adminId } = req.body;
  const files = req.files!;
  const file = files[Object.keys(files)[0]] as any;
  const filePath = path.join(__dirname, "..", "..", "public", file.name);

  file.mv(filePath, (err: any) => {
    if (err) return res.status(400).json({ message: "Invalid Logo" });
  });

  const workspace = await prisma.workspace.create({
    data: {
      name: name,
      logo: `http://localhost:8000/${file.name}`,
      adminId: adminId,
    },
  });

  const lancers = JSON.parse(lancerValues).map(async (lancer: any) => {
    const val = await prisma.user.findUnique({
      where: { email: lancer.email },
    });
    return { userId: val?.id, role: "LANCER", workspaceId: workspace.id };
  });

  const clients = JSON.parse(clientValues).map(async (lancer: any) => {
    const val = await prisma.user.findUnique({
      where: { email: lancer.email },
    });
    return { userId: val?.id, role: "CLIENT", workspaceId: workspace.id };
  });

  const lancersData = await Promise.all(lancers);
  const clientsData = await Promise.all(clients);

  await prisma.member.createMany({
    data: [
      {
        userId: (req.user as any).id,
        role: "ADMIN",
        workspaceId: workspace.id,
      },
      ...lancersData,
      ...clientsData,
    ],
  });

  return res.status(200).json({ workspace });
}

async function handleGetWorkspace(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { userId } = req.params;

  const members = await prisma.member.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      workspace: {
        include: {
          admin: true,
        },
      },
    },
  });

  const membersWithTotalCount = members.map(async (member) => {
    const totalCount = await prisma.member.groupBy({
      by: ["workspaceId"],
      where: { workspaceId: member.workspace.id },
      _count: {
        _all: true,
      },
    });
    return { ...member, totalMember: totalCount[0]._count._all ?? 0 };
  });

  const finalData = await Promise.all(membersWithTotalCount);

  return res.status(200).json({ data: finalData });
}

async function handleDeleteWorkspace(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { workspaceId, userId } = req.params;

  checkIfUserIdMatches(req, userId);
  await verifyRole(["ADMIN", "LANCER"], workspaceId, userId);

  const deleteWorkspace = await prisma.workspace.delete({
    where: { id: workspaceId },
  });

  return res
    .status(200)
    .json({ message: `${deleteWorkspace.name} was deleted Successfully!!` });
}

async function handleUpdateWorkspaceTitle(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { name } = req.body;
  const { workspaceId, userId } = req.params;

  checkIfUserIdMatches(req, userId);
  await verifyRole(["ADMIN", "LANCER"], workspaceId, userId);

  if (!name)
    return res.status(400).json({ message: "Updated title can't be Emtpy" });

  const member = await prisma.member.findFirst({
    where: { userId, workspaceId },
  });

  const updateWorkspace = await prisma.workspace.update({
    data: { name },
    where: { id: workspaceId },
  });

  return res
    .status(200)
    .json({ message: `${updateWorkspace.name} was updated Successfully!!` });
}

// async function handleAddMembers(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   const { workspaceId, userId } = req.params;
//   const { addedUsers, role } = req.body;

//   checkIfUserIdMatches(req, userId);
//   await verifyRole(["ADMIN"], workspaceId, userId);

//   const addedUserId: string[] = await Promise.all(
//     addedUsers.map(async (userEmail: string) => {
//       const findUser = await prisma.user.findUnique({
//         where: { email: userEmail },
//       });
//       return findUser?.id;
//     })
//   );

//   console.log("addedUserId", addedUserId);

//   const updateWorkspace = await prisma.workspace.update({
//     data: {
//       Member: {
//         createMany: {
//           data: await Promise.all(
//             addedUserId.map(async (user: any, index: number) => {
//               return await prisma.member.create({
//                 data: {
//                   userId: addedUserId[index],
//                   role: Role.LANCER,
//                   workspaceId,
//                 },
//               });
//             })
//           ),
//         },
//       },
//     },
//     where: {
//       id: workspaceId,
//     },
//   });

//   return res
//     .status(200)
//     .json({ message: "SucessFully Fetched my boi", data: updateWorkspace });
// }

async function handleAddMembers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { addedUsers, role } = req.body;
  const { userId, workspaceId } = req.params;

  checkIfUserIdMatches(req, userId);
  await verifyRole(["ADMIN"], workspaceId, userId);

  const addedUsersId = await Promise.all(
    addedUsers?.map(async (userEmail: any) => {
      return await prisma.user.findUnique({
        where: { email: userEmail },
        select: { id: true },
      });
    })
  );
  const newMembersData = addedUsers.map((_: any, index: number) => {
    return {
      workspaceId,
      userId: addedUsersId[index].id,
      role: role as Role,
    };
  });

  const addedMembers = await prisma.member.createMany({
    data: newMembersData,
  });

  return res.status(200).json({
    message: `The new User with the Role ${role} added SucessFully`,
    data: addedMembers,
  });
}

export {
  handleCreateWorkspace,
  handleGetWorkspace,
  handleDeleteWorkspace,
  handleUpdateWorkspaceTitle,
  handleAddMembers,
};
