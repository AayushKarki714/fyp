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
  "/:workspaceId/create-progress-container",
  catchAsyncErrors(handleCreateProgressContainer)
);

progressRouter.get(
  "/:workspaceId/progress-container",
  catchAsyncErrors(getAllProgressContainer)
);

progressRouter.post(
  "/:progressContainerId/create-progress-bar",
  catchAsyncErrors(handleCreateProgressBar)
);

progressRouter.get(
  "/:progressContainerId/progress-bar",
  catchAsyncErrors(getAllProgressInProgressContainer)
);

progressRouter.delete(
  "/:progressContainerId/delete-progress-container",
  catchAsyncErrors(handleDeleteProgressBarContainer)
);

progressRouter.patch(
  "/:progressContainerId/update-progress-title",
  catchAsyncErrors(handleProgressTitleUpdate)
);

progressRouter.patch(
  "/:progressContainerId/:progressBarId/update-progress-bar",
  catchAsyncErrors(handleProgressBarUpdate)
);

export default progressRouter;
