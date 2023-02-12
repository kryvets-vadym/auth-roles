import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../exceptions/apiError';
import * as tokenService from '../service/tokenService';

export interface RequestWithUser extends Request {
  user?: any,
}

export function authMiddleware(req: RequestWithUser, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    throw ApiError.UnauthorizedError();
  }

  const [, accessToken] = authHeader.split(' ');

  if (!accessToken) {
    throw ApiError.UnauthorizedError();
  }

  const userData = tokenService.validateAccessToken(accessToken);

  if (!userData) {
    throw ApiError.UnauthorizedError();
  }

  req.user = userData;

  next();
}
