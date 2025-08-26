import { NextFunction, Request, Response } from "express"
import makeConnection, { COLLECTION } from "../../db/conn"

export const createPingSetupController = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const db = await makeConnection();
        const pingSetupsCollection = db?.collection(COLLECTION.pingSetups)
        await pingSetupsCollection?.insertOne(req.body)

        return res.status(200).json({
            success: true
        })
    }
    catch(err:unknown){
        return next(err);
    }

}