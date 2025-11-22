# Midwest Underground Website - Testing Suite

Comprehensive testing suite for the Midwest Underground HDD operations management application.

## Overview

This project uses a multi-layered testing approach:
- **Unit Tests**: Test individual functions and API endpoints (Vitest)
- **Integration Tests**: Test complete workflows across multiple components (Vitest)
- **E2E Tests**: Test user journeys through the UI (Playwright)

## Test Statistics

- **Total Tests**: 130+
- **Unit Tests**: 115 tests across 7 files
- **Integration Tests**: 18 tests across 3 workflows
- **E2E Tests**: 20+ tests across 3 user journeys
- **Coverage Target**: >80% for src/lib/ and src/app/api/

## Quick Start

### Prerequisites

```bash
# Install dependencies
npm install

# Setup test database (one-time)
export DATABASE_URL="file:./prisma/test.db"
npx prisma db push --force-reset
npx ts-node --project tsconfig.seed.json prisma/seed.ts
```

### Running Tests

```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration

# Run E2E tests only
npm run test:e2e

# Run tests with coverage
npm run test:coverage

# Run all tests (unit + integration + E2E)
npm run test:all

# Watch mode for development
npm run test:watch
```

## Test Structure

```
tests/
├── setup.ts                    # Global test configuration
├── fixtures/                   # Reusable test data
│   ├── users.ts
│   ├── projects.ts
│   ├── bores.ts
│   └── tickets.ts
├── unit/                       # Unit tests
│   ├── api/                    # API endpoint tests
│   │   ├── projects.test.ts
│   │   ├── bore-logs.test.ts
│   │   ├── daily-reports.test.ts
│   │   ├── rod-passes.test.ts
│   │   ├── 811-tickets.test.ts
│   │   └── inspections.test.ts
│   └── lib/                    # Library tests
│       └── validations.test.ts
├── integration/                # Integration tests
│   ├── bore-workflow.test.ts
│   ├── 811-compliance.test.ts
│   └── inspection-workflow.test.ts
└── e2e/                        # End-to-end tests
    ├── login.spec.ts
    ├── projects.spec.ts
    └── rod-logger.spec.ts
```

## Unit Tests

### API Endpoints Covered

**Projects API** (15 tests)
- GET /api/projects - List all projects
- POST /api/projects - Create project
- GET /api/projects/[id] - Get single project
- PUT /api/projects/[id] - Update project
- DELETE /api/projects/[id] - Delete project

**Bore Logs API** (16 tests)
- GET /api/bore-logs - List all bores
- POST /api/bore-logs - Create bore
- GET /api/bore-logs/[id] - Get single bore
- PUT /api/bore-logs/[id] - Update bore
- DELETE /api/bore-logs/[id] - Delete bore

**Daily Reports API** (12 tests)
- GET /api/hdd/daily-reports
- POST /api/hdd/daily-reports
- GET /api/hdd/daily-reports/[id]
- PUT /api/hdd/daily-reports/[id]

**Rod Passes API** (10 tests)
- GET /api/hdd/rod-passes
- POST /api/hdd/rod-passes
- GET /api/hdd/rod-passes/[id]

**811 Tickets API** (15 tests)
- GET /api/hdd/811-tickets
- POST /api/hdd/811-tickets
- GET /api/hdd/811-tickets/[id]
- POST /api/hdd/811-tickets/[id]/responses

**Inspections API** (16 tests)
- GET /api/inspections
- POST /api/inspections
- GET /api/inspections/[id]

**Validation Schemas** (31 tests)
- All Zod schemas tested for valid/invalid inputs
- Edge cases and default values

## Integration Tests

### Workflows Tested

1. **Bore Logging Workflow** (10 steps)
   - Create project → Create bore → Log rod passes → Calculate totals → Create daily report → Submit/approve → Complete bore
   - Tests data relationships and cascading deletes

2. **811 Compliance Workflow** (7 steps)
   - Create 811 ticket → Record utility responses → Validate before drilling → Handle expired tickets → Renew tickets → Track compliance

3. **Inspection Workflow** (8 steps)
   - Pre-construction inspection → Assign inspector → Fill checklist → Complete inspection → Progress inspection → Handle failures → Final inspection

## E2E Tests

### User Journeys Tested

1. **Login Flow** (5 tests)
   - Display login page
   - Login with valid credentials
   - Show error with invalid credentials
   - Validate required fields
   - Logout successfully

2. **Project Management** (6 tests)
   - Navigate to projects page
   - Display list of projects
   - Create new project
   - Filter projects by status
   - View project details
   - Search for projects

3. **Rod Logger** (5 tests)
   - Navigate to rod logger
   - Select project and bore
   - Log a rod pass
   - Calculate total length
   - Display rod pass history

## Test Database

The test suite uses a separate SQLite database (`file:./prisma/test.db`) to avoid affecting development data.

### Setup Test Database

```bash
# Manual setup (recommended before first test run)
export DATABASE_URL="file:./prisma/test.db"
npx prisma db push --force-reset
npx ts-node --project tsconfig.seed.json prisma/seed.ts
```

### Test Data

The test database is seeded with:
- 6 users (1 OWNER, 2 SUPER, 3 CREW)
- 7 projects
- 6 bores
- 20 rod passes
- 4 daily reports
- 4 811 tickets
- 5 811 responses
- 4 inspections

## Coverage Reports

Coverage reports are generated in the `coverage/` directory.

```bash
# Generate coverage report
npm run test:coverage

# View HTML report
open coverage/index.html
```

### Coverage Thresholds

- Lines: 80%
- Functions: 80%
- Branches: 80%
- Statements: 80%

## Writing New Tests

### Unit Test Example

```typescript
import { describe, it, expect } from 'vitest';
import { prisma } from '@/lib/prisma';

describe('My Feature', () => {
  it('should do something', async () => {
    const result = await prisma.model.findMany();
    expect(result).toBeDefined();
  });
});
```

### Integration Test Example

```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { prisma } from '@/lib/prisma';

describe('My Workflow', () => {
  let resourceId: string;

  beforeAll(async () => {
    // Setup
  });

  afterAll(async () => {
    // Cleanup
  });

  it('should complete workflow', async () => {
    // Test multiple steps
  });
});
```

### E2E Test Example

```typescript
import { test, expect } from '@playwright/test';

test('should complete user journey', async ({ page }) => {
  await page.goto('/some-page');
  await page.click('button');
  await expect(page).toHaveURL('/next-page');
});
```

## CI/CD Integration

Tests run automatically on GitHub Actions:

- **On Push**: feat/nextjs-migration, main branches
- **On Pull Request**: To feat/nextjs-migration, main branches

### CI Jobs

1. **unit-and-integration-tests**: Runs on Node 18.x and 20.x
2. **e2e-tests**: Runs Playwright tests on multiple browsers
3. **build**: Verifies production build succeeds

## Troubleshooting

### Common Issues

**Tests fail with "database locked"**
```bash
# Stop any running dev servers
# Delete test database and recreate
rm prisma/test.db
npm run test:setup
```

**Playwright tests timeout**
```bash
# Increase timeout in playwright.config.ts
# Or run with UI mode
npx playwright test --ui
```

**Coverage below threshold**
```bash
# Check uncovered files
npm run test:coverage
# View detailed report in coverage/index.html
```

## Test Maintenance

### When to Update Tests

- After adding new API endpoints
- After modifying validation schemas
- After changing database schema
- After adding new UI pages
- After modifying workflows

### Best Practices

1. **Test Isolation**: Each test should be independent
2. **Cleanup**: Always clean up created data in afterAll/afterEach
3. **Assertions**: Use specific assertions, avoid generic ones
4. **Naming**: Use descriptive test names that explain the scenario
5. **Coverage**: Aim for meaningful coverage, not just high numbers

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Library](https://testing-library.com/)
- [Prisma Testing Guide](https://www.prisma.io/docs/guides/testing)

## Support

For questions or issues with the test suite, see the main project README or contact the development team.
