import type { NextFunction, Request, Response } from "express";
import z from "zod";
import type { IResponse, ISchemeProps } from "../types/api.interfaces";
import { getClearResponse } from "../utils/getClearResponse";

export const pingMiddleware = (props: ISchemeProps) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const response: IResponse = getClearResponse();
    try {
      const address = decodeURIComponent(req.params.address);

      if (!address) {
        response.data.code = 400;
        response.data.message = `${props.hostType} is required`;
        res.status(200).json(response);
        return;
      }
      props.scheme.parse(address);
      next();
      return;
    } catch (err) {
      if (err instanceof z.ZodError) {
        response.data.code = 400;
        response.data.message = `${props.hostType} isn't valid`;
        res.status(200).json(response);
        return;
      } else {
        response.data.code = 500;
        response.data.message = "Server side error";

        res.status(500).json(response);
        return;
      }
    }
  };
};
