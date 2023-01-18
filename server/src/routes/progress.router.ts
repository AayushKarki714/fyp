import express from "express";
import {
  getAllProgressContainer,
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

export default progressRouter;
