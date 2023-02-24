import { Request } from "express";
import Api401Error from "./api401Error";

function verifyCreatedUserId(req: Request, userId: string) {
  if (userId !== (req.user as any).id) {
    throw new Api401Error(
      "Only the user who created the item can only delete it!! You are not allowed"
    );
  }
}

export default verifyCreatedUserId;
