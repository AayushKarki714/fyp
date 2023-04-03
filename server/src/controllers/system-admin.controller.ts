import { NextFunction, Request, Response, query } from "express";
import Api400Error from "../utils/api400Error";
import prisma from "../utils/prisma";
import Api401Error from "../utils/api401Error";
import generateToken from "../utils/generateToken";
import verifyPassword from "../utils/verifyPassword";
import { User } from "@prisma/client";

function decodeCount(countObj: any) {
  return countObj._count._all ?? 0;
}

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

async function handleSystemAdminLogin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { username, password } = req.body;
  if (!username || !password)
    throw new Api400Error("Username and Password must be Provided!!");

  const systemAdmin = await prisma.admin.findFirst({
    where: { username },
  });

  if (!systemAdmin) throw new Api401Error("You are not allowed to Login");
  await verifyPassword(password, systemAdmin.password);
  const token = generateToken({ id: systemAdmin.id });

  return res.status(200).json({
    message: "Logged in SuccessFully as a System Admin",
    data: { token, id: systemAdmin.id, username: systemAdmin.username },
  });
}

async function getAllRegisteredUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { page } = req.query;
  const pageCount = 10;
  const registeredUser = await prisma.user.findMany({
    skip: (Number(page) - 1) * pageCount,
    take: pageCount,
  });
  return res.json({
    message: "All Registered User Fetched Successfully",
    data: registeredUser,
  });
}

async function getAllWorkspace(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { page } = req.query;
  const pageCount = 4;
  const workspaces = await prisma.workspace.findMany({
    skip: (Number(page) - 1) * pageCount,
    take: pageCount,
  });

  return res.json({
    message: "All Registered User Fetched Successfully",
    data: workspaces,
  });
}

async function deRegisterUser(req: Request, res: Response, next: NextFunction) {
  const { userId } = req.params;
  console.log({ userId });
  const deletedUser = await prisma.user.delete({ where: { id: userId } });
  return res
    .status(200)
    .json({ message: "De-Registered User Successfully", data: deletedUser });
}

async function deleteWorkspace(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { workspaceId } = req.params;
  const deletedWorkspace = await prisma.workspace.delete({
    where: {
      id: workspaceId,
    },
  });
  return res.status(200).json({
    message: "Deleted Workspace Successfully",
    data: deletedWorkspace,
  });
}

async function getTotalWorkspaceandUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const user = await prisma.user.aggregate({
    _count: {
      _all: true,
    },
  });
  const workspace = await prisma.workspace.aggregate({
    _count: {
      _all: true,
    },
  });
  const userCount = user._count._all ?? 0;
  const workspaceCount = workspace._count._all ?? 0;

  return res.status(200).json({
    message: "Count Fetched Successfully",
    data: { userCount, workspaceCount },
  });
}

async function getAdditionalWorkspaceDetails(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { workspaceId } = req.params;

  const todoContainer = await prisma.todoContainer.aggregate({
    where: {
      workspaceId,
    },
    _count: {
      _all: true,
    },
  });

  const progressContainer = await prisma.progressContainer.aggregate({
    where: {
      workspaceId,
    },
    _count: {
      _all: true,
    },
  });

  const galleryContainer = await prisma.galleryContainer.aggregate({
    where: {
      workspaceId,
    },
    _count: {
      _all: true,
    },
  });

  const members = await prisma.member.findMany({
    where: {
      workspaceId,
      recieverInvitations: {
        some: {
          status: "ACCEPTED",
        },
      },
    },
    include: {
      user: true,
    },
  });

  return res.status(200).json({
    message: "fetched Successfully",
    data: {
      members,
      galleryContainerCount: decodeCount(galleryContainer),
      todoContainerCount: decodeCount(todoContainer),
      progressContainerCount: decodeCount(progressContainer),
    },
  });
}

async function getUsersRegisteredByMonth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const startOfYear = new Date(new Date().getFullYear(), 0, 1); // January 1st of this year
  const endOfYear = new Date(new Date().getFullYear() + 1, 0, 1); // January 1st

  const users = await prisma.user.findMany({
    select: {
      id: true,
      createdAt: true,
    },
    where: {
      createdAt: {
        gte: startOfYear,
        lt: endOfYear,
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const usersByMonth = users.reduce((acc: any, user) => {
    const monthIdx = user.createdAt.getMonth();
    const key = months[monthIdx];
    if (!acc[key]) {
      acc[key] = 0;
    }
    acc[key]++;
    return acc;
  }, {});

  return res
    .status(200)
    .json({ message: "data fetched successfully", data: usersByMonth });
}

async function getWorkspaceRegisteredByMonth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const startOfYear = new Date(new Date().getFullYear(), 0, 1);
  const endOfYear = new Date(new Date().getFullYear() + 1, 0, 1);
  const workspaces = await prisma.workspace.findMany({
    where: {
      createdAt: {
        gte: startOfYear,
        lte: endOfYear,
      },
    },
  });
  const workspaceByMonth = workspaces.reduce((acc: any, workspace) => {
    const monthIdx = workspace.createdAt.getMonth();
    const key = months[monthIdx];
    if (!acc[key]) {
      acc[key] = 0;
    }
    acc[key]++;
    return acc;
  }, {});
  return res
    .status(200)
    .json({ message: "Workspace by Month", data: workspaceByMonth });
}

async function getWorkspaceBySearch(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { searchTerm } = req.params;
  if (!searchTerm) throw new Api400Error("Search Term was not Provided");

  const searchResults = await prisma.workspace.findMany({
    where: {
      name: {
        contains: searchTerm,
      },
    },
    include: {
      admin: {
        select: {
          photo: true,
          email: true,
          userName: true,
        },
      },
    },
  });
  return res.status(200).json({
    message: "Search Results Fetched Successfully",
    data: searchResults,
  });
}

async function getUserBySearch(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { searchTerm } = req.params;
  if (!searchTerm) throw new Api400Error("Search Term was not Provided");

  const searchResults = await prisma.user.findMany({
    where: {
      OR: [
        {
          userName: {
            contains: searchTerm.toUpperCase(),
          },
        },
        {
          userName: {
            contains: searchTerm,
          },
        },
        {
          userName: {
            contains: searchTerm.toLowerCase(),
          },
        },
      ],
    },
  });

  return res.status(200).json({
    message: "Search Results Fetched Successfully",
    data: searchResults,
  });
}

async function getUserById(req: Request, res: Response, next: NextFunction) {
  const { userId } = req.params;
  if (!userId) throw new Api400Error("User Id was not Provided!!");
  const findWorkspace = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  return res
    .status(200)
    .json({ message: "Workspace by Id", data: findWorkspace });
}
export {
  handleSystemAdminLogin,
  getAllRegisteredUser,
  getAllWorkspace,
  deRegisterUser,
  deleteWorkspace,
  getTotalWorkspaceandUser,
  getAdditionalWorkspaceDetails,
  getUsersRegisteredByMonth,
  getWorkspaceRegisteredByMonth,
  getWorkspaceBySearch,
  getUserBySearch,
};
