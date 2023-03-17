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
  console.log({ username, password });
  if (!username || !password)
    throw new Api400Error("Username and Password must be Provided!!");

  const systemAdmin = await prisma.admin.findFirst({
    where: { username },
  });

  if (!systemAdmin) throw new Api401Error("You are not allowed to Login");
  await verifyPassword(password, systemAdmin.password);
  const token = generateToken({ id: systemAdmin.id });

  return res
    .status(200)
    .json({ message: "Logged in SuccessFully as a System Admin", token });
}

async function getAdmin(req: Request, res: Response, next: NextFunction) {
  const id = (req as any).userId.id;
  if (!id) throw new Api400Error("Id was not Provided");
  const admin = await prisma.admin.findUnique({
    where: { id },
    select: { id: true, username: true },
  });
  if (!admin) throw new Api400Error("Admin was not Found");
  return res.status(200).json({ message: "Admin Data", data: admin });
}

export { handleSystemAdminLogin, getAdmin };
