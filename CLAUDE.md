# CLAUDE.md - AI Context for Midwest Underground Website

<!-- Last Updated: 2025-11-23 -->
<!-- Version: 2.0.0 -->

## 🎯 Project Context

**Purpose:**
First digital operations platform for Midwest Underground of Minnesota Inc, a 34-year HDD contractor.

**Business Goal:**
Demonstrate operational capability and readiness for broadband funding opportunities and modernize internal HDD operations.

---

## 💻 Current System Architecture

**Important:** This is a **Next.js 15 full-stack application**, not a static HTML site.

### Frontend

- Next.js 15.0.3 (App Router)
- React 18.3.1
- TypeScript 5.x
- Tailwind CSS 3.4.1
- Radix UI components (if present)

### Backend

- Next.js API Routes
- Prisma ORM 6.0.1
- SQLite for development
- PostgreSQL-ready for production

### Authentication

- NextAuth v5.0.0-beta.29 (Auth.js)
- JWT with httpOnly cookies
- bcryptjs password hashing
- Role-based access control (OWNER, SUPER, CREW, etc.)

### Testing

- Vitest 4.0.13 (unit and integration)
- Playwright 1.56.1 (E2E)
- Target: 80 percent plus coverage

### Database Models (Example Categories)

- Core: User, Role, Permission, AuditLog
- HDD Operations: Project, BoreLog, DailyReport, RodPass
- Assets: Photo, Equipment, MaintenanceLog
- 811 System: EighteenElevenTicket, UtilityMarking
- Business: Customer, Contact, KPI

Use `prisma/schema.prisma` as source of truth.

---

## 🚀 Quick Reference for AI Agents

### Common Commands

```bash
npm run dev              # Start dev server (http://localhost:3000)
npm run build            # Production build
npm test                 # Run tests
npm run test:e2e         # Run Playwright E2E
npm run lint             # Lint
npm run type-check       # TypeScript type-check
npx prisma db push       # Apply schema changes
npx prisma studio        # Prisma database UI
```

### Test Credentials

* Email: `owner@midwestunderground.com`
* Password: `password123`

### Key File Locations

* API routes: `src/app/api/[resource]/route.ts`
* Dashboard pages: `src/app/dashboard/*/page.tsx`
* Components: `src/components/**`
* Prisma schema: `prisma/schema.prisma`
* Auth config: `src/lib/auth.ts` or `src/auth.ts`
* Validation schemas: `src/lib/validations.ts`
* Global layout: `src/app/layout.tsx`

---

## 📁 Documentation Layout

All documentation lives under `docs/`:

```text
docs/
├── README.md                  # Documentation index
├── getting-started/           # Setup and quick start
├── architecture/              # System design
├── guides/                    # Dev, testing, deployment, troubleshooting
├── brand/                     # Brand and naming standards
├── features/                  # Feature-specific docs
├── ai/                        # AI and Serena MCP docs
└── archive/                   # Historical and deprecated docs
```

For a full index, see `docs/README.md`.

---

## 🎨 Brand Standards (Short Version)

**Official Palette:**

* Charcoal: `#23272A` (primary text and logo)
* Safety Orange: `#FF5A1F` (primary CTA accent)
* Steel: `#4F5B66` (secondary)
* Sand: `#F2EDE5` (backgrounds)
* Utility Yellow: `#FFC400` (highlight)

**Deprecated Colors:**

* Do not use `#003B5C`, `#FF6B35`, `#2EA3F2`.

See `docs/brand/BRAND-STANDARDS.md` for full details.

---

## 📝 Naming Conventions (Short Version)

**Files**

* Components: `PascalCase.tsx` (for example `BoreLogCard.tsx`)
* Utilities: `kebab-case.ts` (for example `photo-storage.ts`)
* API routes: `route.ts` in resource folders
* Docs: `SCREAMING-KEBAB-CASE.md` (for example `API-REFERENCE.md`)

**Code**

* Functions: `camelCase` (`getUserById`)
* Variables: `camelCase`
* Constants: `SCREAMING_SNAKE_CASE` (`MAX_FILE_SIZE`)
* Types/Interfaces: `PascalCase` (`User`, `BoreLog`)
* Enums: `PascalCase` name with `SCREAMING_SNAKE_CASE` values

**Git**

* Branches: `feat/feature-name`, `fix/bug-name`, `docs/topic-name`
* Commits: Conventional Commits (`feat(api): add bore logs endpoint`)

For the full set, see `docs/brand/NAMING-CONVENTIONS.md`.

---

## 🧠 AI Agent Workflow

### At the Start of a Session

1. Read this `CLAUDE.md` for context.
2. Read `docs/architecture/CURRENT-STATE.md` for actual state.
3. Check the current branch (`git branch`) and ensure you are on the correct one (`main` or a feature branch requested).
4. If relevant, review recent Serena memories under `.serena/memories/`.

### When Implementing Features

1. Check `docs/features/` to see if the feature is already documented.
2. Follow naming and brand conventions.
3. Use existing Zod validation patterns where possible.
4. Add or update tests.
5. Update documentation when behavior changes.

### When Fixing Bugs

1. Look in `docs/guides/TROUBLESHOOTING.md` for known issues.
2. Search commit history with `git log --grep="keyword"`.
3. Reproduce and fix.
4. Add tests.
5. Update troubleshooting docs and, if relevant, Serena memories.

### When Editing Documentation

1. Follow docs structure described in `docs/README.md`.
2. Add or update "Last Updated" comments where appropriate.
3. Keep internal links correct and relative.
4. Run `npm run docs:validate` when you are done.

---

## 🔗 Serena MCP Memory Protocol

**Location:** `.serena/memories/`

You should create or update memories when:

* Making non-obvious architectural decisions.
* Establishing reusable patterns.
* Discovering tricky bugs or edge cases.
* Completing significant features.

Memory content that becomes permanent knowledge should be extracted into docs:

* Architecture decisions → `docs/architecture/DECISIONS.md`
* Patterns and conventions → `docs/brand/NAMING-CONVENTIONS.md` or `docs/guides/DEVELOPMENT.md`
* Hard problems and solutions → `docs/guides/TROUBLESHOOTING.md`

Once extracted, mark the memory as documented and optionally move it under a dedicated archive folder.

See `docs/ai/SERENA-SYSTEM.md` and `docs/ai/SERENA-INTEGRATION-GUIDE.md` for full guidance and templates.

---

## 🚨 Do and Do Not

**Do**

* Use Next.js 15 and Prisma patterns already established.
* Follow the brand and naming conventions.
* Respect types and validation.
* Update docs when behavior changes.
* Keep changes cohesive and well scoped.

**Do Not**

* Treat this as a static HTML site.
* Introduce conflicting naming or style patterns.
* Add new root-level `.md` files outside the core set.
* Change the database schema without updating schema, migrations (if any), tests, and docs.

---

## 📚 Useful Files

* `README.md` – project overview and quick start
* `PROJECT_INDEX.md` – project index and metadata
* `docs/README.md` – documentation index
* `docs/architecture/OVERVIEW.md` – architecture view
* `docs/brand/BRAND-STANDARDS.md` – color and typography
* `docs/brand/NAMING-CONVENTIONS.md` – naming rules
* `docs/ai/SERENA-SYSTEM.md` – Serena MCP system description

---

**Last Updated:** 2025-11-23
**Maintained by:** @nice-and-precise
