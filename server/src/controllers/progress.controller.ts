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

const handleCreateProgressBar: RequestHandler = async (req, res) => {
  const { title, progressPercent } = req.body;
  const { progressContainerId } = req.params;

  if (!title || !progressPercent)
    return res.status(400).json({ message: "Missing Required Fields" });

  if (!Number(progressPercent))
    return res
      .status(400)
      .json({ messasge: "progressPercent is not in the currect Formatk" });

  try {
    const progressBar = await prisma.progress.create({
      data: {
        title,
        progressPercent: Number(progressPercent),
        progressContainerId,
      },
    });
    return res.status(201).json({
      message: `${progressBar.title} was SuccessFully Created!!`,
      data: progressBar,
    });
  } catch (error: any) {
    return res
      .status(400)
      .json({ message: error.message || "Unexpected Error Encountered" });
  }
};

const getAllProgressInProgressContainer: RequestHandler = async (req, res) => {
  const { progressContainerId } = req.params;
  try {
    const progressBars = await prisma.progress.findMany({
      where: { progressContainerId },
      orderBy: {
        progressPercent: "desc",
      },
    });

    return res.status(200).json({
      message: "Progress Bars Fetched SuccessFully",
      data: progressBars,
    });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export {
  handleCreateProgressContainer,
  getAllProgressContainer,
  handleCreateProgressBar,
  getAllProgressInProgressContainer,
};
