import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    exclude: ['src/generated/**', 'node_modules/**'],
    restoreMocks: true,
    clearMocks: true,
    env: {
      VITE_SERVER_URL: 'http://localhost:3000/graphql',
      VITE_SUPABASE_URL: 'http://localhost:54321',
      VITE_SUPABASE_PUBLISHABLE_KEY: 'test-supabase-key',
      VITE_API_KEY: 'test-api-key',
      VITE_AUTH_DOMAIN: 'test.firebaseapp.com',
      VITE_PROJECT_ID: 'test-project',
      VITE_STORAGE_BUCKET: 'test.appspot.com',
      VITE_MESSAGING_SENDER_ID: '123456789',
      VITE_MEASUREMENT_ID: 'G-TEST',
      VITE_APP_ID: '1:123456789:web:test',
    },
  },
});
