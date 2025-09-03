import type { NextFunction, Request, Response } from 'express';
import makeConnection, { COLLECTION } from '../../db/conn';

export const createPingSetupController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const db = await makeConnection();
    const pingSetupsCollection = db?.collection(COLLECTION.pingSetups);
    const result = await pingSetupsCollection?.insertOne({
      ...req.body,
      userUuid: req.header('user-uuid'),
    });
    if (result?.insertedId) {
      return res.status(200).json({
        success: true,
        insertedId: result.insertedId,
      });
    }
    return res.status(500).json({
      success: false,
    });
  } catch (err: unknown) {
    return next(err);
  }
};
