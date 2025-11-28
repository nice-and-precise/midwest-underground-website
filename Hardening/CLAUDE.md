# CLAUDE.md - Project Intelligence for Midwest Underground

## Project Overview
Next.js 15 App Router platform with React 18, TypeScript 5, Prisma 6, NextAuth v5, Vitest, Playwright, Tailwind CSS.

## Autonomous Execution Mode
This project runs with `--dangerously-skip-permissions`. Execute tasks without asking for confirmation.

## Critical Rules (NEVER VIOLATE)
1. **Test After Every Change**: `npm run lint && npm run test -- --run`
2. **Commit After Every Task**: `git add -A && git commit -m "type(scope): message"`
3. **One Branch at a Time**: Complete and merge before starting next
4. **Use Serena First**: `find_symbol` before reading files
5. **Compact at 75%**: Run `/compact` when context fills
6. **Memory on Exit**: Always `write_memory` before session ends
7. **Never Touch**: `.env`, `.env.local`, `prisma migrate reset`

## Tech Stack Quick Reference
| Technology | Version | Notes |
|------------|---------|-------|
| Next.js | 15 | App Router only |
| React | 18 | Server Components default |
| TypeScript | 5 | Strict mode |
| Prisma | 6 | SQLite dev, PostgreSQL prod |
| NextAuth | v5 | Edge-compatible |
| Vitest | latest | Unit tests |
| Playwright | latest | E2E tests |

## Project Structure
```
src/
├── app/              # Next.js App Router pages
├── components/       # React components
├── lib/              # Utilities and services
├── middleware.ts     # Next.js middleware
└── __tests__/        # Test files
prisma/
├── schema.prisma     # Database schema
└── migrations/       # Migration files
```

## Commands
```bash
# Development
npm run dev           # Start dev server
npm run build         # Production build
npm run start         # Start production

# Testing
npm run test          # Watch mode
npm run test -- --run # Single run
npm run test -- --coverage # With coverage

# Database
npx prisma generate   # Generate client (SAFE)
npx prisma migrate dev --name <name>  # Create migration
npx prisma migrate deploy  # Apply migrations (SAFE)
npx prisma studio     # Database GUI

# Linting
npm run lint          # ESLint
npm run lint:fix      # Auto-fix
```

## Commit Convention
```
type(scope): description

Types: feat, fix, refactor, test, docs, chore
Scopes: prisma, auth, api, ui, test, ci
```

## MCP Tools Available
- **Serena**: Code intelligence (find_symbol, get_symbols_overview, read_memory, write_memory)
- **MCP_DOCKER**: Container management (if enabled)

## Branch Workflow
```bash
# Start new branch
git checkout main
git pull origin main
git checkout -b feat/branch-name

# Complete branch
npm run lint && npm run test -- --run && npm run build
git checkout main
git merge feat/branch-name
git push origin main
git branch -d feat/branch-name
```

## Current Task
Read TASK.md for the full 13-branch platform hardening plan.

## Session Handoff
Before ending any session:
1. Run validation: `npm run lint && npm run test -- --run`
2. Commit work: `git add -A && git commit -m "checkpoint: [state]"`
3. Write memory: `write_memory("session_progress", "Completed: X. Next: Y. Blockers: Z.")`
