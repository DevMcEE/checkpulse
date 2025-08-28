import type { Server } from 'node:http';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { startServer } from '../../src/app';
import { PORT } from '../../src/config';
import { logger } from '@checkpulse/logger';
import makeConnection, { client } from '../../src/db/conn';
import { ObjectId } from 'mongodb';

let server: Server;
let db: any;
let collection: any;

const BASE_URL = `http://localhost:${PORT}`;

const TEST_COLLECTION_NAME = 'pingSetups';

beforeAll(async () => {
  client.db("pinger_test");
  server = await startServer(PORT);
  db = await makeConnection();
  collection = db.collection(TEST_COLLECTION_NAME);
  await collection.deleteMany({});
});

beforeEach(async () => {
   await collection.deleteMany({})
});


afterAll(() => {
  server.close(() => logger.info('Server closed'));
});

describe('PingSetups CRUD', () => {
  const mockDocument = {
    resource: 'example.com',
    timeout: 5000,
    responseCode: 200,
    contentType: 'text/plain',
    startTime: new Date().toISOString(),
    period: 60,
    incedentThreshold: 3,
    recoveryThreshold: 2,
    notificationChannels: null
  };

  it('POST /ping-setups', async () => {
    const res = await fetch(`${BASE_URL}/ping-setups`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mockDocument),
    });

    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json).toHaveProperty("success", true)

    const created = await collection.findOne({ _id: json.insertedId });
    expect(created).not.toBeNull();
    expect(created.resource).toBe(mockDocument.resource);
   
  });

  it('GET /ping-setups', async () => {
    const {insertedId} = await collection.insertOne(mockDocument);

    const res = await fetch(`${BASE_URL}/ping-setups`);
    const json = await res.json();
 
    expect(res.status).toBe(200);
    expect(Array.isArray(json.data)).toBe(true);
    expect(json.data.length).toBeGreaterThan(0);
  });

  it('GET /ping-setups/:id', async () => {
    const { insertedId } = await collection.insertOne(mockDocument);

    const res = await fetch(`${BASE_URL}/ping-setups/${insertedId}`);
    const json = await res.json();
    expect(res.status).toBe(200);;
    expect(json.resource).toBe(mockDocument.resource);
  });

  it('PUT /ping-setups/:id', async () => {
    const { insertedId } = await collection.insertOne(mockDocument);

    const updated = { ...mockDocument, timeout: 9999 };

    const res = await fetch(`${BASE_URL}/ping-setups/${insertedId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    });

    const json = await res.json();
    expect(res.status).toBe(200);
    const inDb = await collection.findOne({ _id: insertedId });
    expect(inDb.timeout).toBe(9999);

  });

  it('DELETE /ping-setups/:id', async () => {
    const { insertedId }= await collection.insertOne(mockDocument);
    const res = await fetch(`${BASE_URL}/ping-setups/${(insertedId as ObjectId).toString()}`, {
      method: 'DELETE',
    });

    const json = await res.json();
     
    expect(res.status).toBe(200);

    const inDb = await collection.findOne({ _id: insertedId });
    expect(inDb).toBeNull();
  });
});
