import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  testDir: './__tests__/e2e',
  use: {
    baseURL: 'http://localhost:3000'
  }
};

export default config;
