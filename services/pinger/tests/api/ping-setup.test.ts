import { type Collection, type Db, ObjectId } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import makeConnection, { COLLECTION } from '../../src/db/conn';
import type { PingSetup } from '../../src/types/ping-setup.types';
import { getBaseUrl } from '../../src/utils/base-url-helpers';

let db: Db;
let collection: Collection<PingSetup>;

const mockDocument: PingSetup = {
  target: 'example.com',
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
    const userUuid = uuidv4();
    const res = await fetch(`${BASE_URL}/ping-setups`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'user-uuid': userUuid },
      body: JSON.stringify(mockDocument),
    });

    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json).toHaveProperty('success', true);

    const created = await collection.findOne({
      _id: ObjectId.createFromHexString(json.insertedId),
    });

    expect(created).not.toBeNull();
    expect(created?.target).toBe(mockDocument.target);
  });

  it('GET /ping-setups', async () => {
    const userUuid = uuidv4();
    await collection.insertOne({ ...mockDocument, userUuid });

    const res = await fetch(`${BASE_URL}/ping-setups`, {
      method: 'GET',
      headers: { 'user-uuid': userUuid },
    });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(Array.isArray(json.data)).toBe(true);
    expect(json.data.length).toBeGreaterThan(0);
  });

  it('GET /ping-setups/:id', async () => {
    const userUuid = uuidv4();
    const { insertedId } = await collection.insertOne({
      ...mockDocument,
      userUuid,
    });

    const res = await fetch(`${BASE_URL}/ping-setups/${insertedId}`, {
      method: 'GET',
      headers: { 'user-uuid': userUuid },
    });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.data.target).toBe(mockDocument.target);
  });

  it('PUT /ping-setups/:id', async () => {
    const userUuid = uuidv4();
    const { insertedId } = await collection.insertOne({
      ...mockDocument,
      userUuid,
    });

    const res = await fetch(`${BASE_URL}/ping-setups/${insertedId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'user-uuid': userUuid },
      body: JSON.stringify({
        target: 'example.com',
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
    const userUuid = uuidv4();

    const { insertedId } = await collection.insertOne({
      ...mockDocument,
      userUuid,
    });
    const res = await fetch(
      `${BASE_URL}/ping-setups/${(insertedId as ObjectId).toString()}`,
      {
        method: 'DELETE',
        headers: { 'user-uuid': userUuid },
      },
    );
    expect(res.status).toBe(200);

    const inDb = await collection.findOne({ _id: insertedId });
    expect(inDb).toBeNull();
  });
});
