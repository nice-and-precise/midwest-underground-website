import { test, expect } from '@playwright/test';

test.describe('Estimate Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/auth/login');
    await page.fill('#email', 'owner@midwestunderground.com');
    await page.fill('#password', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });
  });

  test('should navigate to estimates page', async ({ page }) => {
    await page.goto('/dashboard/estimates');

    await expect(page).toHaveTitle(/Estimates/i);
    await expect(page.locator('h1').first()).toContainText(/Estimates/i);
  });

  test('should display estimates stats cards', async ({ page }) => {
    await page.goto('/dashboard/estimates');

    // Should show stats cards for Total Estimates, Draft, Approved, Total Value
    await expect(page.locator('text=Total Estimates')).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('Draft', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Approved', { exact: true }).first()).toBeVisible();
    await expect(page.locator('text=Total Value')).toBeVisible();
  });

  test('should navigate to new estimate page', async ({ page }) => {
    await page.goto('/dashboard/estimates');

    // Click new estimate button
    const newButton = page.locator('a:has-text("New Estimate"), button:has-text("New Estimate")').first();
    await expect(newButton).toBeVisible({ timeout: 5000 });
    await newButton.click();

    // Should navigate to new estimate form
    await expect(page).toHaveURL(/\/dashboard\/estimates\/new/, { timeout: 5000 });
    await expect(page.locator('h1')).toContainText(/Create New Estimate/i);
  });

  test('should create a new estimate', async ({ page }) => {
    await page.goto('/dashboard/estimates/new');

    // Fill basic information
    await page.fill('#name', 'E2E Test Estimate');
    await page.fill('#description', 'Test estimate created by E2E tests');

    // Fill customer information
    await page.fill('#customerName', 'E2E Test Customer');
    await page.fill('#customerEmail', 'test@example.com');
    await page.fill('#customerPhone', '555-123-4567');

    // Submit form
    await page.click('button[type="submit"]');

    // Should redirect to estimate detail page
    await expect(page).toHaveURL(/\/dashboard\/estimates\/[a-z0-9]+/, { timeout: 10000 });
  });

  test('should display estimate details', async ({ page }) => {
    // First create an estimate
    await page.goto('/dashboard/estimates/new');
    await page.fill('#name', 'E2E Detail Test Estimate');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard\/estimates\/[a-z0-9]+/, { timeout: 10000 });

    // Should show estimate details
    await expect(page.locator('h1')).toContainText('E2E Detail Test Estimate');
    await expect(page.locator('text=DRAFT')).toBeVisible();
  });

  test('should show empty state when no estimates exist initially', async ({ page }) => {
    await page.goto('/dashboard/estimates');

    // Either shows estimates table or empty state
    const table = page.locator('table');
    const emptyState = page.locator('text=/No estimates created yet/i');

    const hasTable = await table.isVisible({ timeout: 2000 }).catch(() => false);
    const hasEmptyState = await emptyState.isVisible({ timeout: 2000 }).catch(() => false);

    // One or the other should be visible
    expect(hasTable || hasEmptyState).toBe(true);
  });

  test('should display estimate in list after creation', async ({ page }) => {
    // Create a unique estimate
    const uniqueName = `E2E List Test ${Date.now()}`;
    await page.goto('/dashboard/estimates/new');
    await page.fill('#name', uniqueName);
    await page.fill('#customerName', 'Test Customer');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard\/estimates\/[a-z0-9]+/, { timeout: 10000 });

    // Navigate back to estimates list
    await page.goto('/dashboard/estimates');

    // Should see the estimate in the table
    await expect(page.locator(`text=${uniqueName}`)).toBeVisible({ timeout: 5000 });
  });

  test('should navigate from list to estimate detail', async ({ page }) => {
    await page.goto('/dashboard/estimates');

    // Click first estimate link
    const firstEstimateLink = page.locator('a[href*="/dashboard/estimates/"]').first();
    if (await firstEstimateLink.isVisible({ timeout: 3000 }).catch(() => false)) {
      await firstEstimateLink.click();

      // Should navigate to detail page
      await expect(page).toHaveURL(/\/dashboard\/estimates\/[a-z0-9]+/, { timeout: 5000 });
    } else {
      test.skip();
    }
  });

  test('should validate required fields on create', async ({ page }) => {
    await page.goto('/dashboard/estimates/new');

    // Try to submit without required fields
    await page.click('button[type="submit"]');

    // Should stay on the same page (HTML5 validation prevents submission)
    await expect(page).toHaveURL(/\/dashboard\/estimates\/new/);
  });

  test('should show back link to estimates list', async ({ page }) => {
    await page.goto('/dashboard/estimates/new');

    // Should have back link
    const backLink = page.locator('a:has-text("Back to Estimates")');
    await expect(backLink).toBeVisible();
    await backLink.click();

    // Should navigate back to estimates list
    await expect(page).toHaveURL(/\/dashboard\/estimates$/, { timeout: 5000 });
  });
});

test.describe('Cost Categories', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/login');
    await page.fill('#email', 'owner@midwestunderground.com');
    await page.fill('#password', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });
  });

  test('should access cost categories API', async ({ page }) => {
    // Test API using authenticated page context
    const response = await page.request.get('/api/cost-categories');
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
  });

  test('should access cost items API', async ({ page }) => {
    const response = await page.request.get('/api/cost-items');
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
  });
});
