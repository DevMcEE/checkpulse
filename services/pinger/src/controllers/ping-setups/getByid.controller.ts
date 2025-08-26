import { NextFunction, Request, Response } from "express"
import makeConnection, { COLLECTION } from "../../db/conn"
import { ObjectId } from "mongodb";

export const getByIdPingSetupController = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const db = await makeConnection();
        const pingSetupsCollection = db?.collection(COLLECTION.pingSetups)
        const id = req.params["id"];
        const document = await pingSetupsCollection?.findOne({
            _id: new ObjectId(id)
        })
        res.status(200).json({
            data: document
        })
    }
    catch(err:unknown){
        return next(err)
    }
}