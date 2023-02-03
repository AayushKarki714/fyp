import httpStatusCode from "./httpStatusCodes";
import BaseError from "./baseError";

class Api400Error extends BaseError {
  constructor(
    name: string,
    description: string = "Bad Request made By the Client",
    statusCode: number = httpStatusCode.BAD_REQUEST,
    isOperational: boolean = true
  ) {
    super(name, description, statusCode, isOperational);
  }
}

export default Api400Error;
