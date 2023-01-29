import express from "express";
import {
  handleCreateWorkspace,
  handleDeleteWorkspace,
  handleGetWorkspace,
} from "../controllers/workspace.controller";
import fileUpload from "express-fileupload";

const workspaceRouter = express.Router();

workspaceRouter.post(
  "/create-workspace",
  fileUpload({ createParentPath: true }),
  handleCreateWorkspace
);

workspaceRouter.get("/workspaces/:userId", handleGetWorkspace);
workspaceRouter.delete("/:workspaceId/:userId", handleDeleteWorkspace);

export default workspaceRouter;
