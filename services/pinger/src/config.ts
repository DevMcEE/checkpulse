import path from 'node:path';
import { config } from 'dotenv';

config({
  path: [
    path.resolve(process.cwd(), '.env'),
    path.resolve(process.cwd(), `.env.${process.env.NODE_ENV || 'dev'}`),
  ],
  override: true,
});

export const SERVICE_NAME = 'pinger';
export const PORT = Number(process.env.SERVICE_PINGER_PORT) || 3000;
export const MAX_TIMEOUT = Number(process.env.MAX_TIMEOUT) || 60000;
export const DEFAULT_TIMEOUT: number =
  Number(process.env.DEFAULT_TIMEOUT) || 30000;
