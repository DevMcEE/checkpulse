import { NextFunction, Request, Response } from 'express';
import { StatusCodeError } from '../errors/StatusCodeError.error';

export function requireUserUuid(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const userUuid = req.header('user-uuid');
  try {
    if (!userUuid) {
      throw new StatusCodeError('User uuid is missing', 401);
    }
  } catch (err: unknown) {
    next(err);
  }
  next();
}
