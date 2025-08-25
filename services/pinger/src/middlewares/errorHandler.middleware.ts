import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { StatusCodeError } from '../errors/StatusCodeError.error';
import { BadRequestError } from '../errors/BadRequest.error';


// Unused arguments in "errorHandlerMiddleware" should be left in place,
// because without them, express will not recognize this handler as an error handler.


export const errorHandlerMiddleware = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  console.error(err);
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'Validation error',
    });
  }
  if (err instanceof StatusCodeError || err instanceof BadRequestError) {
    return res.status(err.statusCode).json({
      error: err.message
    })
  }
  return res.status(500).json({
      success: false,
      message: err instanceof Error ? err.message : String(err),
    });
};
