import { logger } from '@checkpulse/logger';
import axios, { type AxiosError } from 'axios';
import type { NextFunction, Request, Response } from 'express';
import { DEFAULT_TIMEOUT, MAX_TIMEOUT } from '../../config';
import makeConnection, { COLLECTION } from '../../db/conn';
import { GenericResponseDto } from '../../dto/GenericResponse.dto';
import { PingResponseDto } from '../../dto/PingResponse.dto';

const httpPrefix = 'https://';

export const pingController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const timeout =
    typeof req.query.timeout === 'string'
      ? parseInt(req.query.timeout)
      : DEFAULT_TIMEOUT;

  const db = await makeConnection();
  const pingLogCollection = db?.collection(COLLECTION.logs);

  const timeoutMs = Math.min(timeout || DEFAULT_TIMEOUT, MAX_TIMEOUT);
  const address = decodeURIComponent(req.params.address);
  const start = Date.now();

  try {
    const targetResponse = await axios.get(httpPrefix + address, {
      timeout: timeoutMs,
    });

    const response = new PingResponseDto({
      dataCode: targetResponse.status,
      dataTime: Date.now() - start,
      dataType: targetResponse.headers['content-type'],
      dataMessage: targetResponse.statusText,
    });

    await pingLogCollection?.insertOne(response);
    logger.info(
      { address, status: targetResponse.status },
      'Response is logged',
    );

    return res
      .status(200)
      .json(new GenericResponseDto(undefined, response.data));
  } catch (err: unknown) {
    logger.error(err, 'Ping Controller');
    const responseTime = Date.now() - start;

    if ((err as AxiosError).code === 'ECONNABORTED') {
      const response = new PingResponseDto({
        dataTime: responseTime,
        dataTimeouted: true,
      });
      return res
        .status(200)
        .json(new GenericResponseDto(undefined, response.data));
    }

    if ((err as AxiosError).response) {
      const errResponse = (err as AxiosError).response;
      const response = new PingResponseDto({
        dataCode: errResponse?.status,
        dataType: errResponse?.headers['content-type'],
        dataTime: responseTime,
        dataMessage: (err as AxiosError)?.message,
      });
      return res
        .status(200)
        .json(new GenericResponseDto(undefined, response.data));
    }

    return next(err);
  }
};
