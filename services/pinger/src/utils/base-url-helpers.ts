import type { AddressInfo } from 'node:net';

let baseUrl: string | null = null;

export function setBaseUrl(url: string) {
  baseUrl = url;
}

export function getBaseUrl() {
  if (!baseUrl) throw new Error('BASE_URL is not set yet');
  return baseUrl;
}

export function getBaseUrlFromAddress(addr: AddressInfo): string {
  const host =
    addr.address === '::' || addr.address === '::1'
      ? 'localhost'
      : addr.address;
  return `http://${host}:${addr.port}`;
}
