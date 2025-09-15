import type { NextFunction, Request } from 'express';
import makeConnection, { COLLECTION } from '../../db/conn';
import { GenericResponseDto } from '../../dto/GenericResponse.dto';
import type { ApiResponse } from '../../types/type.d';

export const getAllPingSetupController = async (
  req: Request,
  res: ApiResponse<unknown[]>,
  next: NextFunction,
) => {
  try {
    const db = await makeConnection();
    const userUuid = req.header('user-uuid');
    const pingSetupsCollection = db?.collection(COLLECTION.pingSetups);
    const documents = await pingSetupsCollection
      ?.find({
        userUuid,
      })
      .toArray();

    const dto = new GenericResponseDto(undefined, documents ?? []);
    return res.status(200).json(dto);
  } catch (err) {
    next(err);
  }
};
