import { NextFunction, Request, Response } from 'express';
import { StatusCodeError } from '../errors/StatusCodeError.error';

export function requireUserUuid(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const userUuid = req.header('user-uuid');
  if (!userUuid) next(new StatusCodeError('User uuid is missing', 401));
  next();
}
