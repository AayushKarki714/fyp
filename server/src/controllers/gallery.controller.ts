import { Role } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import path from "path";
import Api400Error from "../utils/api400Error";
import checkIfUserIdMatches from "../utils/checkIfUserIdMatches";
import prisma from "../utils/prisma";
import verifyCreatedUserId from "../utils/verifyCreatedUserId";
import verifyRole from "../utils/verifyRole";

async function handleCreateGalleryContainer(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { title } = req.body;
  const { workspaceId, userId } = req.params;

  checkIfUserIdMatches(req, userId);

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
      createdByUserId: userId,
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
      createdAt: "asc",
    },
    include: {
      user: {
        select: {
          photo: true,
          userName: true,
        },
      },
    },
  });

  return res.status(200).json(allGalleryContainer);
}

async function handleUploadImageInGallery(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { workspaceId, galleryContainerId, userId } = req.params;

  checkIfUserIdMatches(req, userId);

  const files = req.files!;
  const file = files[Object.keys(files)[0]] as any;

  const filePath = path.join(__dirname, "..", "..", "public", file.name);

  file.mv(filePath, (err: any) => {
    if (err) return res.status(400).json({ message: "Error Occured in Image" });
  });

  const photo = await prisma.photo.create({
    data: {
      uploadedByUserId: userId,
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
    include: {
      user: {
        select: {
          photo: true,
          userName: true,
        },
      },
    },
  });
  return res.status(200).json(photos);
}

async function handleDeleteGalleryContainer(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { galleryContainerId, userId, workspaceId } = req.params;
  checkIfUserIdMatches(req, userId);

  const role = await verifyRole(
    [Role.LANCER, Role.CLIENT, Role.ADMIN],
    workspaceId,
    userId
  );

  const findGalleryContainer = await prisma.galleryContainer.findUnique({
    where: { id: galleryContainerId },
  });

  if (role === Role.LANCER || role === Role.CLIENT)
    verifyCreatedUserId(findGalleryContainer?.createdByUserId, userId);

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
  const { galleryContainerId, userId, workspaceId } = req.params;

  checkIfUserIdMatches(req, userId);

  const role = await verifyRole(
    [Role.CLIENT, Role.ADMIN, Role.LANCER],
    workspaceId,
    userId
  );

  const findGallery = await prisma.galleryContainer.findUnique({
    where: { id: galleryContainerId },
  });

  if (role === Role.CLIENT || role === Role.LANCER)
    verifyCreatedUserId(findGallery?.createdByUserId, userId);

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

async function handleDeletePhoto(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { photoId, userId, workspaceId } = req.params;
  console.log({ userId, workspaceId });
  checkIfUserIdMatches(req, userId);

  const role = await verifyRole(
    [Role.LANCER, Role.CLIENT, Role.ADMIN],
    workspaceId,
    userId
  );

  const findPhoto = await prisma.photo.findUnique({ where: { id: photoId } });

  if (role === Role.LANCER || role === Role.CLIENT)
    verifyCreatedUserId(findPhoto?.uploadedByUserId, userId);

  if (!findPhoto) throw new Api400Error("Photo not Found!!");

  const deletePhoto = await prisma.photo.delete({
    where: { id: findPhoto.id },
  });
  return res
    .status(200)
    .json({ message: "Photo was Deleted SucessFully", data: deletePhoto });
}

export {
  handleCreateGalleryContainer,
  getAllGalleryContainer,
  handleUploadImageInGallery,
  getAllPhotosInGalleryContainer,
  handleDeleteGalleryContainer,
  handleGalleryTitleUpdate,
  handleDeletePhoto,
};
