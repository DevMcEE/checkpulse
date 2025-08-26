import { Request, Response, NextFunction } from "express"
import { BadRequestError } from "../../errors/BadRequest.error"
import { pingSetupBodyScheme } from "../../schemes/pingSetup/pingSetup.scheme";

export const dataValidationMiddleware = (req: Request, _res: Response, next: NextFunction) => {
    if(req.body){
        try{
            pingSetupBodyScheme.parse(req.body);
            return next()
        }
        catch(err: unknown){
            return next(err)
        }
    }
    else {
        return next(new BadRequestError("Body is missing or type is invalid"))
    }
}