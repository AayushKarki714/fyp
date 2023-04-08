"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const notification_controller_1 = require("../controllers/notification.controller");
const catchAsyncErrors_1 = __importDefault(require("../utils/catchAsyncErrors"));
const notificationRouter = express_1.default.Router();
notificationRouter.get("/:userId/get-notifications", notification_controller_1.getNotificationsByUserId);
notificationRouter.get("/:userId/get-unread-notifications-count", notification_controller_1.getUnreadNotificationCount);
notificationRouter.patch("/:userId/mark-notification-read", notification_controller_1.handleMarkReadNotification);
notificationRouter.delete("/:userId/:notificationId/delete-notification", (0, catchAsyncErrors_1.default)(notification_controller_1.handleDeleteNotificationById));
exports.default = notificationRouter;
