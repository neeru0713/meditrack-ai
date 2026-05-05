declare module '@playwright/test' {
  // Minimal stub for Playwright types used in the repo during CI/type-check.
  export type PlaywrightTestConfig = any;
  export const test: any;
  export const expect: any;
}
