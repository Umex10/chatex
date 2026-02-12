// vitest.config.js
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
   
    include: ['__tests__/unit/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '__tests__/e2e/**',
    ],
  },
});