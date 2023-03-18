import { RequestHandler } from "express";

const verifyAuth: RequestHandler = function (req, res, next) {
  const userExist = req.isAuthenticated() && req.user;
  if (!userExist) {
    return res.status(401).json({ message: "This Seems Uneccessary" });
  }
  next();
};

export default verifyAuth;
