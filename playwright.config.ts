import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright smoke-test configuration.
 *
 * The e2e tests run against the production build served by `vite preview`.
 * They mock all API calls via Playwright's route-intercept feature so no
 * real backend is needed — see e2e/fixtures.ts for the mock payloads.
 *
 * To run locally:
 *   npx playwright install chromium   # first time only
 *   npm run build && npm run test:e2e
 */
export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: 'html',

  use: {
    baseURL: 'http://localhost:4173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'npm run preview',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
})
