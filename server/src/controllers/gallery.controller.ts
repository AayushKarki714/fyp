import { NextFunction, Request, Response } from "express";
import path from "path";
import Api400Error from "../utils/api400Error";
import prisma from "../utils/prisma";

async function handleCreateGalleryContainer(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { title } = req.body;
  const { workspaceId } = req.params;

  const findGalleryByTitle = await prisma.galleryContainer.findFirst({
    where: {
      title,
      workspaceId,
    },
  });

  if (findGalleryByTitle)
    throw new Api400Error(
      `${findGalleryByTitle.title} already exists as a Gallery Container`
    );

  const galleryContainer = await prisma.galleryContainer.create({
    data: {
      title: title,
      workspaceId: workspaceId,
    },
  });

  return res.status(201).json(galleryContainer);
}

async function getAllGalleryContainer(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { workspaceId } = req.params;

  const allGalleryContainer = await prisma.galleryContainer.findMany({
    where: {
      workspaceId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return res.status(200).json(allGalleryContainer);
}

async function handleUploadImageInGallery(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { workspaceId, galleryContainerId } = req.params;
  const files = req.files!;
  const file = files[Object.keys(files)[0]] as any;

  const filePath = path.join(__dirname, "..", "..", "public", file.name);

  file.mv(filePath, (err: any) => {
    if (err) return res.status(400).json({ message: "Error Occured in Image" });
  });

  const photo = await prisma.photo.create({
    data: {
      url: `http://localhost:8000/${file.name}`,
      galleryContainerId,
    },
  });

  return res.status(201).json(photo);
}

async function getAllPhotosInGalleryContainer(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { galleryContainerId } = req.params;
  const photos = await prisma.photo.findMany({
    where: { galleryContainerId },
  });
  return res.status(200).json(photos);
}

async function handleDeleteGalleryContainer(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { galleryContainerId } = req.params;

  const deleteGalleryContainer = await prisma.galleryContainer.delete({
    where: { id: galleryContainerId },
  });

  return res.status(200).json({
    message: `${deleteGalleryContainer.title} GalleryContainer was SuccessFully deleted`,
    data: getAllGalleryContainer,
  });
}

async function handleGalleryTitleUpdate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { title } = req.body;
  const { galleryContainerId } = req.params;

  if (!title) throw new Api400Error("Missing Required Field* (title)");

  const updateGallery = await prisma.galleryContainer.update({
    data: {
      title,
    },
    where: {
      id: galleryContainerId,
    },
  });

  return res.status(200).json({
    message: `Gallery title SuccessFully Update to ${updateGallery.title}`,
    data: updateGallery,
  });
}

export {
  handleCreateGalleryContainer,
  getAllGalleryContainer,
  handleUploadImageInGallery,
  getAllPhotosInGalleryContainer,
  handleDeleteGalleryContainer,
  handleGalleryTitleUpdate,
};
