"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const auth_controller_1 = require("../controllers/auth.controller");
const verifyAuth_middlware_1 = __importDefault(require("../middlewares/verifyAuth.middlware"));
const catchAsyncErrors_1 = __importDefault(require("../utils/catchAsyncErrors"));
const CLIENT_URL = process.env.CLIENT_URL;
const authRouter = express_1.default.Router();
authRouter.get("/google", passport_1.default.authenticate("google", { scope: ["profile", "email"] }));
authRouter.get("/google/callback", passport_1.default.authenticate("google", {
    successRedirect: `${CLIENT_URL}/dashboard`,
    failureRedirect: `${CLIENT_URL}/login`,
}));
authRouter.get("/:userId/:emailValue/email-exists", verifyAuth_middlware_1.default, (0, catchAsyncErrors_1.default)(auth_controller_1.handleIfEmailExists));
authRouter.get("/user", verifyAuth_middlware_1.default, auth_controller_1.getUserData);
authRouter.get("/logout", verifyAuth_middlware_1.default, auth_controller_1.handleLogout);
exports.default = authRouter;
