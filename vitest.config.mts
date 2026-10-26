import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: { tsconfigPaths: true },
  test: {
    environment: 'jsdom',
    globals: true,
    // Business dates are civil dates in Brasília; tests run in that zone like the users' browsers.
    env: { TZ: 'America/Sao_Paulo' },
    setupFiles: ['./src/test/setup.ts'],
    // `server-only` throws outside a React Server environment; tests import server modules directly.
    alias: { 'server-only': new URL('./src/test/serverOnlyStub.ts', import.meta.url).pathname },
  },
});
