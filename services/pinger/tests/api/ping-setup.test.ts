import { randomUUID } from 'node:crypto';
import { type Collection, type Db, ObjectId } from 'mongodb';
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

  it('should create a ping setup for the given user', async () => {
    const userUuid = randomUUID();
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
    expect(created?.userUuid).toBe(userUuid);
  });

  it('should return all ping setups for a given user', async () => {
    const userUuid = randomUUID();
    await collection.insertOne({ ...mockDocument, userUuid });
    await collection.insertOne({ ...mockDocument, userUuid: randomUUID() });

    const res = await fetch(`${BASE_URL}/ping-setups`, {
      method: 'GET',
      headers: { 'user-uuid': userUuid },
    });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(Array.isArray(json.data)).toBe(true);
    expect(json.data.every((d: any) => d.userUuid === userUuid)).toBe(true);
  });

  it('should return a single ping setup by id for the correct user', async () => {
    const userUuid = randomUUID();
    const otherUuid = randomUUID();
    const { insertedId } = await collection.insertOne({
      ...mockDocument,
      userUuid,
    });
    await collection.insertOne({ ...mockDocument, userUuid: otherUuid });

    const res = await fetch(`${BASE_URL}/ping-setups/${insertedId}`, {
      method: 'GET',
      headers: { 'user-uuid': userUuid },
    });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.data.userUuid).toBe(userUuid);
    expect(json.data.target).toBe(mockDocument.target);
  });

  it('should return 400 if ping setup does not exist for the given id', async () => {
    const userUuid = randomUUID();
    const fakeId = new ObjectId().toString();

    const res = await fetch(`${BASE_URL}/ping-setups/${fakeId}`, {
      method: 'GET',
      headers: { 'user-uuid': userUuid },
    });
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body).toHaveProperty('data', null);
  });

  it('should update a ping setup for the correct user', async () => {
    const userUuid = randomUUID();
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
    expect(inDb?.userUuid).toBe(userUuid);
  });

  it('should not update a ping setup if user uuid does not match', async () => {
    const { insertedId } = await collection.insertOne({
      ...mockDocument,
      userUuid: randomUUID(),
    });

    const res = await fetch(`${BASE_URL}/ping-setups/${insertedId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'user-uuid': randomUUID(),
      },
      body: JSON.stringify({ ...mockDocument, timeout: 8888 }),
    });

    expect(res.status).toBe(400);
  });

  it('should delete a ping setup for the correct user', async () => {
    const userUuid = randomUUID();
    const { insertedId } = await collection.insertOne({
      ...mockDocument,
      userUuid,
    });

    const res = await fetch(`${BASE_URL}/ping-setups/${insertedId}`, {
      method: 'DELETE',
      headers: { 'user-uuid': userUuid },
    });
    expect(res.status).toBe(200);

    const inDb = await collection.findOne({ _id: insertedId });
    expect(inDb).toBeNull();
  });

  it('should not delete a ping setup if user uuid does not match', async () => {
    const { insertedId } = await collection.insertOne({
      ...mockDocument,
      userUuid: randomUUID(),
    });

    const res = await fetch(`${BASE_URL}/ping-setups/${insertedId}`, {
      method: 'DELETE',
      headers: { 'user-uuid': randomUUID() },
    });

    expect(res.status).toBe(400);
    const inDb = await collection.findOne({ _id: insertedId });
    expect(inDb).not.toBeNull();
  });

  it('should return 401 if user uuid header is missing when creating a ping setup', async () => {
    const res = await fetch(`${BASE_URL}/ping-setups`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mockDocument),
    });

    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body).toHaveProperty('error');
    expect(body.error).toBe('Unauthorized access');
  });
});
