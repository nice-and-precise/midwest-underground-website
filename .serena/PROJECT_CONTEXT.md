# Midwest Underground Website - Project Context for Serena MCP

## Project Overview
Next.js 15 application for Midwest Underground of Minnesota Inc - HDD field operations management

## Current State (40% Complete)
- ✅ Infrastructure: Next.js 15.0.3, Prisma, NextAuth configured
- ✅ Database Schema: 17 models for HDD operations
- ❌ API Logic: All routes are stubs (return mock data)
- ❌ Dashboard Logic: All pages are placeholders
- ❌ Authentication: Config exists but flow not implemented
- ❌ Testing: Zero test coverage

## Critical Paths
1. **Database Seeding** → Enables all other features
2. **Authentication Flow** → Blocks dashboard access
3. **Core APIs** → Projects, Bores, Daily Reports
4. **Dashboard UI** → Connect to APIs

## Architecture Decisions
- SQLite for development (easy setup)
- PostgreSQL for production (scalability)
- NextAuth v5 (credential-based login)
- Zod for validation
- Tailwind for styling

## Key Files
- Entry: `src/app/page.tsx`
- Auth: `src/auth.ts`, `src/middleware.ts`
- DB: `prisma/schema.prisma`, `src/lib/prisma.ts`
- APIs: `src/app/api/*/route.ts` (24 endpoints)

## Implementation Priority
1. Phase 1: Foundation (seeding, env)
2. Phase 2: Auth (login, session, protected routes)
3. Phase 3: APIs (full CRUD with Prisma)
4. Phase 4: Dashboard (functional UI)
5. Phase 5: Advanced (offline, KPIs, photos)
6. Phase 6: Testing
7. Phase 7: Production deployment

## Agent Collaboration Opportunities
- **Parallel API Implementation**: 6 agents building different API groups
- **Parallel Page Implementation**: 5 agents building dashboard pages
- **Parallel Testing**: 3 agents writing different test types
