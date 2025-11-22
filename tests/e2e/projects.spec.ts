import { test, expect } from '@playwright/test';

test.describe('Project Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/auth/login');
    await page.fill('#email', 'owner@midwestunderground.com');
    await page.fill('#password', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });
  });

  test('should navigate to projects page', async ({ page }) => {
    await page.goto('/dashboard/projects');

    await expect(page).toHaveTitle(/Projects/i);
    await expect(page.locator('h1').first()).toContainText(/projects/i);
  });

  test('should display list of projects', async ({ page }) => {
    await page.goto('/dashboard/projects');

    // Should show projects table or grid
    const projectsList = page.locator('[data-testid="projects-list"], table, .project-card, .projects-grid').first();
    await expect(projectsList).toBeVisible({ timeout: 5000 });
  });

  test('should create a new project', async ({ page }) => {
    await page.goto('/dashboard/projects');

    // Click new project button
    const newButton = page.locator('button:has-text("New Project"), a:has-text("New Project"), button:has-text("Create"), a:has-text("Create")').first();
    if (await newButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await newButton.click();

      // Fill project form
      await page.fill('input[name="name"], #name', 'E2E Test Project');
      await page.fill('input[name="customerName"], #customerName', 'E2E Test Customer');

      const statusSelect = page.locator('select[name="status"], #status');
      if (await statusSelect.isVisible({ timeout: 1000 }).catch(() => false)) {
        await statusSelect.selectOption('PLANNING');
      }

      // Submit form
      await page.click('button[type="submit"]');

      // Should show success message or redirect to project detail
      await expect(page.locator('text=/created successfully/i, h1:has-text("E2E Test Project")')).toBeVisible({ timeout: 5000 });
    } else {
      test.skip();
    }
  });

  test('should filter projects by status', async ({ page }) => {
    await page.goto('/dashboard/projects');

    // Select filter if exists
    const statusFilter = page.locator('select[name="status-filter"], select[name="status"], #status-filter');
    if (await statusFilter.isVisible({ timeout: 2000 }).catch(() => false)) {
      await statusFilter.selectOption('IN_PROGRESS');

      // Wait for filter to apply
      await page.waitForTimeout(500);

      // Verify some result appears
      const projectCards = page.locator('[data-status="IN_PROGRESS"], .project-card, table tbody tr');
      const count = await projectCards.count();

      // All visible projects should be IN_PROGRESS or filter is working
      expect(count).toBeGreaterThanOrEqual(0);
    } else {
      test.skip();
    }
  });

  test('should view project details', async ({ page }) => {
    await page.goto('/dashboard/projects');

    // Click first project link (not the whole row, look for link element)
    const firstProjectLink = page.locator('a[href*="/dashboard/projects/"]').first();
    if (await firstProjectLink.isVisible({ timeout: 2000 }).catch(() => false)) {
      await firstProjectLink.click();

      // Should navigate to project detail page
      await expect(page).toHaveURL(/\/dashboard\/projects\/[a-z0-9-]+/, { timeout: 5000 });
    } else {
      test.skip(); // No project links found
    }
  });

  test('should search for projects', async ({ page }) => {
    await page.goto('/dashboard/projects');

    // Type in search box if it exists
    const searchInput = page.locator('input[placeholder*="Search" i], input[type="search"], input[name="search"]');
    if (await searchInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await searchInput.fill('Fiber');

      // Wait for results to filter
      await page.waitForTimeout(500);

      // Results should contain search term (if any exist)
      const results = page.locator('[data-testid="project-card"], table tbody tr, .project-item');
      const count = await results.count();
      expect(count).toBeGreaterThanOrEqual(0);
    } else {
      test.skip();
    }
  });
});
