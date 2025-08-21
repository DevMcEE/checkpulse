import axios from "axios";
import type { Request, Response } from "express";
import type { IResponse } from "../types/api.interfaces";
import { getClearResponse } from "../utils/getClearResponse";

const defaultTimeout = 30000;
const maxTimeout = 60000;
const httpPrefix = "https://";

export const pingController = async (req: Request, res: Response) => {
  const response: IResponse = getClearResponse();

  try {
    let timeoutMs = req.query.timeout
      ? parseInt(req.query.timeout as string)
      : defaultTimeout;
    const address = decodeURIComponent(req.params.address);
    if (timeoutMs > maxTimeout) timeoutMs = maxTimeout;
    const start = Date.now();
    try {
      const resourceResponse = await axios.get(httpPrefix + address, {
        timeout: timeoutMs,
      });
      const responseTime = Date.now() - start;
      const contentType = resourceResponse.headers["content-type"];
      const data = resourceResponse.data || null;
      response.data.code = resourceResponse.status;
      response.data.time = responseTime;
      response.data.type = contentType || null;
      response.data.message = data;
      res.status(200).json(response);
      return;
    } catch (err: any) {
      const responseTime = Date.now() - start;
      response.data.time = responseTime;

      if (err.code === "ECONNABORTED") {
        response.data.timeouted = true;
        res.status(200).json(response);
        return;
      }

      if (err.response) {
        response.data.code = err.response.status;
        response.data.type = err.response.headers["content-type"] || null;
        response.data.message = err.response.message || null;
        res.status(200).json(response);
        return;
      }
      res.status(500).json(response);
      return;
    }
  } catch (err: any) {
    res.sendStatus(500).json(response);
    return;
  }
};
