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
const prisma_1 = __importDefault(require("./prisma"));
const api403Error_1 = __importDefault(require("./api403Error"));
function verifyRole(role, workspaceId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const findUser = yield prisma_1.default.member.findUnique({
            where: { workspaceId_userId: { workspaceId, userId } },
        });
        const assignedRole = findUser.role;
        const isAllowed = role.includes(assignedRole);
        if (!isAllowed) {
            throw new api403Error_1.default(`Member with the role: ${assignedRole} is restricted to perform the Following Tasks`);
        }
        return assignedRole;
    });
}
exports.default = verifyRole;
