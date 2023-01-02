import { RequestHandler } from "express";
import path from "path";
import prisma from "../utils/prisma";

const handleCreateWorkspace: RequestHandler = async function (req, res) {
  const { name, lancerValues, clientValues, adminId } = req.body;
  console.log(lancerValues);
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

  const members = await prisma.member.createMany({
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
  return res.status(200).json({ workspace });
};

const handleGetWorkspace: RequestHandler = async function (req, res) {
  const { userId } = req.params;
  console.log(userId);
  const workspaces = await prisma.member.findMany({
    where: {
      userId: userId,
    },
    include: {
      workspace: true,
    },
  });
  return res.status(200).json({ data: workspaces });
};

export { handleCreateWorkspace, handleGetWorkspace };
