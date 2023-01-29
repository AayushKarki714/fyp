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
    const findByTitle = await prisma.progressContainer.findFirst({
      where: {
        title,
        workspaceId,
      },
    });

    if (findByTitle)
      return res.status(400).json({
        message: `${findByTitle.title} already exists as a Progress Container`,
      });

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
      orderBy: {
        createdAt: "asc",
      },
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
    const findProgressByTitle = await prisma.progress.findFirst({
      where: { title, progressContainerId },
    });

    if (findProgressByTitle)
      return res.status(400).json({
        message: `${findProgressByTitle.title} already Exists!!
        `,
        data: null,
      });

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

const handleDeleteProgressBarContainer: RequestHandler = async (req, res) => {
  const { progressContainerId } = req.params;
  try {
    const deleteProgressContainer = await prisma.progressContainer.delete({
      where: { id: progressContainerId },
    });
    return res.status(200).json({
      message: `${deleteProgressContainer.title} was deleted successFully`,
      data: deleteProgressContainer,
    });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

const handleProgressTitleUpdate: RequestHandler = async (req, res) => {
  const { title } = req.body;
  const { progressContainerId } = req.params;
  if (!title)
    return res.status(400).json({ message: "Missing Required Title" });

  try {
    const updateProgress = await prisma.progressContainer.update({
      data: {
        title,
      },
      where: { id: progressContainerId },
    });
    return res.status(200).json({
      message: `Progress Title SuccessFully Updated to ${updateProgress.title}`,
    });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

const handleProgressBarUpdate: RequestHandler = async (req, res) => {
  const progressPercent = Number(req.body.progressPercent);
  if (!progressPercent)
    return res.status(400).json({ message: "Missing Required Field" });

  const { progressContainerId, progressBarId } = req.params;

  try {
    const progressContainer = await prisma.progressContainer.findUnique({
      where: { id: progressContainerId },
    });

    if (!progressContainer)
      return res
        .status(400)
        .json({ message: "Progress Container Was not Found" });

    const progressBar = await prisma.progress.findUnique({
      where: { id: progressBarId },
    });

    if (!progressBar)
      return res.status(400).json({ message: "Progresss Bar was not Found" });

    if (progressBar?.progressContainerId !== progressContainer.id) {
      return res.status(400).json({
        message: "Progress Bar doesn't belong to the Specified Container",
      });
    }

    if (progressBar.progressPercent >= progressPercent) {
      return res
        .status(400)
        .json({ message: "Progress Percent can't go from Higher to Lower" });
    }

    const updatedProgressBar = await prisma.progress.update({
      where: { id: progressBarId },
      data: { progressPercent },
    });
    return res.status(200).json({
      message: `${progressBar.title} was updated to ${progressPercent}% successfully`,
      data: updatedProgressBar,
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
  handleDeleteProgressBarContainer,
  handleProgressTitleUpdate,
  handleProgressBarUpdate,
};
