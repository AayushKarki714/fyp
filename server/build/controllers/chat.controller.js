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
exports.handleDeleteChatMessage = exports.handleSendMessageInChat = exports.getAllMessagesInChat = exports.getAllMembersInChat = exports.getAllChat = void 0;
const client_1 = require("@prisma/client");
const api400Error_1 = __importDefault(require("../utils/api400Error"));
const checkIfUserIdMatches_1 = __importDefault(require("../utils/checkIfUserIdMatches"));
const prisma_1 = __importDefault(require("../utils/prisma"));
const verifyRole_1 = __importDefault(require("../utils/verifyRole"));
function getAllowedRole(chatType) {
    let allowedRoles;
    if (chatType === client_1.ChatType.ALL)
        allowedRoles = [client_1.Role.ADMIN, client_1.Role.LANCER, client_1.Role.CLIENT];
    else if (chatType === client_1.ChatType.LANCERS)
        allowedRoles = [client_1.Role.ADMIN, client_1.Role.LANCER];
    else {
        allowedRoles = [client_1.Role.ADMIN, client_1.Role.CLIENT];
    }
    return allowedRoles;
}
function getAllChat(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { workspaceId, userId } = req.params;
        (0, checkIfUserIdMatches_1.default)(req, userId);
        const chats = yield prisma_1.default.chat.findMany({ where: { workspaceId } });
        return res.status(200).json({ data: chats, message: "Fetched Sucessfully" });
    });
}
exports.getAllChat = getAllChat;
function getAllMembersInChat(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId, chatId, workspaceId, chatType } = req.params;
        (0, checkIfUserIdMatches_1.default)(req, userId);
        const allowedRoles = getAllowedRole(chatType);
        yield (0, verifyRole_1.default)(allowedRoles, workspaceId, userId);
        const findChat = yield prisma_1.default.chat.findUnique({ where: { id: chatId } });
        if ((findChat === null || findChat === void 0 ? void 0 : findChat.workspaceId) !== workspaceId)
            throw new api400Error_1.default("Underlying workspace Id was not found!!");
        const allMembers = yield prisma_1.default.chatWithMember.findMany({
            where: {
                chatId,
                member: {
                    recieverInvitations: {
                        some: {
                            status: {
                                in: ["ACCEPTED"],
                            },
                        },
                    },
                },
            },
            select: {
                member: {
                    include: {
                        user: true,
                    },
                },
                chat: true,
            },
        });
        console.log({ allMembers });
        return res.status(200).json({ data: allMembers });
    });
}
exports.getAllMembersInChat = getAllMembersInChat;
function handleSendMessageInChat(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId, chatId, workspaceId } = req.params;
        const { message, memberId, chatType } = req.body;
        (0, checkIfUserIdMatches_1.default)(req, userId);
        const allowedRoles = getAllowedRole(chatType);
        yield (0, verifyRole_1.default)(allowedRoles, workspaceId, userId);
        if (!message)
            return res.status(400).json({ message: "Message can't be empty" });
        const chatMessage = yield prisma_1.default.chatMessage.create({
            data: {
                message,
                chatId,
                memberId,
            },
        });
        return res
            .status(200)
            .json({ message: "Message Sent Succesfully", data: chatMessage });
    });
}
exports.handleSendMessageInChat = handleSendMessageInChat;
function getAllMessagesInChat(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { workspaceId, chatId, userId, chatType } = req.params;
        (0, checkIfUserIdMatches_1.default)(req, userId);
        const allowedRoles = getAllowedRole(chatType);
        yield (0, verifyRole_1.default)(allowedRoles, workspaceId, userId);
        const chatMessages = yield prisma_1.default.chatMessage.findMany({
            where: {
                chatId,
            },
            orderBy: {
                createdAt: "asc",
            },
            include: {
                member: {
                    include: {
                        user: true,
                    },
                },
            },
        });
        return res
            .status(200)
            .json({ message: "Chat Messages Fetched Sucessfully", data: chatMessages });
    });
}
exports.getAllMessagesInChat = getAllMessagesInChat;
function handleDeleteChatMessage(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId, workspaceId, chatMessageId } = req.params;
        (0, checkIfUserIdMatches_1.default)(req, userId);
        yield (0, verifyRole_1.default)([client_1.Role.ADMIN], workspaceId, userId);
        const deleteChatMessage = yield prisma_1.default.chatMessage.delete({
            where: { id: chatMessageId },
        });
        return res.status(200).json({
            message: "Chat Message was deleted Succesfully!!",
            data: deleteChatMessage,
        });
    });
}
exports.handleDeleteChatMessage = handleDeleteChatMessage;
