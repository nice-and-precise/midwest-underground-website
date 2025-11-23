# Takeoff System Testing Documentation

**Version:** 1.0
**Last Updated:** 2025-11-22
**Purpose:** Testing strategy, conventions, and best practices

---

## Table of Contents

1. [Testing Overview](#testing-overview)
2. [Testing Framework](#testing-framework)
3. [Test Organization](#test-organization)
4. [Naming Conventions](#naming-conventions)
5. [When to Write Tests](#when-to-write-tests)
6. [Test Data Management](#test-data-management)
7. [Running Tests](#running-tests)
8. [Test Coverage Goals](#test-coverage-goals)
9. [Examples](#examples)

---

## Testing Overview

### Testing Philosophy

The Takeoff System follows a **pragmatic testing approach** focused on:

1. **Critical Path Coverage:** Test the happy path and common error cases
2. **User-Facing Behavior:** Test what users see and interact with
3. **Integration Over Unit:** E2E tests validate entire workflows
4. **Fast Feedback:** Tests run quickly (< 30 seconds total)
5. **Maintainability:** Tests are simple and don't break with minor changes

### What We Test

**High Priority:**
- PDF upload and rendering
- Measurement tool interactions (drawing, editing, deleting)
- Quantity calculations and aggregations
- Save/load functionality
- Data persistence and export
- Estimate calculations
- Proposal generation

**Medium Priority:**
- UI state management
- Form validation
- Error handling
- Browser compatibility

**Low Priority (Not Tested):**
- CSS styling details
- Animation timing
- Exact pixel positioning
- Non-critical error messages

---

## Testing Framework

### Playwright E2E Testing

**Why Playwright?**
- Tests real browser behavior (not jsdom)
- Built-in screenshot and video recording
- Excellent debugging tools
- Works well with static HTML pages
- Supports multiple browsers (Chromium, Firefox, WebKit)

**Framework Stack:**
- **Playwright:** E2E testing framework
- **Node.js:** Test runner environment
- **No additional libraries:** Keep it simple

**Installation:**
```bash
cd /c/Users/Owner/Desktop/midwest-underground-website
npm install -D @playwright/test
npx playwright install
```

**Configuration:** `playwright.config.js`
```javascript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/takeoff',
  timeout: 30000,
  expect: {
    timeout: 5000
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' }
    }
  ],
  webServer: {
    command: 'npx http-server dashboard -p 3000',
    port: 3000,
    timeout: 120000,
    reuseExistingServer: !process.env.CI
  }
});
```

---

## Test Organization

### Directory Structure

```
tests/
└── takeoff/
    ├── fixtures/                    # Test data files
    │   ├── sample-plan.pdf          # Sample PDF for testing
    │   ├── test-takeoff.json        # Sample takeoff data
    │   ├── test-cost-items.json     # Sample cost database
    │   └── test-estimate.json       # Sample estimate
    │
    ├── phase-1/                     # Phase 1 tests
    │   ├── pdf-viewer.spec.js       # Module 1.1 tests
    │   ├── measurement-tools.spec.js # Module 1.2 tests
    │   ├── quantity-calculator.spec.js # Module 1.3 tests
    │   └── export-persistence.spec.js # Module 1.4 tests
    │
    ├── phase-2/                     # Phase 2 tests
    │   ├── cost-database.spec.js    # Module 2.1 tests
    │   ├── estimate-builder.spec.js # Module 2.2 tests
    │   ├── proposal-generator.spec.js # Module 2.3 tests
    │   └── dashboard-integration.spec.js # Module 2.4 tests
    │
    ├── phase-3/                     # Phase 3 tests
    │   ├── bore-visualizer.spec.js  # Module 3.1 tests
    │   ├── historical.spec.js       # Module 3.2 tests
    │   ├── change-orders.spec.js    # Module 3.3 tests
    │   └── client-portal.spec.js    # Module 3.4 tests
    │
    ├── helpers/                     # Reusable test utilities
    │   ├── page-helpers.js          # Common page interactions
    │   ├── data-helpers.js          # Test data generation
    │   └── assertions.js            # Custom assertions
    │
    └── e2e/                         # End-to-end workflows
        ├── complete-takeoff-workflow.spec.js
        ├── estimate-to-proposal.spec.js
        └── change-order-workflow.spec.js
```

---

## Naming Conventions

### Test File Names

**Pattern:** `{module-name}.spec.js`

**Examples:**
- `pdf-viewer.spec.js` - Tests for Module 1.1
- `measurement-tools.spec.js` - Tests for Module 1.2
- `estimate-builder.spec.js` - Tests for Module 2.2

**Rules:**
- Use kebab-case
- Match the module name
- End with `.spec.js`

---

### Test Suite Names

**Pattern:** `describe('Module {ID}: {Name}', () => { ... })`

**Example:**
```javascript
describe('Module 1.2: Measurement Tools', () => {
  describe('Linear Measurement Tool', () => {
    test('should draw a line between two points', async ({ page }) => {
      // ...
    });
  });
});
```

---

### Test Names

**Pattern:** `test('should {behavior} when {condition}', async ({ page }) => { ... })`

**Examples:**
```javascript
test('should upload PDF when file is selected', async ({ page }) => { });
test('should calculate total length when measurements are added', async ({ page }) => { });
test('should save takeoff when save button is clicked', async ({ page }) => { });
test('should display error when invalid scale is entered', async ({ page }) => { });
```

**Rules:**
- Start with "should"
- Describe observable behavior
- Include condition if relevant
- Be specific but concise

---

## When to Write Tests

### Test-Driven Development (TDD)

**Ideal Flow (when practical):**
1. Read module spec and plan
2. Write failing test for first behavior
3. Implement feature to make test pass
4. Refactor if needed
5. Repeat for next behavior

**Reality (for static HTML):**
- TDD works well for JavaScript modules
- Less practical for HTML/CSS layout
- **Guideline:** Write tests during or immediately after implementation

---

### Per-Module Testing Checklist

After completing a module, ensure these tests exist:

**Phase 1 Modules:**

**Module 1.1 - PDF Viewer:**
- [ ] Upload PDF file
- [ ] Display PDF on canvas
- [ ] Navigate between pages
- [ ] Zoom in/out
- [ ] Pan around document

**Module 1.2 - Measurement Tools:**
- [ ] Set scale from plan
- [ ] Draw linear measurement
- [ ] Draw area measurement
- [ ] Add count marker
- [ ] Edit existing measurement
- [ ] Delete measurement
- [ ] Measurements persist across page changes

**Module 1.3 - Quantity Calculator:**
- [ ] Calculate total length for category
- [ ] Update totals when measurement added
- [ ] Update totals when measurement deleted
- [ ] Group quantities by category
- [ ] Display quantities in panel

**Module 1.4 - Export & Persistence:**
- [ ] Save takeoff to JSON
- [ ] Load takeoff from JSON
- [ ] Export to CSV
- [ ] Export to PDF
- [ ] File manager displays saved takeoffs

---

**Phase 2 Modules:**

**Module 2.1 - Cost Database:**
- [ ] Add new cost item
- [ ] Edit cost item
- [ ] Delete cost item
- [ ] Filter by category
- [ ] Search cost items

**Module 2.2 - Estimate Builder:**
- [ ] Link takeoff quantities to cost items
- [ ] Calculate line item totals
- [ ] Apply markup percentage
- [ ] Display estimate total
- [ ] Save estimate

**Module 2.3 - Proposal Generator:**
- [ ] Generate PDF proposal
- [ ] Include company branding
- [ ] Display line items correctly
- [ ] Show totals and markup
- [ ] Save proposal metadata

**Module 2.4 - Dashboard Integration:**
- [ ] Display takeoff count on dashboard
- [ ] Display estimate count on dashboard
- [ ] Link from dashboard to takeoff
- [ ] Show recent activity

---

**Phase 3 Modules:**

**Module 3.1 - Bore Visualizer:**
- [ ] Render 3D bore path
- [ ] Display depth profile
- [ ] Show obstacles/utilities
- [ ] Detect collisions
- [ ] Rotate and zoom 3D view

**Module 3.2 - Historical Database:**
- [ ] Search historical projects
- [ ] Filter by date range
- [ ] Compare similar projects
- [ ] Suggest cost estimates

**Module 3.3 - Change Orders:**
- [ ] Create change order from estimate
- [ ] Add line items to CO
- [ ] Calculate CO total with markup
- [ ] Track CO approval status

**Module 3.4 - Client Portal:**
- [ ] Client login
- [ ] View assigned projects
- [ ] Download proposals
- [ ] Upload files

---

## Test Data Management

### Fixtures Strategy

**Use Case:** Provide consistent test data across tests

**Location:** `tests/takeoff/fixtures/`

**Files:**
- `sample-plan.pdf` - Small 2-page PDF for testing (500KB max)
- `test-takeoff.json` - Sample takeoff with measurements
- `test-cost-items.json` - Sample cost database (10-20 items)
- `test-estimate.json` - Sample estimate with line items
- `test-proposal.json` - Sample proposal metadata

**Loading Fixtures:**
```javascript
import { test } from '@playwright/test';
import path from 'path';

test('should load takeoff from JSON', async ({ page }) => {
  const fixturePath = path.join(__dirname, '../fixtures/test-takeoff.json');
  // Use file input to upload fixture
  await page.setInputFiles('#file-input', fixturePath);
  // Verify loaded correctly
});
```

---

### Test Data Isolation

**Strategy:** Each test creates its own data

**Example:**
```javascript
test('should save new takeoff', async ({ page }) => {
  // Generate unique test data
  const testId = `test-${Date.now()}`;
  const takeoffName = `Test Takeoff ${testId}`;

  // Create takeoff with unique name
  await page.fill('#takeoff-name', takeoffName);
  await page.click('#save-button');

  // Verify saved
  await expect(page.locator(`text=${takeoffName}`)).toBeVisible();

  // Cleanup after test (optional)
  await page.click(`#delete-${testId}`);
});
```

---

### Mock Data Generation

**Helper:** `tests/takeoff/helpers/data-helpers.js`

```javascript
export function generateMockTakeoff() {
  return {
    id: `mock-${Date.now()}`,
    name: 'Mock Takeoff',
    pdfUrl: '/tests/takeoff/fixtures/sample-plan.pdf',
    scale: { pixels: 100, realWorld: 50, units: 'feet' },
    measurements: [
      {
        id: 'measurement-1',
        type: 'linear',
        category: 'HDD',
        points: [[100, 100], [500, 100]],
        length: 200,
        units: 'feet'
      }
    ],
    quantities: { HDD: 200 }
  };
}

export function generateMockCostItem() {
  return {
    id: `cost-${Date.now()}`,
    category: 'Labor',
    name: 'Test Crew',
    unit: 'hour',
    unitCost: 100.00,
    active: true
  };
}
```

---

## Running Tests

### Command Reference

**Run all tests:**
```bash
npx playwright test
```

**Run specific test file:**
```bash
npx playwright test tests/takeoff/phase-1/pdf-viewer.spec.js
```

**Run tests for specific module:**
```bash
npx playwright test tests/takeoff/phase-1/measurement-tools.spec.js
```

**Run tests in headed mode (see browser):**
```bash
npx playwright test --headed
```

**Run tests in debug mode:**
```bash
npx playwright test --debug
```

**Run tests and show report:**
```bash
npx playwright test
npx playwright show-report
```

**Run specific test by name:**
```bash
npx playwright test -g "should upload PDF"
```

---

### Test Scripts (package.json)

Add these scripts to `package.json`:

```json
{
  "scripts": {
    "test": "playwright test",
    "test:headed": "playwright test --headed",
    "test:debug": "playwright test --debug",
    "test:report": "playwright show-report",
    "test:phase1": "playwright test tests/takeoff/phase-1",
    "test:phase2": "playwright test tests/takeoff/phase-2",
    "test:phase3": "playwright test tests/takeoff/phase-3",
    "test:e2e": "playwright test tests/takeoff/e2e"
  }
}
```

**Usage:**
```bash
npm test                 # Run all tests
npm run test:phase1      # Run Phase 1 tests only
npm run test:headed      # Run with visible browser
npm run test:report      # Show HTML report
```

---

## Test Coverage Goals

### Coverage Targets

**Critical Paths:** 100% coverage
- File upload and saving
- Measurement creation and editing
- Quantity calculations
- Estimate totals
- Proposal generation

**Standard Features:** 80% coverage
- UI interactions
- Form validation
- Data display
- Navigation

**Nice-to-Have Features:** 50% coverage
- Advanced filtering
- Search functionality
- Keyboard shortcuts

---

### Coverage Tracking

**After each module completion:**

1. Run tests: `npm test`
2. Check pass/fail status
3. Update `docs/takeoff/TEST-RESULTS.md`
4. Update Serena module state with test status

**TEST-RESULTS.md Format:**
```markdown
# Test Results

| Module | Tests | Passing | Failing | Coverage | Last Run |
|--------|-------|---------|---------|----------|----------|
| 1.1    | 5     | 5       | 0       | 100%     | 2025-11-20 |
| 1.2    | 7     | 7       | 0       | 100%     | 2025-11-21 |
| 1.3    | 4     | 4       | 0       | 100%     | 2025-11-22 |
```

---

## Examples

### Example 1: PDF Viewer Test

**File:** `tests/takeoff/phase-1/pdf-viewer.spec.js`

```javascript
import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Module 1.1: PDF Viewer', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to takeoff page
    await page.goto('http://localhost:3000/dashboard/takeoff.html');
  });

  test('should upload PDF when file is selected', async ({ page }) => {
    // Arrange: Get file input and sample PDF
    const fileInput = page.locator('#pdf-upload');
    const fixturePath = path.join(__dirname, '../fixtures/sample-plan.pdf');

    // Act: Upload file
    await fileInput.setInputFiles(fixturePath);

    // Assert: PDF should be visible
    await expect(page.locator('#pdf-canvas')).toBeVisible();
    await expect(page.locator('#pdf-page-info')).toContainText('Page 1 of 2');
  });

  test('should navigate to next page when next button clicked', async ({ page }) => {
    // Arrange: Upload PDF first
    await page.setInputFiles('#pdf-upload', path.join(__dirname, '../fixtures/sample-plan.pdf'));
    await expect(page.locator('#pdf-page-info')).toContainText('Page 1 of 2');

    // Act: Click next button
    await page.click('#next-page-button');

    // Assert: Should show page 2
    await expect(page.locator('#pdf-page-info')).toContainText('Page 2 of 2');
  });

  test('should zoom in when zoom button clicked', async ({ page }) => {
    // Arrange: Upload PDF
    await page.setInputFiles('#pdf-upload', path.join(__dirname, '../fixtures/sample-plan.pdf'));
    const initialScale = await page.locator('#zoom-level').textContent();

    // Act: Click zoom in button
    await page.click('#zoom-in-button');

    // Assert: Zoom level should increase
    const newScale = await page.locator('#zoom-level').textContent();
    expect(parseFloat(newScale)).toBeGreaterThan(parseFloat(initialScale));
  });
});
```

---

### Example 2: Measurement Tools Test

**File:** `tests/takeoff/phase-1/measurement-tools.spec.js`

```javascript
import { test, expect } from '@playwright/test';

test.describe('Module 1.2: Measurement Tools', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard/takeoff.html');
    // Upload PDF for testing
    await page.setInputFiles('#pdf-upload', path.join(__dirname, '../fixtures/sample-plan.pdf'));
  });

  test('should set scale when calibration completed', async ({ page }) => {
    // Arrange: Open scale tool
    await page.click('#scale-tool-button');

    // Act: Draw scale line (simulate clicks on canvas)
    const canvas = page.locator('#measurement-canvas');
    await canvas.click({ position: { x: 100, y: 100 } });
    await canvas.click({ position: { x: 300, y: 100 } });

    // Enter real-world distance
    await page.fill('#scale-real-world', '100');
    await page.selectOption('#scale-units', 'feet');
    await page.click('#set-scale-button');

    // Assert: Scale should be set
    await expect(page.locator('#scale-display')).toContainText('1" = 100 feet');
  });

  test('should draw linear measurement when tool selected', async ({ page }) => {
    // Arrange: Set scale first
    await setScale(page, 100, 'feet');

    // Select linear tool
    await page.click('#linear-tool-button');

    // Act: Draw line on canvas
    const canvas = page.locator('#measurement-canvas');
    await canvas.click({ position: { x: 100, y: 100 } });
    await canvas.click({ position: { x: 500, y: 100 } });

    // Assert: Measurement should appear in list
    await expect(page.locator('.measurement-item')).toHaveCount(1);
    await expect(page.locator('.measurement-length')).toContainText('200 feet');
  });

  test('should delete measurement when delete button clicked', async ({ page }) => {
    // Arrange: Create a measurement
    await setScale(page, 100, 'feet');
    await drawLinearMeasurement(page, { x: 100, y: 100 }, { x: 500, y: 100 });

    // Act: Click delete button
    await page.click('.measurement-delete-button');

    // Assert: Measurement should be gone
    await expect(page.locator('.measurement-item')).toHaveCount(0);
  });
});

// Helper function
async function setScale(page, distance, units) {
  await page.click('#scale-tool-button');
  const canvas = page.locator('#measurement-canvas');
  await canvas.click({ position: { x: 100, y: 100 } });
  await canvas.click({ position: { x: 300, y: 100 } });
  await page.fill('#scale-real-world', distance.toString());
  await page.selectOption('#scale-units', units);
  await page.click('#set-scale-button');
}
```

---

### Example 3: End-to-End Workflow Test

**File:** `tests/takeoff/e2e/complete-takeoff-workflow.spec.js`

```javascript
import { test, expect } from '@playwright/test';

test.describe('E2E: Complete Takeoff Workflow', () => {
  test('should complete full takeoff workflow from upload to export', async ({ page }) => {
    // Step 1: Upload PDF
    await page.goto('http://localhost:3000/dashboard/takeoff.html');
    await page.setInputFiles('#pdf-upload', path.join(__dirname, '../fixtures/sample-plan.pdf'));
    await expect(page.locator('#pdf-canvas')).toBeVisible();

    // Step 2: Set scale
    await page.click('#scale-tool-button');
    const canvas = page.locator('#measurement-canvas');
    await canvas.click({ position: { x: 100, y: 100 } });
    await canvas.click({ position: { x: 300, y: 100 } });
    await page.fill('#scale-real-world', '100');
    await page.selectOption('#scale-units', 'feet');
    await page.click('#set-scale-button');

    // Step 3: Draw HDD measurement
    await page.click('#linear-tool-button');
    await page.selectOption('#measurement-category', 'HDD');
    await canvas.click({ position: { x: 100, y: 200 } });
    await canvas.click({ position: { x: 500, y: 200 } });

    // Step 4: Draw fiber measurement
    await canvas.click({ position: { x: 100, y: 300 } });
    await canvas.click({ position: { x: 500, y: 300 } });

    // Step 5: Verify quantities
    await expect(page.locator('#quantity-hdd')).toContainText('200 feet');
    await expect(page.locator('#quantity-fiber')).toContainText('200 feet');

    // Step 6: Save takeoff
    await page.fill('#takeoff-name', 'Test Complete Workflow');
    await page.click('#save-button');
    await expect(page.locator('.success-message')).toContainText('Takeoff saved');

    // Step 7: Export to CSV
    await page.click('#export-csv-button');
    // Verify download started (check download event)
    const download = await page.waitForEvent('download');
    expect(download.suggestedFilename()).toContain('takeoff');
    expect(download.suggestedFilename()).toContain('.csv');
  });
});
```

---

## Debugging Failed Tests

### Common Issues and Solutions

**Issue 1: Element not found**
```javascript
// Problem: Element might not be loaded yet
await page.click('#save-button');  // ❌ Might fail

// Solution: Wait for element
await page.waitForSelector('#save-button', { state: 'visible' });
await page.click('#save-button');  // ✅ More reliable
```

**Issue 2: Timing issues**
```javascript
// Problem: Action happens too fast
await page.click('#submit');
await expect(page.locator('.success')).toBeVisible();  // ❌ Might fail

// Solution: Use Playwright's auto-waiting
await page.click('#submit');
await expect(page.locator('.success')).toBeVisible({ timeout: 5000 });  // ✅ Waits up to 5s
```

**Issue 3: Canvas interactions**
```javascript
// Problem: Canvas coordinates might be off
await canvas.click({ position: { x: 100, y: 100 } });  // ❌ May be wrong position

// Solution: Get canvas bounding box first
const box = await canvas.boundingBox();
await canvas.click({ position: { x: box.x + 100, y: box.y + 100 } });  // ✅ Absolute position
```

---

### Debug Tools

**1. Playwright Inspector:**
```bash
npx playwright test --debug
```

**2. Screenshots on failure:**
```javascript
test('should do something', async ({ page }) => {
  try {
    // Test code
  } catch (error) {
    await page.screenshot({ path: 'error-screenshot.png' });
    throw error;
  }
});
```

**3. Console logs:**
```javascript
page.on('console', msg => console.log('PAGE LOG:', msg.text()));
```

**4. Trace viewer:**
```bash
npx playwright test --trace on
npx playwright show-trace trace.zip
```

---

## Playwright Setup and Usage

### Installation and Configuration

**Step 1: Install Playwright**

```bash
cd /c/Users/Owner/Desktop/midwest-underground-website

# Install Playwright test package
npm install -D @playwright/test

# Install browsers (Chromium, Firefox, WebKit)
npx playwright install

# Or install specific browser only
npx playwright install chromium
```

**Step 2: Verify Installation**

```bash
# Check Playwright version
npx playwright --version

# Run sample test
npx playwright test --help
```

**Step 3: Project Structure**

Ensure your project has this structure:

```
midwest-underground-website/
├── playwright.config.js          # Playwright configuration
├── package.json                  # Dependencies
├── dashboard/                    # Static HTML files
│   └── takeoff.html             # Main takeoff page
└── tests/
    └── takeoff/
        ├── fixtures/             # Test data
        ├── helpers/              # Reusable utilities
        ├── phase-1/              # Phase 1 tests
        ├── phase-2/              # Phase 2 tests
        └── phase-3/              # Phase 3 tests
```

---

### Configuration File

The `playwright.config.js` file is already configured. Key settings:

```javascript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  // Test directory
  testDir: './tests/takeoff',

  // Timeout for each test
  timeout: 30000,

  // Expect timeout
  expect: {
    timeout: 5000
  },

  // Run tests in parallel
  fullyParallel: true,

  // Fail build on CI if you accidentally left test.only
  forbidOnly: !!process.env.CI,

  // Retry failed tests on CI
  retries: process.env.CI ? 2 : 0,

  // Reporter configuration
  reporter: 'html',

  // Shared settings for all projects
  use: {
    // Base URL for page.goto()
    baseURL: 'http://localhost:3000',

    // Capture trace on first retry
    trace: 'on-first-retry',

    // Screenshot on failure
    screenshot: 'only-on-failure',

    // Video on failure
    video: 'retain-on-failure'
  },

  // Browser projects
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' }
    }
  ],

  // Web server for tests
  webServer: {
    command: 'npx http-server dashboard -p 3000',
    port: 3000,
    timeout: 120000,
    reuseExistingServer: !process.env.CI
  }
});
```

---

### Basic Usage Examples

**Example 1: Simple Navigation and Assertion**

```javascript
import { test, expect } from '@playwright/test';

test('should load takeoff page', async ({ page }) => {
  // Navigate to page
  await page.goto('/dashboard/takeoff.html');

  // Assert page title
  await expect(page).toHaveTitle(/Takeoff/);

  // Assert element is visible
  await expect(page.locator('h1')).toBeVisible();
});
```

---

**Example 2: Form Interaction**

```javascript
test('should submit project form', async ({ page }) => {
  await page.goto('/dashboard/takeoff.html');

  // Fill form fields
  await page.fill('#project-name', 'Test HDD Project');
  await page.fill('#project-location', 'Willmar, MN');
  await page.selectOption('#project-type', 'HDD');

  // Submit form
  await page.click('[data-testid="submit-btn"]');

  // Verify success message
  await expect(page.locator('.success-message')).toBeVisible();
  await expect(page.locator('.success-message')).toContainText('Project created');
});
```

---

**Example 3: File Upload**

```javascript
import path from 'path';

test('should upload PDF file', async ({ page }) => {
  await page.goto('/dashboard/takeoff.html');

  // Get file input element
  const fileInput = page.locator('#pdf-upload');

  // Upload file
  const filePath = path.join(__dirname, '../fixtures/pdfs/sample-hdd-plan.pdf');
  await fileInput.setInputFiles(filePath);

  // Wait for upload to complete
  await page.waitForSelector('#pdf-canvas', { state: 'visible' });

  // Verify PDF is loaded
  await expect(page.locator('#pdf-canvas')).toBeVisible();
  await expect(page.locator('#pdf-page-info')).toContainText('Page 1');
});
```

---

**Example 4: Canvas Interaction**

```javascript
test('should draw measurement on canvas', async ({ page }) => {
  await page.goto('/dashboard/takeoff.html');

  // Upload PDF first
  await page.setInputFiles('#pdf-upload', 'fixtures/pdfs/sample-hdd-plan.pdf');
  await page.waitForSelector('#measurement-canvas', { state: 'visible' });

  // Select measurement tool
  await page.click('[data-testid="linear-tool-btn"]');

  // Click on canvas to draw measurement
  const canvas = page.locator('#measurement-canvas');
  await canvas.click({ position: { x: 100, y: 100 } });
  await canvas.click({ position: { x: 500, y: 100 } });

  // Verify measurement was created
  await expect(page.locator('.measurement-item')).toHaveCount(1);
});
```

---

**Example 5: Testing API Calls**

```javascript
test('should save takeoff data', async ({ page }) => {
  await page.goto('/dashboard/takeoff.html');

  // Set up response listener
  const responsePromise = page.waitForResponse(
    response => response.url().includes('/api/takeoff') && response.status() === 200
  );

  // Trigger save
  await page.click('[data-testid="save-btn"]');

  // Wait for and verify response
  const response = await responsePromise;
  const responseBody = await response.json();

  expect(responseBody.success).toBe(true);
  expect(responseBody.id).toBeDefined();
});
```

---

**Example 6: Visual Regression Testing**

```javascript
test('should match visual baseline', async ({ page }) => {
  await page.goto('/dashboard/takeoff.html');

  // Wait for page to fully load
  await page.waitForLoadState('networkidle');

  // Compare full page against baseline
  await expect(page).toHaveScreenshot('takeoff-dashboard.png', {
    maxDiffPixels: 100 // Allow minor differences
  });

  // Compare specific element
  const canvas = page.locator('#pdf-canvas');
  await expect(canvas).toHaveScreenshot('pdf-canvas-initial.png');
});
```

---

**Example 7: Mobile Testing**

```javascript
test('should work on mobile viewport', async ({ page }) => {
  // Set mobile viewport
  await page.setViewportSize({ width: 375, height: 667 });

  await page.goto('/dashboard/takeoff.html');

  // Verify mobile menu is visible
  await expect(page.locator('[data-testid="mobile-menu-btn"]')).toBeVisible();

  // Click mobile menu
  await page.click('[data-testid="mobile-menu-btn"]');

  // Verify menu opens
  await expect(page.locator('[data-testid="mobile-nav"]')).toBeVisible();
});
```

---

**Example 8: Error Handling**

```javascript
test('should show error for invalid file', async ({ page }) => {
  await page.goto('/dashboard/takeoff.html');

  // Try to upload invalid file
  await page.setInputFiles('#pdf-upload', 'fixtures/pdfs/invalid.txt');

  // Wait for error message
  await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
  await expect(page.locator('[data-testid="error-message"]')).toContainText('Invalid file type');

  // Verify upload button is re-enabled
  await expect(page.locator('#pdf-upload')).toBeEnabled();
});
```

---

### Running Tests

**Basic Commands:**

```bash
# Run all tests
npm test

# Run specific test file
npx playwright test tests/takeoff/phase-1/pdf-viewer.spec.js

# Run tests in headed mode (see browser)
npx playwright test --headed

# Run tests in debug mode
npx playwright test --debug

# Run specific test by name
npx playwright test -g "should upload PDF"
```

**Watch Mode:**

```bash
# Re-run tests on file change
npx playwright test --watch
```

**Browser Selection:**

```bash
# Run in specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

**Parallel Execution:**

```bash
# Run tests in parallel (default)
npx playwright test

# Run tests serially
npx playwright test --workers=1
```

---

### Debugging Tests

**1. Playwright Inspector**

```bash
# Open Playwright Inspector
npx playwright test --debug

# Debug specific test
npx playwright test pdf-viewer.spec.js --debug
```

**2. Browser Developer Tools**

```bash
# Run with browser open
npx playwright test --headed

# Pause on failure
npx playwright test --headed --timeout=0
```

**3. Screenshots and Videos**

Automatically captured on failure (configured in `playwright.config.js`):

```javascript
use: {
  screenshot: 'only-on-failure',
  video: 'retain-on-failure'
}
```

Access in test results:

```bash
npx playwright show-report
```

**4. Trace Viewer**

```bash
# Run with trace
npx playwright test --trace on

# View trace
npx playwright show-trace trace.zip
```

**5. Console Logging**

```javascript
test('should log console messages', async ({ page }) => {
  // Listen to console
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  await page.goto('/dashboard/takeoff.html');

  // Your test code
});
```

---

### Test Fixtures and Helpers

**Creating Reusable Helpers:**

**File:** `tests/takeoff/helpers/page-helpers.js`

```javascript
export async function uploadPDF(page, filename) {
  const path = require('path');
  const filePath = path.join(__dirname, `../fixtures/pdfs/${filename}`);
  await page.setInputFiles('#pdf-upload', filePath);
  await page.waitForSelector('#pdf-canvas', { state: 'visible' });
}

export async function setScale(page, distance, units) {
  await page.click('#scale-tool-button');
  const canvas = page.locator('#measurement-canvas');
  await canvas.click({ position: { x: 100, y: 100 } });
  await canvas.click({ position: { x: 300, y: 100 } });
  await page.fill('#scale-real-world', distance.toString());
  await page.selectOption('#scale-units', units);
  await page.click('#set-scale-button');
}

export async function drawLinearMeasurement(page, start, end, category = 'HDD') {
  await page.click('#linear-tool-button');
  await page.selectOption('#measurement-category', category);

  const canvas = page.locator('#measurement-canvas');
  await canvas.click({ position: start });
  await canvas.click({ position: end });
}
```

**Using Helpers in Tests:**

```javascript
import { uploadPDF, setScale, drawLinearMeasurement } from '../helpers/page-helpers.js';

test('should create complete takeoff', async ({ page }) => {
  await page.goto('/dashboard/takeoff.html');

  // Use helper functions
  await uploadPDF(page, 'sample-hdd-plan.pdf');
  await setScale(page, 100, 'feet');
  await drawLinearMeasurement(page, { x: 100, y: 100 }, { x: 500, y: 100 }, 'HDD');

  // Verify
  await expect(page.locator('.measurement-item')).toHaveCount(1);
});
```

---

### CI/CD Integration

**GitHub Actions Example:**

```yaml
name: Playwright Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Run Playwright tests
        run: npx playwright test

      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

---

### Best Practices Checklist

**Before Writing Tests:**
- [ ] Read `TESTING-CONVENTIONS.md` for standards
- [ ] Review module specification
- [ ] Identify critical user paths
- [ ] Plan test data and fixtures

**While Writing Tests:**
- [ ] Use `data-testid` attributes for stable selectors
- [ ] Make tests independent (no shared state)
- [ ] Add descriptive test names ("should X when Y")
- [ ] Use `beforeEach` for common setup
- [ ] Handle async operations with await
- [ ] Add meaningful assertions

**After Writing Tests:**
- [ ] Run tests locally (`npm test`)
- [ ] Verify tests pass in isolation
- [ ] Check test coverage
- [ ] Update documentation
- [ ] Commit test fixtures with code

---

## Reference Documentation

For related documentation, see:

- **`.claude/takeoff-system.md`** - Complete system architecture
- **`docs/takeoff/ARCHITECTURE.md`** - High-level system overview
- **`docs/takeoff/TESTING-CONVENTIONS.md`** - Detailed testing conventions and standards
- **`docs/takeoff/MEMORY.md`** - Serena memory structure
- **`docs/takeoff/PROGRESS.md`** - Development progress log

---

**Document Version:** 1.1
**Maintained By:** Autonomous Development Team
**Review Frequency:** After each phase completion
**Last Updated:** 2025-11-22
