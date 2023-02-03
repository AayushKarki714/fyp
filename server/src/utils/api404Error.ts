import httpStatusCode from "./httpStatusCodes";
import BaseError from "./baseError";

class Api404Error extends BaseError {
  constructor(
    name: string,
    description: string = "Not Found",
    statusCode: number = httpStatusCode.NOT_FOUND,
    isOperational: boolean = true
  ) {
    super(name, description, statusCode, isOperational);
  }
}

export default Api404Error;
