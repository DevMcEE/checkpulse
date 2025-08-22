import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export const errorHandlerMiddleware = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err);

    if (err instanceof ZodError) {
        return res.status(400).json({
            error: "Validation error"
        });
    } else {
        return res.status(500).json({
            success: false,
            message: err instanceof Error ? err.message : String(err)
        });
    }
};
