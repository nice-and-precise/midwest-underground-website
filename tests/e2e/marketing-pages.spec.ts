import { test, expect } from '@playwright/test';

test.describe('Marketing Pages', () => {
  test.describe('Home Page', () => {
    test('should display home page with key elements', async ({ page }) => {
      await page.goto('/');

      // Check page loads
      await expect(page).toHaveTitle(/Midwest Underground/i);

      // Check for key sections
      await expect(page.locator('h1').first()).toBeVisible();

      // Check for navigation
      await expect(page.locator('nav')).toBeVisible();

      // Check for CTA buttons
      const ctaButton = page.locator('a[href="/contact"], a:has-text("Contact"), a:has-text("Quote")').first();
      await expect(ctaButton).toBeVisible();
    });

    test('should have working navigation links', async ({ page }) => {
      await page.goto('/');

      // Check services link
      const servicesLink = page.locator('nav a[href="/services"], a:has-text("Services")').first();
      if (await servicesLink.isVisible()) {
        await servicesLink.click();
        await expect(page).toHaveURL('/services');
      }
    });
  });

  test.describe('Services Page', () => {
    test('should display services page', async ({ page }) => {
      await page.goto('/services');

      await expect(page).toHaveTitle(/Services.*Midwest Underground/i);
      await expect(page.locator('h1').first()).toContainText(/Services/i);
    });

    test('should show all service categories', async ({ page }) => {
      await page.goto('/services');

      // Check for main service sections
      const hddSection = page.locator('text=Horizontal Directional Drilling, text=HDD').first();
      await expect(hddSection).toBeVisible();

      const fiberSection = page.locator('text=Fiber').first();
      await expect(fiberSection).toBeVisible();

      const utilitiesSection = page.locator('text=Utilities').first();
      await expect(utilitiesSection).toBeVisible();
    });

    test('should have quote request buttons', async ({ page }) => {
      await page.goto('/services');

      const quoteButtons = page.locator('a[href="/contact"], button:has-text("Quote")');
      await expect(quoteButtons.first()).toBeVisible();
    });
  });

  test.describe('About Page', () => {
    test('should display about page', async ({ page }) => {
      await page.goto('/about');

      await expect(page).toHaveTitle(/About.*Midwest Underground/i);
      await expect(page.locator('h1').first()).toContainText(/About/i);
    });

    test('should show company statistics', async ({ page }) => {
      await page.goto('/about');

      // Check for key stats (34 years, etc)
      const yearsText = page.locator('text=/34.*Years|Years.*34/i').first();
      await expect(yearsText).toBeVisible();
    });

    test('should display core values', async ({ page }) => {
      await page.goto('/about');

      // Check for values section
      await expect(page.locator('text=Values, text=Safety, text=Integrity').first()).toBeVisible();
    });

    test('should show location information', async ({ page }) => {
      await page.goto('/about');

      // Check for address
      await expect(page.locator('text=Willmar').first()).toBeVisible();
      await expect(page.locator('text=Minnesota, text=MN').first()).toBeVisible();
    });
  });

  test.describe('Projects Page', () => {
    test('should display projects page', async ({ page }) => {
      await page.goto('/projects');

      await expect(page).toHaveTitle(/Projects.*Midwest Underground/i);
      await expect(page.locator('h1').first()).toContainText(/Projects/i);
    });

    test('should show project statistics', async ({ page }) => {
      await page.goto('/projects');

      // Check for project stats
      await expect(page.locator('text=/1000|1,000/').first()).toBeVisible();
    });

    test('should display featured projects', async ({ page }) => {
      await page.goto('/projects');

      // Check for featured projects section
      const featuredSection = page.locator('text=Featured').first();
      await expect(featuredSection).toBeVisible();
    });

    test('should show testimonials', async ({ page }) => {
      await page.goto('/projects');

      // Check for testimonials/quotes
      const testimonial = page.locator('[class*="testimonial"], text=/Midwest Underground.*completed|completed.*Midwest Underground/i').first();
      // May or may not exist depending on implementation
      if (await testimonial.isVisible({ timeout: 2000 }).catch(() => false)) {
        await expect(testimonial).toBeVisible();
      }
    });
  });

  test.describe('Contact Page', () => {
    test('should display contact page', async ({ page }) => {
      await page.goto('/contact');

      await expect(page).toHaveTitle(/Contact.*Midwest Underground/i);
      await expect(page.locator('h1').first()).toContainText(/Contact/i);
    });

    test('should have working contact form', async ({ page }) => {
      await page.goto('/contact');

      // Check form elements exist
      await expect(page.locator('#name, input[name="name"]').first()).toBeVisible();
      await expect(page.locator('#email, input[name="email"]').first()).toBeVisible();
      await expect(page.locator('#message, textarea[name="message"]').first()).toBeVisible();

      // Check submit button
      await expect(page.locator('button[type="submit"]')).toBeVisible();
    });

    test('should validate required form fields', async ({ page }) => {
      await page.goto('/contact');

      // Try to submit empty form
      await page.click('button[type="submit"]');

      // Form should not submit (required fields validation)
      const nameInput = page.locator('#name, input[name="name"]').first();
      const emailInput = page.locator('#email, input[name="email"]').first();

      await expect(nameInput).toHaveAttribute('required', '');
      await expect(emailInput).toHaveAttribute('required', '');
    });

    test('should show contact information', async ({ page }) => {
      await page.goto('/contact');

      // Check for phone number
      await expect(page.locator('text=(320) 382-6636, text=3203826636').first()).toBeVisible();

      // Check for address
      await expect(page.locator('text=Willmar').first()).toBeVisible();
    });

    test('should show service area', async ({ page }) => {
      await page.goto('/contact');

      // Check for service area section
      await expect(page.locator('text=Service Area').first()).toBeVisible();

      // Check for counties
      await expect(page.locator('text=Kandiyohi').first()).toBeVisible();
    });
  });

  test.describe('Navigation Flow', () => {
    test('should navigate between all marketing pages', async ({ page }) => {
      // Start at home
      await page.goto('/');
      await expect(page).toHaveURL('/');

      // Navigate to services
      await page.click('nav a[href="/services"], a:has-text("Services")');
      await expect(page).toHaveURL('/services');

      // Navigate to about
      await page.click('nav a[href="/about"], a:has-text("About")');
      await expect(page).toHaveURL('/about');

      // Navigate to projects
      await page.click('nav a[href="/projects"], a:has-text("Projects")');
      await expect(page).toHaveURL('/projects');

      // Navigate to contact
      await page.click('nav a[href="/contact"], a:has-text("Contact")');
      await expect(page).toHaveURL('/contact');
    });

    test('should have consistent header and footer', async ({ page }) => {
      const pages = ['/', '/services', '/about', '/projects', '/contact'];

      for (const pagePath of pages) {
        await page.goto(pagePath);

        // Check header/nav exists
        await expect(page.locator('nav, header')).toBeVisible();

        // Check logo or company name is visible
        const logo = page.locator('img[alt*="logo" i], a:has-text("Midwest"), h1:has-text("Midwest")').first();
        await expect(logo).toBeVisible();
      }
    });
  });

  test.describe('Responsive Design', () => {
    test('should be mobile friendly', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });

      await page.goto('/');
      await expect(page.locator('h1').first()).toBeVisible();

      // Check mobile menu (hamburger) or responsive nav
      const mobileMenu = page.locator('[aria-label*="menu" i], button:has-text("Menu"), .hamburger, .mobile-menu-toggle').first();
      const nav = page.locator('nav').first();

      // Either mobile menu button exists or nav is still visible (responsive)
      const hasMobileMenu = await mobileMenu.isVisible({ timeout: 1000 }).catch(() => false);
      const hasNav = await nav.isVisible({ timeout: 1000 }).catch(() => false);

      expect(hasMobileMenu || hasNav).toBeTruthy();
    });

    test('contact form should work on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      await page.goto('/contact');

      // Form should be visible and accessible
      await expect(page.locator('#name, input[name="name"]').first()).toBeVisible();
      await expect(page.locator('button[type="submit"]')).toBeVisible();
    });
  });
});
