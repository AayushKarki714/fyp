"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const progress_controller_1 = require("../controllers/progress.controller");
const catchAsyncErrors_1 = __importDefault(require("../utils/catchAsyncErrors"));
const progressRouter = express_1.default.Router();
progressRouter.post("/:userId/:workspaceId/create-progress-container", (0, catchAsyncErrors_1.default)(progress_controller_1.handleCreateProgressContainer));
progressRouter.get("/:workspaceId/progress-container", (0, catchAsyncErrors_1.default)(progress_controller_1.getAllProgressContainer));
progressRouter.post("/:userId/:workspaceId/:progressContainerId/create-progress-bar", (0, catchAsyncErrors_1.default)(progress_controller_1.handleCreateProgressBar));
progressRouter.get("/:progressContainerId/progress-bar", (0, catchAsyncErrors_1.default)(progress_controller_1.getAllProgressInProgressContainer));
progressRouter.delete("/:userId/:workspaceId/:progressContainerId/delete-progress-container", (0, catchAsyncErrors_1.default)(progress_controller_1.handleDeleteProgressBarContainer));
progressRouter.patch("/:userId/:workspaceId/:progressContainerId/update-progress-title", (0, catchAsyncErrors_1.default)(progress_controller_1.handleProgressTitleUpdate));
progressRouter.patch("/:userId/:workspaceId/:progressContainerId/:progressBarId/update-progress-bar", (0, catchAsyncErrors_1.default)(progress_controller_1.handleProgressBarUpdate));
exports.default = progressRouter;
