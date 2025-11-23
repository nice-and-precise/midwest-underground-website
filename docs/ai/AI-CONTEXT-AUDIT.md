# AI Context Audit

**Last Updated:** 2025-11-23
**Version:** 1.0.0

---

## Purpose

This document provides an inventory of all AI context files in the repository and defines the consolidation strategy to maintain a single source of truth for AI agents working on this project.

---

## AI Context Files Inventory

### Primary AI Context File (Canonical)

**File:** `CLAUDE.md`
**Location:** Repository root
**Lines:** 246
**Status:** ✅ Canonical and authoritative
**Last Updated:** 2025-11-23
**Version:** 2.0.0

This is the **single source of truth** for AI context. All AI agents must read this file at the start of each session.

**Contents:**
- Project context and business goals
- Current system architecture (Next.js 15, Prisma, NextAuth)
- Quick reference commands and credentials
- Documentation layout and structure
- Brand standards and naming conventions
- AI agent workflow guidelines
- Serena MCP memory protocol
- Do's and don'ts for AI agents

---

## Other Documentation Files

### Project Overview Files

**File:** `README.md`
**Location:** Repository root
**Lines:** 830
**Purpose:** Human-readable project overview and quick start guide
**Target Audience:** Developers (human and AI)
**Status:** ✅ Active

**File:** `PROJECT_INDEX.md`
**Location:** Repository root
**Lines:** 477
**Purpose:** Comprehensive project index for rapid context acquisition (95.6% token savings)
**Target Audience:** AI agents starting new sessions
**Status:** ✅ Active

---

### Structured Documentation

All documentation is organized under `docs/`:

```
docs/
├── README.md                         # Documentation index
├── getting-started/                  # Setup and installation
├── architecture/                     # System design and decisions
├── guides/                           # Development, testing, deployment
├── brand/                            # Brand standards and naming
├── features/                         # Feature-specific docs
├── ai/                               # AI and Serena MCP docs (this directory)
└── archive/                          # Historical and deprecated docs
```

**No additional CLAUDE.md files exist** in feature directories or subdirectories.

---

## Consolidation Strategy

### Guiding Principles

1. **Single Source of Truth:** The root `CLAUDE.md` is the canonical AI context file.
2. **No Duplication:** No other `CLAUDE.md` files should exist in the repository.
3. **Clear Separation:** AI context (CLAUDE.md) vs human documentation (README.md, docs/).
4. **Structured Organization:** All documentation follows the `docs/` hierarchy.

---

### Strategy for Additional AI Context Files

If additional AI context files are discovered in the repository:

#### Option 1: Convert to Feature-Specific Context

If the content is relevant to a specific feature or module:

1. Create a `CONTEXT.md` file in the appropriate feature directory
2. Keep it focused and narrowly scoped
3. Link to it from the main `CLAUDE.md` if needed
4. Example: `src/app/dashboard/bore-logs/CONTEXT.md`

#### Option 2: Archive if Obsolete

If the content is historical or no longer relevant:

1. Move to `docs/archive/ai-context/`
2. Add a header noting the archive date and reason
3. Update any references in active documentation
4. Example: `docs/archive/ai-context/legacy-claude-v1.md`

#### Option 3: Merge into Main CLAUDE.md

If the content is universally relevant:

1. Extract the relevant information
2. Integrate it into the appropriate section of root `CLAUDE.md`
3. Delete the duplicate file
4. Document the merge in commit message

---

### Maintenance Protocol

#### For AI Agents

When working on this repository:

1. **Always read** `CLAUDE.md` at session start
2. **Never create** new `CLAUDE.md` files in subdirectories
3. **If you find** duplicate AI context files, flag them for consolidation
4. **Update** `CLAUDE.md` if you make architectural changes that affect AI workflow

#### For Human Developers

1. **Keep `CLAUDE.md` updated** when making significant architectural changes
2. **Review quarterly** to ensure accuracy and remove obsolete information
3. **Don't create** multiple AI context files without consulting this audit
4. **Follow** the consolidation strategy if you discover duplicate files

---

## Current Status

### ✅ Consolidated

- Root `CLAUDE.md` is up-to-date (v2.0.0)
- No duplicate `CLAUDE.md` files exist
- Documentation structure is clean and organized
- Serena MCP integration is documented

### 📋 Next Actions

None required. The AI context is fully consolidated and following best practices.

---

## Related Documentation

- **[CLAUDE.md](../../CLAUDE.md)** - Primary AI context file
- **[README.md](../../README.md)** - Human-readable project overview
- **[PROJECT_INDEX.md](../../PROJECT_INDEX.md)** - Comprehensive project index
- **[docs/README.md](../README.md)** - Documentation index
- **[SERENA-SYSTEM.md](SERENA-SYSTEM.md)** - Serena MCP system description
- **[SERENA-INTEGRATION-GUIDE.md](SERENA-INTEGRATION-GUIDE.md)** - Serena integration guide

---

## Validation Checklist

Use this checklist when auditing AI context files:

- [ ] Root `CLAUDE.md` exists and is current
- [ ] No duplicate `CLAUDE.md` files in subdirectories
- [ ] `CLAUDE.md` references documentation structure correctly
- [ ] `CLAUDE.md` includes Serena MCP protocol
- [ ] All links in `CLAUDE.md` are valid and relative
- [ ] Brand standards and naming conventions are up-to-date
- [ ] AI agent workflow is clearly documented
- [ ] Do's and don'ts are comprehensive and clear

---

**Last Audited:** 2025-11-23
**Next Audit Due:** 2026-02-23 (quarterly)
**Audited By:** AI Documentation Team
