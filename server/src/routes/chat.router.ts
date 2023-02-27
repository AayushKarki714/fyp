import express from "express";
import { getAllChat } from "../controllers/chat.controller";
import catchAsyncErrors from "../utils/catchAsyncErrors";

const chatRouter = express.Router();

chatRouter.get(
  "/:userId/:workspaceId/get-all-chat",
  catchAsyncErrors(getAllChat)
);

export default chatRouter;
