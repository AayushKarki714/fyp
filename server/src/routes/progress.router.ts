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

const progressRouter = express.Router();

progressRouter.post(
  "/:workspaceId/create-progress-container",
  handleCreateProgressContainer
);

progressRouter.get("/:workspaceId/progress-container", getAllProgressContainer);

progressRouter.post(
  "/:progressContainerId/create-progress-bar",
  handleCreateProgressBar
);

progressRouter.get(
  "/:progressContainerId/progress-bar",
  getAllProgressInProgressContainer
);

progressRouter.delete(
  "/:progressContainerId/delete-progress-container",
  handleDeleteProgressBarContainer
);

progressRouter.patch(
  "/:progressContainerId/update-progress-title",
  handleProgressTitleUpdate
);

progressRouter.patch(
  "/:progressContainerId/:progressBarId/update-progress-bar",
  handleProgressBarUpdate
);

export default progressRouter;
