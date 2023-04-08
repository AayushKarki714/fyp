"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const api401Error_1 = __importDefault(require("../utils/api401Error"));
function verifyToken(req, res, next) {
    const header = req.headers && req.headers["authorization"];
    const token = header === null || header === void 0 ? void 0 : header.split(" ")[1];
    if (!token)
        throw new api401Error_1.default("You are not verified");
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
        req.userId = decoded;
        next();
    }
    catch (error) {
        return res.status(401).json({ message: "Invalid Token" });
    }
}
exports.default = verifyToken;
