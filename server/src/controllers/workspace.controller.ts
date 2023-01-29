import { RequestHandler } from "express";
import path from "path";
import prisma from "../utils/prisma";

const handleCreateWorkspace: RequestHandler = async function (req, res) {
  const { name, lancerValues, clientValues, adminId } = req.body;
  const files = req.files!;
  const file = files[Object.keys(files)[0]] as any;
  const filePath = path.join(__dirname, "..", "..", "public", file.name);

  file.mv(filePath, (err: any) => {
    if (err) return res.status(400).json({ message: "Invalid Logo" });
  });

  const workspace = await prisma.workspace.create({
    data: {
      name: name,
      logo: `http://localhost:8000/${file.name}`,
      adminId: adminId,
    },
  });

  const lancers = JSON.parse(lancerValues).map(async (lancer: any) => {
    const val = await prisma.user.findUnique({
      where: { email: lancer.email },
    });
    return { userId: val?.id, role: "LANCER", workspaceId: workspace.id };
  });

  const clients = JSON.parse(clientValues).map(async (lancer: any) => {
    const val = await prisma.user.findUnique({
      where: { email: lancer.email },
    });
    return { userId: val?.id, role: "CLIENT", workspaceId: workspace.id };
  });

  const lancersData = await Promise.all(lancers);
  const clientsData = await Promise.all(clients);

  try {
    await prisma.member.createMany({
      data: [
        {
          userId: (req.user as any).id,
          role: "ADMIN",
          workspaceId: workspace.id,
        },
        ...lancersData,
        ...clientsData,
      ],
    });
  } catch (error) {
    await prisma.workspace.delete({
      where: {
        id: workspace.id,
      },
    });
    return res.status(400).json({ message: (error as any).message });
  }

  return res.status(200).json({ workspace });
};

const handleGetWorkspace: RequestHandler = async function (req, res) {
  const { userId } = req.params;
  const workspaces = await prisma.member.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      createdAt: "asc",
    },
    include: {
      workspace: true,
    },
  });
  return res.status(200).json({ data: workspaces });
};

const handleDeleteWorkspace: RequestHandler = async (req, res) => {
  const { workspaceId, userId } = req.params;

  try {
    const member = await prisma.member.findFirst({
      where: { userId, workspaceId },
    });

    const isAdmin = member?.role === "ADMIN";

    if (!isAdmin) {
      return res
        .status(403)
        .json({ message: "Role must be admin to delete workspace" });
    }
    const deleteWorkspace = await prisma.workspace.delete({
      where: { id: workspaceId },
    });

    return res
      .status(200)
      .json({ message: `${deleteWorkspace.name} was deleted Successfully!!` });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

const handleUpdateWorkspaceTitle: RequestHandler = async (req, res) => {
  const { name } = req.body;
  const { workspaceId, userId } = req.params;

  if (!name)
    return res.status(400).json({ message: "Updated title can't be Emtpy" });

  try {
    const member = await prisma.member.findFirst({
      where: { userId, workspaceId },
    });

    const isAdmin = member?.role === "ADMIN";

    if (!isAdmin) {
      return res
        .status(403)
        .json({ message: "Role must be admin to delete workspace" });
    }

    const updateWorkspace = await prisma.workspace.update({
      data: { name },
      where: { id: workspaceId },
    });

    return res
      .status(200)
      .json({ message: `${updateWorkspace.name} was updated Successfully!!` });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export {
  handleCreateWorkspace,
  handleGetWorkspace,
  handleDeleteWorkspace,
  handleUpdateWorkspaceTitle,
};
