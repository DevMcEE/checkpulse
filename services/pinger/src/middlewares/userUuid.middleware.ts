import { NextFunction, Request, Response } from 'express';
import { StatusCodeError } from '../errors/StatusCodeError.error';

export function requireUserUuid(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const userUuid = req.header('user-uuid');
  if (!userUuid) return next(new StatusCodeError('Unauthorized access', 401));
  next();
}
