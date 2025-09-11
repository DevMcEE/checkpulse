import { NextFunction, Request, Response } from 'express';
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
  let message = err instanceof Error ? err.message : String(err);
  let statusCode = 500;

  switch (true) {
    case err instanceof ZodError: {
      message = 'Validation error';
      statusCode = 400;
      break;
    }
    case err instanceof BadRequestError: {
      statusCode = 400;
      break;
    }
    case err instanceof MongoServerError: {
      if (typeof err.code === 'number' && err.code === 11000) {
        message = 'Duplicate setup: this target already exists for this user';
        statusCode = 409;
      }
      break;
    }
    case err instanceof UnauthorizedError: {
      statusCode = 401;
      break;
    }
    case err instanceof NotFoundError: {
      statusCode = 404;
      break;
    }
  }

  return res.status(statusCode).json({
    error: message,
  });
};
