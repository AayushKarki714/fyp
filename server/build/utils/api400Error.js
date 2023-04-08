"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const httpStatusCodes_1 = __importDefault(require("./httpStatusCodes"));
const baseError_1 = __importDefault(require("./baseError"));
class Api400Error extends baseError_1.default {
    constructor(description = "Bad Request made By the Client", name = "404 Error", statusCode = httpStatusCodes_1.default.BAD_REQUEST, isOperational = true) {
        super(name, description, statusCode, isOperational);
    }
}
exports.default = Api400Error;
