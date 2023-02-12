import { ApiError } from '../exceptions/apiError';
import { Request, Response, NextFunction } from "express";

export function errorMiddleware(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof ApiError) {
    const { status, message, errors } = err;

    return res.status(status).json({ message, errors, });
  }
  console.log(err);
  return res.status(500).json({ message: 'Unexpected error!' })
};

