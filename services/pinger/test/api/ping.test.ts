import type { Server } from 'node:http';
import nock from 'nock';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { startServer } from '../../src/app';
import { PORT } from '../../src/config';
import { logger } from '@checkpulse/logger';
import makeConnection, { COLLECTION } from '../../src/db/conn';

let server: Server;
const BASE_URL = `http://localhost:${PORT}`;
const pingedResource = 'example.com';

beforeAll(async () => {
  server = startServer(PORT);
  const db = await makeConnection()
  const pingLogCollection = await db?.collection(COLLECTION.logs);
  await pingLogCollection.drop();
});

afterAll(() => {
  server.close(() => logger.info('Server closed'));
});

describe('Ping Service', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it("Should return code 200 and type 'text/plain'", async () => {
    const url = `${BASE_URL}/ping/url/example.com?timeout=4000`;
    nock(`https://${pingedResource}`).get('/').reply(200, 'uhm, okay', {
      'Content-Type': 'text/plain',
    });

    const res = await fetch(url);
    const json = await res.json();

    expect(json.data).toHaveProperty('code', 200);
    expect(json.data).toHaveProperty('type', 'text/plain');
  });

  it('Server should return code 400 and error message cause of invalid address', async () => {
    const url = `${BASE_URL}/ping/url/example?timeout=4000`;

    const res = await fetch(url);
    const json = await res.json();

    expect(res).toHaveProperty('status', 400);
    expect(json).toHaveProperty('error');
  });

  it('Server should return code 400 and error message cause of invalid ip', async () => {
    const url = `${BASE_URL}/ping/ip/945.123.112`;

    const res = await fetch(url);
    const json = await res.json();

    expect(res).toHaveProperty('status', 400);
    expect(json).toHaveProperty('error');
  });

  it('Should return timeouted = true', async () => {
    nock(`https://${pingedResource}`).get('/').delay(50).reply(200, 'OK');

    const res = await fetch(
      `${BASE_URL}/ping/url/${pingedResource}?timeout=10`,
    );
    const json = await res.json();

    expect(json.data).toHaveProperty('timeouted', true);
  });
});
