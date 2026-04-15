// frontend/playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  retries: 0,
  globalSetup: './e2e/global-setup.ts',
  globalTeardown: './e2e/global-teardown.ts',
  use: {
    baseURL: 'http://localhost:5173',
    headless: true,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: [
    {
      // Go 后端：优先使用预编译二进制，回退到 go run
      command: 'test -f ../backend/rss-backend && cd ../backend && ./rss-backend || (cd ../backend && go run .)',
      url: 'http://localhost:8080/api/feeds',
      reuseExistingServer: false,
      timeout: 60_000,
    },
    {
      // Vite 前端
      command: 'npm run dev',
      url: 'http://localhost:5173',
      reuseExistingServer: true,
      timeout: 30_000,
    },
  ],
})
