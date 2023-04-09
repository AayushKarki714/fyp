import { RequestHandler } from "express";

const verifyAuth: RequestHandler = function (req, res, next) {
  console.log({ session: req.session, cookie: req.cookies });
  const userExist = req.isAuthenticated() && req.user;
  if (!userExist) {
    return res.status(401).json({ message: "You are nott allowed to Login" });
  }
  next();
};

export default verifyAuth;
