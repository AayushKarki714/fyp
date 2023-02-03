import { Request, Response, NextFunction } from "express";

function catchAsyncErrors(
  middleware: (req: Request, res: Response, next: NextFunction) => any
) {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      await middleware(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}

export default catchAsyncErrors;
