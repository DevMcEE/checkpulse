import type { NextFunction, Request } from 'express';
import makeConnection, { COLLECTION } from '../../db/conn';
import { GenericResponseDto } from '../../dto/GenericResponse.dto';
import type { ApiResponse } from '../../types/type.d';

export const createPingSetupController = async (
  req: Request,
  res: ApiResponse<{ insertedId: string }>,
  next: NextFunction,
) => {
  try {
    const db = await makeConnection();
    const pingSetupsCollection = db?.collection(COLLECTION.pingSetups);
    const result = await pingSetupsCollection?.insertOne({
      ...req.body,
      userUuid: req.header('user-uuid'),
    });

    if (!result?.insertedId) {
      throw new Error('Failed to create ping setup');
    }

    const dto = new GenericResponseDto(undefined, {
      insertedId: result.insertedId.toString(),
    });
    return res.status(200).json(dto);
  } catch (err) {
    next(err);
  }
};
