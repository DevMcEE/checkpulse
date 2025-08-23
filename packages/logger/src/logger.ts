import { pino } from 'pino';

export const logger = pino();
export type Logger = typeof logger;
