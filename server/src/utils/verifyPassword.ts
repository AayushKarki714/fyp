import bcryptjs from "bcryptjs";
import Api400Error from "./api400Error";

async function verifyPassword(password: string, hashPwd: string) {
  const isMatch = await bcryptjs.compare(password, hashPwd);
  console.log({ password, hashPwd, isMatch });
  if (!isMatch) throw new Api400Error("Password doesn't Match");
  return isMatch;
}

export default verifyPassword;
