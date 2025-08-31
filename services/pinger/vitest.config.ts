/// <reference types="vitest" />
import { defineConfig } from 'vite';

export default defineConfig({
  root: __dirname,
  test: {
    setupFiles: ['vitest.setup.ts'],
    clearMocks: true,
    restoreMocks: true,
  },
});
