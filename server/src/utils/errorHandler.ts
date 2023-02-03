import { NextFunction, Request, Response } from "express";
import BaseError from "./baseError";

interface Error {
  statusCode?: number;
  message: string;
}

function logError(err: Error) {
  console.error(err);
}

function logErrorMiddleware(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logError(err);
  next(err);
}

function isOperationalError(error: Error) {
  if (error instanceof BaseError) {
    return error.isOperational;
  }
  return false;
}

function globalErrorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  return res.status(error.statusCode || 500).json({ message: error.message });
}

export { logError, logErrorMiddleware, isOperationalError, globalErrorHandler };
