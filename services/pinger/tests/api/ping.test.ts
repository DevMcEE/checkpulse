import nock from 'nock';
import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import makeConnection, { COLLECTION } from '../../src/db/conn';
import { getBaseUrl } from '../../src/utils/base-url-helpers';

const pingedtarget = 'example.com';

describe('Ping Service', () => {
  let BASE_URL = '';
  beforeAll(() => {
    BASE_URL = getBaseUrl();
  });
  beforeEach(async () => {
    const db = await makeConnection();
    const pingLogCollection = db?.collection(COLLECTION.logs);
    await pingLogCollection.drop();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it("Should return code 200 and type 'text/plain'", async () => {
    const url = `${BASE_URL}/ping/url/example.com?timeout=4000`;
    nock(`https://${pingedtarget}`).get('/').reply(200, 'uhm, okay', {
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
    nock(`https://${pingedtarget}`).get('/').delay(50).reply(200, 'OK');

    const res = await fetch(`${BASE_URL}/ping/url/${pingedtarget}?timeout=10`);
    const json = await res.json();

    expect(json.data).toHaveProperty('timeouted', true);
  });
});
