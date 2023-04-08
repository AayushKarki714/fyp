"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const verifyAuth = function (req, res, next) {
    const userExist = req.isAuthenticated() && req.user;
    if (!userExist) {
        return res.status(401).json({ message: "This Seems Uneccessary" });
    }
    next();
};
exports.default = verifyAuth;
