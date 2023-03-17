import express from "express";
import {
  getAdmin,
  handleSystemAdminLogin,
} from "../controllers/system-admin.controller";
import verifyToken from "../middlewares/verifyToken";
import catchAsyncErrors from "../utils/catchAsyncErrors";

const systemAdminRouter = express.Router();

systemAdminRouter.post(
  "/system-admin/login",
  catchAsyncErrors(handleSystemAdminLogin)
);

systemAdminRouter.get(
  "/system-admin",
  catchAsyncErrors(verifyToken),
  catchAsyncErrors(getAdmin)
);

export default systemAdminRouter;
