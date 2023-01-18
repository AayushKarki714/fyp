import express from "express";
import {
  getAllProgressContainer,
  getAllProgressInProgressContainer,
  handleCreateProgressBar,
  handleCreateProgressContainer,
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

export default progressRouter;
