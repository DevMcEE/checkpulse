import { Request, Response, NextFunction } from "express"
import { BadRequestError } from "../../errors/BadRequest.error";

export const idValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try{
        
        const id = req.params["id"]
        if(!id){
            throw new BadRequestError("Id is missing");
        }
        next()
    }
    catch(err:unknown){
        return next(err)
    }

}