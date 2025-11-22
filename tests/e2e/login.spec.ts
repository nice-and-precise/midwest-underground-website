import { test, expect } from '@playwright/test';

test.describe('Login Flow', () => {
  test('should display login page', async ({ page }) => {
    await page.goto('/auth/login');

    await expect(page).toHaveTitle(/Login/i);
    await expect(page.locator('h1')).toContainText(/sign in/i);
  });

  test('should login with valid credentials', async ({ page }) => {
    await page.goto('/auth/login');

    // Fill in login form
    await page.fill('input[name="email"]', 'owner@midwestunderground.com');
    await page.fill('input[name="password"]', 'password123');

    // Submit form
    await page.click('button[type="submit"]');

    // Should redirect to dashboard
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.locator('h1')).toContainText(/dashboard/i);
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('/auth/login');

    await page.fill('input[name="email"]', 'invalid@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    // Should show error message
    await expect(page.locator('text=/invalid credentials/i')).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    await page.goto('/auth/login');

    // Try to submit without filling fields
    await page.click('button[type="submit"]');

    // Should show validation errors
    const emailInput = page.locator('input[name="email"]');
    await expect(emailInput).toHaveAttribute('required', '');
  });

  test('should logout successfully', async ({ page }) => {
    // Login first
    await page.goto('/auth/login');
    await page.fill('input[name="email"]', 'owner@midwestunderground.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/);

    // Logout
    await page.click('button[aria-label="User menu"]');
    await page.click('text=Sign out');

    // Should redirect to login
    await expect(page).toHaveURL(/\/auth\/login/);
  });
});
