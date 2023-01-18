import express from "express";
import {
  getAllProgressContainer,
  getAllProgressInProgressContainer,
  handleCreateProgressBar,
  handleCreateProgressContainer,
  handleDeleteProgressBarContainer,
  handleProgressTitleUpdate,
} from "../controllers/progress.controller";
import verifyAuth from "../middlewares/verifyAuth.middlware";

const progressRouter = express.Router();

progressRouter.post(
  "/:workspaceId/create-progress-container",
  verifyAuth,
  handleCreateProgressContainer
);

progressRouter.get(
  "/:workspaceId/progress-container",
  verifyAuth,
  getAllProgressContainer
);

progressRouter.post(
  "/:progressContainerId/create-progress-bar",
  verifyAuth,
  handleCreateProgressBar
);

progressRouter.get(
  "/:progressContainerId/progress-bar",
  verifyAuth,
  getAllProgressInProgressContainer
);

progressRouter.delete(
  "/:progressContainerId/delete-progress-container",
  verifyAuth,
  handleDeleteProgressBarContainer
);

progressRouter.patch(
  "/:progressContainerId/update-progress-title",
  verifyAuth,
  handleProgressTitleUpdate
);

export default progressRouter;
