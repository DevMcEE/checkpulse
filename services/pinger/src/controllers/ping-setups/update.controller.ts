import type { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import makeConnection, { COLLECTION } from '../../db/conn';
import { BadRequestError } from '../../errors/BadRequest.error';

export const updatePingSetupController = async (
  req: Request,
  res: Response,
) => {
  const db = await makeConnection();
  const pingSetupsCollection = db?.collection(COLLECTION.pingSetups);
  const { id } = req.params;
  const result = await pingSetupsCollection?.updateOne(
    {
      _id: ObjectId.createFromHexString(id),
    },
    {
      $set: req.body,
    },
  );
  if (!result?.modifiedCount) {
    throw new BadRequestError('Document not found');
  }
  return res.status(200).json({
    success: true,
  });
};
