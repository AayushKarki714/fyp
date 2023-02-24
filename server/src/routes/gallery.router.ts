import express from "express";
import fileUpload from "express-fileupload";
import {
  getAllGalleryContainer,
  getAllPhotosInGalleryContainer,
  handleCreateGalleryContainer,
  handleDeleteGalleryContainer,
  handleDeletePhoto,
  handleGalleryTitleUpdate,
  handleUploadImageInGallery,
} from "../controllers/gallery.controller";
import catchAsyncErrors from "../utils/catchAsyncErrors";

const galleryRouter = express.Router();

galleryRouter.post(
  "/:userId/:workspaceId/create-gallery-container",
  catchAsyncErrors(handleCreateGalleryContainer)
);

galleryRouter.get(
  "/:workspaceId/gallery-container",
  catchAsyncErrors(getAllGalleryContainer)
);

galleryRouter.post(
  "/:userId/:workspaceId/:galleryContainerId/upload-image",
  fileUpload({ createParentPath: true }),
  catchAsyncErrors(handleUploadImageInGallery)
);

galleryRouter.get(
  "/:galleryContainerId/gallery-images",
  catchAsyncErrors(getAllPhotosInGalleryContainer)
);

galleryRouter.patch(
  "/:userId/:workspaceId/:galleryContainerId/update-gallery-title",
  catchAsyncErrors(handleGalleryTitleUpdate)
);

galleryRouter.delete(
  "/:galleryContainerId/delete-gallery-container",
  catchAsyncErrors(handleDeleteGalleryContainer)
);

galleryRouter.delete(
  "/:userId/:workspaceId/:galleryContainerId/delete-gallery-container",
  catchAsyncErrors(handleDeleteGalleryContainer)
);

galleryRouter.delete(
  "/:userId/:workspaceId/:photoId/delete-single-photo",
  catchAsyncErrors(handleDeletePhoto)
);

export default galleryRouter;
