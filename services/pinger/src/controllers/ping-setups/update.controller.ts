import type { NextFunction, Request } from 'express';
import { ObjectId } from 'mongodb';
import makeConnection, { COLLECTION } from '../../db/conn';
import { GenericResponseDto } from '../../dto/GenericResponse.dto';
import { BadRequestError } from '../../errors/BadRequest.error';
import type { ApiResponse } from '../../types/type.d';

export const updatePingSetupController = async (
  req: Request,
  res: ApiResponse<{ updated: boolean }>,
  next: NextFunction,
) => {
  try {
    const db = await makeConnection();
    const pingSetupsCollection = db?.collection(COLLECTION.pingSetups);
    const userUuid = req.header('user-uuid');
    const { id } = req.params;

    const result = await pingSetupsCollection?.findOneAndUpdate(
      {
        _id: ObjectId.createFromHexString(id),
        userUuid,
      },
      {
        $set: req.body,
      },
    );

    if (!result) {
      throw new BadRequestError('Document not found');
    }

    const dto = new GenericResponseDto(undefined, { updated: true });
    return res.status(200).json(dto);
  } catch (err) {
    next(err);
  }
};
