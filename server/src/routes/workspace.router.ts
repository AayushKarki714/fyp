import express from "express";
import {
  appointAsAdmin,
  checkIfEmailAvailable,
  deleteMember,
  getAllMembers,
  handleAddMembers,
  handleCreateWorkspace,
  handleDeleteWorkspace,
  handleGetWorkspace,
  handleUpdateInvitationStatus,
  handleUpdateWorkspaceTitle,
} from "../controllers/workspace.controller";
import fileUpload from "express-fileupload";
import catchAsyncErrors from "../utils/catchAsyncErrors";

const workspaceRouter = express.Router();

workspaceRouter.get(
  "/:workspaceId/:email/check-email",
  catchAsyncErrors(checkIfEmailAvailable)
);

workspaceRouter.get(
  "/:userId/:workspaceId/get-members",
  catchAsyncErrors(getAllMembers)
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

workspaceRouter.patch(
  "/:userId/invitation",
  catchAsyncErrors(handleUpdateInvitationStatus)
);

workspaceRouter.patch(
  "/:workspaceId/:userId/appoint-admin",
  catchAsyncErrors(appointAsAdmin)
);

workspaceRouter.get(
  "/workspaces/:userId",
  catchAsyncErrors(handleGetWorkspace)
);

workspaceRouter.delete(
  "/:workspaceId/:userId",
  catchAsyncErrors(handleDeleteWorkspace)
);

workspaceRouter.delete(
  "/:userId/:workspaceId/:memberId/delete-member",
  catchAsyncErrors(deleteMember)
);

export default workspaceRouter;
