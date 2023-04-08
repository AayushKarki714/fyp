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
exports.handleIfEmailExists = exports.getUserData = exports.handleLogout = void 0;
const checkIfUserIdMatches_1 = __importDefault(require("../utils/checkIfUserIdMatches"));
const prisma_1 = __importDefault(require("../utils/prisma"));
const getUserData = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        return res.status(200).json({ user: req.user });
    });
};
exports.getUserData = getUserData;
const handleLogout = function (req, res) {
    req.logout();
    return res.status(200).json({ message: "You Loggedout SuccessFully" });
};
exports.handleLogout = handleLogout;
function handleIfEmailExists(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { emailValue, userId } = req.params;
        (0, checkIfUserIdMatches_1.default)(req, userId);
        const findUser = yield prisma_1.default.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                email: true,
            },
        });
        if ((findUser === null || findUser === void 0 ? void 0 : findUser.email) === emailValue)
            return res.status(400).json({ message: "Admin is not allowed" });
        const emailExists = yield prisma_1.default.user.findUnique({
            where: { email: emailValue },
        });
        if (!emailExists)
            return res.status(400).json({ message: "User is not registered" });
        return res.status(200).json({ message: "Email is Valid" });
    });
}
exports.handleIfEmailExists = handleIfEmailExists;
