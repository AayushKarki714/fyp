import express from "express";
import {
  deleteWorkspace,
  deRegisterUser,
  getAllRegisteredUser,
  getAllWorkspace,
  getTotalWorkspaceandUser,
  handleSystemAdminLogin,
} from "../controllers/system-admin.controller";
import verifyToken from "../middlewares/verifyToken";
import catchAsyncErrors from "../utils/catchAsyncErrors";

const systemAdminRouter = express.Router();

systemAdminRouter.post("/login", catchAsyncErrors(handleSystemAdminLogin));

systemAdminRouter.get(
  "/all/users",
  catchAsyncErrors(verifyToken),
  catchAsyncErrors(getAllRegisteredUser)
);

systemAdminRouter.get(
  "/all/workspaces",
  catchAsyncErrors(verifyToken),
  catchAsyncErrors(getAllWorkspace)
);

systemAdminRouter.delete(
  "/:userId/deregister-user",
  catchAsyncErrors(verifyToken),
  catchAsyncErrors(deRegisterUser)
);

systemAdminRouter.delete(
  "/:workspaceId/delete-workspace",
  catchAsyncErrors(verifyToken),
  catchAsyncErrors(deleteWorkspace)
);

systemAdminRouter.get(
  "/workspace/user/count",
  catchAsyncErrors(verifyToken),
  catchAsyncErrors(getTotalWorkspaceandUser)
);

export default systemAdminRouter;
