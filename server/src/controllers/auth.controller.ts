import { RequestHandler } from "express";

const getUserData: RequestHandler = async function (req, res) {
  return res.status(200).json({ user: req.user });
};

const handleLogout: RequestHandler = function (req, res) {
  (req as any).logout();
  return res.status(200).json({ message: "You Loggedout SuccessFully" });
};

export { handleLogout, getUserData };
