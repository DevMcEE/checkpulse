import { NextFunction, Request, Response } from "express"
import makeConnection, { COLLECTION } from "../../db/conn"
import { ObjectId } from "mongodb";
import { BadRequestError } from "../../errors/BadRequest.error";

export const updatePingSetupController = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const db = await makeConnection();
        const pingSetupsCollection = db?.collection(COLLECTION.pingSetups)
        const id = req.params["id"]
        const result = await pingSetupsCollection?.updateOne({
            _id: new ObjectId(id)
        },{
            $set: req.body
        })
        if(result?.modifiedCount == 0){
            throw new BadRequestError("Document not found");
        }
        return res.status(200).json({
            success: true
        })
    }
    catch(err:unknown){
        return next(err)
    }
}