<!-- TOC -->

## Table of Contents

  - [File Naming Standards](#file-naming-standards)
  - [Test Structure](#test-structure)
    - [Describe Blocks](#describe-blocks)
    - [Setup and Teardown](#setup-and-teardown)
    - [Test Naming](#test-naming)
  - [Element Selectors](#element-selectors)
    - [Preference Order](#preference-order)
    - [Selector Best Practices](#selector-best-practices)
  - [Fixtures and Test Data](#fixtures-and-test-data)
    - [Location and Organization](#location-and-organization)
    - [Fixture Naming Conventions](#fixture-naming-conventions)
    - [Using Fixtures in Tests](#using-fixtures-in-tests)
    - [Fixture Maintenance](#fixture-maintenance)
  - [Screenshot Naming](#screenshot-naming)
    - [Auto-Generated Screenshots](#auto-generated-screenshots)
    - [Manual Screenshots](#manual-screenshots)
    - [Screenshot Naming Pattern](#screenshot-naming-pattern)
    - [Screenshot Assertions](#screenshot-assertions)
- [Update all screenshot baselines](#update-all-screenshot-baselines)
- [Update specific test](#update-specific-test)
  - [Async/Await Patterns](#asyncawait-patterns)
    - [Always Await Page Interactions](#always-await-page-interactions)
    - [Error Handling](#error-handling)
    - [Promise Handling](#promise-handling)
    - [Common Async Patterns](#common-async-patterns)
  - [Assertions](#assertions)
    - [Page Assertions](#page-assertions)
    - [Element Assertions](#element-assertions)
    - [Custom Assertions](#custom-assertions)
  - [Test Independence](#test-independence)
    - [Rule: Each Test Should Be Completely Independent](#rule-each-test-should-be-completely-independent)
    - [Why Test Independence Matters](#why-test-independence-matters)
    - [Achieving Independence](#achieving-independence)
  - [Resources](#resources)
    - [Playwright Documentation](#playwright-documentation)
    - [Guides and Tutorials](#guides-and-tutorials)
    - [Advanced Topics](#advanced-topics)
    - [Community Resources](#community-resources)
  - [Quick Reference](#quick-reference)
    - [Common Commands](#common-commands)
- [Run all tests](#run-all-tests)
- [Run specific file](#run-specific-file)
- [Run in headed mode (see browser)](#run-in-headed-mode-see-browser)
- [Debug mode](#debug-mode)
- [Update screenshots](#update-screenshots)
- [Show test report](#show-test-report)
- [Generate tests](#generate-tests)
    - [Common Patterns](#common-patterns)

<!-- /TOC -->

# Takeoff System - Testing Conventions

**Created:** 2025-11-22
**Framework:** Playwright
**Purpose:** Standards for all E2E tests across 15 modules

---

## File Naming Standards

**Pattern:** `{module-id}.spec.js`

**Examples by Module:**
- Module 1.1: `pdf-viewer.spec.js`
- Module 1.2: `measurement-tools.spec.js`
- Module 1.3: `quantity-calculator.spec.js`
- Module 1.4: `export-persistence.spec.js`
- Module 2.1: `cost-database.spec.js`
- Module 2.2: `estimate-builder.spec.js`
- Module 2.3: `proposal-generator.spec.js`
- Module 2.4: `dashboard-integration.spec.js`
- Module 3.1: `bore-visualizer.spec.js`
- Module 3.2: `historical.spec.js`
- Module 3.3: `change-orders.spec.js`
- Module 3.4: `client-portal.spec.js`

**Location:** `tests/takeoff/`

**Directory Organization:**
```
tests/takeoff/
├── phase-1/
│   ├── pdf-viewer.spec.js
│   ├── measurement-tools.spec.js
│   ├── quantity-calculator.spec.js
│   └── export-persistence.spec.js
├── phase-2/
│   ├── cost-database.spec.js
│   ├── estimate-builder.spec.js
│   ├── proposal-generator.spec.js
│   └── dashboard-integration.spec.js
└── phase-3/
    ├── bore-visualizer.spec.js
    ├── historical.spec.js
    ├── change-orders.spec.js
    └── client-portal.spec.js
```

**Rule:** One file per module

---

## Test Structure

### Describe Blocks

Group related tests by module and feature:

```javascript
import { test, expect } from '@playwright/test';

test.describe('Module 1.2: Measurement Tools', () => {
  test.describe('Linear Measurement', () => {
    test('should draw line between two points', async ({ page }) => {
      // Test implementation
    });

    test('should display length in correct units', async ({ page }) => {
      // Test implementation
    });
  });

  test.describe('Area Measurement', () => {
    test('should draw polygon area', async ({ page }) => {
      // Test implementation
    });

    test('should calculate area correctly', async ({ page }) => {
      // Test implementation
    });
  });

  test.describe('Count Markers', () => {
    test('should add count marker on click', async ({ page }) => {
      // Test implementation
    });
  });
});
```

**Nesting Guidelines:**
- **Level 1:** Module name (e.g., "Module 1.2: Measurement Tools")
- **Level 2:** Feature group (e.g., "Linear Measurement")
- **Level 3:** Individual tests

---

### Setup and Teardown

Use `beforeEach` and `afterEach` for common setup and cleanup:

```javascript
test.describe('Module 1.1: PDF Viewer', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to page before each test
    await page.goto('/dashboard/takeoff.html');

    // Common setup (upload PDF, set scale, etc.)
    const fixturePath = path.join(__dirname, '../fixtures/sample-plan.pdf');
    await page.setInputFiles('#pdf-upload', fixturePath);
    await page.waitForSelector('#pdf-canvas', { state: 'visible' });
  });

  test.afterEach(async ({ page }) => {
    // Cleanup if needed (optional for most tests)
    // Clear local storage, reset state, etc.
    await page.evaluate(() => localStorage.clear());
  });

  test('should display PDF on canvas', async ({ page }) => {
    // PDF already loaded by beforeEach
    await expect(page.locator('#pdf-canvas')).toBeVisible();
  });
});
```

**When to use:**
- `beforeEach`: Common navigation, data setup, authentication
- `afterEach`: Cleanup of persistent state (localStorage, cookies)
- `beforeAll`: Rarely needed (use only for expensive one-time setup)
- `afterAll`: Database cleanup, server shutdown (not typical for static sites)

---

### Test Naming

**Pattern:** `should [expected behavior]` or `should [expected behavior] when [condition]`

**Examples:**
```javascript
// Simple behavior
test('should load PDF successfully', async ({ page }) => {});
test('should calculate quantities correctly', async ({ page }) => {});
test('should save takeoff data', async ({ page }) => {});

// Conditional behavior
test('should show error when invalid file uploaded', async ({ page }) => {});
test('should recalculate totals when measurement deleted', async ({ page }) => {});
test('should disable save button when no data entered', async ({ page }) => {});

// Specific scenarios
test('should preserve measurements when switching PDF pages', async ({ page }) => {});
test('should apply markup percentage to estimate total', async ({ page }) => {});
test('should export CSV with all quantity categories', async ({ page }) => {});
```

**Naming Rules:**
- Start with "should"
- Use present tense
- Be specific and descriptive
- Include condition if relevant ("when X", "after Y")
- Avoid vague terms ("works", "is correct")
- Focus on user-observable behavior

---

## Element Selectors

### Preference Order

**1. data-testid (Best - Most Stable)**

Use custom data attributes for test targets:

```javascript
// HTML
<button data-testid="save-takeoff-btn">Save Takeoff</button>
<canvas data-testid="measurement-canvas" id="canvas"></canvas>
<div data-testid="quantity-display-hdd">200 feet</div>

// Test
await page.locator('[data-testid="save-takeoff-btn"]').click();
await page.locator('[data-testid="measurement-canvas"]').click({ position: { x: 100, y: 100 } });
await expect(page.locator('[data-testid="quantity-display-hdd"]')).toContainText('200 feet');
```

**Why best:** Decouples tests from implementation details, survives CSS/class changes.

---

**2. Semantic Selectors (Good - Accessible)**

Use Playwright's built-in semantic selectors:

```javascript
// By role
await page.getByRole('button', { name: 'Upload PDF' }).click();
await page.getByRole('textbox', { name: 'Project Name' }).fill('Test Project');
await page.getByRole('heading', { name: 'Takeoff Dashboard' }).isVisible();

// By label
await page.getByLabel('Scale (feet)').fill('100');
await page.getByLabel('Category').selectOption('HDD');

// By text
await page.getByText('Save Takeoff').click();
await page.getByText('200 feet').isVisible();

// By placeholder
await page.getByPlaceholder('Enter project name').fill('Test');
```

**Why good:** Aligns with accessibility, tests what users see.

---

**3. CSS Selectors (Acceptable - Use Sparingly)**

Use when semantic selectors aren't available:

```javascript
// ID selectors (acceptable)
await page.locator('#pdf-canvas').isVisible();
await page.locator('#save-button').click();

// Class selectors (use with caution)
await page.locator('.measurement-item').count();
await page.locator('.success-message').isVisible();

// Attribute selectors
await page.locator('[type="file"]').setInputFiles('path/to/file.pdf');
await page.locator('[name="takeoff-name"]').fill('Test');
```

**When acceptable:** Stable IDs that won't change, form inputs.

---

**4. Complex CSS Selectors (Avoid)**

These are fragile and break easily:

```javascript
// Avoid - too specific
await page.locator('div > div.container > span:nth-child(3)').click();

// Avoid - position-dependent
await page.locator('.list > li:first-child > button:last-child').click();

// Avoid - overly nested
await page.locator('#main > .content > .panel > .header > h2').isVisible();
```

**Why avoid:** Breaks when HTML structure changes.

---

### Selector Best Practices

**Combine selectors for precision:**
```javascript
// Good: Specific button in specific context
await page.locator('[data-testid="cost-items-panel"]')
  .getByRole('button', { name: 'Add Item' })
  .click();

// Good: Text within a specific container
await expect(
  page.locator('[data-testid="total-display"]').getByText('$1,234.56')
).toBeVisible();
```

**Use locator chaining:**
```javascript
const measurementList = page.locator('[data-testid="measurement-list"]');
const firstItem = measurementList.locator('.measurement-item').first();
await firstItem.getByRole('button', { name: 'Delete' }).click();
```

---

## Fixtures and Test Data

### Location and Organization

**Location:** `tests/fixtures/`

**Directory Structure:**
```
tests/fixtures/
├── pdfs/
│   ├── sample-hdd-plan.pdf        # 2-page HDD plan
│   ├── sample-fiber-plan.pdf      # 1-page fiber layout
│   ├── multi-page-plan.pdf        # 5-page complex plan
│   └── invalid.txt                # For error testing
├── json/
│   ├── cost-items-test-data.json  # Sample cost database
│   ├── sample-takeoff.json        # Complete takeoff data
│   ├── sample-estimate.json       # Estimate with line items
│   └── bore-path-profile.json     # 3D bore path data
├── images/
│   ├── company-logo.png           # For proposal testing
│   └── sample-signature.png       # For approval testing
└── csv/
    └── expected-export.csv        # For export validation
```

---

### Fixture Naming Conventions

**Pattern:** `{purpose}-{descriptor}.{extension}`

**Examples:**
- `sample-hdd-plan.pdf` - Sample PDF for HDD project
- `cost-items-test-data.json` - Test data for cost database
- `multi-page-plan.pdf` - Multi-page PDF for pagination testing
- `invalid.txt` - Invalid file for error handling tests

**Naming Rules:**
- Use kebab-case
- Be descriptive and purposeful
- Include file type/purpose in name
- Keep under 50 characters

---

### Using Fixtures in Tests

**Loading PDF fixtures:**
```javascript
import path from 'path';

test('should upload PDF successfully', async ({ page }) => {
  const fixturePath = path.join(__dirname, '../fixtures/pdfs/sample-hdd-plan.pdf');
  await page.setInputFiles('#pdf-upload', fixturePath);
  await expect(page.locator('#pdf-canvas')).toBeVisible();
});
```

**Loading JSON fixtures:**
```javascript
import fs from 'fs';
import path from 'path';

test('should load takeoff from JSON', async ({ page }) => {
  const fixturePath = path.join(__dirname, '../fixtures/json/sample-takeoff.json');
  const fixtureData = JSON.parse(fs.readFileSync(fixturePath, 'utf-8'));

  // Use fixture data in test
  await page.evaluate((data) => {
    window.loadTakeoffData(data);
  }, fixtureData);

  await expect(page.locator('[data-testid="measurement-count"]'))
    .toContainText(fixtureData.measurements.length.toString());
});
```

**Validating against fixture:**
```javascript
test('should export CSV matching expected format', async ({ page }) => {
  // Trigger export
  const downloadPromise = page.waitForEvent('download');
  await page.click('[data-testid="export-csv-btn"]');
  const download = await downloadPromise;

  // Save and read downloaded file
  const downloadPath = await download.path();
  const downloadedContent = fs.readFileSync(downloadPath, 'utf-8');

  // Read expected fixture
  const expectedPath = path.join(__dirname, '../fixtures/csv/expected-export.csv');
  const expectedContent = fs.readFileSync(expectedPath, 'utf-8');

  // Compare
  expect(downloadedContent).toBe(expectedContent);
});
```

---

### Fixture Maintenance

**Keep fixtures small:**
- PDFs: < 500KB each
- JSON: < 100KB each
- Images: < 100KB each

**Version control:**
- Commit all fixtures to git
- Document purpose in adjacent README if needed
- Update fixtures when data format changes

**Cleanup:**
- Remove unused fixtures regularly
- Archive old fixtures if needed for reference

---

## Screenshot Naming

### Auto-Generated Screenshots

**Playwright automatically creates snapshots for visual regression testing:**

```javascript
test('should match PDF viewer layout', async ({ page }) => {
  await page.goto('/dashboard/takeoff.html');

  // Playwright creates snapshot automatically
  await expect(page).toHaveScreenshot('pdf-viewer-initial.png');
});
```

**Location:** `tests/takeoff/{test-file}-snapshots/`

**Example:**
```
tests/takeoff/phase-1/pdf-viewer.spec.js-snapshots/
├── pdf-viewer-initial-chromium-darwin.png
├── pdf-viewer-loaded-chromium-darwin.png
└── pdf-viewer-zoomed-chromium-darwin.png
```

---

### Manual Screenshots

**For debugging or documentation:**

```javascript
test('should handle measurement creation', async ({ page }) => {
  // Take screenshot at specific point
  await page.screenshot({
    path: 'test-results/screenshots/measurement-tools-before-draw.png'
  });

  // Perform action
  await drawMeasurement(page);

  // Take after screenshot
  await page.screenshot({
    path: 'test-results/screenshots/measurement-tools-after-draw.png'
  });
});
```

**Screenshot options:**
```javascript
// Full page screenshot
await page.screenshot({
  path: 'screenshot.png',
  fullPage: true
});

// Element screenshot
await page.locator('#pdf-canvas').screenshot({
  path: 'canvas-only.png'
});

// With specific viewport
await page.setViewportSize({ width: 375, height: 667 }); // Mobile
await page.screenshot({
  path: 'mobile-view.png'
});
```

---

### Screenshot Naming Pattern

**Pattern:** `{module-id}-{scenario}-{viewport?}.png`

**Examples:**
- `pdf-viewer-loaded.png` - PDF viewer after loading
- `measurement-tools-linear.png` - Linear measurement drawn
- `cost-database-crud-mobile.png` - Cost database on mobile
- `estimate-builder-totals-desktop.png` - Estimate totals on desktop
- `proposal-generator-preview.png` - Proposal preview

**Naming Rules:**
- Use kebab-case
- Start with module ID
- Describe scenario/state
- Include viewport if relevant (mobile/tablet/desktop)
- Use descriptive scenario names

---

### Screenshot Assertions

**Visual regression testing:**

```javascript
test('should maintain consistent layout', async ({ page }) => {
  await page.goto('/dashboard/takeoff.html');

  // Compare against baseline
  await expect(page).toHaveScreenshot('takeoff-dashboard.png', {
    maxDiffPixels: 100 // Allow minor differences
  });
});

test('should render measurement correctly', async ({ page }) => {
  const canvas = page.locator('[data-testid="measurement-canvas"]');

  // Draw measurement
  await drawLinearMeasurement(page);

  // Compare canvas only
  await expect(canvas).toHaveScreenshot('linear-measurement-canvas.png');
});
```

**Updating baselines:**
```bash
# Update all screenshot baselines
npx playwright test --update-snapshots

# Update specific test
npx playwright test pdf-viewer.spec.js --update-snapshots
```

---

## Async/Await Patterns

### Always Await Page Interactions

**Correct usage:**
```javascript
test('should complete workflow', async ({ page }) => {
  // ✅ Correct - await all async operations
  await page.goto('/takeoff');
  await page.click('[data-testid="btn-upload"]');
  await page.setInputFiles('#file-input', 'path/to/file.pdf');
  await expect(page.locator('.pdf-canvas')).toBeVisible();
  await page.fill('#project-name', 'Test Project');
  await page.click('[data-testid="save-btn"]');
  await expect(page.locator('.success-message')).toBeVisible();
});
```

**Wrong - missing awaits:**
```javascript
test('should complete workflow', async ({ page }) => {
  // ❌ Wrong - missing awaits
  page.goto('/takeoff');  // Won't wait for navigation
  page.click('[data-testid="btn-upload"]');  // Won't wait for click
  expect(page.locator('.pdf-canvas')).toBeVisible();  // Sync expect, fails immediately
});
```

---

### Error Handling

**Graceful timeout handling:**

```javascript
test('should handle slow loading', async ({ page }) => {
  await page.goto('/takeoff');

  try {
    await page.waitForSelector('[data-testid="pdf-canvas"]', {
      timeout: 5000
    });
    // Element found, continue test
  } catch (error) {
    // Handle timeout gracefully
    console.log('PDF canvas did not load within 5 seconds');
    throw new Error('PDF failed to load - check file upload');
  }
});
```

**Conditional waits:**

```javascript
test('should wait for calculation to complete', async ({ page }) => {
  await page.click('[data-testid="calculate-btn"]');

  // Wait for either success or error message
  await page.waitForSelector(
    '[data-testid="calculation-result"], [data-testid="calculation-error"]',
    { state: 'visible', timeout: 10000 }
  );

  // Check which appeared
  const resultVisible = await page.locator('[data-testid="calculation-result"]').isVisible();
  const errorVisible = await page.locator('[data-testid="calculation-error"]').isVisible();

  if (errorVisible) {
    const errorText = await page.locator('[data-testid="calculation-error"]').textContent();
    throw new Error(`Calculation failed: ${errorText}`);
  }

  expect(resultVisible).toBe(true);
});
```

---

### Promise Handling

**Parallel operations:**

```javascript
test('should load multiple elements in parallel', async ({ page }) => {
  await page.goto('/takeoff');

  // ✅ Good - run independent checks in parallel
  await Promise.all([
    expect(page.locator('#header')).toBeVisible(),
    expect(page.locator('#sidebar')).toBeVisible(),
    expect(page.locator('#main-content')).toBeVisible(),
    expect(page).toHaveTitle(/Takeoff/)
  ]);
});
```

**Sequential operations:**

```javascript
test('should complete steps in order', async ({ page }) => {
  // ✅ Correct - sequential dependencies
  await page.goto('/takeoff');

  const uploadResult = await page.locator('#upload-status').textContent();
  expect(uploadResult).toBe('Ready');

  await page.setInputFiles('#file-input', 'file.pdf');

  const loadedResult = await page.locator('#upload-status').textContent();
  expect(loadedResult).toBe('Loaded');
});
```

---

### Common Async Patterns

**Wait for navigation:**
```javascript
await Promise.all([
  page.waitForNavigation(),
  page.click('a[href="/takeoff"]')
]);
```

**Wait for download:**
```javascript
const downloadPromise = page.waitForEvent('download');
await page.click('[data-testid="export-btn"]');
const download = await downloadPromise;
const path = await download.path();
```

**Wait for response:**
```javascript
const responsePromise = page.waitForResponse(
  response => response.url().includes('/api/save') && response.status() === 200
);
await page.click('[data-testid="save-btn"]');
const response = await responsePromise;
```

**Wait for custom condition:**
```javascript
await page.waitForFunction(() => {
  const element = document.querySelector('#calculation-result');
  return element && element.textContent.includes('$');
});
```

---

## Assertions

### Page Assertions

**Title and URL:**
```javascript
test('should have correct page metadata', async ({ page }) => {
  await page.goto('/dashboard/takeoff.html');

  // Check title
  await expect(page).toHaveTitle(/Takeoff/);
  await expect(page).toHaveTitle('Midwest Underground - Takeoff System');

  // Check URL
  await expect(page).toHaveURL(/.*takeoff.*/);
  await expect(page).toHaveURL(/\/dashboard\/takeoff\.html$/);
});
```

**Screenshot comparison:**
```javascript
test('should match visual baseline', async ({ page }) => {
  await page.goto('/dashboard/takeoff.html');
  await expect(page).toHaveScreenshot('takeoff-page.png');
});
```

---

### Element Assertions

**Visibility:**
```javascript
test('should show and hide elements', async ({ page }) => {
  const modal = page.locator('[data-testid="upload-modal"]');

  await expect(modal).toBeHidden();

  await page.click('[data-testid="upload-btn"]');
  await expect(modal).toBeVisible();

  await page.click('[data-testid="modal-close"]');
  await expect(modal).toBeHidden();
});
```

**Text content:**
```javascript
test('should display correct text', async ({ page }) => {
  const totalDisplay = page.locator('[data-testid="total-display"]');

  // Contains text
  await expect(totalDisplay).toContainText('$1,234.56');

  // Exact text
  await expect(totalDisplay).toHaveText('Total: $1,234.56');

  // Regex match
  await expect(totalDisplay).toHaveText(/\$\d{1,3}(,\d{3})*\.\d{2}/);
});
```

**Attributes:**
```javascript
test('should have correct attributes', async ({ page }) => {
  const input = page.locator('#project-name');

  await expect(input).toHaveAttribute('type', 'text');
  await expect(input).toHaveAttribute('placeholder', 'Enter project name');
  await expect(input).toHaveAttribute('required');

  // Disabled state
  await expect(page.locator('#save-btn')).toBeDisabled();
  await input.fill('Test Project');
  await expect(page.locator('#save-btn')).toBeEnabled();
});
```

**CSS properties:**
```javascript
test('should have correct styling', async ({ page }) => {
  const button = page.locator('[data-testid="primary-btn"]');

  await expect(button).toHaveCSS('background-color', 'rgb(0, 59, 92)');
  await expect(button).toHaveCSS('color', 'rgb(255, 255, 255)');
});
```

**Count:**
```javascript
test('should have correct number of items', async ({ page }) => {
  const items = page.locator('.measurement-item');

  await expect(items).toHaveCount(0);

  await addMeasurement(page);
  await expect(items).toHaveCount(1);

  await addMeasurement(page);
  await expect(items).toHaveCount(2);
});
```

---

### Custom Assertions

**Create reusable assertion helpers:**

```javascript
// helpers/assertions.js
export async function expectMeasurementCount(page, expectedCount) {
  const items = page.locator('[data-testid="measurement-item"]');
  await expect(items).toHaveCount(expectedCount);
}

export async function expectTotalEquals(page, category, expectedTotal) {
  const totalDisplay = page.locator(`[data-testid="total-${category}"]`);
  await expect(totalDisplay).toContainText(expectedTotal);
}

export async function expectSaveSuccess(page) {
  const successMessage = page.locator('[data-testid="success-message"]');
  await expect(successMessage).toBeVisible();
  await expect(successMessage).toContainText('saved successfully');
}
```

**Usage in tests:**
```javascript
import { expectMeasurementCount, expectTotalEquals } from '../helpers/assertions.js';

test('should calculate totals correctly', async ({ page }) => {
  await addLinearMeasurement(page, 'HDD', 100);
  await expectMeasurementCount(page, 1);
  await expectTotalEquals(page, 'HDD', '100 feet');

  await addLinearMeasurement(page, 'HDD', 150);
  await expectMeasurementCount(page, 2);
  await expectTotalEquals(page, 'HDD', '250 feet');
});
```

---

## Test Independence

### Rule: Each Test Should Be Completely Independent

**Good - Independent Tests:**

```javascript
test('scenario A: should create new takeoff', async ({ page }) => {
  // Setup
  await page.goto('/dashboard/takeoff.html');

  // Execute
  await page.fill('#project-name', 'Test Project A');
  await page.click('[data-testid="create-btn"]');

  // Assert
  await expect(page.locator('[data-testid="project-title"]')).toHaveText('Test Project A');

  // Cleanup (optional)
  await page.evaluate(() => localStorage.clear());
});

test('scenario B: should load existing takeoff', async ({ page }) => {
  // Setup - starts fresh, no dependency on scenario A
  await page.goto('/dashboard/takeoff.html');

  // Create test data for this test only
  await page.evaluate(() => {
    localStorage.setItem('takeoff-123', JSON.stringify({
      id: '123',
      name: 'Test Project B',
      measurements: []
    }));
  });

  // Execute
  await page.click('[data-testid="load-takeoff-123"]');

  // Assert
  await expect(page.locator('[data-testid="project-title"]')).toHaveText('Test Project B');
});
```

**Bad - Shared State:**

```javascript
// ❌ AVOID THIS PATTERN
let sharedState;
let sharedProjectId;

test('scenario A: creates project', async ({ page }) => {
  await page.goto('/dashboard/takeoff.html');
  await page.fill('#project-name', 'Shared Project');
  await page.click('[data-testid="create-btn"]');

  // Storing state for next test - BAD!
  sharedProjectId = await page.locator('[data-testid="project-id"]').textContent();
  sharedState = await page.evaluate(() => localStorage.getItem('currentProject'));
});

test('scenario B: edits project', async ({ page }) => {
  // Depends on scenario A - BAD!
  await page.goto('/dashboard/takeoff.html');
  await page.click(`[data-testid="load-project-${sharedProjectId}"]`);
  await page.fill('#project-name', 'Updated Name');
  await page.click('[data-testid="save-btn"]');
});
```

---

### Why Test Independence Matters

**Problems with shared state:**
1. Tests fail when run in isolation
2. Test order matters (non-deterministic)
3. Parallel execution breaks
4. Hard to debug failures
5. Brittle test suite

**Benefits of independence:**
1. Tests can run in any order
2. Tests can run in parallel
3. Easy to debug (isolated failures)
4. Reliable test results
5. Easy to maintain

---

### Achieving Independence

**Use beforeEach for setup:**
```javascript
test.describe('Measurement Tools', () => {
  test.beforeEach(async ({ page }) => {
    // Fresh start for each test
    await page.goto('/dashboard/takeoff.html');
    await setupDefaultProject(page);
  });

  test('test 1', async ({ page }) => {
    // Has fresh setup from beforeEach
  });

  test('test 2', async ({ page }) => {
    // Has fresh setup from beforeEach
  });
});
```

**Create test-specific data:**
```javascript
test('should save multiple measurements', async ({ page }) => {
  // Create unique test data
  const testId = `test-${Date.now()}`;
  const measurements = [
    { id: `${testId}-1`, type: 'linear', length: 100 },
    { id: `${testId}-2`, type: 'linear', length: 150 }
  ];

  // Use test-specific data
  for (const measurement of measurements) {
    await addMeasurement(page, measurement);
  }

  // Assert on test-specific data
  await expect(page.locator(`[data-testid="measurement-${testId}-1"]`)).toBeVisible();
  await expect(page.locator(`[data-testid="measurement-${testId}-2"]`)).toBeVisible();
});
```

**Isolate storage:**
```javascript
test.beforeEach(async ({ page }) => {
  // Clear all storage before each test
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
});

test.afterEach(async ({ page }) => {
  // Clean up after each test
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
});
```

---

## Resources

### Playwright Documentation

- **Official Docs:** https://playwright.dev/
- **Getting Started:** https://playwright.dev/docs/intro
- **Best Practices:** https://playwright.dev/docs/best-practices
- **Selectors Guide:** https://playwright.dev/docs/selectors
- **Assertions:** https://playwright.dev/docs/test-assertions
- **Auto-waiting:** https://playwright.dev/docs/actionability

### Guides and Tutorials

- **Writing Tests:** https://playwright.dev/docs/writing-tests
- **Generating Tests:** https://playwright.dev/docs/codegen
- **Debugging Tests:** https://playwright.dev/docs/debug
- **Trace Viewer:** https://playwright.dev/docs/trace-viewer
- **Test Reporters:** https://playwright.dev/docs/test-reporters
- **Configuration:** https://playwright.dev/docs/test-configuration

### Advanced Topics

- **Fixtures:** https://playwright.dev/docs/test-fixtures
- **Parallel Testing:** https://playwright.dev/docs/test-parallel
- **Visual Comparisons:** https://playwright.dev/docs/test-snapshots
- **API Testing:** https://playwright.dev/docs/test-api-testing
- **Component Testing:** https://playwright.dev/docs/test-components
- **CI/CD Integration:** https://playwright.dev/docs/ci

### Community Resources

- **GitHub:** https://github.com/microsoft/playwright
- **Stack Overflow:** Tag `playwright`
- **Discord:** https://aka.ms/playwright/discord
- **Blog:** https://playwright.dev/blog

---

## Quick Reference

### Common Commands

```bash
# Run all tests
npx playwright test

# Run specific file
npx playwright test pdf-viewer.spec.js

# Run in headed mode (see browser)
npx playwright test --headed

# Debug mode
npx playwright test --debug

# Update screenshots
npx playwright test --update-snapshots

# Show test report
npx playwright show-report

# Generate tests
npx playwright codegen http://localhost:3000
```

### Common Patterns

```javascript
// Navigation
await page.goto('/path');

// Click
await page.click('[data-testid="button"]');

// Fill input
await page.fill('#input', 'value');

// Select option
await page.selectOption('#select', 'option-value');

// Upload file
await page.setInputFiles('#file-input', 'path/to/file.pdf');

// Wait for element
await page.waitForSelector('[data-testid="element"]');

// Get text
const text = await page.locator('#element').textContent();

// Check visibility
await expect(page.locator('#element')).toBeVisible();

// Screenshot
await page.screenshot({ path: 'screenshot.png' });
```

---

**Last Updated:** 2025-11-22
**Status:** Active
**Applies To:** All 15 takeoff modules (P0-P3)
**Maintained By:** Autonomous Development Team
