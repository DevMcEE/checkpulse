import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { logger } from '@checkpulse/logger';
import nock from 'nock';
import { afterAll, beforeAll } from 'vitest';
import { startServer } from './src/app';
import { closeDbConnection } from './src/db/conn';
import {
  getBaseUrlFromAddress,
  setBaseUrl,
} from './src/utils/base-url-helpers';
import { waitListeningServer } from './src/utils/wait-listening-server';
export let server: Server;

beforeAll(async () => {
  try {
    logger.info('Starting Pinger TEST API');
    server = startServer();

    await waitListeningServer(server);
    const addr = server.address() as AddressInfo;
    const baseUrl = getBaseUrlFromAddress(addr);

    logger.info(`test server listening at ${baseUrl}`);
    setBaseUrl(baseUrl);
  } catch (error) {
    logger.error(error, 'Failed start server');
  }

  nock.disableNetConnect();
  nock.enableNetConnect(/^(localhost|127\.0\.0\.1)(:\d+)?$/);
});

afterAll(async () => {
  logger.info('Closing all open connection');
  await new Promise<void>((resolve, reject) => {
    server.closeIdleConnections();
    server.closeAllConnections();
    server.close((err) => (err ? reject(err) : resolve()));
  });

  await closeDbConnection();
  logger.info('All connections are closed');
  nock.cleanAll();
  nock.enableNetConnect();
});
