# Contributing to Midwest Underground Website

Thank you for your interest in contributing. This document explains how to get started and how we work.

---

## Getting Started

1. **Fork the repository** on GitHub.
2. **Clone your fork:**

   ```bash
   git clone https://github.com/YOUR-USERNAME/midwest-underground-website.git
   cd midwest-underground-website
   ```

3. **Install dependencies:**

   ```bash
   npm install
   ```

4. **Set up the database (development):**

   ```bash
   npx prisma db push
   npx ts-node --project tsconfig.seed.json prisma/seed.ts
   ```

5. **Start the dev server:**

   ```bash
   npm run dev
   ```

6. **Open:** [http://localhost:3000](http://localhost:3000)

---

## Branching

Use the following branch naming conventions:

* Features: `feat/short-feature-name`
* Bug fixes: `fix/short-bug-description`
* Documentation: `docs/topic-name`
* Refactors: `refactor/scope`
* Tests only: `test/scope`
* Chores: `chore/scope`

Examples:

* `feat/daily-report-export`
* `fix/bore-log-length-calculation`
* `docs/architecture-overview`
* `refactor/auth-middleware`

---

## Commit Messages

We use [Conventional Commits](https://www.conventionalcommits.org/).

Examples:

* `feat(api): add bore logs endpoint`
* `fix(auth): handle expired tokens`
* `docs(readme): update quick start`
* `refactor(db): simplify project query`
* `test(bore-log): add integration tests`
* `chore(deps): bump next to 15.x`

Format:

```text
type(scope): short description
```

Types:

* `feat` – new feature
* `fix` – bug fix
* `docs` – documentation
* `style` – formatting, no code change
* `refactor` – code changes that are not fixes or features
* `test` – adding or updating tests
* `chore` – maintenance tasks
* `perf` – performance improvements

---

## Code Standards

* **TypeScript:** strict mode.
* **Linting:** run `npm run lint` before committing.
* **Formatting:** Prettier (ensure your editor formats on save).
* **Naming:** follow `docs/brand/NAMING-CONVENTIONS.md`.
* **Brand:** follow `docs/brand/BRAND-STANDARDS.md`.

---

## Testing

Before opening a PR:

1. Run unit and integration tests:

   ```bash
   npm test
   ```

2. Run E2E tests (if your change affects flows):

   ```bash
   npm run test:e2e
   ```

3. Run type-check:

   ```bash
   npm run type-check
   ```

4. Ensure tests and type-check pass with no errors.

Add or update tests for:

* New features
* Bug fixes
* Changes to behavior

---

## Documentation Requirements

Update documentation when:

* Adding or changing features
* Changing API contracts
* Changing database schema
* Changing key workflows

Locations:

* High-level: `README.md`
* Architecture: `docs/architecture/OVERVIEW.md`, `docs/architecture/API-REFERENCE.md`
* Guides: `docs/guides/*`
* Features: `docs/features/*`

---

## Pull Request Process

1. **Sync with default branch:**

   ```bash
   git fetch origin
   git checkout main
   git pull origin main
   git checkout your-branch
   git rebase main
   ```

2. **Run checks:**

   ```bash
   npm run lint
   npm run type-check
   npm test
   npm run build
   ```

3. **Push your branch:**

   ```bash
   git push origin your-branch-name
   ```

4. **Open a Pull Request:**

   * Use a clear title.
   * Fill in the template:

   ```markdown
   ## Description

   [Brief description of the change.]

   ## Type of Change

   - [ ] Bug fix
   - [ ] New feature
   - [ ] Documentation update
   - [ ] Refactor
   - [ ] Performance improvement
   - [ ] Other

   ## Testing

   - [ ] Unit tests
   - [ ] Integration tests
   - [ ] E2E tests
   - [ ] Manual testing

   ## Checklist

   - [ ] Code follows project conventions
   - [ ] Tests added or updated
   - [ ] All tests pass
   - [ ] Type-check passes
   - [ ] Documentation updated

   ## Related Issues

   Closes #ISSUE_NUMBER
   ```

5. A maintainer will review your PR. Please be ready to respond to feedback.

---

## Questions

* Check the documentation: `docs/README.md`.
* Open an issue on GitHub if something is unclear.
* For security issues, please follow `SECURITY.md`.

Thank you for contributing.
