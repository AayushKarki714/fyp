import express from "express";
import passport from "passport";
import {
  getUserData,
  handleIfEmailExists,
  handleLogout,
} from "../controllers/auth.controller";
import verifyAuth from "../middlewares/verifyAuth.middlware";
import catchAsyncErrors from "../utils/catchAsyncErrors";

const CLIENT_URL = process.env.CLIENT_URL!;
const authRouter = express.Router();

authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: `${CLIENT_URL}/dashboard`,
    failureRedirect: `${CLIENT_URL}/login`,
  })
);

authRouter.get(
  "/:userId/:emailValue/email-exists",
  verifyAuth,
  catchAsyncErrors(handleIfEmailExists)
);

authRouter.get("/user", verifyAuth, getUserData);
authRouter.get("/logout", verifyAuth, handleLogout);

export default authRouter;
