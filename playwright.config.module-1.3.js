/**
 * Playwright Configuration for Module 1.3 Tests
 * Simplified configuration for testing takeoff system on localhost:8000
 */

const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  testMatch: ['**/module-1.3-automated-test.spec.js'],

  // Run tests sequentially (not in parallel) to avoid resource issues
  fullyParallel: false,
  workers: 1,

  // Timeout settings
  timeout: 60000, // 60 seconds per test
  expect: {
    timeout: 10000 // 10 seconds for assertions
  },

  // Don't retry on failure for initial run
  retries: 0,

  // HTML reporter
  reporter: [
    ['html', { outputFolder: 'playwright-report-module-1.3' }],
    ['list']
  ],

  use: {
    // Base URL for the static server
    baseURL: 'http://localhost:8000',

    // Browser options
    headless: true, // Run in headless mode
    viewport: { width: 1280, height: 720 },

    // Screenshot and trace settings
    screenshot: 'on', // Take screenshots on every test
    trace: 'on', // Capture trace for debugging
    video: 'off', // Don't record video to save time

    // Action timeout
    actionTimeout: 15000,
  },

  // Test only in Chromium for speed
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // No web server (assuming localhost:8000 is already running)
  // webServer: undefined,
});
