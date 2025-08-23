import { pinoHttp } from 'pino-http';
import type { HttpLogger } from 'pino-http';

export const httpLogger: HttpLogger = pinoHttp();
