import type { NextFunction, Request, Response } from 'express';
import type { ZodType } from 'zod';
import { BadRequestError } from '../errors/BadRequest.error';
import type { ISchemeProps } from '../types/api.types';

export const validateRequestBody =
  (schema: ZodType) => (req: Request, _res: Response, next: NextFunction) => {
    if (!req.body) {
      throw new BadRequestError('Body is missing or type is invalid');
    }

    schema.parse(req.body);
    next();
  };

export const validateRequestParamas = (props: ISchemeProps) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const address = decodeURIComponent(req.params.address);

    props.scheme.parse(address);
    return next();
  };
};
