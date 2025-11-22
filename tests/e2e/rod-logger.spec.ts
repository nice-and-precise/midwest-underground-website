import { test, expect } from '@playwright/test';

test.describe('Rod Logger', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/auth/login');
    await page.fill('input[name="email"]', 'crew@midwestunderground.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('should navigate to rod logger', async ({ page }) => {
    await page.goto('/dashboard/hdd/rod-logger');

    await expect(page.locator('h1')).toContainText(/rod logger/i);
  });

  test('should select project and bore', async ({ page }) => {
    await page.goto('/dashboard/hdd/rod-logger');

    // Select project from dropdown
    const projectSelect = page.locator('select[name="project"]');
    await projectSelect.waitFor({ timeout: 5000 });
    await projectSelect.selectOption({ index: 1 }); // Select first project

    // Select bore from dropdown
    const boreSelect = page.locator('select[name="bore"]');
    await boreSelect.waitFor({ timeout: 5000 });
    await boreSelect.selectOption({ index: 1 }); // Select first bore

    // Verify bore is selected
    const selectedBore = await boreSelect.inputValue();
    expect(selectedBore).toBeTruthy();
  });

  test('should log a rod pass', async ({ page }) => {
    await page.goto('/dashboard/hdd/rod-logger');

    // Select project and bore
    await page.selectOption('select[name="project"]', { index: 1 });
    await page.waitForTimeout(500);
    await page.selectOption('select[name="bore"]', { index: 1 });

    // Fill rod pass form
    await page.fill('input[name="linearFeet"]', '50');
    await page.fill('input[name="fluidMix"]', 'Standard bentonite');
    await page.fill('input[name="fluidVolume"]', '100');

    // Submit rod pass
    await page.click('button:has-text("Log Pass")');

    // Should show success message
    await expect(page.locator('text=/pass logged/i')).toBeVisible({ timeout: 5000 });
  });

  test('should calculate total length', async ({ page }) => {
    await page.goto('/dashboard/hdd/rod-logger');

    // Select project and bore
    await page.selectOption('select[name="project"]', { index: 1 });
    await page.waitForTimeout(500);
    await page.selectOption('select[name="bore"]', { index: 1 });

    // Should display total length
    const totalLength = page.locator('[data-testid="total-length"]').or(page.locator('text=/total.*feet/i'));
    await expect(totalLength).toBeVisible({ timeout: 5000 });
  });

  test('should display rod pass history', async ({ page }) => {
    await page.goto('/dashboard/hdd/rod-logger');

    // Select project and bore
    await page.selectOption('select[name="project"]', { index: 1 });
    await page.waitForTimeout(500);
    await page.selectOption('select[name="bore"]', { index: 1 });

    // Should show history table
    const historyTable = page.locator('[data-testid="rod-pass-history"]').or(page.locator('table'));
    await expect(historyTable).toBeVisible({ timeout: 5000 });
  });
});
