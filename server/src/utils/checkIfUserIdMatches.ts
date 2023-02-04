import { Request } from "express";
import Api401Error from "./api401Error";

function checkIfUserIdMatches(req: Request, userId: string) {
  if (userId !== (req.user as any).id) {
    throw new Api401Error(
      "You are not Authorized to do the following Actions!!"
    );
  }
}

export default checkIfUserIdMatches;
