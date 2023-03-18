import { NextFunction, Request, Response } from "express";
import Api400Error from "../utils/api400Error";
import prisma from "../utils/prisma";
import Api401Error from "../utils/api401Error";
import generateToken from "../utils/generateToken";
import verifyPassword from "../utils/verifyPassword";

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
  const registeredUser = await prisma.user.findMany();
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
  const workspaces = await prisma.workspace.findMany({
    include: {
      Member: true,
    },
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
  console.log({ deletedUser });
  return res
    .status(200)
    .json({ message: "De-Registered User Successfully", data: deletedUser });
}

export {
  handleSystemAdminLogin,
  getAllRegisteredUser,
  getAllWorkspace,
  deRegisterUser,
};
