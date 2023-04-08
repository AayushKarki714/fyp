"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const httpStatusCodes_1 = __importDefault(require("./httpStatusCodes"));
const baseError_1 = __importDefault(require("./baseError"));
class Api403Error extends baseError_1.default {
    constructor(description = "The Following Resources is Forbidden", name = "403 Error", statusCode = httpStatusCodes_1.default.FORBIDDEN, isOperational = true) {
        super(name, description, statusCode, isOperational);
    }
}
exports.default = Api403Error;
