<!-- TOC -->

## Table of Contents

  - [What is Serena MCP?](#what-is-serena-mcp)
  - [Core Concepts](#core-concepts)
    - [1. Persistent Memory](#1-persistent-memory)
    - [2. Memory Types](#2-memory-types)
    - [3. Memory Lifecycle](#3-memory-lifecycle)
  - [Memory Location](#memory-location)
  - [Memory File Structure](#memory-file-structure)
- [[Title]](#title)
  - [Context](#context)
  - [Details](#details)
  - [Rationale](#rationale)
  - [Outcome](#outcome)
  - [Related](#related)
  - [Memory Types in Detail](#memory-types-in-detail)
    - [Decision Memories](#decision-memories)
- [Decision: Use NextAuth v5 for Authentication](#decision-use-nextauth-v5-for-authentication)
  - [Context](#context)
  - [Details](#details)
  - [Rationale](#rationale)
  - [Outcome](#outcome)
  - [Related](#related)
    - [Pattern Memories](#pattern-memories)
- [Pattern: API Endpoint Structure](#pattern-api-endpoint-structure)
  - [Context](#context)
  - [Details](#details)
  - [Rationale](#rationale)
  - [Outcome](#outcome)
  - [Related](#related)
    - [Issue Memories](#issue-memories)
- [Issue: Next.js 15 Dynamic Route Params Must Be Awaited](#issue-nextjs-15-dynamic-route-params-must-be-awaited)
  - [Context](#context)
  - [Details](#details)
  - [Rationale](#rationale)
  - [Outcome](#outcome)
  - [Related](#related)
    - [Session Memories](#session-memories)
- [Session: Module 1.3 Comprehensive Testing Complete](#session-module-13-comprehensive-testing-complete)
  - [Summary](#summary)
  - [Key Achievements](#key-achievements)
  - [Challenges](#challenges)
  - [Next Steps](#next-steps)
  - [Related](#related)
  - [When to Promote Memories to Documentation](#when-to-promote-memories-to-documentation)
    - [Promote to docs/ When:](#promote-to-docs-when)
    - [Keep in .serena/memories/ When:](#keep-in-serenamemories-when)
  - [Memory Extraction Process](#memory-extraction-process)
- [1. Memory identified for promotion](#1-memory-identified-for-promotion)
- [2. Extract to documentation](#2-extract-to-documentation)
- [3. Update memory status](#3-update-memory-status)
- [4. Optional: Archive](#4-optional-archive)
  - [Memory Management Best Practices](#memory-management-best-practices)
    - [For AI Agents](#for-ai-agents)
    - [For Human Developers](#for-human-developers)
  - [Current Memory Statistics](#current-memory-statistics)
  - [Integration with CLAUDE.md](#integration-with-claudemd)
  - [Tools and Utilities](#tools-and-utilities)
    - [Memory Search](#memory-search)
- [Find all memories about authentication](#find-all-memories-about-authentication)
- [Find all active decision memories](#find-all-active-decision-memories)
    - [Memory Statistics](#memory-statistics)
- [Count total memories](#count-total-memories)
- [Count by category](#count-by-category)
    - [Memory Validation](#memory-validation)
- [Check for memories missing required fields](#check-for-memories-missing-required-fields)
  - [Future Enhancements](#future-enhancements)
  - [Related Documentation](#related-documentation)

<!-- /TOC -->

# Serena MCP System

**Last Updated:** 2025-11-23
**Version:** 1.0.0

---

## What is Serena MCP?

**Serena MCP** (Model Context Protocol) is an intelligent memory management system designed to help AI agents maintain context, learn from experience, and build institutional knowledge across sessions.

Unlike traditional AI interactions where context is lost between sessions, Serena creates persistent memories that capture:

- Technical decisions and their rationale
- Implementation patterns that work well
- Known issues and their solutions
- Session summaries for continuity

Think of Serena as a **project knowledge base** that grows smarter over time, helping both AI agents and human developers understand what has been tried, what works, and why.

---

## Core Concepts

### 1. Persistent Memory

Serena memories persist between sessions, allowing:

- **AI agents** to learn from previous sessions without re-discovering solutions
- **Human developers** to understand project history and decision rationale
- **Teams** to build shared institutional knowledge

### 2. Memory Types

Serena organizes memories into categories:

| Memory Type | Purpose | Examples |
|-------------|---------|----------|
| **Decisions** | Architectural and technical choices | "Why we chose NextAuth over Passport", "Database schema design rationale" |
| **Patterns** | Reusable implementation approaches | "API endpoint structure", "Form validation pattern" |
| **Issues** | Known bugs, edge cases, solutions | "Race condition in file upload", "CORS configuration fix" |
| **Sessions** | Session summaries and checkpoints | "Module 1.3 completion", "Navigation integration" |

### 3. Memory Lifecycle

```
Create → Use → Evaluate → Extract or Archive
  ↓       ↓        ↓            ↓
 New    Active   Review    Documentation
```

**Create:** AI agent encounters something worth remembering
**Use:** Memory informs future decisions and implementations
**Evaluate:** Determine if memory is still relevant and valuable
**Extract or Archive:** Promote to docs or archive if obsolete

---

## Memory Location

All Serena memories live in:

```
.serena/
└── memories/
    ├── decisions/
    ├── patterns/
    ├── issues/
    └── sessions/
```

**Important:** The `.serena/` directory is typically **not** committed to version control (listed in `.gitignore`) as it contains session-specific context. However, for this project, we maintain it in the repository to preserve valuable project knowledge.

---

## Memory File Structure

Every Serena memory follows a consistent structure:

```markdown
# [Title]

**Date:** YYYY-MM-DD
**Category:** [Decision|Pattern|Issue|Session]
**Status:** [Active|Documented|Archived]

---

## Context
[What was the situation or problem?]

## Details
[What was decided, implemented, or discovered?]

## Rationale
[Why was this approach chosen?]

## Outcome
[What was the result? What did we learn?]

## Related
- Links to related memories, docs, or code
```

---

## Memory Types in Detail

### Decision Memories

**Purpose:** Document important technical or architectural decisions

**When to create:**
- Choosing between technology options (libraries, frameworks, approaches)
- Database schema design decisions
- Authentication/authorization strategy
- API design patterns
- Deployment architecture

**Example:**
```markdown
# Decision: Use NextAuth v5 for Authentication

**Date:** 2025-11-20
**Category:** Decision
**Status:** Active

## Context
Needed robust authentication for dashboard with role-based access control.

## Details
Chose NextAuth v5 (Auth.js) over Passport.js and custom JWT implementation.

## Rationale
- Native Next.js integration
- Built-in JWT with httpOnly cookies
- Excellent TypeScript support
- Role-based access control
- Active community and documentation

## Outcome
Successfully implemented with minimal configuration. RBAC working well.

## Related
- `src/lib/auth.ts`
- `docs/architecture/OVERVIEW.md`
```

---

### Pattern Memories

**Purpose:** Document reusable implementation patterns that work well

**When to create:**
- Establishing consistent API endpoint structure
- Form validation approach
- Error handling patterns
- Testing strategies
- Component composition patterns

**Example:**
```markdown
# Pattern: API Endpoint Structure

**Date:** 2025-11-21
**Category:** Pattern
**Status:** Active

## Context
Needed consistent structure for all API endpoints for maintainability.

## Details
All API routes follow this pattern:

1. Validate request (Zod schema)
2. Authenticate (session check)
3. Authorize (permission check)
4. Execute business logic
5. Return standardized response

## Rationale
- Consistency across all endpoints
- Easy to test and maintain
- Clear error handling
- Audit trail built-in

## Outcome
All 32 API routes follow this pattern. Zero security incidents.

## Related
- `src/app/api/*/route.ts`
- `docs/guides/DEVELOPMENT.md#api-patterns`
```

---

### Issue Memories

**Purpose:** Document tricky bugs, edge cases, and their solutions

**When to create:**
- Non-obvious bugs that took time to solve
- Edge cases that might recur
- Configuration issues
- Performance problems
- Security vulnerabilities

**Example:**
```markdown
# Issue: Next.js 15 Dynamic Route Params Must Be Awaited

**Date:** 2025-11-22
**Category:** Issue
**Status:** Documented

## Context
Upgrading to Next.js 15 caused type errors in dynamic routes.

## Details
In Next.js 15, route params are now Promises and must be awaited:

```typescript
// ❌ Old way (Next.js 14)
export async function Page({ params }: { params: { id: string } }) {
  const { id } = params;
}

// ✅ New way (Next.js 15)
export async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
}
```

## Rationale
Next.js 15 improved performance by making params async.

## Outcome
Updated all dynamic routes. Added to coding standards.

## Related
- `docs/guides/TROUBLESHOOTING.md#nextjs-15-migration`
- `.serena/memories/code-style-conventions.md`
```

---

### Session Memories

**Purpose:** Capture session summaries, checkpoints, and completion reports

**When to create:**
- Completing a major feature or module
- Reaching a project milestone
- Multi-agent coordination handoffs
- Session checkpoints for continuity

**Example:**
```markdown
# Session: Module 1.3 Comprehensive Testing Complete

**Date:** 2025-11-23
**Category:** Session
**Status:** Active

## Summary
Completed comprehensive testing suite for Takeoff Module 1.3:
- 96% test coverage
- All E2E tests passing
- Performance validated
- Security tested

## Key Achievements
- Created 15 new test files
- Added 127 test cases
- Fixed 3 edge case bugs
- Documented testing patterns

## Challenges
- Race conditions in file upload tests
- CORS configuration for PDF viewer
- Memory leaks in long-running tests

## Next Steps
- Module 1.4: Advanced measurement features
- Performance optimization
- Mobile responsiveness

## Related
- `tests/takeoff/*.spec.ts`
- `.serena/memories/module-1.3-comprehensive-testing-2025-11-23.md`
```

---

## When to Promote Memories to Documentation

Not all memories should live in `.serena/memories/` forever. Some should be promoted to permanent documentation:

### Promote to `docs/` When:

1. **Architectural Decisions** → `docs/architecture/DECISIONS.md`
   - Choice affects long-term system design
   - Important for all developers to know
   - Referenced frequently

2. **Coding Patterns** → `docs/guides/DEVELOPMENT.md`
   - Established as team standard
   - Should be followed by all developers
   - Part of code review criteria

3. **Known Issues** → `docs/guides/TROUBLESHOOTING.md`
   - Likely to affect other developers
   - Has clear solution or workaround
   - Frequently asked question

4. **Feature Documentation** → `docs/features/[FEATURE].md`
   - Feature is complete and stable
   - Needs user or developer documentation
   - Part of core product

### Keep in `.serena/memories/` When:

- Still experimental or in progress
- Session-specific context
- Useful for AI continuity but not for humans
- Detailed implementation notes
- Temporary workarounds
- Historical context that doesn't warrant formal docs

---

## Memory Extraction Process

When promoting a memory to documentation:

1. **Identify** the memory for promotion
2. **Extract** the relevant information
3. **Format** according to the target document's style
4. **Integrate** into appropriate section of docs
5. **Mark** the memory as "Documented" with reference
6. **Optional:** Archive the memory file or delete if fully extracted

**Example Workflow:**

```bash
# 1. Memory identified for promotion
.serena/memories/decision-nextauth-choice.md

# 2. Extract to documentation
docs/architecture/DECISIONS.md (new section added)

# 3. Update memory status
echo "Status: Documented → docs/architecture/DECISIONS.md#nextauth" \
  >> .serena/memories/decision-nextauth-choice.md

# 4. Optional: Archive
mv .serena/memories/decision-nextauth-choice.md \
   .serena/memories/archive/
```

---

## Memory Management Best Practices

### For AI Agents

**Do:**
- Create memories for non-obvious decisions
- Use descriptive, searchable titles
- Follow the memory structure consistently
- Update memory status when circumstances change
- Reference memories when making related decisions

**Don't:**
- Create memories for trivial information
- Duplicate information that's already in docs
- Leave memories without context or rationale
- Create memories without proper categorization

### For Human Developers

**Do:**
- Read relevant memories before starting work
- Update memories when you solve related issues
- Promote valuable memories to documentation
- Archive obsolete memories
- Maintain the memory structure and organization

**Don't:**
- Ignore memories when debugging known issues
- Delete memories without archiving important ones
- Let memories grow stale without review
- Mix session notes with permanent documentation

---

## Current Memory Statistics

As of 2025-11-23:

- **Total Memories:** 87 files
- **Categories:**
  - Decisions: ~12 files
  - Patterns: ~15 files
  - Issues: ~8 files
  - Sessions: ~52 files

- **Status:**
  - Active: ~35 files
  - Documented: ~12 files
  - Archive candidates: ~40 files

**Note:** Next scheduled memory audit: 2025-12-23

---

## Integration with CLAUDE.md

The root `CLAUDE.md` file includes a Serena MCP Memory Protocol section that provides:

- Quick reference for when to create memories
- Guidelines for extracting memories to docs
- References to full Serena documentation

This ensures AI agents are aware of Serena from the start of every session.

---

## Tools and Utilities

### Memory Search

```bash
# Find all memories about authentication
grep -r "auth" .serena/memories/

# Find all active decision memories
grep -r "Category: Decision" .serena/memories/ | grep "Status: Active"
```

### Memory Statistics

```bash
# Count total memories
find .serena/memories/ -type f -name "*.md" | wc -l

# Count by category
grep -r "Category: Decision" .serena/memories/ | wc -l
```

### Memory Validation

```bash
# Check for memories missing required fields
for file in .serena/memories/*.md; do
  if ! grep -q "Category:" "$file" || ! grep -q "Status:" "$file"; then
    echo "Missing fields in: $file"
  fi
done
```

---

## Future Enhancements

Potential improvements to the Serena system:

1. **Automated Memory Tagging** - Auto-categorize memories based on content
2. **Memory Search Interface** - Web UI for searching and browsing memories
3. **Memory Expiration** - Auto-flag stale memories for review
4. **Memory Analytics** - Track which memories are most referenced
5. **Integration with Git** - Link memories to specific commits
6. **Memory Templates** - Interactive templates for creating new memories

---

## Related Documentation

- **[SERENA-INTEGRATION-GUIDE.md](SERENA-INTEGRATION-GUIDE.md)** - How to use Serena (templates, protocols, workflows)
- **[AI-CONTEXT-AUDIT.md](AI-CONTEXT-AUDIT.md)** - AI context file inventory and consolidation
- **[CLAUDE.md](../../CLAUDE.md)** - Primary AI context (includes Serena protocol)
- **[docs/guides/DEVELOPMENT.md](../guides/DEVELOPMENT.md)** - Development patterns and practices

---

**Maintained By:** AI Documentation Team
**Questions?** Review the integration guide or consult recent session memories
