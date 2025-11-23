<!-- TOC -->

## Table of Contents

  - [📋 QUICK START FOR NEW SESSION](#quick-start-for-new-session)
    - [Step 1: Activate Project in Serena MCP](#step-1-activate-project-in-serena-mcp)
    - [Step 2: Review Current State](#step-2-review-current-state)
  - [🎯 MISSION: Complete Full Implementation](#mission-complete-full-implementation)
    - [Overall Goal](#overall-goal)
    - [Current Status](#current-status)
  - [🤖 MULTI-AGENT DEVELOPMENT STRATEGY](#multi-agent-development-strategy)
    - [Critical Instructions for Claude](#critical-instructions-for-claude)
  - [📊 WAVE 2: READY TO LAUNCH (2 Parallel Agents)](#wave-2-ready-to-launch-2-parallel-agents)
    - [Agent 2: Authentication Implementation](#agent-2-authentication-implementation)
    - [Agent 3: Projects & Bores API](#agent-3-projects-bores-api)
  - [📚 ESSENTIAL CONTEXT](#essential-context)
    - [Database is Ready](#database-is-ready)
    - [Test Credentials](#test-credentials)
    - [Tech Stack](#tech-stack)
    - [Project Structure](#project-structure)
  - [🚦 EXECUTION PLAN FOR CLAUDE](#execution-plan-for-claude)
    - [Step 1: Activate & Review (2 minutes)](#step-1-activate-review-2-minutes)
    - [Step 2: Launch Wave 2 Agents (Parallel)](#step-2-launch-wave-2-agents-parallel)
    - [Step 3: Monitor & Coordinate](#step-3-monitor-coordinate)
    - [Step 4: Launch Wave 3 (4 Parallel Agents)](#step-4-launch-wave-3-4-parallel-agents)
    - [Step 5: Launch Wave 4 (2 Parallel Agents)](#step-5-launch-wave-4-2-parallel-agents)
    - [Step 6: Final Integration](#step-6-final-integration)
  - [📝 DETAILED AGENT PROMPTS](#detailed-agent-prompts)
    - [Agent 2: Authentication (Full Prompt)](#agent-2-authentication-full-prompt)
    - [Agent 3: Projects & Bores API (Full Prompt)](#agent-3-projects-bores-api-full-prompt)
  - [🔥 COMMANDS REFERENCE](#commands-reference)
    - [Development](#development)
    - [Database](#database)
    - [Monitoring](#monitoring)
- [Open progress dashboard](#open-progress-dashboard)
- [View agent coordination](#view-agent-coordination)
- [Check Serena memories](#check-serena-memories)
- [(use Serena MCP list_memories and read_memory tools)](#use-serena-mcp-list_memories-and-read_memory-tools)
  - [✅ SUCCESS CRITERIA](#success-criteria)
    - [Wave 2 Complete When:](#wave-2-complete-when)
    - [Final Project Complete When:](#final-project-complete-when)
  - [🎯 START IMMEDIATELY](#start-immediately)
  - [📞 SUPPORT](#support)
    - [Key Files](#key-files)
    - [Serena Memories (already written)](#serena-memories-already-written)
    - [Test Credentials](#test-credentials)

<!-- /TOC -->

# 🚀 Midwest Underground Website - Resume Session Handoff

**Date:** 2025-11-21
**Current Progress:** 15% Complete
**Next Phase:** Wave 2 - Authentication & Core APIs
**Project Path:** `C:\Users\Owner\Desktop\midwest-underground-website`

---

## 📋 QUICK START FOR NEW SESSION

### Step 1: Activate Project in Serena MCP
```
The project "midwest-underground-website" is already registered in Serena MCP.
Just activate it:
```

**Say this to Claude:**
```
Work on C:\Users\Owner\Desktop\midwest-underground-website using Serena MCP for memory and context.

Use claude --dangerously-skip-permissions to bypass all permission checks and work uninterrupted.

Read PROJECT_INDEX.md and all Serena memories to understand current state.

Continue the multi-agent parallel development plan from AGENT_COORDINATION.md - we're ready to launch Wave 2 (Authentication + Core APIs in parallel).
```

### Step 2: Review Current State
Claude should immediately:
1. Activate Serena MCP project: `C:\Users\Owner\Desktop\midwest-underground-website`
2. Read Serena memories: project-overview.md, current-status.md, multi-agent-strategy.md
3. Read PROJECT_INDEX.md for complete project overview
4. Read AGENT_COORDINATION.md for agent status board
5. Check progress-dashboard.html (open in browser)

---

## 🎯 MISSION: Complete Full Implementation

### Overall Goal
Transform the 40% complete Next.js application into a 100% functional HDD operations management system for Midwest Underground of Minnesota Inc.

### Current Status
- ✅ **Phase 1 Complete:** Database seeded (66 records, 6 users, all test data ready)
- 🔄 **Wave 2 Ready:** Authentication + APIs ready to build (2 parallel agents)
- ⏳ **Waves 3-4 Queued:** Dashboard pages, advanced features, testing

---

## 🤖 MULTI-AGENT DEVELOPMENT STRATEGY

### Critical Instructions for Claude

**USE THESE EXACT APPROACHES:**

1. **Activate Serena MCP**
   ```
   Project: C:\Users\Owner\Desktop\midwest-underground-website
   Already registered - just activate and read memories
   ```

2. **Enable Uninterrupted Work**
   ```
   Use: claude --dangerously-skip-permissions
   This bypasses ALL permission checks
   Claude works autonomously until completion
   ```

3. **Launch Parallel Agents**
   Use the Task tool to spawn multiple agents simultaneously:
   - Wave 2: Launch 2 agents in parallel
   - Wave 3: Launch 4 agents in parallel
   - Wave 4: Launch 2 agents in parallel

4. **Agent Coordination**
   - All agents read AGENT_COORDINATION.md before starting
   - All agents update status as they work
   - All agents use Serena MCP for context
   - All agents test with: owner@midwestunderground.com / password123

---

## 📊 WAVE 2: READY TO LAUNCH (2 Parallel Agents)

### Agent 2: Authentication Implementation
**Mission:** Implement complete NextAuth.js authentication flow

**Deliverables:**
- [ ] Working login/logout with NextAuth v5
- [ ] Session management (JWT-based)
- [ ] Protected routes (middleware)
- [ ] Role-based access control (OWNER, SUPER, CREW)
- [ ] Functional LoginForm component
- [ ] Test with: owner@midwestunderground.com / password123

**Files to Modify:**
- src/auth.ts (NextAuth config)
- src/middleware.ts (route protection)
- src/app/auth/login/page.tsx (login page)
- src/components/LoginForm.tsx (form component)
- src/app/api/auth/[...nextauth]/route.ts (API handler)

**Test Checklist:**
- Login with valid credentials → redirects to /dashboard
- Invalid credentials → shows error
- Dashboard without auth → redirects to /auth/login
- Logout → clears session and redirects to /
- Session persists across page reloads

---

### Agent 3: Projects & Bores API
**Mission:** Implement full CRUD for Projects and Bore Logs with Prisma

**Deliverables:**
- [ ] GET /api/projects (list all with relations)
- [ ] POST /api/projects (create new)
- [ ] GET /api/projects/[id] (single with full relations)
- [ ] PUT /api/projects/[id] (update)
- [ ] DELETE /api/projects/[id] (delete with cascade)
- [ ] Same 5 endpoints for /api/bore-logs/*
- [ ] Proper error handling (404, 400, 500)
- [ ] Zod validation on all inputs
- [ ] Test with Prisma Studio data

**Files to Modify:**
- src/app/api/projects/route.ts
- src/app/api/projects/[id]/route.ts
- src/app/api/bore-logs/route.ts
- src/app/api/bore-logs/[id]/route.ts

**Test Checklist:**
- GET returns all 7 seeded projects
- POST creates new project
- GET /[id] includes all relations (bores, reports, etc.)
- PUT updates successfully
- DELETE removes project and cascades
- Invalid ID returns 404
- Invalid input returns 400 with validation errors

---

## 📚 ESSENTIAL CONTEXT

### Database is Ready
- **Seeded:** 66 records across 17 models
- **Test Users:** 6 accounts (owner, super, crew roles)
- **Password:** password123 (all accounts)
- **View Data:** `npm run db:studio`

### Test Credentials
```
Email: owner@midwestunderground.com
Password: password123

Email: super@midwestunderground.com
Password: password123

Email: crew@midwestunderground.com
Password: password123
```

### Tech Stack
- Next.js 15.0.3 (App Router)
- React 18.3.1
- TypeScript 5.x (strict mode)
- Prisma 6.0.1 + SQLite (dev)
- NextAuth v5.0.0-beta.29
- Tailwind CSS 3.4.1
- Zod 3.25.76

### Project Structure
```
src/
├── app/
│   ├── api/          # 24 API endpoints (currently stubs)
│   ├── dashboard/    # 32 pages (currently placeholders)
│   └── auth/login/   # Login page
├── components/       # React components
├── lib/             # Utilities (prisma, validations)
└── middleware.ts    # Route protection

prisma/
├── schema.prisma    # 17 models
├── seed.ts          # Seed script (1,060 lines)
└── dev.db           # SQLite database (272 KB, seeded)
```

---

## 🚦 EXECUTION PLAN FOR CLAUDE

### Step 1: Activate & Review (2 minutes)
```typescript
// 1. Activate Serena MCP
mcp__serena__activate_project("C:\\Users\\Owner\\Desktop\\midwest-underground-website")

// 2. Read all memories
mcp__serena__list_memories()
mcp__serena__read_memory("current-status.md")
mcp__serena__read_memory("multi-agent-strategy.md")

// 3. Review coordination
Read: PROJECT_INDEX.md
Read: AGENT_COORDINATION.md
```

### Step 2: Launch Wave 2 Agents (Parallel)
```typescript
// Launch 2 agents simultaneously
Task({
  subagent_type: "general-purpose",
  description: "Agent 2: Authentication",
  model: "sonnet",
  prompt: "Implement complete NextAuth authentication flow..."
})

Task({
  subagent_type: "general-purpose",
  description: "Agent 3: Projects & Bores API",
  model: "sonnet",
  prompt: "Implement full CRUD for Projects and Bores..."
})
```

### Step 3: Monitor & Coordinate
- Check AGENT_COORDINATION.md for updates
- View progress-dashboard.html in browser
- Ensure agents update status as they work
- Integrate outputs when both complete

### Step 4: Launch Wave 3 (4 Parallel Agents)
After Wave 2 completes, launch:
- Agent 4: Daily Reports & Rod Passes API
- Agent 5: 811 Tickets & Inspections API
- Agent 6: Dashboard Pages - Group A
- Agent 7: Dashboard Pages - Group B

### Step 5: Launch Wave 4 (2 Parallel Agents)
After Wave 3 completes, launch:
- Agent 8: Advanced Features
- Agent 9: Testing Suite

### Step 6: Final Integration
- Run full build: `npm run build`
- Run all tests: `npm test`
- Manual browser testing
- Update documentation
- Re-index repository

---

## 📝 DETAILED AGENT PROMPTS

### Agent 2: Authentication (Full Prompt)

```
You are Agent 2 in a multi-agent development team working on Midwest Underground Website.

PROJECT: C:\Users\Owner\Desktop\midwest-underground-website
SERENA MCP: Already activated - read memories for context
PERMISSIONS: Use --dangerously-skip-permissions (work uninterrupted)

READ FIRST:
- Serena memory: current-status.md
- PROJECT_INDEX.md
- AGENT_COORDINATION.md

YOUR MISSION: Implement complete, working NextAuth.js v5 authentication system

TEST CREDENTIALS (from Agent 1's database seed):
- Email: owner@midwestunderground.com
- Password: password123
- (All 6 users use this password)

WHAT EXISTS:
✅ Database with User model (6 seeded users)
✅ NextAuth config stub (src/auth.ts)
✅ Login page stub (src/app/auth/login/page.tsx)
✅ LoginForm component stub (src/components/LoginForm.tsx)
✅ Middleware stub (src/middleware.ts)
✅ Auth API route (src/app/api/auth/[...nextauth]/route.ts)

YOUR TASKS:

1. Complete NextAuth Configuration (src/auth.ts)
   - Configure CredentialsProvider
   - Implement authorize() to verify email/password
   - Use bcryptjs.compare() for password verification
   - Query Prisma: prisma.user.findUnique({ where: { email } })
   - Include user role in session
   - Callbacks: jwt() and session()

2. Fix Auth API Route (src/app/api/auth/[...nextauth]/route.ts)
   - Import auth from src/auth.ts
   - Export GET and POST handlers for NextAuth v5

3. Build LoginForm (src/components/LoginForm.tsx)
   - Email + password inputs
   - Use signIn() from next-auth/react
   - On success: redirect to /dashboard
   - On error: display error message
   - Loading state during submit

4. Complete Login Page (src/app/auth/login/page.tsx)
   - Render LoginForm
   - Check session, show "already logged in" if authenticated
   - Proper styling

5. Implement Middleware (src/middleware.ts)
   - Protect /dashboard/* routes
   - Redirect to /auth/login if not authenticated
   - Allow public routes (/, /auth/*)

6. Test Authentication Flow
   - Start dev server: npm run dev
   - Visit /auth/login
   - Login with owner@midwestunderground.com / password123
   - Verify redirect to /dashboard
   - Test logout
   - Verify session persists

TECHNICAL REQUIREMENTS:
- NextAuth v5 (in dependencies)
- Prisma Client: import { prisma } from '@/lib/prisma'
- bcryptjs for password comparison
- TypeScript strict mode
- Follow Next.js 15 conventions

COORDINATION:
- Update AGENT_COORDINATION.md when starting
- Update when completing each deliverable
- Document issues encountered
- Test with all 6 user accounts

DELIVERABLES:
✅ Working login/logout flow
✅ Session management
✅ Protected routes (middleware)
✅ Role-based access (roles in session)
✅ Updated AGENT_COORDINATION.md

TESTING CHECKLIST:
- [ ] Login with valid credentials works
- [ ] Login with wrong password fails
- [ ] Session persists across reloads
- [ ] Dashboard redirects when not authenticated
- [ ] Logout clears session
- [ ] Role available in session

COMPLETION:
- Run: npm run build (must succeed)
- Test in browser
- Update AGENT_COORDINATION.md
- Write completion report
```

---

### Agent 3: Projects & Bores API (Full Prompt)

```
You are Agent 3 in a multi-agent development team working on Midwest Underground Website.

PROJECT: C:\Users\Owner\Desktop\midwest-underground-website
SERENA MCP: Already activated - read memories for context
PERMISSIONS: Use --dangerously-skip-permissions (work uninterrupted)

READ FIRST:
- Serena memory: current-status.md
- PROJECT_INDEX.md
- AGENT_COORDINATION.md
- Database seeded with 7 projects, 6 bores (Agent 1)

YOUR MISSION: Implement full CRUD API routes for Projects and Bore Logs

WHAT EXISTS:
✅ Database seeded (7 projects, 6 bores with relationships)
✅ Prisma schema defined (17 models)
✅ API route stubs (currently return mock data)
✅ Zod schemas in src/lib/validations.ts

API ROUTES TO IMPLEMENT (10 total):

PROJECTS API:
1. GET /api/projects/route.ts - List all projects
   - Include: createdBy (name, email), bore counts, report counts
   - Support: ?status=PLANNING|IN_PROGRESS|COMPLETED
   - Return: { projects: Project[] }

2. POST /api/projects/route.ts - Create project
   - Validate with Zod
   - Get user from session
   - Create with Prisma
   - Return: { project: Project }

3. GET /api/projects/[id]/route.ts - Get single project
   - Await params (Next.js 15!)
   - Include all relations (bores, reports, tickets)
   - Return 404 if not found
   - Return: { project: Project }

4. PUT /api/projects/[id]/route.ts - Update project
   - Await params
   - Validate input
   - Update with Prisma
   - Return: { project: Project }

5. DELETE /api/projects/[id]/route.ts - Delete project
   - Await params
   - Check permissions (OWNER only)
   - Delete (cascades to related records)
   - Return: { success: true }

BORE LOGS API:
6. GET /api/bore-logs/route.ts - List bores
   - Include: project, pits, rod pass counts
   - Support: ?status=PLANNED|IN_PROGRESS|COMPLETED
   - Return: { bores: Bore[] }

7. POST /api/bore-logs/route.ts - Create bore
   - Validate input
   - Verify project exists
   - Create with Prisma
   - Return: { bore: Bore }

8. GET /api/bore-logs/[id]/route.ts - Get bore details
   - Include: project, pits, all rod passes
   - Return 404 if not found
   - Return: { bore: Bore }

9. PUT /api/bore-logs/[id]/route.ts - Update bore
   - Validate and update
   - Return: { bore: Bore }

10. DELETE /api/bore-logs/[id]/route.ts - Delete bore
    - Check permissions
    - Delete (cascades to rod passes)
    - Return: { success: true }

EXAMPLE IMPLEMENTATION:
```typescript
// src/app/api/projects/route.ts
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const projects = await prisma.project.findMany({
      where: status ? { status } : {},
      include: {
        createdBy: {
          select: { name: true, email: true }
        },
        _count: {
          select: {
            bores: true,
            dailyReports: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return Response.json({ projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return Response.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate with Zod
    // Get user from session
    // Create project

    const project = await prisma.project.create({
      data: {
        ...body,
        createdById: userId
      },
      include: {
        createdBy: true
      }
    });

    return Response.json({ project }, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return Response.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
```

ERROR HANDLING:
- Try/catch all database operations
- Return appropriate status codes (200, 201, 400, 404, 500)
- Log errors to console
- User-friendly error messages

VALIDATION:
- Import/create Zod schemas if not in validations.ts
- Validate all POST/PUT bodies
- Return 400 for validation errors

TESTING:
- Test each endpoint (curl or Postman)
- Verify data matches database
- Test error cases (not found, invalid data)
- Check relationships load

COORDINATION:
- Read AGENT_COORDINATION.md before starting
- Update status as you complete endpoints
- Document issues for other agents

DELIVERABLES:
✅ All 10 endpoints fully functional
✅ Proper Prisma queries with relations
✅ Error handling on all routes
✅ Validation on all inputs
✅ Test results for each endpoint
✅ Updated AGENT_COORDINATION.md

TESTING CHECKLIST:
- [ ] GET /api/projects returns 7 projects
- [ ] POST /api/projects creates new
- [ ] GET /api/projects/[id] returns with relations
- [ ] PUT /api/projects/[id] updates
- [ ] DELETE /api/projects/[id] deletes
- [ ] Same for bore-logs endpoints
- [ ] Invalid IDs return 404
- [ ] Invalid input returns 400

COMPLETION:
- Run: npm run build (must succeed)
- Test each endpoint
- Update AGENT_COORDINATION.md
- Write completion report
```

---

## 🔥 COMMANDS REFERENCE

### Development
```bash
npm run dev              # Start dev server (http://localhost:3000)
npm run build            # Production build
npm run lint             # Run linter
```

### Database
```bash
npm run db:studio        # View database GUI (http://localhost:5555)
npm run db:seed          # Populate with test data
npm run db:reset         # Reset and reseed (⚠️ destroys data)
npm run db:generate      # Generate Prisma Client
npm run db:push          # Push schema changes
```

### Monitoring
```bash
# Open progress dashboard
start progress-dashboard.html

# View agent coordination
cat AGENT_COORDINATION.md

# Check Serena memories
# (use Serena MCP list_memories and read_memory tools)
```

---

## ✅ SUCCESS CRITERIA

### Wave 2 Complete When:
- [ ] Can login with owner@midwestunderground.com / password123
- [ ] Dashboard redirects to login when not authenticated
- [ ] Session persists across page reloads
- [ ] GET /api/projects returns all 7 projects
- [ ] GET /api/bore-logs returns all 6 bores
- [ ] All CRUD operations work for both APIs
- [ ] npm run build succeeds with 0 errors
- [ ] AGENT_COORDINATION.md updated by both agents

### Final Project Complete When:
- All 9 agents complete (Waves 2-4)
- All API routes functional (no mock data)
- All dashboard pages functional (real data)
- Authentication working (login, logout, protected routes)
- Tests written and passing
- npm run build succeeds
- Manual testing passes
- Documentation updated

---

## 🎯 START IMMEDIATELY

**Copy this exact message to new Claude Code session:**

```
Work on C:\Users\Owner\Desktop\midwest-underground-website

Use Serena MCP for memory and context - the project is already registered.

Use claude --dangerously-skip-permissions to work uninterrupted until completion.

Read HANDOFF-RESUME-SESSION.md for complete context and instructions.

Launch Wave 2 parallel agents now:
- Agent 2: Authentication Implementation
- Agent 3: Projects & Bores API

Follow the multi-agent development strategy with full autonomy.
```

---

## 📞 SUPPORT

### Key Files
- **HANDOFF-RESUME-SESSION.md** (this file) - Complete handoff
- **PROJECT_INDEX.md** - Project overview
- **AGENT_COORDINATION.md** - Agent status board
- **progress-dashboard.html** - Visual progress
- **DATABASE-SETUP-REPORT.md** - Database documentation

### Serena Memories (already written)
- project-overview.md
- tech-stack.md
- suggested-commands.md
- code-style-conventions.md
- task-completion-checklist.md
- current-status.md
- multi-agent-strategy.md

### Test Credentials
```
ALL users: password123

owner@midwestunderground.com
super@midwestunderground.com
supervisor@midwestunderground.com
crew@midwestunderground.com
operator@midwestunderground.com
locator@midwestunderground.com
```

---

**Handoff Complete. Ready for new Claude Code session to resume and complete all work.**

**Current Progress:** 15% (Phase 1 complete)
**Target Progress:** 100% (All 9 agents complete)
**Estimated Completion:** 4-6 hours with parallel agents
**Status:** ✅ READY TO RESUME
