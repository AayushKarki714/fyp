import prisma from "../utils/prisma";
import { RequestHandler } from "express";

const handleCreateProgressContainer: RequestHandler = async (req, res) => {
  const { title } = req.body;
  const { workspaceId } = req.params;

  if (!title)
    return res
      .status(400)
      .json({ message: "Progress Container Title was not Provided!!" });

  try {
    const progressContainer = await prisma.progressContainer.create({
      data: {
        title,
        workspaceId,
      },
    });
    return res.status(201).json({
      message: `${progressContainer.title} Progress Container was SuccessFully Created!!`,
      data: progressContainer,
    });
  } catch (error: any) {
    return res
      .status(400)
      .json({ message: error.message || "Unexpected Error Encountered" });
  }
};

const getAllProgressContainer: RequestHandler = async (req, res) => {
  const { workspaceId } = req.params;
  if (!workspaceId)
    return res.status(400).json({ message: "Workspace Id was not Provided!!" });
  try {
    const progressContainers = await prisma.progressContainer.findMany({
      where: { workspaceId },
    });
    return res.status(200).json({
      message: "Progress Container was Fetched SuccessFully",
      data: progressContainers,
    });
  } catch (error: any) {
    return res
      .status(400)
      .json({ message: error.message || "Unexpected Message Encountered" });
  }
};

export { handleCreateProgressContainer, getAllProgressContainer };
