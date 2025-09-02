import { NextFunction, Request, Response } from 'express';
import { BadRequestError } from '../errors/BadRequest.error';
import { uuidSchema } from '../schemas/pingSetup/uuid.scheme';

export function requireUserUuid(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userUuid = req.header('user-uuid');
  try {
    if (!userUuid) {
      throw new BadRequestError('User uuid is missing');
    }
    uuidSchema.parse(userUuid);
  } catch (err: unknown) {
    next(err);
  }
  next();
}
