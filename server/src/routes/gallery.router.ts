import express from "express";
import fileUpload from "express-fileupload";
import {
  getAllGalleryContainer,
  getAllPhotosInGalleryContainer,
  handleCreateGalleryContainer,
  handleDeleteGalleryContainer,
  handleGalleryTitleUpdate,
  handleUploadImageInGallery,
} from "../controllers/gallery.controller";

const galleryRouter = express.Router();

galleryRouter.post(
  "/:workspaceId/create-gallery-container",
  handleCreateGalleryContainer
);

galleryRouter.get("/:workspaceId/gallery-container", getAllGalleryContainer);

galleryRouter.post(
  "/:workspaceId/:galleryContainerId/upload-image",
  fileUpload({ createParentPath: true }),
  handleUploadImageInGallery
);

galleryRouter.get(
  "/:galleryContainerId/gallery-images",
  getAllPhotosInGalleryContainer
);

galleryRouter.delete(
  "/:galleryContainerId/delete-gallery-container",
  handleDeleteGalleryContainer
);

galleryRouter.patch(
  "/:galleryContainerId/update-gallery-title",
  handleGalleryTitleUpdate
);

export default galleryRouter;
