import { RequestHandler } from "express";

const verifyAuth: RequestHandler = function (req, res, next) {
  const userExist = req.isAuthenticated() && req.user;
  if (!userExist) {
    return res.status(401).json({ message: "You are not authorized" });
  }
  next();
};

export default verifyAuth;
