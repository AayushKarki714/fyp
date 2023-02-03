import httpStatusCode from "./httpStatusCodes";
import BaseError from "./baseError";

class Api403Error extends BaseError {
  constructor(
    description: string = "The Following Resources is Forbidden",
    name: string = "403 Error",
    statusCode: number = httpStatusCode.FORBIDDEN,
    isOperational: boolean = true
  ) {
    super(name, description, statusCode, isOperational);
  }
}

export default Api403Error;
