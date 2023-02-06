import express from "express";
import {
  checkIfEmailAvailable,
  handleAddMembers,
  handleCreateWorkspace,
  handleDeleteWorkspace,
  handleGetWorkspace,
  handleUpdateWorkspaceTitle,
} from "../controllers/workspace.controller";
import fileUpload from "express-fileupload";
import catchAsyncErrors from "../utils/catchAsyncErrors";

const workspaceRouter = express.Router();

workspaceRouter.get(
  "/:workspaceId/:email/check-email",
  catchAsyncErrors(checkIfEmailAvailable)
);

workspaceRouter.post(
  "/create-workspace",
  fileUpload({ createParentPath: true }),
  catchAsyncErrors(handleCreateWorkspace)
);

workspaceRouter.post(
  "/:userId/:workspaceId/add-members",
  catchAsyncErrors(handleAddMembers)
);

workspaceRouter.patch(
  "/:workspaceId/:userId/update-workspace-name",
  catchAsyncErrors(handleUpdateWorkspaceTitle)
);

workspaceRouter.get(
  "/workspaces/:userId",
  catchAsyncErrors(handleGetWorkspace)
);

workspaceRouter.delete(
  "/:workspaceId/:userId",
  catchAsyncErrors(handleDeleteWorkspace)
);

export default workspaceRouter;
