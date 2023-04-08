"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const httpStatusCodes_1 = __importDefault(require("./httpStatusCodes"));
const baseError_1 = __importDefault(require("./baseError"));
class Api404Error extends baseError_1.default {
    constructor(name, description = "Not Found", statusCode = httpStatusCodes_1.default.NOT_FOUND, isOperational = true) {
        super(name, description, statusCode, isOperational);
    }
}
exports.default = Api404Error;
