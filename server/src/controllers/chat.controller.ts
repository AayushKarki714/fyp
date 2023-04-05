import { ChatType, ChatWithMember, Role } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import Api400Error from "../utils/api400Error";
import checkIfUserIdMatches from "../utils/checkIfUserIdMatches";
import prisma from "../utils/prisma";
import verifyRole from "../utils/verifyRole";

function getAllowedRole(chatType: ChatType) {
  let allowedRoles;
  if (chatType === ChatType.ALL)
    allowedRoles = [Role.ADMIN, Role.LANCER, Role.CLIENT];
  else if (chatType === ChatType.LANCERS)
    allowedRoles = [Role.ADMIN, Role.LANCER];
  else {
    allowedRoles = [Role.ADMIN, Role.CLIENT];
  }
  return allowedRoles;
}

async function getAllChat(req: Request, res: Response, next: NextFunction) {
  const { workspaceId, userId } = req.params;
  checkIfUserIdMatches(req, userId);
  const chats = await prisma.chat.findMany({ where: { workspaceId } });
  return res.status(200).json({ data: chats, message: "Fetched Sucessfully" });
}

async function getAllMembersInChat(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { userId, chatId, workspaceId, chatType } = req.params;
  checkIfUserIdMatches(req, userId);
  const allowedRoles = getAllowedRole(chatType as ChatType);
  await verifyRole(allowedRoles, workspaceId, userId);

  const findChat = await prisma.chat.findUnique({ where: { id: chatId } });

  if (findChat?.workspaceId !== workspaceId)
    throw new Api400Error("Underlying workspace Id was not found!!");

  const allMembers = await prisma.chatWithMember.findMany({
    where: {
      chatId,
      member: {
        recieverInvitations: {
          some: {
            status: {
              in: ["ACCEPTED"],
            },
          },
        },
      },
    },
    select: {
      member: {
        include: {
          user: true,
        },
      },
      chat: true,
    },
  });

  console.log({ allMembers });

  return res.status(200).json({ data: allMembers });
}

async function handleSendMessageInChat(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { userId, chatId, workspaceId } = req.params;
  const { message, memberId, chatType } = req.body;

  checkIfUserIdMatches(req, userId);
  const allowedRoles = getAllowedRole(chatType);
  await verifyRole(allowedRoles, workspaceId, userId);

  if (!message)
    return res.status(400).json({ message: "Message can't be empty" });

  const chatMessage = await prisma.chatMessage.create({
    data: {
      message,
      chatId,
      memberId,
    },
  });

  return res
    .status(200)
    .json({ message: "Message Sent Succesfully", data: chatMessage });
}

async function getAllMessagesInChat(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { workspaceId, chatId, userId, chatType } = req.params;
  checkIfUserIdMatches(req, userId);
  const allowedRoles = getAllowedRole(chatType as ChatType);
  await verifyRole(allowedRoles, workspaceId, userId);

  const chatMessages = await prisma.chatMessage.findMany({
    where: {
      chatId,
    },
    orderBy: {
      createdAt: "asc",
    },
    include: {
      member: {
        include: {
          user: true,
        },
      },
    },
  });

  return res
    .status(200)
    .json({ message: "Chat Messages Fetched Sucessfully", data: chatMessages });
}

async function handleDeleteChatMessage(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { userId, workspaceId, chatMessageId } = req.params;
  checkIfUserIdMatches(req, userId);
  await verifyRole([Role.ADMIN], workspaceId, userId);

  const deleteChatMessage = await prisma.chatMessage.delete({
    where: { id: chatMessageId },
  });

  return res.status(200).json({
    message: "Chat Message was deleted Succesfully!!",
    data: deleteChatMessage,
  });
}

export {
  getAllChat,
  getAllMembersInChat,
  getAllMessagesInChat,
  handleSendMessageInChat,
  handleDeleteChatMessage,
};
