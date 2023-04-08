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
exports.handleProgressBarUpdate = exports.handleProgressTitleUpdate = exports.handleDeleteProgressBarContainer = exports.getAllProgressInProgressContainer = exports.handleCreateProgressBar = exports.getAllProgressContainer = exports.handleCreateProgressContainer = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const api400Error_1 = __importDefault(require("../utils/api400Error"));
const checkIfUserIdMatches_1 = __importDefault(require("../utils/checkIfUserIdMatches"));
const verifyRole_1 = __importDefault(require("../utils/verifyRole"));
const verifyCreatedUserId_1 = __importDefault(require("../utils/verifyCreatedUserId"));
const client_1 = require("@prisma/client");
function handleCreateProgressContainer(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { title } = req.body;
        console.log({ title });
        const { workspaceId, userId } = req.params;
        (0, checkIfUserIdMatches_1.default)(req, userId);
        yield (0, verifyRole_1.default)(["ADMIN", "LANCER"], workspaceId, userId);
        if (!title)
            throw new api400Error_1.default("Progress Container Title was not Provided!!");
        const findByTitle = yield prisma_1.default.progressContainer.findFirst({
            where: {
                title,
                workspaceId,
            },
        });
        if (findByTitle)
            throw new api400Error_1.default(`${findByTitle.title} already exists a a Progress Container`);
        const progressContainer = yield prisma_1.default.progressContainer.create({
            data: {
                title,
                workspaceId,
                createdByUserId: userId,
            },
        });
        return res.status(201).json({
            message: `${progressContainer.title} Progress Container was SuccessFully Created!!`,
            data: progressContainer,
        });
    });
}
exports.handleCreateProgressContainer = handleCreateProgressContainer;
function getAllProgressContainer(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { workspaceId } = req.params;
        console.log({ workspaceId });
        if (!workspaceId)
            throw new api400Error_1.default("Workspace Id was not Provided!!");
        const progressContainers = yield prisma_1.default.progressContainer.findMany({
            where: { workspaceId },
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
        return res.status(200).json({
            message: "Progress Container was Fetched SuccessFully",
            data: progressContainers,
        });
    });
}
exports.getAllProgressContainer = getAllProgressContainer;
function handleCreateProgressBar(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { title, progressPercent } = req.body;
        const { progressContainerId, workspaceId, userId } = req.params;
        (0, checkIfUserIdMatches_1.default)(req, userId);
        yield (0, verifyRole_1.default)(["ADMIN", "LANCER"], workspaceId, userId);
        if (!title || !progressPercent)
            throw new api400Error_1.default("Missing Required Fields");
        if (!Number(progressPercent))
            throw new api400Error_1.default("Progress Percent is not in the Current Format");
        const findProgressByTitle = yield prisma_1.default.progress.findFirst({
            where: { title, progressContainerId },
        });
        if (findProgressByTitle)
            throw new api400Error_1.default(`${findProgressByTitle.title} already Exists!!`);
        const progressBar = yield prisma_1.default.progress.create({
            data: {
                title,
                progressPercent: Number(progressPercent),
                progressContainerId,
                createdByUserId: userId,
            },
        });
        return res.status(201).json({
            message: `${progressBar.title} was SuccessFully Created!!`,
            data: progressBar,
        });
    });
}
exports.handleCreateProgressBar = handleCreateProgressBar;
function getAllProgressInProgressContainer(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { progressContainerId } = req.params;
        const progressBars = yield prisma_1.default.progress.findMany({
            where: { progressContainerId },
            orderBy: {
                progressPercent: "desc",
            },
            include: {
                user: {
                    select: {
                        userName: true,
                        photo: true,
                    },
                },
            },
        });
        return res.status(200).json({
            message: "Progress Bars Fetched SuccessFully",
            data: progressBars,
        });
    });
}
exports.getAllProgressInProgressContainer = getAllProgressInProgressContainer;
function handleDeleteProgressBarContainer(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { progressContainerId, workspaceId, userId } = req.params;
        (0, checkIfUserIdMatches_1.default)(req, userId);
        yield (0, verifyRole_1.default)(["ADMIN", "LANCER"], workspaceId, userId);
        const progressContainer = yield prisma_1.default.progressContainer.findUnique({
            where: { id: progressContainerId },
        });
        const member = yield prisma_1.default.member.findUnique({
            where: { workspaceId_userId: { workspaceId, userId } },
        });
        if ((member === null || member === void 0 ? void 0 : member.role) === client_1.Role.LANCER) {
            (0, verifyCreatedUserId_1.default)(progressContainer === null || progressContainer === void 0 ? void 0 : progressContainer.createdByUserId, userId);
        }
        const deleteProgressContainer = yield prisma_1.default.progressContainer.delete({
            where: { id: progressContainerId },
        });
        return res.status(200).json({
            message: `${deleteProgressContainer.title} was deleted successFully`,
            data: deleteProgressContainer,
        });
    });
}
exports.handleDeleteProgressBarContainer = handleDeleteProgressBarContainer;
function handleProgressTitleUpdate(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { title } = req.body;
        const { progressContainerId, userId, workspaceId } = req.params;
        console.log({ progressContainerId, userId, workspaceId });
        (0, checkIfUserIdMatches_1.default)(req, userId);
        yield (0, verifyRole_1.default)(["ADMIN", "LANCER"], workspaceId, userId);
        if (!title)
            throw new api400Error_1.default("Missing Required Title");
        const member = yield prisma_1.default.member.findUnique({
            where: { workspaceId_userId: { workspaceId, userId } },
        });
        const findProgressContainer = yield prisma_1.default.progressContainer.findUnique({
            where: { id: progressContainerId },
        });
        console.log({
            member: member === null || member === void 0 ? void 0 : member.role,
            userId,
            created: findProgressContainer === null || findProgressContainer === void 0 ? void 0 : findProgressContainer.createdByUserId,
            progressContainerId,
            findProgressContainer,
        });
        if ((member === null || member === void 0 ? void 0 : member.role) === client_1.Role.LANCER)
            (0, verifyCreatedUserId_1.default)(findProgressContainer === null || findProgressContainer === void 0 ? void 0 : findProgressContainer.createdByUserId, userId);
        const updateProgress = yield prisma_1.default.progressContainer.update({
            data: {
                title,
            },
            where: { id: progressContainerId },
        });
        return res.status(200).json({
            message: `Progress Title SuccessFully Updated to ${updateProgress.title}`,
        });
    });
}
exports.handleProgressTitleUpdate = handleProgressTitleUpdate;
function handleProgressBarUpdate(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const progressPercent = Number(req.body.progressPercent);
        const { progressTitle } = req.body;
        const { progressContainerId, progressBarId, userId, workspaceId } = req.params;
        (0, checkIfUserIdMatches_1.default)(req, userId);
        yield (0, verifyRole_1.default)(["ADMIN", "LANCER"], workspaceId, userId);
        if (!progressPercent)
            throw new api400Error_1.default("Missing Required Field (progressPercent)");
        const progressContainer = yield prisma_1.default.progressContainer.findUnique({
            where: { id: progressContainerId },
        });
        if (!progressContainer)
            throw new api400Error_1.default("Progress Container Was not Found");
        const progressBar = yield prisma_1.default.progress.findUnique({
            where: { id: progressBarId },
        });
        if (!progressBar)
            throw new api400Error_1.default("Progress Bar was not Found");
        if ((progressBar === null || progressBar === void 0 ? void 0 : progressBar.progressContainerId) !== progressContainer.id) {
            throw new api400Error_1.default("Progress Bar doesn't belong to the Specified Container");
        }
        if (progressPercent > 100 || progressPercent < 0) {
            throw new api400Error_1.default("Progress Percent can only have number between 0 t0 100%");
        }
        const member = yield prisma_1.default.member.findUnique({
            where: { workspaceId_userId: { workspaceId, userId } },
        });
        console.log({
            member: member === null || member === void 0 ? void 0 : member.role,
            progressBar: progressBar.createdByUserId,
            userId,
        });
        if ((member === null || member === void 0 ? void 0 : member.role) === client_1.Role.LANCER)
            (0, verifyCreatedUserId_1.default)(progressBar.createdByUserId, userId);
        const updatedProgressBar = yield prisma_1.default.progress.update({
            where: { id: progressBarId },
            data: { title: progressTitle, progressPercent },
        });
        return res.status(200).json({
            message: `${progressBar.title} was updated to ${progressPercent}% successfully`,
            data: updatedProgressBar,
        });
    });
}
exports.handleProgressBarUpdate = handleProgressBarUpdate;
