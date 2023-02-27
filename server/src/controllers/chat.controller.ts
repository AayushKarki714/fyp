import { Request, Response, NextFunction } from "express";
import checkIfUserIdMatches from "../utils/checkIfUserIdMatches";
import prisma from "../utils/prisma";

async function getAllChat(req: Request, res: Response, next: NextFunction) {
  const { workspaceId, userId } = req.params;
  checkIfUserIdMatches(req, userId);
  const chats = await prisma.chat.findMany({ where: { workspaceId } });
  return res.status(200).json({ data: chats, message: "Fetched Sucessfully" });
}

export { getAllChat };
