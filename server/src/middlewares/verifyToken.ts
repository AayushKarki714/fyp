import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import Api401Error from "../utils/api401Error";

function verifyToken(req: Request, res: Response, next: NextFunction) {
  const header = req.headers && req.headers["authorization"];
  const token = header?.split(" ")[1];
  if (!token) throw new Api401Error("You are not verified");
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY!);
    (req as any).userId = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid Token" });
  }
}

export default verifyToken;
