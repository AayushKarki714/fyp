import express from "express";
import {
  getAllProgressContainer,
  getAllProgressInProgressContainer,
  handleCreateProgressBar,
  handleCreateProgressContainer,
  handleDeleteProgressBarContainer,
  handleProgressBarUpdate,
  handleProgressTitleUpdate,
} from "../controllers/progress.controller";
import catchAsyncErrors from "../utils/catchAsyncErrors";

const progressRouter = express.Router();

progressRouter.post(
  "/:userId/:workspaceId/create-progress-container",
  catchAsyncErrors(handleCreateProgressContainer)
);

progressRouter.get(
  "/:workspaceId/progress-container",
  catchAsyncErrors(getAllProgressContainer)
);

progressRouter.post(
  "/:userId/:workspaceId/:progressContainerId/create-progress-bar",
  catchAsyncErrors(handleCreateProgressBar)
);

progressRouter.get(
  "/:progressContainerId/progress-bar",
  catchAsyncErrors(getAllProgressInProgressContainer)
);

progressRouter.delete(
  "/:userId/:workspaceId/:progressContainerId/delete-progress-container",
  catchAsyncErrors(handleDeleteProgressBarContainer)
);

progressRouter.patch(
  "/:userId/:workspaceId/:progressContainerId/update-progress-title",
  catchAsyncErrors(handleProgressTitleUpdate)
);

progressRouter.patch(
  "/:userId/:workspaceId/:progressContainerId/:progressBarId/update-progress-bar",
  catchAsyncErrors(handleProgressBarUpdate)
);

export default progressRouter;
