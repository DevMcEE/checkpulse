import type { NextFunction, Request } from 'express';
import { ObjectId } from 'mongodb';
import makeConnection, { COLLECTION } from '../../db/conn';
import { GenericResponseDto } from '../../dto/GenericResponse.dto';
import { BadRequestError } from '../../errors/BadRequest.error';
import type { ApiResponse } from '../../types/type.d';

export const deletePingSetupController = async (
  req: Request,
  res: ApiResponse<{ deleted: boolean }>,
  next: NextFunction,
) => {
  try {
    const db = await makeConnection();
    const userUuid = req.header('user-uuid');
    const pingSetupsCollection = db?.collection(COLLECTION.pingSetups);
    const { id } = req.params;

    const result = await pingSetupsCollection?.findOneAndDelete({
      _id: ObjectId.createFromHexString(id),
      userUuid,
    });

    if (!result) {
      throw new BadRequestError('Document not found');
    }

    const dto = new GenericResponseDto(undefined, { deleted: true });
    return res.status(200).json(dto);
  } catch (err) {
    next(err);
  }
};
