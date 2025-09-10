import type { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../errors/Unauthorized.error';

export function requireUserUuid(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const userUuid = req.header('user-uuid');
  if (!userUuid) return next(new UnauthorizedError('Unauthorized access'));
  next();
}
