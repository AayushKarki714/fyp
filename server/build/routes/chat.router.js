"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chat_controller_1 = require("../controllers/chat.controller");
const catchAsyncErrors_1 = __importDefault(require("../utils/catchAsyncErrors"));
const chatRouter = express_1.default.Router();
chatRouter.get("/:userId/:workspaceId/get-all-chat", (0, catchAsyncErrors_1.default)(chat_controller_1.getAllChat));
chatRouter.get("/:userId/:workspaceId/:chatId/:chatType/all-members", (0, catchAsyncErrors_1.default)(chat_controller_1.getAllMembersInChat));
chatRouter.get("/:userId/:workspaceId/:chatId/:chatType/get-messages-chat", (0, catchAsyncErrors_1.default)(chat_controller_1.getAllMessagesInChat));
chatRouter.post("/:userId/:workspaceId/:chatId/send-message-chat", (0, catchAsyncErrors_1.default)(chat_controller_1.handleSendMessageInChat));
chatRouter.delete("/:userId/:workspaceId/:chatMessageId/delete-chat-message", (0, catchAsyncErrors_1.default)(chat_controller_1.handleDeleteChatMessage));
exports.default = chatRouter;
