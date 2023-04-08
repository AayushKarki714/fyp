"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const gallery_controller_1 = require("../controllers/gallery.controller");
const catchAsyncErrors_1 = __importDefault(require("../utils/catchAsyncErrors"));
const galleryRouter = express_1.default.Router();
galleryRouter.post("/:userId/:workspaceId/create-gallery-container", (0, catchAsyncErrors_1.default)(gallery_controller_1.handleCreateGalleryContainer));
galleryRouter.get("/:workspaceId/gallery-container", (0, catchAsyncErrors_1.default)(gallery_controller_1.getAllGalleryContainer));
galleryRouter.post("/:userId/:workspaceId/:galleryContainerId/upload-image", (0, express_fileupload_1.default)({ createParentPath: true }), (0, catchAsyncErrors_1.default)(gallery_controller_1.handleUploadImageInGallery));
galleryRouter.get("/:galleryContainerId/gallery-images", (0, catchAsyncErrors_1.default)(gallery_controller_1.getAllPhotosInGalleryContainer));
galleryRouter.patch("/:userId/:workspaceId/:galleryContainerId/update-gallery-title", (0, catchAsyncErrors_1.default)(gallery_controller_1.handleGalleryTitleUpdate));
galleryRouter.delete("/:galleryContainerId/delete-gallery-container", (0, catchAsyncErrors_1.default)(gallery_controller_1.handleDeleteGalleryContainer));
galleryRouter.delete("/:userId/:workspaceId/:galleryContainerId/delete-gallery-container", (0, catchAsyncErrors_1.default)(gallery_controller_1.handleDeleteGalleryContainer));
galleryRouter.delete("/:userId/:workspaceId/:photoId/delete-single-photo", (0, catchAsyncErrors_1.default)(gallery_controller_1.handleDeletePhoto));
exports.default = galleryRouter;
