"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const api401Error_1 = __importDefault(require("./api401Error"));
function checkIfUserIdMatches(req, userId) {
    if (userId !== req.user.id) {
        throw new api401Error_1.default("You are not Authorized to do the following Actions!!");
    }
}
exports.default = checkIfUserIdMatches;
