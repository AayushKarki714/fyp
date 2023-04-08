"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleDeletePhoto = exports.handleGalleryTitleUpdate = exports.handleDeleteGalleryContainer = exports.getAllPhotosInGalleryContainer = exports.handleUploadImageInGallery = exports.getAllGalleryContainer = exports.handleCreateGalleryContainer = void 0;
const client_1 = require("@prisma/client");
const path_1 = __importDefault(require("path"));
const api400Error_1 = __importDefault(require("../utils/api400Error"));
const checkIfUserIdMatches_1 = __importDefault(require("../utils/checkIfUserIdMatches"));
const prisma_1 = __importDefault(require("../utils/prisma"));
const verifyCreatedUserId_1 = __importDefault(require("../utils/verifyCreatedUserId"));
const verifyRole_1 = __importDefault(require("../utils/verifyRole"));
function handleCreateGalleryContainer(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { title } = req.body;
        const { workspaceId, userId } = req.params;
        (0, checkIfUserIdMatches_1.default)(req, userId);
        const findGalleryByTitle = yield prisma_1.default.galleryContainer.findFirst({
            where: {
                title,
                workspaceId,
            },
        });
        if (findGalleryByTitle)
            throw new api400Error_1.default(`${findGalleryByTitle.title} already exists as a Gallery Container`);
        const galleryContainer = yield prisma_1.default.galleryContainer.create({
            data: {
                title: title,
                createdByUserId: userId,
                workspaceId: workspaceId,
            },
        });
        return res.status(201).json(galleryContainer);
    });
}
exports.handleCreateGalleryContainer = handleCreateGalleryContainer;
function getAllGalleryContainer(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { workspaceId } = req.params;
        const allGalleryContainer = yield prisma_1.default.galleryContainer.findMany({
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
    });
}
exports.getAllGalleryContainer = getAllGalleryContainer;
function handleUploadImageInGallery(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { workspaceId, galleryContainerId, userId } = req.params;
        (0, checkIfUserIdMatches_1.default)(req, userId);
        const files = req.files;
        const file = files[Object.keys(files)[0]];
        const filePath = path_1.default.join(__dirname, "..", "..", "public", file.name);
        file.mv(filePath, (err) => {
            if (err)
                return res.status(400).json({ message: "Error Occured in Image" });
        });
        const photo = yield prisma_1.default.photo.create({
            data: {
                uploadedByUserId: userId,
                url: `http://localhost:8000/${file.name}`,
                galleryContainerId,
            },
        });
        return res.status(201).json(photo);
    });
}
exports.handleUploadImageInGallery = handleUploadImageInGallery;
function getAllPhotosInGalleryContainer(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { galleryContainerId } = req.params;
        const photos = yield prisma_1.default.photo.findMany({
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
    });
}
exports.getAllPhotosInGalleryContainer = getAllPhotosInGalleryContainer;
function handleDeleteGalleryContainer(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { galleryContainerId, userId, workspaceId } = req.params;
        (0, checkIfUserIdMatches_1.default)(req, userId);
        const role = yield (0, verifyRole_1.default)([client_1.Role.LANCER, client_1.Role.CLIENT, client_1.Role.ADMIN], workspaceId, userId);
        const findGalleryContainer = yield prisma_1.default.galleryContainer.findUnique({
            where: { id: galleryContainerId },
        });
        if (role === client_1.Role.LANCER || role === client_1.Role.CLIENT)
            (0, verifyCreatedUserId_1.default)(findGalleryContainer === null || findGalleryContainer === void 0 ? void 0 : findGalleryContainer.createdByUserId, userId);
        const deleteGalleryContainer = yield prisma_1.default.galleryContainer.delete({
            where: { id: galleryContainerId },
        });
        return res.status(200).json({
            message: `${deleteGalleryContainer.title} GalleryContainer was SuccessFully deleted`,
            data: getAllGalleryContainer,
        });
    });
}
exports.handleDeleteGalleryContainer = handleDeleteGalleryContainer;
function handleGalleryTitleUpdate(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { title } = req.body;
        const { galleryContainerId, userId, workspaceId } = req.params;
        (0, checkIfUserIdMatches_1.default)(req, userId);
        const role = yield (0, verifyRole_1.default)([client_1.Role.CLIENT, client_1.Role.ADMIN, client_1.Role.LANCER], workspaceId, userId);
        const findGallery = yield prisma_1.default.galleryContainer.findUnique({
            where: { id: galleryContainerId },
        });
        if (role === client_1.Role.CLIENT || role === client_1.Role.LANCER)
            (0, verifyCreatedUserId_1.default)(findGallery === null || findGallery === void 0 ? void 0 : findGallery.createdByUserId, userId);
        if (!title)
            throw new api400Error_1.default("Missing Required Field* (title)");
        const updateGallery = yield prisma_1.default.galleryContainer.update({
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
    });
}
exports.handleGalleryTitleUpdate = handleGalleryTitleUpdate;
function handleDeletePhoto(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { photoId, userId, workspaceId } = req.params;
        console.log({ userId, workspaceId });
        (0, checkIfUserIdMatches_1.default)(req, userId);
        const role = yield (0, verifyRole_1.default)([client_1.Role.LANCER, client_1.Role.CLIENT, client_1.Role.ADMIN], workspaceId, userId);
        const findPhoto = yield prisma_1.default.photo.findUnique({ where: { id: photoId } });
        if (role === client_1.Role.LANCER || role === client_1.Role.CLIENT)
            (0, verifyCreatedUserId_1.default)(findPhoto === null || findPhoto === void 0 ? void 0 : findPhoto.uploadedByUserId, userId);
        if (!findPhoto)
            throw new api400Error_1.default("Photo not Found!!");
        const deletePhoto = yield prisma_1.default.photo.delete({
            where: { id: findPhoto.id },
        });
        return res
            .status(200)
            .json({ message: "Photo was Deleted SucessFully", data: deletePhoto });
    });
}
exports.handleDeletePhoto = handleDeletePhoto;
