import type { HttpLogger } from 'pino-http';
import { pinoHttp } from 'pino-http';

export const httpLogger: HttpLogger = pinoHttp();
