import express from "express";
import {
  getAllChat,
  getAllMembersInChat,
  getAllMessagesInChat,
  handleSendMessageInChat,
} from "../controllers/chat.controller";
import catchAsyncErrors from "../utils/catchAsyncErrors";

const chatRouter = express.Router();

chatRouter.get(
  "/:userId/:workspaceId/get-all-chat",
  catchAsyncErrors(getAllChat)
);

chatRouter.get(
  "/:userId/:workspaceId/:chatId/:chatType/all-members",
  catchAsyncErrors(getAllMembersInChat)
);

chatRouter.get(
  "/:userId/:workspaceId/:chatId/:chatType/get-messages-chat",
  catchAsyncErrors(getAllMessagesInChat)
);

chatRouter.post(
  "/:userId/:workspaceId/:chatId/send-message-chat",
  catchAsyncErrors(handleSendMessageInChat)
);

export default chatRouter;
