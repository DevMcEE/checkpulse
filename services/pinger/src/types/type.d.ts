import type { Response } from 'express';

export type SuccessResponse<T = unknown> = {
  meta?: Record<string, unknown>;
  data?: T;
};

export type ErrorResponse = {
  error: string;
};

export type ApiResponse<T = unknown> = Response<
  SuccessResponse<T> | ErrorResponse
>;
