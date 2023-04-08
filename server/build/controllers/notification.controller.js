"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleDeleteNotificationById = exports.getUnreadNotificationCount = exports.handleMarkReadNotification = exports.getNotificationsByUserId = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const checkIfUserIdMatches_1 = __importDefault(require("../utils/checkIfUserIdMatches"));
function handleMarkReadNotification(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId } = req.params;
        (0, checkIfUserIdMatches_1.default)(req, userId);
        const updateNotifications = yield prisma_1.default.notification.updateMany({
            where: {
                read: false,
                recieverId: userId,
            },
            data: {
                read: true,
            },
        });
        return res.status(200).json({
            message: "Mark as Read Notification SucessFully",
            data: updateNotifications,
        });
    });
}
exports.handleMarkReadNotification = handleMarkReadNotification;
function getUnreadNotificationCount(req, res, next) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        const { userId } = req.params;
        (0, checkIfUserIdMatches_1.default)(req, userId);
        const unreadNotificationCount = yield prisma_1.default.notification.groupBy({
            by: ["recieverId"],
            where: {
                recieverId: userId,
                read: false,
            },
            _count: {
                _all: true,
            },
        });
        return res.status(200).json({
            message: "Unread Notification Count",
            data: (_c = (_b = (_a = unreadNotificationCount[0]) === null || _a === void 0 ? void 0 : _a._count) === null || _b === void 0 ? void 0 : _b._all) !== null && _c !== void 0 ? _c : 0,
        });
    });
}
exports.getUnreadNotificationCount = getUnreadNotificationCount;
function getNotificationsByUserId(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId } = req.params;
        (0, checkIfUserIdMatches_1.default)(req, userId);
        const notifications = yield prisma_1.default.notification.findMany({
            where: {
                recieverId: userId,
            },
            include: {
                invitation: {
                    include: {
                        workspace: true,
                    },
                },
                sender: true,
                reciever: true,
                workspace: true,
            },
            orderBy: [{ createdAt: "desc" }, { updatedAt: "desc" }],
        });
        return res
            .status(200)
            .json({ data: notifications, message: "Notification Fetched SucessFully" });
    });
}
exports.getNotificationsByUserId = getNotificationsByUserId;
function handleDeleteNotificationById(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { notificationId, userId } = req.params;
        (0, checkIfUserIdMatches_1.default)(req, userId);
        const deleteNotification = yield prisma_1.default.notification.delete({
            where: { id: notificationId },
        });
        return res.status(200).json({
            message: "Notification deleted Succesfully",
            data: deleteNotification,
        });
    });
}
exports.handleDeleteNotificationById = handleDeleteNotificationById;
