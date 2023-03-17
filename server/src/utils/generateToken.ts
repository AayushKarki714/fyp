import jwt from "jsonwebtoken";

function generateToken(payload: any) {
  const token = jwt.sign(payload, process.env.SECRET_KEY!);
  return token;
}

export default generateToken;
