import { test, expect } from '@playwright/test';

test.describe('Takeoff System - Sample Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to base URL before each test
    await page.goto('/');
  });

  test('should load homepage successfully', async ({ page }) => {
    // Verify page loads
    await expect(page).toHaveTitle(/Midwest Underground/i);

    // Check for key elements
    const body = await page.locator('body');
    await expect(body).toBeVisible();

    // Capture full-page screenshot
    await page.screenshot({
      path: 'test-results/screenshots/homepage-full.png',
      fullPage: true
    });
  });

  test('should capture element screenshot', async ({ page }) => {
    // Find navigation or header element
    const header = page.locator('header, nav, [role="banner"]').first();

    // Verify element exists and is visible
    if (await header.count() > 0) {
      await expect(header).toBeVisible();

      // Screenshot specific element
      await header.screenshot({
        path: 'test-results/screenshots/header.png'
      });
    }
  });

  test('should demonstrate screenshot comparison', async ({ page }) => {
    // Use Playwright's built-in screenshot comparison
    await expect(page).toHaveScreenshot('homepage-baseline.png', {
      fullPage: true,
      maxDiffPixels: 100 // Allow small differences
    });
  });
});
