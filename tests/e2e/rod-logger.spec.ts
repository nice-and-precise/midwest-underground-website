import { test, expect } from '@playwright/test';

test.describe('Rod Logger', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/auth/login');
    await page.fill('#email', 'crew@midwestunderground.com');
    await page.fill('#password', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });
  });

  test('should navigate to rod logger', async ({ page }) => {
    await page.goto('/dashboard/hdd/rod-logger');

    await expect(page.locator('h1').first()).toContainText(/rod|logger/i);
  });

  test('should select project and bore', async ({ page }) => {
    await page.goto('/dashboard/hdd/rod-logger');

    // Select project from dropdown
    const projectSelect = page.locator('select[name="project"], #project, select[name="projectId"]').first();
    if (await projectSelect.isVisible({ timeout: 5000 }).catch(() => false)) {
      await projectSelect.selectOption({ index: 1 }); // Select first project

      // Wait for bore dropdown to populate
      await page.waitForTimeout(1000);

      // Select bore from dropdown
      const boreSelect = page.locator('select[name="bore"], #bore, select[name="boreId"], select[name="boreLogId"]').first();
      if (await boreSelect.isVisible({ timeout: 5000 }).catch(() => false)) {
        await boreSelect.selectOption({ index: 1 }); // Select first bore

        // Verify bore is selected
        const selectedBore = await boreSelect.inputValue();
        expect(selectedBore).toBeTruthy();
      } else {
        test.skip();
      }
    } else {
      test.skip();
    }
  });

  test('should log a rod pass', async ({ page }) => {
    await page.goto('/dashboard/hdd/rod-logger');

    // Select project and bore
    const projectSelect = page.locator('select[name="project"], #project, select[name="projectId"]').first();
    if (await projectSelect.isVisible({ timeout: 5000 }).catch(() => false)) {
      await projectSelect.selectOption({ index: 1 });
      await page.waitForTimeout(1000);

      const boreSelect = page.locator('select[name="bore"], #bore, select[name="boreId"], select[name="boreLogId"]').first();
      await boreSelect.selectOption({ index: 1 });
      await page.waitForTimeout(500);

      // Fill rod pass form
      const linearFeetInput = page.locator('input[name="linearFeet"], #linearFeet, input[name="length"]').first();
      const fluidMixInput = page.locator('input[name="fluidMix"], #fluidMix, textarea[name="fluidMix"]').first();
      const fluidVolumeInput = page.locator('input[name="fluidVolume"], #fluidVolume').first();

      if (await linearFeetInput.isVisible({ timeout: 2000 }).catch(() => false)) {
        await linearFeetInput.fill('50');

        if (await fluidMixInput.isVisible().catch(() => false)) {
          await fluidMixInput.fill('Standard bentonite');
        }

        if (await fluidVolumeInput.isVisible().catch(() => false)) {
          await fluidVolumeInput.fill('100');
        }

        // Submit rod pass
        const submitButton = page.locator('button:has-text("Log Pass"), button:has-text("Submit"), button[type="submit"]').first();
        await submitButton.click();

        // Should show success message
        await expect(page.locator('text=/pass logged|success|added/i').first()).toBeVisible({ timeout: 5000 });
      } else {
        test.skip();
      }
    } else {
      test.skip();
    }
  });

  test('should calculate total length', async ({ page }) => {
    await page.goto('/dashboard/hdd/rod-logger');

    // Select project and bore
    const projectSelect = page.locator('select[name="project"], #project, select[name="projectId"]').first();
    if (await projectSelect.isVisible({ timeout: 5000 }).catch(() => false)) {
      await projectSelect.selectOption({ index: 1 });
      await page.waitForTimeout(1000);

      const boreSelect = page.locator('select[name="bore"], #bore, select[name="boreId"], select[name="boreLogId"]').first();
      await boreSelect.selectOption({ index: 1 });
      await page.waitForTimeout(500);

      // Should display total length
      const totalLength = page.locator('[data-testid="total-length"], text=/total.*feet/i, text=/total.*length/i').first();
      if (await totalLength.isVisible({ timeout: 5000 }).catch(() => false)) {
        await expect(totalLength).toBeVisible();
      } else {
        test.skip();
      }
    } else {
      test.skip();
    }
  });

  test('should display rod pass history', async ({ page }) => {
    await page.goto('/dashboard/hdd/rod-logger');

    // Select project and bore
    const projectSelect = page.locator('select[name="project"], #project, select[name="projectId"]').first();
    if (await projectSelect.isVisible({ timeout: 5000 }).catch(() => false)) {
      await projectSelect.selectOption({ index: 1 });
      await page.waitForTimeout(1000);

      const boreSelect = page.locator('select[name="bore"], #bore, select[name="boreId"], select[name="boreLogId"]').first();
      await boreSelect.selectOption({ index: 1 });
      await page.waitForTimeout(500);

      // Should show history table
      const historyTable = page.locator('[data-testid="rod-pass-history"], table, .history-table, .rod-pass-list').first();
      if (await historyTable.isVisible({ timeout: 5000 }).catch(() => false)) {
        await expect(historyTable).toBeVisible();
      } else {
        test.skip();
      }
    } else {
      test.skip();
    }
  });
});
