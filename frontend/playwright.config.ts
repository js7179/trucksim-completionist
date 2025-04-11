import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env.test.local' });

const backendPort = Number(process.env.PORT) || 3500;

export default defineConfig({
    testDir: 'tests/playwright',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'list',
    use: {
      baseURL: process.env.VITE_SITE_URL,
      trace: 'on-first-retry',
    },
    projects: [
      {
        name: 'chromium',
        use: { ...devices['Desktop Chrome'] },
      },
    ],
    webServer: [
      {
        command: 'npm run dev',
        url: process.env.VITE_SITE_URL,
        reuseExistingServer: !process.env.CI,
      },
      {
        command: 'npm run server',
        port: backendPort,
        reuseExistingServer: !process.env.CI,
        cwd: '../backend',
        stdout: 'pipe',
      }
  ],
    timeout: 30000,
});