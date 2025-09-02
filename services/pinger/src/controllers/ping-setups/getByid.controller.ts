import type { NextFunction, Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import makeConnection, { COLLECTION } from '../../db/conn';

export const getByIdPingSetupController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const db = await makeConnection();
    const userUuid = req.header('user-uuid');
    const pingSetupsCollection = db?.collection(COLLECTION.pingSetups);
    const { id } = req.params;
    const document = await pingSetupsCollection?.findOne({
      _id: ObjectId.createFromHexString(id),
      userUuid,
    });
    res.status(200).json({
      data: document,
    });
  } catch (err: unknown) {
    return next(err);
  }
};
