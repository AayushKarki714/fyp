import { Request, Response, NextFunction } from "express";
import path from "path";
import prisma from "../utils/prisma";
import checkIfUserIdMatches from "../utils/checkIfUserIdMatches";
import verifyRole from "../utils/verifyRole";
import { InvitationStatus, NotificationType, Role } from "@prisma/client";
import Api400Error from "../utils/api400Error";

async function handleCreateWorkspace(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { name, lancerValues, clientValues, adminId } = req.body;
  checkIfUserIdMatches(req, adminId);

  const files = req.files!;
  const file = files[Object.keys(files)[0]] as any;
  const filePath = path.join(__dirname, "..", "..", "public", file.name);

  file.mv(filePath, (err: any) => {
    if (err) return res.status(400).json({ message: "Invalid Logo" });
  });

  const newWorkspace = await prisma.workspace.create({
    data: {
      name,
      logo: `http://localhost:8000/${file.name}`,
      adminId,
    },
  });

  const lancers = JSON.parse(lancerValues).map(async (lancer: any) => {
    const val = await prisma.user.findUnique({
      where: { email: lancer.email },
    });
    return { userId: val?.id, role: "LANCER", workspaceId: newWorkspace.id };
  });

  const clients = JSON.parse(clientValues).map(async (lancer: any) => {
    const val = await prisma.user.findUnique({
      where: { email: lancer.email },
    });
    return { userId: val?.id, role: "CLIENT", workspaceId: newWorkspace.id };
  });

  const lancersData = await Promise.all(lancers);
  const clientsData = await Promise.all(clients);

  const membersData = lancersData.concat(clientsData).concat({
    userId: adminId,
    role: "ADMIN",
    workspaceId: newWorkspace.id,
  });

  const members = await prisma.$transaction(
    membersData.map((memberData) =>
      prisma.member.create({ data: { ...memberData } })
    )
  );

  const adminMember = members.find((member) => member.role === Role.ADMIN);

  const invitations = await prisma.$transaction(
    members.map((member) =>
      prisma.invitation.create({
        data: {
          message:
            member.id === adminMember!.id
              ? `You created a Workspace named ${newWorkspace.name} SuccesFully`
              : `You are invited as a ${member.role} in ${newWorkspace.name}`,
          receiverId: member.id,
          senderId: adminMember!.id,
          status:
            member.id === adminMember!.id
              ? InvitationStatus.ACCEPTED
              : InvitationStatus.PENDING,
        },
        include: {
          reciever: true,
          sender: true,
        },
      })
    )
  );

  console.log("invitations", invitations);

  const notifications = await prisma.$transaction(
    invitations.map((invitation) =>
      prisma.notification.create({
        data: {
          invitationId: invitation.id,
          message: invitation.message,
          recieverId: invitation.reciever.userId,
          senderId: invitation.sender.userId,
          type:
            invitation.reciever.userId === invitation.sender.userId
              ? NotificationType.NORMAL
              : NotificationType.INVITATION,
        },
      })
    )
  );

  console.log("notifications", notifications);

  return res.status(200).json({ workspace: newWorkspace });
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
      recieverInvitations: {
        every: {
          status: "ACCEPTED",
        },
      },
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
      where: {
        workspaceId: member.workspace.id,
        recieverInvitations: {
          every: {
            status: "ACCEPTED",
          },
        },
      },
      _count: {
        _all: true,
      },
    });
    return { ...member, totalMember: totalCount[0]?._count?._all ?? 0 };
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
  await verifyRole(["ADMIN"], workspaceId, userId);

  if (!name)
    return res.status(400).json({ message: "Updated title can't be Emtpy" });

  const member = await prisma.member.findUnique({
    where: { workspaceId_userId: { workspaceId, userId } },
  });

  const updateWorkspace = await prisma.workspace.update({
    data: { name },
    where: { id: workspaceId },
  });

  return res
    .status(200)
    .json({ message: `${updateWorkspace.name} was updated Successfully!!` });
}

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

  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
  });

  if (!workspace)
    throw new Api400Error("Workspace with the Id Provided Id was not Found");

  const newMembersData = addedUsers.map((_: any, index: number) => {
    return {
      workspaceId: workspace.id,
      userId: addedUsersId[index].id,
      role: role as Role,
    };
  });

  const addedMembers = await prisma.$transaction(
    newMembersData.map((newMemberData: any) =>
      prisma.member.upsert({
        where: {
          workspaceId_userId: { workspaceId, userId: newMemberData.userId },
        },
        update: {
          role: role as Role,
        },
        create: {
          ...newMemberData,
        },
      })
    )
  );

  const adminMember = await prisma.member.findUnique({
    where: { workspaceId_userId: { workspaceId, userId } },
  });

  const invitationData = await prisma.$transaction(
    addedMembers.map((addedMember) =>
      prisma.invitation.create({
        data: {
          message: `You are invited as a ${addedMember.role} in ${workspace.name}`,
          receiverId: addedMember.id,
          senderId: adminMember!.id,
        },
        include: {
          reciever: true,
          sender: true,
        },
      })
    )
  );

  await prisma.$transaction(
    invitationData.map((invitation) =>
      prisma.notification.create({
        data: {
          invitationId: invitation.id,
          message: invitation.message,
          recieverId: invitation.reciever.userId,
          senderId: invitation.sender.userId,
          type: NotificationType.INVITATION,
        },
      })
    )
  );

  return res.status(200).json({
    message: `The new User with the Role ${role} added SucessFully`,
    data: addedMembers,
  });
}

async function checkIfEmailAvailable(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { email, workspaceId } = req.params;
  const findUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!findUser) {
    throw new Api400Error("User doesn't Exist ");
  }
  const isAlreadyMember = await prisma.member.findUnique({
    where: {
      workspaceId_userId: { workspaceId, userId: findUser.id },
    },
    include: {
      recieverInvitations: {
        select: {
          status: true,
        },
      },
    },
  });

  if (isAlreadyMember?.recieverInvitations[0].status === "ACCEPTED") {
    throw new Api400Error("Already Part of the Workspace");
  }

  if (isAlreadyMember?.recieverInvitations[0].status === "PENDING") {
    throw new Api400Error("Already Invited, Pending State");
  }

  return res.status(200).json({ message: "Email is Allowed to Add" });
}

async function getAllMembers(req: Request, res: Response, next: NextFunction) {
  const { userId, workspaceId } = req.params;

  checkIfUserIdMatches(req, userId);
  await verifyRole(["ADMIN"], workspaceId, userId);

  const findMembers = await prisma.member.findMany({
    where: {
      workspaceId: workspaceId,
      recieverInvitations: {
        every: {
          status: "ACCEPTED",
        },
      },
      NOT: { role: "ADMIN" },
    },
    select: {
      role: true,
      createdAt: true,
      workspaceId: true,
      userId: true,
      user: {
        select: {
          id: true,
          photo: true,
          userName: true,
        },
      },
    },
  });

  return res.status(200).json({
    message: `Get all users in the Workspace `,
    data: findMembers,
  });
}

async function deleteMember(req: Request, res: Response, next: NextFunction) {
  const { workspaceId, userId, memberId } = req.params;
  checkIfUserIdMatches(req, userId);
  await verifyRole(["ADMIN"], workspaceId, userId);

  const deleteMember = await prisma.member.delete({
    where: {
      workspaceId_userId: { workspaceId, userId: memberId },
    },
  });

  return res.status(200).json({
    message: `The member with the role ${deleteMember.role} was SuccesFully removed `,
    data: deleteMember,
  });
}

async function appointAsAdmin(req: Request, res: Response, next: NextFunction) {
  const { userId, workspaceId } = req.params;
  const { newAdminId } = req.body;
  checkIfUserIdMatches(req, userId);
  await verifyRole(["ADMIN"], workspaceId, userId);

  const data = await prisma.$transaction([
    prisma.workspace.update({
      where: {
        id: workspaceId,
      },
      data: {
        adminId: newAdminId,
      },
    }),
    prisma.member.update({
      where: {
        workspaceId_userId: { workspaceId, userId: newAdminId },
      },
      data: {
        role: "ADMIN",
      },
    }),
    prisma.member.delete({
      where: {
        workspaceId_userId: { workspaceId, userId },
      },
    }),
  ]);

  return res.status(200).json({ message: "Appointed as a new Admin", data });
}

async function handleUpdateInvitationStatus(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { userId } = req.params;
  const { invitationId, invitationStatus, notificationId } = req.body;
  console.log(req.body);
  checkIfUserIdMatches(req, userId);

  const updateInvitationStatus = await prisma.invitation.update({
    data: {
      status: invitationStatus as InvitationStatus,
    },
    where: {
      id: invitationId,
    },
  });

  const updateNotification = await prisma.notification.update({
    data: {
      message:
        invitationStatus === InvitationStatus.ACCEPTED
          ? `You are now member of the Workspace `
          : `You decline to be part of the Workspace `,
      type: "NORMAL",
    },
    where: {
      id: notificationId,
    },
  });

  return res.status(200).json({
    message: `You ${invitationStatus} Sucessfully`,
    data: updateInvitationStatus,
  });
}

export {
  handleCreateWorkspace,
  handleGetWorkspace,
  handleDeleteWorkspace,
  handleUpdateWorkspaceTitle,
  handleAddMembers,
  checkIfEmailAvailable,
  getAllMembers,
  deleteMember,
  appointAsAdmin,
  handleUpdateInvitationStatus,
};
