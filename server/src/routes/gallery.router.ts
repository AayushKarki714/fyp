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
import verifyAuth from "../middlewares/verifyAuth.middlware";

const galleryRouter = express.Router();

galleryRouter.post(
  "/:workspaceId/create-gallery-container",
  verifyAuth,
  handleCreateGalleryContainer
);

galleryRouter.get(
  "/:workspaceId/gallery-container",
  verifyAuth,
  getAllGalleryContainer
);

galleryRouter.post(
  "/:workspaceId/:galleryContainerId/upload-image",
  verifyAuth,
  fileUpload({ createParentPath: true }),
  handleUploadImageInGallery
);

galleryRouter.get(
  "/:galleryContainerId/gallery-images",
  verifyAuth,
  getAllPhotosInGalleryContainer
);

galleryRouter.delete(
  "/:galleryContainerId/delete-gallery-container",
  verifyAuth,
  handleDeleteGalleryContainer
);

galleryRouter.patch(
  "/:galleryContainerId/update-gallery-title",
  verifyAuth,
  handleGalleryTitleUpdate
);

export default galleryRouter;
