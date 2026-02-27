// vitest.config.js
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    setupFiles: ['./__tests__/int/vitest.setup.ts'],
    environment: 'jsdom',
    env: {
      NEXT_PUBLIC_BACKEND_URL: 'http://localhost:8080',
    },

    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '__tests__/e2e/**',
    ],

    coverage: {
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['**/__tests__/**'],
      reporter: ['text', 'html'],
    },
  },
});