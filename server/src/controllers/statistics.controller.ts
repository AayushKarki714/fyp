import { NextFunction, Response, Request } from "express";
import prisma from "../utils/prisma";
import { Role } from "@prisma/client";

async function getPopularUsersByRole(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { role } = req.params;
  console.log({ role });
  const popular = await prisma.member.groupBy({
    by: ["userId"],
    where: {
      role: role as Role,
      recieverInvitations: {
        some: {
          status: "ACCEPTED",
        },
      },
    },
    _count: {
      _all: true,
    },
    orderBy: {
      _count: {
        userId: "desc",
      },
    },
    take: 10,
  });
  const finalData = await Promise.all(
    popular.map(async (data) => {
      const {
        userId,
        _count: { _all: totalCount },
      } = data;
      const memberData = await prisma.user.findUnique({
        where: { id: userId },
      });
      return { ...memberData, totalCount };
    })
  );

  return res.status(200).json({
    message: `Top 10 most popular member by ${role}`,
    data: finalData,
  });
}
export { getPopularUsersByRole };
