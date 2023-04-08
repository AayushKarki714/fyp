"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const api401Error_1 = __importDefault(require("./api401Error"));
function verifyCreatedUserId(createdUserId, userId) {
    if (!createdUserId || userId !== createdUserId) {
        throw new api401Error_1.default("Only the user who created the item and admin of the workspace can only delete it!! You are not allowed");
    }
}
exports.default = verifyCreatedUserId;
