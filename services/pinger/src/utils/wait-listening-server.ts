import type { Server } from 'node:http';

export function waitListeningServer(srv: Server) {
  return new Promise<void>((resolve, reject) => {
    if (srv.listening) return resolve();
    srv.once('listening', () => resolve());
    srv.once('error', reject);
  });
}
