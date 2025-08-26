import axios, { type AxiosError } from 'axios';
import type { NextFunction, Request, Response } from 'express';
import { DEFAULT_TIMEOUT, MAX_TIMEOUT } from '../../config';
import { PingResponse } from '../../dto/PingResponse.dto';
import makeConnection, { COLLECTION } from '../../db/conn';
import { logger } from '@checkpulse/logger';

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
    const resourceResponse = await axios.get(httpPrefix + address, {
      timeout: timeoutMs,
    });

    const response = new PingResponse({
      dataCode: resourceResponse.status,
      dataTime: Date.now() - start,
      dataType: resourceResponse.headers['content-type'],
      dataMessage: resourceResponse.statusText,
    });

    const pingResult = await pingLogCollection?.insertOne(response);
    logger.info(pingResult, 'Response is logged');

    return res.status(200).json(response);
  } catch (err: unknown) {
    const responseTime = Date.now() - start;

    if ((err as AxiosError).code === 'ECONNABORTED') {
      return res.status(200).json(
        new PingResponse({
          dataTime: responseTime,
          dataTimeouted: true,
        }),
      );
    }

    if ((err as AxiosError).response) {
      const errResponse = (err as AxiosError).response;

      return res.status(200).json(
        new PingResponse({
          dataCode: errResponse?.status,
          dataType: errResponse?.headers['content-type'],
          dataTime: responseTime,
          dataMessage: (err as AxiosError)?.message,
        }),
      );
    }
    return next(err);
  }
};
