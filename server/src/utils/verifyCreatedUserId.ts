import Api401Error from "./api401Error";

function verifyCreatedUserId(
  createdUserId: string | undefined,
  userId: string
) {
  if (!createdUserId || userId !== createdUserId) {
    throw new Api401Error(
      "Only the user who created the item and admin of the workspace can only delete it!! You are not allowed"
    );
  }
}

export default verifyCreatedUserId;
