# Midwest Underground Platform Hardening - Autonomous Execution Plan

## Execution Mode
**FULLY AUTONOMOUS** - Execute all tasks without human intervention.

## Rules (NEVER BREAK THESE)
1. Complete ONE branch fully before starting the next
2. Run `npm run lint && npm run test` after EVERY code change
3. Commit after EVERY completed task with descriptive message
4. Use Serena `find_symbol` before reading files (saves tokens)
5. Run `/compact` when context reaches 75%
6. Write to Serena memory before ending session
7. NEVER modify `.env` or `.env.local` files
8. NEVER run `prisma migrate reset`

## MCP Verification (DO THIS FIRST)
Run `/mcp` and verify these are connected:
- ✅ Serena (or serena-mcp)
- ✅ MCP_DOCKER (if using Docker tools)

If not connected, run `/mcp reconnect` twice if needed.

## Session Start Protocol
1. Verify MCP: `/mcp`
2. Load context: `read_memory("session_progress")`
3. Check git status: `git status && git branch`
4. Verify tests pass: `npm run test -- --run`

## Session End Protocol
1. Run full validation: `npm run lint && npm run test -- --run && npm run build`
2. Commit checkpoint: `git add -A && git commit -m "checkpoint: [description]"`
3. Write memory: `write_memory("session_progress", "[completed tasks, current state, next steps]")`
4. Update PROGRESS.md if exists

---

# PHASE 1: FOUNDATION (Branches 1-3)

## Branch 1: feat/prisma-migrations
**Objective**: Harden Prisma schema and create proper migration workflow

### Prerequisites Check
```bash
git checkout -b feat/prisma-migrations
npm run test -- --run  # Must pass before starting
```

### Tasks

#### Task 1.1: Audit Current Schema
- [ ] Use Serena: `find_symbol("prisma/schema.prisma")`
- [ ] Document all models, relations, and indexes
- [ ] Identify missing indexes on foreign keys
- [ ] Check for missing `@updatedAt` fields

**Acceptance**: Schema audit documented in code comments

#### Task 1.2: Add Missing Indexes
- [ ] Add indexes to all foreign key fields
- [ ] Add composite indexes for common query patterns
- [ ] Run `npx prisma generate`
- [ ] Run `npm run test -- --run`
- [ ] Commit: `git commit -m "feat(prisma): add missing indexes for query optimization"`

**Acceptance**: All FK fields indexed, tests pass

#### Task 1.3: Add Audit Fields
- [ ] Add `createdAt DateTime @default(now())` to models missing it
- [ ] Add `updatedAt DateTime @updatedAt` to models missing it
- [ ] Run `npx prisma generate`
- [ ] Run `npm run test -- --run`
- [ ] Commit: `git commit -m "feat(prisma): add audit timestamp fields"`

**Acceptance**: All models have createdAt/updatedAt, tests pass

#### Task 1.4: Create Migration
- [ ] Run `npx prisma migrate dev --name hardening_indexes_audit_fields`
- [ ] Verify migration file created in `prisma/migrations/`
- [ ] Run `npm run test -- --run`
- [ ] Commit: `git commit -m "feat(prisma): create hardening migration"`

**Acceptance**: Migration created and applied, tests pass

#### Task 1.5: Branch Completion
- [ ] Run full validation: `npm run lint && npm run test -- --run && npm run build`
- [ ] Merge to main: `git checkout main && git merge feat/prisma-migrations`
- [ ] Push: `git push origin main`
- [ ] Write memory: `write_memory("branch_1_complete", "Prisma migrations complete. Indexes added, audit fields added, migration created.")`

---

## Branch 2: feat/security-headers
**Objective**: Implement security headers and CSP

### Prerequisites Check
```bash
git checkout -b feat/security-headers
npm run test -- --run
```

### Tasks

#### Task 2.1: Create Security Headers Middleware
- [ ] Create `src/middleware/security-headers.ts`
- [ ] Implement headers: X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, Referrer-Policy, Permissions-Policy
- [ ] Run tests, commit

```typescript
// Template for security-headers.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function securityHeaders(request: NextRequest, response: NextResponse) {
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  return response;
}
```

**Acceptance**: Security headers middleware created, tests pass

#### Task 2.2: Implement CSP
- [ ] Add Content-Security-Policy header
- [ ] Configure for Next.js (allow 'self', inline scripts for Next.js hydration)
- [ ] Test in development mode
- [ ] Run tests, commit

**Acceptance**: CSP implemented, no console errors in dev

#### Task 2.3: Integrate with Next.js Middleware
- [ ] Update `src/middleware.ts` to use security headers
- [ ] Ensure headers applied to all routes
- [ ] Run tests, commit

**Acceptance**: All responses include security headers

#### Task 2.4: Add Security Header Tests
- [ ] Create `src/__tests__/security-headers.test.ts`
- [ ] Test all headers present
- [ ] Test CSP policy
- [ ] Run tests, commit

**Acceptance**: Security header tests pass

#### Task 2.5: Branch Completion
- [ ] Full validation, merge to main, push
- [ ] Write memory

---

## Branch 3: feat/nextauth-hardening
**Objective**: Harden NextAuth v5 configuration

### Prerequisites Check
```bash
git checkout -b feat/nextauth-hardening
npm run test -- --run
```

### Tasks

#### Task 3.1: Audit Current Auth Config
- [ ] Use Serena to find auth configuration
- [ ] Document current providers, callbacks, session strategy
- [ ] Identify security gaps

#### Task 3.2: Implement Session Security
- [ ] Set secure session configuration
- [ ] Implement session rotation
- [ ] Add session timeout
- [ ] Run tests, commit

#### Task 3.3: Add CSRF Protection
- [ ] Verify CSRF token on mutations
- [ ] Add CSRF validation to API routes
- [ ] Run tests, commit

#### Task 3.4: Implement Auth Rate Limiting
- [ ] Add rate limiting to auth endpoints
- [ ] Implement account lockout after failed attempts
- [ ] Run tests, commit

#### Task 3.5: Branch Completion
- [ ] Full validation, merge to main, push
- [ ] Write memory

---

# PHASE 2: API HARDENING (Branches 4-6)

## Branch 4: feat/input-validation
**Objective**: Implement Zod validation on all API routes

### Tasks
- [ ] Install zod if not present: `npm install zod`
- [ ] Create validation schemas in `src/lib/validations/`
- [ ] Add validation to all API routes
- [ ] Create reusable validation middleware
- [ ] Add validation error handling
- [ ] Tests, commit each task

---

## Branch 5: feat/rate-limiting
**Objective**: Implement API rate limiting

### Tasks
- [ ] Create rate limiter utility
- [ ] Implement per-route rate limits
- [ ] Add rate limit headers to responses
- [ ] Create rate limit bypass for authenticated admins
- [ ] Tests, commit each task

---

## Branch 6: feat/error-handling
**Objective**: Standardize error handling

### Tasks
- [ ] Create error classes (ValidationError, AuthError, NotFoundError)
- [ ] Implement global error handler
- [ ] Sanitize error messages for production
- [ ] Add error logging
- [ ] Tests, commit each task

---

# PHASE 3: TESTING (Branches 7-9)

## Branch 7: feat/unit-tests
**Objective**: Increase unit test coverage to 80%

### Tasks
- [ ] Run coverage report: `npm run test -- --coverage`
- [ ] Identify untested files
- [ ] Add tests for utilities
- [ ] Add tests for hooks
- [ ] Add tests for components
- [ ] Target: 80% coverage

---

## Branch 8: feat/e2e-tests
**Objective**: Add Playwright E2E tests

### Tasks
- [ ] Configure Playwright if not present
- [ ] Add auth flow tests
- [ ] Add critical path tests
- [ ] Add admin workflow tests
- [ ] Create test fixtures

---

## Branch 9: feat/ci-hardening
**Objective**: Harden CI/CD pipeline

### Tasks
- [ ] Add test stage to CI
- [ ] Add lint stage to CI
- [ ] Add build verification
- [ ] Add security scanning (npm audit)
- [ ] Add coverage reporting

---

# PHASE 4: INFRASTRUCTURE (Branches 10-12)

## Branch 10: feat/audit-logging
**Objective**: Implement comprehensive audit logging

### Tasks
- [ ] Create audit log schema
- [ ] Implement audit log service
- [ ] Add audit logging to auth events
- [ ] Add audit logging to data mutations
- [ ] Add audit log viewer for admins

---

## Branch 11: feat/monitoring
**Objective**: Add application monitoring

### Tasks
- [ ] Implement structured logging
- [ ] Add request logging middleware
- [ ] Create health check endpoint
- [ ] Add performance metrics
- [ ] Create monitoring dashboard data

---

## Branch 12: feat/documentation
**Objective**: Create operations documentation

### Tasks
- [ ] Create API documentation
- [ ] Create deployment guide
- [ ] Create security runbook
- [ ] Create incident response guide
- [ ] Update README

---

# PHASE 5: VALIDATION (Branch 13)

## Branch 13: feat/security-audit
**Objective**: Final security audit and sign-off

### Tasks
- [ ] Run `npm audit` and fix vulnerabilities
- [ ] Review all security headers
- [ ] Verify all auth flows secure
- [ ] Test rate limiting
- [ ] Verify input validation complete
- [ ] Create security checklist
- [ ] Document remaining recommendations

---

# Context Management

## Token Budget
- 0-50%: Normal operation
- 50-75%: Consider `/compact`
- 75-90%: MANDATORY `/compact`
- 90%+: Save memory and restart session

## Serena Usage (ALWAYS prefer over file reads)
```
# Instead of reading entire files:
find_symbol("functionName")           # 50 tokens
get_symbols_overview("src/lib")       # 200 tokens
find_referencing_symbols("Component") # 100-500 tokens

# Only read specific sections after finding them
```

## Memory Keys
- `session_progress`: Current state and next steps
- `branch_N_complete`: Completion status for branch N
- `blockers`: Any issues encountered
- `code_patterns`: Discovered patterns in codebase
