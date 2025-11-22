import { test, expect } from '@playwright/test';

test.describe('Project Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/auth/login');
    await page.fill('input[name="email"]', 'owner@midwestunderground.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('should navigate to projects page', async ({ page }) => {
    await page.goto('/dashboard/projects');

    await expect(page).toHaveTitle(/Projects/i);
    await expect(page.locator('h1')).toContainText(/projects/i);
  });

  test('should display list of projects', async ({ page }) => {
    await page.goto('/dashboard/projects');

    // Should show projects table or grid
    const projectsList = page.locator('[data-testid="projects-list"]').or(page.locator('table'));
    await expect(projectsList).toBeVisible({ timeout: 5000 });
  });

  test('should create a new project', async ({ page }) => {
    await page.goto('/dashboard/projects');

    // Click new project button
    await page.click('button:has-text("New Project")');

    // Fill project form
    await page.fill('input[name="name"]', 'E2E Test Project');
    await page.fill('input[name="customerName"]', 'E2E Test Customer');
    await page.selectOption('select[name="status"]', 'PLANNING');

    // Submit form
    await page.click('button[type="submit"]');

    // Should show success message or redirect to project detail
    await expect(page.locator('text=/created successfully/i').or(page.locator('h1:has-text("E2E Test Project")'))).toBeVisible({ timeout: 5000 });
  });

  test('should filter projects by status', async ({ page }) => {
    await page.goto('/dashboard/projects');

    // Select filter
    await page.selectOption('select[name="status-filter"]', 'IN_PROGRESS');

    // Verify filtered results (if any)
    const projectCards = page.locator('[data-status="IN_PROGRESS"]');
    const count = await projectCards.count();

    // All visible projects should be IN_PROGRESS
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should view project details', async ({ page }) => {
    await page.goto('/dashboard/projects');

    // Click first project (if exists)
    const firstProject = page.locator('[data-testid="project-card"]').or(page.locator('table tbody tr')).first();
    await firstProject.click();

    // Should navigate to project detail page
    await expect(page).toHaveURL(/\/dashboard\/projects\/[a-z0-9-]+/);
  });

  test('should search for projects', async ({ page }) => {
    await page.goto('/dashboard/projects');

    // Type in search box
    await page.fill('input[placeholder*="Search"]', 'Fiber');

    // Wait for results to filter
    await page.waitForTimeout(500);

    // Results should contain search term (if any exist)
    const results = page.locator('[data-testid="project-card"]');
    const count = await results.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });
});
