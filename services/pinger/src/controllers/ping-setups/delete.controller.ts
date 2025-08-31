import type { NextFunction, Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import makeConnection, { COLLECTION } from '../../db/conn';
import { BadRequestError } from '../../errors/BadRequest.error';

export const deletePingSetupController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const db = await makeConnection();
    const pingSetupsCollection = db?.collection(COLLECTION.pingSetups);
    const { id } = req.params;
    const result = await pingSetupsCollection?.deleteOne({
      _id: ObjectId.createFromHexString(id),
    });

    if (!result?.deletedCount) {
      throw new BadRequestError('Document not found');
    }

    return res.status(200).json({
      success: true,
    });
  } catch (err: unknown) {
    return next(err);
  }
};
