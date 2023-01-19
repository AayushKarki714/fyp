import { RequestHandler } from "express";
import path from "path";
import prisma from "../utils/prisma";

const handleCreateGalleryContainer: RequestHandler = async (req, res) => {
  const { title } = req.body;
  const { workspaceId } = req.params;
  try {
    const galleryContainer = await prisma.galleryContainer.create({
      data: {
        title: title,
        workspaceId: workspaceId,
      },
    });
    return res.status(201).json(galleryContainer);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

const getAllGalleryContainer: RequestHandler = async (req, res) => {
  const { workspaceId } = req.params;
  try {
    const allGalleryContainer = await prisma.galleryContainer.findMany({
      where: {
        workspaceId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return res.status(200).json(allGalleryContainer);
  } catch (error: any) {
    return res
      .status(400)
      .json({ message: error.message || "Unexpected Error Occured" });
  }
};

const handleUploadImageInGallery: RequestHandler = async (req, res) => {
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
};

const getAllPhotosInGalleryContainer: RequestHandler = async (req, res) => {
  const { galleryContainerId } = req.params;
  try {
    const photos = await prisma.photo.findMany({
      where: { galleryContainerId },
    });
    return res.status(200).json(photos);
  } catch (error: any) {
    return res
      .status(400)
      .json({ message: error.message || "Unexpected Error encountered" });
  }
};

const handleDeleteGalleryContainer: RequestHandler = async (req, res) => {
  const { galleryContainerId } = req.params;
  try {
    const deletePhotos = await prisma.photo.deleteMany({
      where: { galleryContainerId },
    });
    const deleteGalleryContainer = await prisma.galleryContainer.delete({
      where: { id: galleryContainerId },
    });
    return res.status(200).json({
      message: `${deleteGalleryContainer.title} GalleryContainer was SuccessFully deleted`,
      data: getAllGalleryContainer,
    });
  } catch (error: any) {
    return res
      .status(400)
      .json({ message: error.message || "Unexpected Error Encountered" });
  }
};

const handleGalleryTitleUpdate: RequestHandler = async (req, res) => {
  const { title } = req.body;
  const { galleryContainerId } = req.params;
  try {
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
  } catch (error: any) {
    return res
      .status(400)
      .json({ message: error.message || "Unexpected Error Encountered" });
  }
};

export {
  handleCreateGalleryContainer,
  getAllGalleryContainer,
  handleUploadImageInGallery,
  getAllPhotosInGalleryContainer,
  handleDeleteGalleryContainer,
  handleGalleryTitleUpdate,
};
