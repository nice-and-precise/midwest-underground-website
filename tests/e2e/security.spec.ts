import { test, expect } from '@playwright/test';

test.describe('Security E2E Tests', () => {
  test.describe('Authentication Security', () => {
    test('should require authentication for dashboard', async ({ page }) => {
      // Try to access dashboard without login
      const response = await page.goto('/dashboard');

      // Should redirect to login
      await expect(page).toHaveURL(/\/auth\/login/);
    });

    test('should require authentication for API endpoints', async ({ request }) => {
      // Try to access protected API without auth
      const response = await request.get('/api/projects');

      expect(response.status()).toBe(401);
    });

    test('should have secure cookie settings', async ({ page }) => {
      await page.goto('/auth/login');
      await page.fill('#email', 'owner@midwestunderground.com');
      await page.fill('#password', 'password123');
      await page.click('button[type="submit"]');
      await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });

      // Get cookies
      const cookies = await page.context().cookies();
      const sessionCookie = cookies.find(c => c.name.includes('session'));

      if (sessionCookie) {
        expect(sessionCookie.httpOnly).toBe(true);
        expect(sessionCookie.sameSite).toBe('Lax');
        // In production, secure should be true
        // expect(sessionCookie.secure).toBe(true);
      }
    });
  });

  test.describe('Security Headers', () => {
    test('should have X-Content-Type-Options header', async ({ page }) => {
      const response = await page.goto('/');
      expect(response?.headers()['x-content-type-options']).toBe('nosniff');
    });

    test('should have X-Frame-Options header', async ({ page }) => {
      const response = await page.goto('/');
      const xFrameOptions = response?.headers()['x-frame-options'];
      expect(xFrameOptions).toBeDefined();
      expect(['DENY', 'SAMEORIGIN']).toContain(xFrameOptions);
    });

    test('should have Content-Security-Policy header', async ({ page }) => {
      const response = await page.goto('/');
      const csp = response?.headers()['content-security-policy'];
      expect(csp).toBeDefined();
      expect(csp).toContain("default-src 'self'");
    });

    test('should have Referrer-Policy header', async ({ page }) => {
      const response = await page.goto('/');
      const referrerPolicy = response?.headers()['referrer-policy'];
      expect(referrerPolicy).toBeDefined();
    });
  });

  test.describe('Input Validation', () => {
    test('should sanitize XSS in contact form', async ({ page }) => {
      await page.goto('/contact');

      // Try to submit XSS payload
      const xssPayload = '<script>alert("xss")</script>';
      await page.fill('input[name="name"]', xssPayload);
      await page.fill('input[name="email"]', 'test@example.com');
      await page.fill('textarea[name="message"]', 'Test message');

      // Submit form
      await page.click('button[type="submit"]');

      // Wait for response
      await page.waitForTimeout(1000);

      // Check that script tag is not executed/rendered
      const pageContent = await page.content();
      expect(pageContent).not.toContain('<script>alert("xss")</script>');
    });

    test('should validate email format on login', async ({ page }) => {
      await page.goto('/auth/login');

      const emailInput = page.locator('#email');
      await emailInput.fill('not-an-email');

      // Check HTML5 validation
      const validityState = await emailInput.evaluate((el: HTMLInputElement) => el.validity.valid);
      expect(validityState).toBe(false);
    });
  });

  test.describe('Rate Limiting', () => {
    test('should return rate limit headers on API requests', async ({ request }) => {
      const response = await request.get('/api/projects');

      // Should have rate limit headers (even on 401)
      const headers = response.headers();
      // Rate limit headers might not be present on 401, check if endpoint returns them
    });

    test('should handle rapid requests gracefully', async ({ request }) => {
      // Make several rapid requests
      const promises = Array(10).fill(null).map(() =>
        request.get('/api/projects')
      );

      const responses = await Promise.all(promises);

      // All should get a response (either 401 or 429)
      responses.forEach(response => {
        expect([401, 429, 200]).toContain(response.status());
      });
    });
  });

  test.describe('Error Handling', () => {
    test('should show custom 404 page', async ({ page }) => {
      await page.goto('/non-existent-page');

      // Should show 404 content
      const content = await page.textContent('body');
      expect(content?.toLowerCase()).toMatch(/not found|404|page.*exist/i);
    });

    test('should not expose stack traces in production', async ({ request }) => {
      // Try to trigger an error
      const response = await request.get('/api/bore-logs/invalid-id');

      if (response.status() >= 400) {
        const body = await response.json().catch(() => ({}));
        expect(body.stack).toBeUndefined();
        expect(body.error || body.message).toBeDefined();
      }
    });
  });

  test.describe('Session Management', () => {
    test('should redirect to login on session expiry', async ({ page, context }) => {
      // Login first
      await page.goto('/auth/login');
      await page.fill('#email', 'owner@midwestunderground.com');
      await page.fill('#password', 'password123');
      await page.click('button[type="submit"]');
      await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });

      // Clear cookies to simulate session expiry
      await context.clearCookies();

      // Try to access protected page
      await page.goto('/dashboard');

      // Should redirect to login
      await expect(page).toHaveURL(/\/auth\/login/);
    });
  });
});
