import test from "node:test";
import assert from "node:assert";
import request from "supertest";
import app from "../dist/index.js";

test("GET /ping/:resource should return 200 and JSON with response-code and response-time", async () => {
  const res = await request(app).get("/ping/youtube.com?timeout=3000");

  assert.strictEqual(res.statusCode, 200);
  assert.ok(res.body["response-code"] >= 200 && res.body["response-code"] < 600);
  assert.ok(typeof res.body["response-time"] === "number");
});

test("GET /ping/:resource should return 404 for invalid resource", async () => {
  const res = await request(app).get("/ping/nonexistent.invalid?timeout=1000");

  assert.strictEqual(res.statusCode, 404);
});
