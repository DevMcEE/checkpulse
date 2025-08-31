import { type Collection, type Db, ObjectId } from 'mongodb';
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import makeConnection, { COLLECTION } from '../../src/db/conn';
import type { PingSetup } from '../../src/types/ping-setup.types';
import { getBaseUrl } from '../../src/utils/base-url-helpers';

let db: Db;
let collection: Collection<PingSetup>;

const mockDocument: PingSetup = {
  resource: 'example.com',
  timeout: 5000,
  responseCode: 200,
  contentType: 'text/plain',
  startTime: new Date(),
  period: 60,
  incedentThreshold: 3,
  recoveryThreshold: 2,
  notificationChannels: null,
} as const;

describe('PingSetups CRUD', () => {
  let BASE_URL = '';
  beforeAll(async () => {
    BASE_URL = getBaseUrl();
    db = await makeConnection();
    collection = db.collection(COLLECTION.pingSetups);
  });

  beforeEach(async () => {
    await collection.deleteMany({});
  });

  it('POST /ping-setups', async () => {
    const res = await fetch(`${BASE_URL}/ping-setups`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mockDocument),
    });

    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json).toHaveProperty('success', true);

    const created = await collection.findOne({
      _id: ObjectId.createFromHexString(json.insertedId),
    });

    expect(created).not.toBeNull();
    expect(created?.resource).toBe(mockDocument.resource);
  });

  it('GET /ping-setups', async () => {
    await collection.insertOne(mockDocument);

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

    expect(res.status).toBe(200);
    expect(json.data.resource).toBe(mockDocument.resource);
  });

  it('PUT /ping-setups/:id', async () => {
    const { insertedId } = await collection.insertOne(mockDocument);

    const res = await fetch(`${BASE_URL}/ping-setups/${insertedId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        resource: 'example.com',
        timeout: 9999,
        responseCode: 200,
        contentType: 'text/plain',
        startTime: new Date().toISOString(),
        period: 50,
        incedentThreshold: 3,
        recoveryThreshold: 2,
        notificationChannels: null,
      }),
    });

    expect(res.status).toBe(200);
    const inDb = await collection.findOne({ _id: insertedId });
    expect(inDb?.timeout).toBe(9999);
  });

  it('DELETE /ping-setups/:id', async () => {
    const { insertedId } = await collection.insertOne(mockDocument);
    const res = await fetch(
      `${BASE_URL}/ping-setups/${(insertedId as ObjectId).toString()}`,
      {
        method: 'DELETE',
      },
    );

    expect(res.status).toBe(200);

    const inDb = await collection.findOne({ _id: insertedId });
    expect(inDb).toBeNull();
  });
});
