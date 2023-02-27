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
  console.log({ name, lancerValues, clientValues, adminId, file: req.files });

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

  const lancers = JSON.parse(lancerValues).map(async (lancerEmail: any) => {
    const val = await prisma.user.findUnique({
      where: { email: lancerEmail },
    });
    return { userId: val?.id, role: "LANCER", workspaceId: newWorkspace.id };
  });

  const clients = JSON.parse(clientValues).map(async (clientEmail: any) => {
    const val = await prisma.user.findUnique({
      where: { email: clientEmail },
    });
    return { userId: val?.id, role: "CLIENT", workspaceId: newWorkspace.id };
  });

  const lancersData = await Promise.all(lancers);
  const clientsData = await Promise.all(clients);

  const adminData = {
    userId: adminId,
    role: "ADMIN",
    workspaceId: newWorkspace.id,
  };
  const membersData = lancersData.concat(clientsData).concat(adminData);

  const members = await prisma.$transaction(
    membersData.map((memberData) =>
      prisma.member.create({ data: { ...memberData } })
    )
  );

  const allChat = await prisma.chat.create({
    data: {
      workspaceId: newWorkspace.id,
      type: "ALL",
    },
  });

  const lancersAndAdminChat = await prisma.chat.create({
    data: {
      workspaceId: newWorkspace.id,
      type: "LANCERS",
    },
  });

  const clientsAndAdminChat = await prisma.chat.create({
    data: {
      workspaceId: newWorkspace.id,
      type: "CLIENTS",
    },
  });

  const allMembersDataWithId = await prisma.member.findMany({
    where: { workspaceId: newWorkspace.id },
    select: {
      id: true,
    },
  });

  const lancersDataWithId = await prisma.member.findMany({
    where: { workspaceId: newWorkspace.id, role: { in: ["ADMIN", "LANCER"] } },
    select: {
      id: true,
    },
  });

  const clientsDataWithId = await prisma.member.findMany({
    where: { workspaceId: newWorkspace.id, role: { in: ["ADMIN", "CLIENT"] } },
    select: {
      id: true,
    },
  });

  const allChatData = allMembersDataWithId.map((memberData) => ({
    memberId: memberData.id,
    chatId: allChat.id,
  }));

  const lancersChatData = lancersDataWithId.map((memberData) => ({
    memberId: memberData.id,
    chatId: lancersAndAdminChat.id,
  }));

  const clientsChatData = clientsDataWithId.map((memberData) => ({
    memberId: memberData.id,
    chatId: clientsAndAdminChat.id,
  }));

  const finalData = allChatData.concat(lancersChatData).concat(clientsChatData);

  await prisma.$transaction([
    prisma.chatWithMember.createMany({ data: finalData }),
  ]);

  const adminMember = members.find((member) => member.role === Role.ADMIN);

  const invitations = await prisma.$transaction(
    members.map((member) =>
      prisma.invitation.create({
        data: {
          senderId: adminMember!.id,
          recieverId: member.id,
          message:
            member.id === adminMember!.id
              ? `You created a Workspace named ${newWorkspace.name} Successfully`
              : `You are invited as a ${member.role} in ${newWorkspace.name}`,
          status:
            member.id === adminMember!.id
              ? InvitationStatus.ACCEPTED
              : InvitationStatus.PENDING,
          workspaceId: newWorkspace.id,
        },
        include: {
          reciever: true,
          sender: true,
        },
      })
    )
  );

  await prisma.$transaction(
    invitations.map((invitation) =>
      prisma.notification.create({
        data: {
          message: invitation.message,
          invitationId: invitation.id,
          recieverId: invitation.reciever.userId,
          senderId: invitation.sender!.userId,
          type:
            invitation.reciever.userId === invitation?.sender!.userId
              ? NotificationType.INVITATION_CREATOR
              : NotificationType.INVITATION,
        },
      })
    )
  );

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
        some: {
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
          some: {
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
  await verifyRole(["ADMIN"], workspaceId, userId);

  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
  });

  const allMembers = await prisma.member.findMany({
    where: {
      workspaceId,
      recieverInvitations: {
        some: {
          status: "ACCEPTED",
        },
      },
    },
  });

  await prisma.$transaction(
    allMembers.map((member) =>
      prisma.notification.create({
        data: {
          senderId: userId,
          recieverId: member.userId,
          message:
            userId === member.userId
              ? `You deleted the Workspace named ${workspace?.name}`
              : `deleted the Workspace named ${workspace?.name}`,
          type:
            userId === member.userId
              ? NotificationType.NORMAL
              : NotificationType.DELETE_WORKSPACE,
        },
      })
    )
  );

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

  const allMembers = await prisma.member.findMany({
    where: {
      workspaceId,
      recieverInvitations: {
        some: {
          status: "ACCEPTED",
        },
      },
    },
  });

  const findWorkspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
  });

  const updateWorkspace = await prisma.workspace.update({
    data: { name },
    where: { id: workspaceId },
  });

  await prisma.$transaction(
    allMembers.map((member) =>
      prisma.notification.create({
        data: {
          senderId: userId,
          recieverId: member.userId,
          message:
            member.userId === userId
              ? `You updated the title of  workspace from ${findWorkspace?.name} to ${updateWorkspace.name}`
              : `The Admin of the Workspace senderName updated the title from ${findWorkspace?.name} to ${updateWorkspace.name}`,
          type:
            member.userId === userId
              ? NotificationType.INVITATION_CREATOR
              : NotificationType.WORKSPACE_TITLE_UPDATE,
          workspaceId: workspaceId,
        },
      })
    )
  );

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
          workspaceId: workspaceId,
          recieverId: addedMember.id,
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
          senderId: invitation.sender!.userId,
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

  const isMember = await prisma.member.findUnique({
    where: {
      workspaceId_userId: { workspaceId, userId: findUser.id },
    },
  });

  if (!isMember) {
    return res.status(200).json({ message: "Email is Allowed to Add" });
  }

  const isPartOfWorkspace = await prisma.invitation.findFirst({
    where: {
      workspaceId: workspaceId,
      recieverId: isMember.id,
      NOT: { status: "DECLINED" },
    },
  });

  if (isPartOfWorkspace?.status === "ACCEPTED") {
    throw new Api400Error("Already Part of the Workspace");
  }

  if (isPartOfWorkspace?.status === "PENDING") {
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
      NOT: { role: "ADMIN" },
      recieverInvitations: {
        some: {
          status: "ACCEPTED",
        },
      },
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
  const { userId: senderId, workspaceId } = req.params;
  const { recieverId } = req.body;

  checkIfUserIdMatches(req, senderId);
  await verifyRole(["ADMIN"], workspaceId, senderId);

  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
  });
  const notifications = await prisma.notification.createMany({
    data: [
      {
        senderId,
        recieverId,
        message: `You are apppointed as admin of the workspace ${workspace?.name}`,
        type: "APPOINT_ADMIN",
        workspaceId,
      },
      {
        senderId,
        recieverId: senderId,
        message: `You have sent invitation to appoint (recieverName) as admin of the workspace ${workspace?.name}`,
        type: "APPOINT_ADMIN_CREATOR",
        workspaceId,
      },
    ],
  });

  return res.status(200).json({
    message: "Invitation is sent to appoint new Admin",
    data: notifications,
  });
}

async function handleUpdateInvitationStatus(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { userId } = req.params;
  console.log({ userId });
  const { invitationId, invitationStatus, notificationId } = req.body;
  checkIfUserIdMatches(req, userId);
  console.log({ invitationId, invitationStatus, notificationId });

  const updateInvitationStatus = await prisma.invitation.update({
    data: {
      status: invitationStatus as InvitationStatus,
    },
    where: {
      id: invitationId,
    },
  });

  const workspace = await prisma.workspace.findUnique({
    where: { id: updateInvitationStatus.workspaceId },
  });

  await prisma.notification.update({
    data: {
      message:
        invitationStatus === InvitationStatus.ACCEPTED
          ? `You are now member of the Workspace ${workspace?.name} `
          : `You declined to be part of the Workspace ${workspace?.name} `,
      type:
        invitationStatus === InvitationStatus.ACCEPTED
          ? NotificationType.ACCEPTED_INVITATION
          : NotificationType.DECLINED_INVITATION,
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

const adminInvitationRequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { workspaceId } = req.params;
  const { newAdminId, adminId, status, notificationId } = req.body;
  checkIfUserIdMatches(req, newAdminId);

  if (status === NotificationType.APPOINT_ADMIN_DECLINED) {
    const data = await prisma.notification.update({
      where: {
        id: notificationId,
      },

      data: {
        type: "APPOINT_ADMIN_DECLINED",
      },
    });
    return res.status(200).json({
      message: "You declined to be part of workspace as an admin",
      data,
    });
  }
  await prisma.$transaction([
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
    prisma.member.update({
      where: {
        workspaceId_userId: { workspaceId, userId: adminId },
      },
      data: {
        role: "CLIENT",
      },
    }),
    prisma.notification.update({
      where: {
        id: notificationId,
      },
      data: {
        type:
          status === NotificationType.APPOINT_ADMIN_ACCEPTED
            ? NotificationType.APPOINT_ADMIN_ACCEPTED
            : NotificationType.APPOINT_ADMIN_DECLINED,
      },
    }),
  ]);

  return res.status(200).json({ message: "You are appointed as a new admin" });
};

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
  adminInvitationRequestHandler,
};
