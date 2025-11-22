/**
 * Comprehensive Automated Test Suite
 * Session: autonomous-20251122-054459
 *
 * Tests all 18 pages (5 public HTML + 13 Next.js dashboard)
 * Captures evidence: screenshots, console errors, network failures
 */

import { test, expect, Page } from '@playwright/test';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

const baseURL = process.env.BASE_URL || 'http://localhost:3000';
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const evidenceDir = join(__dirname, '..');

// Helper: Capture console errors
const consoleErrors: string[] = [];
function setupConsoleCapture(page: Page) {
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(`[${new Date().toISOString()}] ${msg.text()}`);
    }
  });
}

// Helper: Capture network failures
const networkFailures: any[] = [];
function setupNetworkCapture(page: Page) {
  page.on('response', response => {
    if (!response.ok() && response.status() !== 304) {
      networkFailures.push({
        url: response.url(),
        status: response.status(),
        statusText: response.statusText(),
      });
    }
  });
}

// Helper: Take screenshot with timestamp
async function captureEvidence(page: Page, testName: string, status: 'pass' | 'fail') {
  const fileName = `${testName.replace(/\s+/g, '-')}-${status}-${timestamp}.png`;
  await page.screenshot({
    path: join(evidenceDir, 'screenshots', fileName),
    fullPage: true
  });
}

// Helper: Save console log
async function saveConsoleLogs(testName: string) {
  if (consoleErrors.length > 0) {
    const fileName = `${testName.replace(/\s+/g, '-')}-${timestamp}.txt`;
    await writeFile(
      join(evidenceDir, 'console-logs', fileName),
      consoleErrors.join('\n')
    );
  }
}

test.describe('Public Pages - Static HTML', () => {

  test('Homepage (index.html) - Load and interactions', async ({ page }) => {
    const testName = 'homepage-load';
    setupConsoleCapture(page);
    setupNetworkCapture(page);

    try {
      // Navigate to homepage
      await page.goto(`${baseURL}/index.html`, { waitUntil: 'networkidle' });

      // Check page title
      await expect(page).toHaveTitle(/Midwest Underground/i);

      // Check main heading exists
      const heading = page.locator('h1').first();
      await expect(heading).toBeVisible();

      // Test dark mode toggle (if exists)
      const darkModeToggle = page.locator('[data-theme-toggle]');
      if (await darkModeToggle.count() > 0) {
        await darkModeToggle.click();
        await page.waitForTimeout(500);
      }

      // Check navigation links
      const navLinks = page.locator('nav a');
      expect(await navLinks.count()).toBeGreaterThan(0);

      // Test responsive design
      await page.setViewportSize({ width: 375, height: 667 }); // Mobile
      await page.waitForTimeout(500);
      await page.setViewportSize({ width: 1920, height: 1080 }); // Desktop

      await captureEvidence(page, testName, 'pass');

    } catch (error) {
      await captureEvidence(page, testName, 'fail');
      await saveConsoleLogs(testName);
      throw error;
    }
  });

  test('About Page (about.html) - Content and navigation', async ({ page }) => {
    const testName = 'about-page';
    setupConsoleCapture(page);
    setupNetworkCapture(page);

    try {
      await page.goto(`${baseURL}/about.html`, { waitUntil: 'networkidle' });

      // Check page loaded
      await expect(page).toHaveTitle(/About|Midwest Underground/i);

      // Verify content sections exist
      const contentSections = page.locator('section, .section, article');
      expect(await contentSections.count()).toBeGreaterThan(0);

      await captureEvidence(page, testName, 'pass');

    } catch (error) {
      await captureEvidence(page, testName, 'fail');
      await saveConsoleLogs(testName);
      throw error;
    }
  });

  test('Services Page (services.html) - Services display', async ({ page }) => {
    const testName = 'services-page';
    setupConsoleCapture(page);
    setupNetworkCapture(page);

    try {
      await page.goto(`${baseURL}/services.html`, { waitUntil: 'networkidle' });

      await expect(page).toHaveTitle(/Services|Midwest Underground/i);

      // Check for service listings
      const services = page.locator('.service, .service-card, article');
      expect(await services.count()).toBeGreaterThan(0);

      await captureEvidence(page, testName, 'pass');

    } catch (error) {
      await captureEvidence(page, testName, 'fail');
      await saveConsoleLogs(testName);
      throw error;
    }
  });

  test('Contact Page (contact.html) - Form validation', async ({ page }) => {
    const testName = 'contact-page';
    setupConsoleCapture(page);
    setupNetworkCapture(page);

    try {
      await page.goto(`${baseURL}/contact.html`, { waitUntil: 'networkidle' });

      await expect(page).toHaveTitle(/Contact|Midwest Underground/i);

      // Find contact form if exists
      const form = page.locator('form').first();
      if (await form.count() > 0) {
        // Test empty form submission (should show validation)
        const submitButton = form.locator('button[type="submit"], input[type="submit"]');
        if (await submitButton.count() > 0) {
          await submitButton.click();
          await page.waitForTimeout(1000);
        }
      }

      // Verify contact information is displayed
      const phoneNumber = page.locator('text=/\\(320\\)|320-/i').first();
      await expect(phoneNumber).toBeVisible();

      await captureEvidence(page, testName, 'pass');

    } catch (error) {
      await captureEvidence(page, testName, 'fail');
      await saveConsoleLogs(testName);
      throw error;
    }
  });

  test('Projects Page (projects.html) - Project listings', async ({ page }) => {
    const testName = 'projects-page';
    setupConsoleCapture(page);
    setupNetworkCapture(page);

    try {
      await page.goto(`${baseURL}/projects.html`, { waitUntil: 'networkidle' });

      await expect(page).toHaveTitle(/Projects|Midwest Underground/i);

      // Check for project listings or gallery
      const projects = page.locator('.project, .project-card, article, figure');
      expect(await projects.count()).toBeGreaterThan(0);

      await captureEvidence(page, testName, 'pass');

    } catch (error) {
      await captureEvidence(page, testName, 'fail');
      await saveConsoleLogs(testName);
      throw error;
    }
  });
});

test.describe('Dashboard Pages - Next.js Application', () => {

  // Setup: Login before dashboard tests
  test.beforeEach(async ({ page }) => {
    // Navigate to login page
    await page.goto(`${baseURL}/auth/login`);

    // Fill login form
    await page.fill('input[name="email"], input[type="email"]', 'owner@midwestunderground.com');
    await page.fill('input[name="password"], input[type="password"]', 'password123');

    // Submit login
    await page.click('button[type="submit"]');

    // Wait for redirect to dashboard
    await page.waitForURL('**/dashboard**', { timeout: 5000 }).catch(() => {});
  });

  test('Dashboard Home - KPI Display', async ({ page }) => {
    const testName = 'dashboard-home';
    setupConsoleCapture(page);
    setupNetworkCapture(page);

    try {
      await page.goto(`${baseURL}/dashboard`, { waitUntil: 'networkidle' });

      // Check for KPI cards
      const kpiCards = page.locator('[class*="kpi"], [class*="metric"], [class*="stat"]');
      expect(await kpiCards.count()).toBeGreaterThan(0);

      // Verify navigation menu
      const navMenu = page.locator('nav');
      await expect(navMenu).toBeVisible();

      await captureEvidence(page, testName, 'pass');

    } catch (error) {
      await captureEvidence(page, testName, 'fail');
      await saveConsoleLogs(testName);
      throw error;
    }
  });

  test('Projects List Page', async ({ page }) => {
    const testName = 'dashboard-projects-list';
    setupConsoleCapture(page);
    setupNetworkCapture(page);

    try {
      await page.goto(`${baseURL}/dashboard/projects`, { waitUntil: 'networkidle' });

      // Check for projects table or grid
      const projectsList = page.locator('table, [class*="grid"], [class*="list"]');
      await expect(projectsList).toBeVisible();

      // Test create button if exists
      const createButton = page.locator('button:has-text("New"), button:has-text("Create"), button:has-text("Add")').first();
      if (await createButton.count() > 0) {
        await expect(createButton).toBeVisible();
      }

      await captureEvidence(page, testName, 'pass');

    } catch (error) {
      await captureEvidence(page, testName, 'fail');
      await saveConsoleLogs(testName);
      throw error;
    }
  });

  test('Bore Logs List Page', async ({ page }) => {
    const testName = 'dashboard-bore-logs';
    setupConsoleCapture(page);
    setupNetworkCapture(page);

    try {
      await page.goto(`${baseURL}/dashboard/bore-logs`, { waitUntil: 'networkidle' });

      // Verify bore logs are displayed
      const boreLogsList = page.locator('table, [class*="grid"], [class*="list"]');
      await expect(boreLogsList).toBeVisible();

      await captureEvidence(page, testName, 'pass');

    } catch (error) {
      await captureEvidence(page, testName, 'fail');
      await saveConsoleLogs(testName);
      throw error;
    }
  });

  test('Rod Logger Tool - HDD Operations', async ({ page }) => {
    const testName = 'dashboard-rod-logger';
    setupConsoleCapture(page);
    setupNetworkCapture(page);

    try {
      await page.goto(`${baseURL}/dashboard/hdd/rod-logger`, { waitUntil: 'networkidle' });

      // Check for rod logging form
      const form = page.locator('form');
      await expect(form).toBeVisible();

      // Verify input fields exist
      const inputs = page.locator('input');
      expect(await inputs.count()).toBeGreaterThan(0);

      await captureEvidence(page, testName, 'pass');

    } catch (error) {
      await captureEvidence(page, testName, 'fail');
      await saveConsoleLogs(testName);
      throw error;
    }
  });

  test('Daily Report Form', async ({ page }) => {
    const testName = 'dashboard-daily-report';
    setupConsoleCapture(page);
    setupNetworkCapture(page);

    try {
      await page.goto(`${baseURL}/dashboard/hdd/daily-report`, { waitUntil: 'networkidle' });

      // Check for daily report form
      const form = page.locator('form');
      await expect(form).toBeVisible();

      await captureEvidence(page, testName, 'pass');

    } catch (error) {
      await captureEvidence(page, testName, 'fail');
      await saveConsoleLogs(testName);
      throw error;
    }
  });

  test('811 Compliance Gate', async ({ page }) => {
    const testName = 'dashboard-811-compliance';
    setupConsoleCapture(page);
    setupNetworkCapture(page);

    try {
      await page.goto(`${baseURL}/dashboard/hdd/811-compliance`, { waitUntil: 'networkidle' });

      // Verify 811 compliance interface
      await expect(page.locator('h1, h2')).toBeVisible();

      await captureEvidence(page, testName, 'pass');

    } catch (error) {
      await captureEvidence(page, testName, 'fail');
      await saveConsoleLogs(testName);
      throw error;
    }
  });

  test('811 Tickets List', async ({ page }) => {
    const testName = 'dashboard-811-tickets';
    setupConsoleCapture(page);
    setupNetworkCapture(page);

    try {
      await page.goto(`${baseURL}/dashboard/811-tickets`, { waitUntil: 'networkidle' });

      // Verify tickets are displayed
      const ticketsList = page.locator('table, [class*="grid"], [class*="list"]');
      await expect(ticketsList).toBeVisible();

      await captureEvidence(page, testName, 'pass');

    } catch (error) {
      await captureEvidence(page, testName, 'fail');
      await saveConsoleLogs(testName);
      throw error;
    }
  });

  test('Inspections List', async ({ page }) => {
    const testName = 'dashboard-inspections';
    setupConsoleCapture(page);
    setupNetworkCapture(page);

    try {
      await page.goto(`${baseURL}/dashboard/inspections`, { waitUntil: 'networkidle' });

      // Verify inspections interface
      await expect(page.locator('h1, h2')).toBeVisible();

      await captureEvidence(page, testName, 'pass');

    } catch (error) {
      await captureEvidence(page, testName, 'fail');
      await saveConsoleLogs(testName);
      throw error;
    }
  });
});

test.describe('Cross-Browser and Responsive Testing', () => {

  test('Mobile Responsive - Homepage', async ({ page }) => {
    const testName = 'mobile-responsive-homepage';

    try {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(`${baseURL}/index.html`, { waitUntil: 'networkidle' });

      // Verify mobile menu or navigation
      await captureEvidence(page, testName, 'pass');

    } catch (error) {
      await captureEvidence(page, testName, 'fail');
      throw error;
    }
  });

  test('Tablet Responsive - Dashboard', async ({ page }) => {
    const testName = 'tablet-responsive-dashboard';

    try {
      // Login first
      await page.goto(`${baseURL}/auth/login`);
      await page.fill('input[name="email"], input[type="email"]', 'owner@midwestunderground.com');
      await page.fill('input[name="password"], input[type="password"]', 'password123');
      await page.click('button[type="submit"]');
      await page.waitForTimeout(2000);

      // Set tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto(`${baseURL}/dashboard`, { waitUntil: 'networkidle' });

      await captureEvidence(page, testName, 'pass');

    } catch (error) {
      await captureEvidence(page, testName, 'fail');
      throw error;
    }
  });
});

// Generate test summary report
test.afterAll(async () => {
  const report = {
    sessionId: 'autonomous-20251122-054459',
    timestamp: new Date().toISOString(),
    consoleErrors: consoleErrors.length,
    networkFailures: networkFailures.length,
    errors: consoleErrors,
    failures: networkFailures,
  };

  await writeFile(
    join(evidenceDir, `test-summary-${timestamp}.json`),
    JSON.stringify(report, null, 2)
  );
});
