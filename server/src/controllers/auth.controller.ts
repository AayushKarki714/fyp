import { NextFunction, RequestHandler, Request, Response } from "express";
import prisma from "../utils/prisma";

const getUserData: RequestHandler = async function (req, res) {
  return res.status(200).json({ user: req.user });
};

const handleLogout: RequestHandler = function (req, res) {
  (req as any).logout();
  return res.status(200).json({ message: "You Loggedout SuccessFully" });
};

async function handleIfEmailExists(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { emailValue } = req.params;
  const emailExists = await prisma.user.findUnique({
    where: { email: emailValue },
  });

  if (!emailExists)
    return res.status(400).json({ message: "User is not registered" });

  return res.status(200).json({ message: "Email is Valid" });
}

export { handleLogout, getUserData, handleIfEmailExists };
