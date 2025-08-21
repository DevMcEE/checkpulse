import { describe, expect, it } from "vitest";
import { ZodError } from "zod";
import { ipv4Scheme } from "../src/schemes/ip.scheme";

const invalidAddresses = [
  "123",
  "002.001",
  "999.999.999.999",
  "qwerty.com",
  "266.266.266.266",
];
const validAddresses = [
  "172.16.254.1:8000",
  "192.168.0.1",
  "11.22.33.44",
  "172.16.254.1:8000/code?as=123",
];

describe("IPv4 scheme", () => {
  it.each(invalidAddresses)(
    "Should throw the validation error",
    async (address) => {
      expect(() => ipv4Scheme.parse(address)).toThrow(ZodError);
    },
  );
  it.each(validAddresses)(
    "Should not throw the validation error",
    async (address) => {
      expect(() => ipv4Scheme.parse(address)).not.toThrow();
    },
  );
});
