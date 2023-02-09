import prisma from "../utils/prisma";
import { Request, Response, NextFunction } from "express";
import checkIfUserIdMatches from "../utils/checkIfUserIdMatches";

async function handleMarkReadNotification(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { userId } = req.params;
  checkIfUserIdMatches(req, userId);

  const updateNotifications = await prisma.notification.updateMany({
    where: {
      userId,
    },
    data: {
      read: true,
    },
  });

  return res.status(200).json({
    message: "Mark as Read Notification SucessFully",
    data: updateNotifications,
  });
}

async function getUnreadNotificationCount(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { userId } = req.params;
  checkIfUserIdMatches(req, userId);

  const unreadNotificationCount = await prisma.notification.groupBy({
    by: ["userId"],
    where: {
      userId,
      read: false,
    },

    _count: {
      _all: true,
    },
  });

  return res.status(200).json({
    message: "Unread Notification Count",
    data: unreadNotificationCount[0]?._count?._all ?? 0,
  });
}

async function getNotificationsByUserId(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { userId } = req.params;
  checkIfUserIdMatches(req, userId);

  const notifications = await prisma.notification.findMany({
    where: {
      userId,
    },
    orderBy: [{ createdAt: "desc" }, { updatedAt: "desc" }],
    include: {
      workspace: true,
    },
  });

  return res
    .status(200)
    .json({ data: notifications, message: "Notification Fetched SucessFully" });
}

export {
  getNotificationsByUserId,
  handleMarkReadNotification,
  getUnreadNotificationCount,
};
