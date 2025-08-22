import type { NextFunction, Request, Response } from "express";
import type { ISchemeProps } from "../types/api.interfaces"

export const pingMiddleware = (props: ISchemeProps) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try{
            const address = decodeURIComponent(req.params.address);
            if (!address) {
                res.status(400).json({
                    error: `${props.hostType} is required`
                })
                return
            }
            props.scheme.parse(address);

            return next();
        }
        catch(err){
            return next(err)
        }
    }
}
