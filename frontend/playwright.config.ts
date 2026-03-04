import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env.local') });

const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000';

export default defineConfig({

  testDir: './__tests__/e2e',

  /* Run tests in files in parallel */
  fullyParallel: false,

  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,

  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,

  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,

  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    baseURL: FRONTEND_URL,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure project matrix for auth bootstrap + feature coverage */
 projects: [

  // 1. Exercise raw auth flows (sign-up/sign-in) per browser before anything else
  {
    name: 'auth-tests-chromium',
    testMatch: /auth\.spec\.ts/,
    use: { ...devices['Desktop Chrome'] },
  },
  {
    name: 'auth-tests-webkit',
    testMatch: /auth\.spec\.ts/,
    use: { ...devices['Desktop Safari'] },
  },
  // 2. Seed a reusable logged-in context so downstream specs can focus on features
  {
    name: 'auth-initial-chromium',
    testMatch: /auth\.setup\.ts/,
    use: { ...devices['Desktop Chrome'] },
    // Runs only after the Chromium auth smoke tests succeeded
    dependencies: ['auth-tests-chromium'],
  },
  {
    name: 'auth-initial-webkit',
    testMatch: /auth\.setup\.ts/,
    use: { ...devices['Desktop Safari'] },
    // Runs only after the WebKit auth smoke tests succeeded
    dependencies: ['auth-tests-webkit'],
  },

  // 3. Feature suites consume the saved storage state instead of re-signing-in
  {
    name: 'chromium-features',
    testIgnore: [/auth\.spec\.ts/, /auth\.setup\.ts/],
    use: {
      ...devices['Desktop Chrome'],
      storageState: 'playwright/.auth/chromium.json',
    },
    dependencies: ['auth-initial-chromium'],
  },
  {
    name: 'webkit-features',
    testIgnore: [/auth\.spec\.ts/, /auth\.setup\.ts/],
    use: {
      ...devices['Desktop Safari'],
      storageState: 'playwright/.auth/webkit.json',
    },
    dependencies: ['auth-initial-webkit'],
  },
],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run dev',
    url: FRONTEND_URL,
    reuseExistingServer: !process.env.CI,
    env: {
      // Prevent MSW from hijacking requests; e2e needs the real backend.
      APP_ENV: 'e2e',
    },
  },
});
