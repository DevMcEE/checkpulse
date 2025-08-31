import type { NextFunction, Request, Response } from 'express';
import makeConnection, { COLLECTION } from '../../db/conn';

export const getAllPingSetupController = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const db = await makeConnection();
    const pingSetupsCollection = db?.collection(COLLECTION.pingSetups);
    const documents = await pingSetupsCollection?.find().toArray();
    res.status(200).json({
      data: documents,
    });
  } catch (err: unknown) {
    return next(err);
  }
};
