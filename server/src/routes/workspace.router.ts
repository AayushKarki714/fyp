import express from "express";
import {
  handleCreateWorkspace,
  handleDeleteWorkspace,
  handleGetWorkspace,
  handleUpdateWorkspaceTitle,
} from "../controllers/workspace.controller";
import fileUpload from "express-fileupload";

const workspaceRouter = express.Router();

workspaceRouter.post(
  "/create-workspace",
  fileUpload({ createParentPath: true }),
  handleCreateWorkspace
);

workspaceRouter.patch(
  "/:workspaceId/:userId/update-workspace-name",
  handleUpdateWorkspaceTitle
);
workspaceRouter.get("/workspaces/:userId", handleGetWorkspace);
workspaceRouter.delete("/:workspaceId/:userId", handleDeleteWorkspace);

export default workspaceRouter;
