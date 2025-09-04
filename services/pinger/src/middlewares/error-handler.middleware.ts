import type { NextFunction, Request, Response } from 'express';
import { MongoServerError } from 'mongodb';
import { ZodError } from 'zod';
import { BadRequestError } from '../errors/BadRequest.error';
import { StatusCodeError } from '../errors/StatusCodeError.error';

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
  if (err instanceof StatusCodeError || err instanceof BadRequestError) {
    return res.status(err.statusCode).json({
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

  return res.status(500).json({
    success: false,
    message: err instanceof Error ? err.message : String(err),
  });
};
