import type { AddressInfo } from 'node:net';
import { logger } from '@checkpulse/logger';
import { startServer } from './app.js';
import { getBaseUrlFromAddress } from './utils/base-url-helpers.js';
import { waitListeningServer } from './utils/wait-listening-server.js';

const server = startServer();
await waitListeningServer(server);
const addr = server.address() as AddressInfo;
const baseUrl = getBaseUrlFromAddress(addr);

logger.info(`Server is running at ${baseUrl}`);
