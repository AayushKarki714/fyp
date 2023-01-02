import express from "express";
import {
  handleCreateWorkspace,
  handleGetWorkspace,
} from "../controllers/workspace.controller";
import fileUpload from "express-fileupload";
import verifyAuth from "../middlewares/verifyAuth.middlware";

const workspaceRouter = express.Router();

workspaceRouter.post(
  "/create-workspace",
  verifyAuth,
  fileUpload({ createParentPath: true }),
  handleCreateWorkspace
);
workspaceRouter.get("/workspaces/:userId", verifyAuth, handleGetWorkspace);

export default workspaceRouter;
