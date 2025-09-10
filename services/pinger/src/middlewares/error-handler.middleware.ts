import type { NextFunction, Request, Response } from 'express';
import { MongoServerError } from 'mongodb';
import { ZodError } from 'zod';
import { BadRequestError } from '../errors/BadRequest.error';
import { NotFoundError } from '../errors/NotFound.error';
import { UnauthorizedError } from '../errors/Unauthorized.error';

// Unused arguments in "errorHandlerMiddleware" should be left in place,
// because without them, express will not recognize this handler as an error handler.

export const errorHandlerMiddleware = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'Validation error',
    });
  }
  if (err instanceof BadRequestError) {
    return res.status(400).json({
      error: err.message,
    });
  }
  if (err instanceof MongoServerError) {
    if (typeof err.code === 'number' && err.code === 11000) {
      res.status(409).json({
        error: 'Duplicate setup: this target already exists for this user',
      });
    }
  }
  if (err instanceof UnauthorizedError) {
    return res.status(401).json({
      error: err.message,
    });
  }
  if (err instanceof NotFoundError) {
    return res.status(404).json({
      error: err.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: err instanceof Error ? err.message : String(err),
  });
};
