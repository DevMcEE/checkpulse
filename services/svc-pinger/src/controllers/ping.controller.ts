import axios from "axios";
import type { NextFunction, Request, Response } from "express";
import { PingResponse } from "../dto/pingResponse.dto";
import { DEFAULT_TIMEOUT, MAX_TIMEOUT } from "../config";

const httpPrefix = "https://"

export const pingController = async (req: Request, res: Response, next: NextFunction) => {
    const timeout = typeof(req.query.timeout) === "string" ? parseInt(req.query.timeout) : DEFAULT_TIMEOUT;
    const timeoutMs = Math.min(timeout || DEFAULT_TIMEOUT, MAX_TIMEOUT);
    const address = decodeURIComponent(req.params.address);
    const start = Date.now();
    try {
        const resourceResponse = await axios.get(httpPrefix + address, { timeout: timeoutMs });
        
        const pingResponse = new PingResponse({
            dataCode: resourceResponse.status,
            dataTime: Date.now() - start,
            dataType: resourceResponse.headers["content-type"],
            dataMessage: resourceResponse.data,
        })
        return res.status(200).json(pingResponse);
    } catch (err: any) {
        const responseTime = Date.now() - start;
        
        if (err.code === "ECONNABORTED") {
            const pingResponse = new PingResponse({
                dataTime: responseTime,
                dataTimeouted: true,
            })
            return res.status(200).json(pingResponse);
        }
        if (err.response) {
            const errResponse = err.response
            const pingResponse = new PingResponse({
                dataCode: errResponse.status,
                dataType: errResponse.headers["content-type"],
                dataTime: responseTime,
                dataMessage: errResponse.message,
            })
            return res.status(200).json(pingResponse);
        }
        return next(err);
    }
}