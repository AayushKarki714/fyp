import httpStatusCode from "./httpStatusCodes";
import BaseError from "./baseError";

class Api401Error extends BaseError {
  constructor(
    description: string = "Unauthorized ⛔",
    name: string = "401 Error",
    statusCode: number = httpStatusCode.FORBIDDEN,
    isOperational: boolean = true
  ) {
    super(name, description, statusCode, isOperational);
  }
}

export default Api401Error;
