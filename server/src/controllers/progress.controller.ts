import prisma from "../utils/prisma";
import { NextFunction, Request, Response } from "express";
import Api400Error from "../utils/api400Error";

async function handleCreateProgressContainer(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { title } = req.body;
  const { workspaceId } = req.params;

  if (!title)
    throw new Api400Error("Progress Container Title was not Provided!!");

  const findByTitle = await prisma.progressContainer.findFirst({
    where: {
      title,
      workspaceId,
    },
  });

  if (findByTitle)
    throw new Api400Error(
      `${findByTitle.title} already exists a a Progress Container`
    );

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
}

async function getAllProgressContainer(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { workspaceId } = req.params;

  if (!workspaceId) throw new Api400Error("Workspace Id was not Provided!!");

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
}

async function handleCreateProgressBar(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { title, progressPercent } = req.body;
  const { progressContainerId } = req.params;

  if (!title || !progressPercent)
    throw new Api400Error("Missing Required Fields");

  if (!Number(progressPercent))
    throw new Api400Error("Progress Percent is not in the Current Format");

  const findProgressByTitle = await prisma.progress.findFirst({
    where: { title, progressContainerId },
  });

  if (findProgressByTitle)
    throw new Api400Error(`${findProgressByTitle.title} already Exists!!`);

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
}

async function getAllProgressInProgressContainer(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { progressContainerId } = req.params;

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
}

async function handleDeleteProgressBarContainer(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { progressContainerId } = req.params;

  const deleteProgressContainer = await prisma.progressContainer.delete({
    where: { id: progressContainerId },
  });

  return res.status(200).json({
    message: `${deleteProgressContainer.title} was deleted successFully`,
    data: deleteProgressContainer,
  });
}

async function handleProgressTitleUpdate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { title } = req.body;
  const { progressContainerId } = req.params;
  if (!title) throw new Api400Error("Missing Required Title");

  const updateProgress = await prisma.progressContainer.update({
    data: {
      title,
    },
    where: { id: progressContainerId },
  });

  return res.status(200).json({
    message: `Progress Title SuccessFully Updated to ${updateProgress.title}`,
  });
}

async function handleProgressBarUpdate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const progressPercent = Number(req.body.progressPercent);
  const { progressContainerId, progressBarId } = req.params;

  if (!progressPercent)
    throw new Api400Error("Missing Required Field (progressPercent)");

  const progressContainer = await prisma.progressContainer.findUnique({
    where: { id: progressContainerId },
  });

  if (!progressContainer)
    throw new Api400Error("Progress Container Was not Found");

  const progressBar = await prisma.progress.findUnique({
    where: { id: progressBarId },
  });

  if (!progressBar) throw new Api400Error("Progress Bar was not Found");

  if (progressBar?.progressContainerId !== progressContainer.id) {
    throw new Api400Error(
      "Progress Bar doesn't belong to the Specified Container"
    );
  }

  if (progressBar.progressPercent >= progressPercent) {
    throw new Api400Error("Progress Percent can't go from higher to lower");
  }

  const updatedProgressBar = await prisma.progress.update({
    where: { id: progressBarId },
    data: { progressPercent },
  });

  return res.status(200).json({
    message: `${progressBar.title} was updated to ${progressPercent}% successfully`,
    data: updatedProgressBar,
  });
}

export {
  handleCreateProgressContainer,
  getAllProgressContainer,
  handleCreateProgressBar,
  getAllProgressInProgressContainer,
  handleDeleteProgressBarContainer,
  handleProgressTitleUpdate,
  handleProgressBarUpdate,
};
