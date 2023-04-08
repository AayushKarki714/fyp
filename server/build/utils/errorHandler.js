"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = exports.isOperationalError = exports.logErrorMiddleware = exports.logError = void 0;
const baseError_1 = __importDefault(require("./baseError"));
function logError(err) {
    console.error(err);
}
exports.logError = logError;
function logErrorMiddleware(err, req, res, next) {
    logError(err);
    next(err);
}
exports.logErrorMiddleware = logErrorMiddleware;
function isOperationalError(error) {
    if (error instanceof baseError_1.default) {
        return error.isOperational;
    }
    return false;
}
exports.isOperationalError = isOperationalError;
function globalErrorHandler(error, req, res, next) {
    return res.status(error.statusCode || 500).json({ message: error.message });
}
exports.globalErrorHandler = globalErrorHandler;
