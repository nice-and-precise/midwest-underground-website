<!-- TOC -->

## Table of Contents

  - [🎯 CURRENT STATE ANALYSIS](#current-state-analysis)
    - [Documentation Inventory](#documentation-inventory)
    - [Key Issues](#key-issues)
  - [📋 CLEANUP STRATEGY](#cleanup-strategy)
    - [Phase 1: Archive Historical Session Files](#phase-1-archive-historical-session-files)
    - [Phase 2: Archive Completion Reports](#phase-2-archive-completion-reports)
    - [Phase 3: Archive Migration/Status Files](#phase-3-archive-migrationstatus-files)
    - [Phase 4: Delete Obsolete/Duplicate Files](#phase-4-delete-obsoleteduplicate-files)
    - [Phase 5: Keep Essential Root Files](#phase-5-keep-essential-root-files)
    - [Phase 6: Organize .claude/ Directory](#phase-6-organize-claude-directory)
    - [Phase 7: Clean Up Serena Memories](#phase-7-clean-up-serena-memories)
    - [Phase 8: Consolidate docs/ Directory](#phase-8-consolidate-docs-directory)
  - [🔄 FILES TO UPDATE](#files-to-update)
    - [1. CLAUDE.md (Primary Context File)](#1-claudemd-primary-context-file)
- [Midwest Underground Website - Project Context](#midwest-underground-website-project-context)
  - [Company Profile](#company-profile)
  - [Market Opportunity](#market-opportunity)
  - [Sandbox & Agent Architecture](#sandbox-agent-architecture)
    - [2. README.md](#2-readmemd)
  - [Company Information](#company-information)
  - [Documentation Structure](#documentation-structure)
    - [3. PROJECT_INDEX.md](#3-project_indexmd)
  - [Company Context](#company-context)
  - [Agent Architecture](#agent-architecture)
    - [4. .claude/README.md (CREATE NEW)](#4-claudereadmemd-create-new)
- [.claude/ Directory - Agent Coordination & MCP Setup](#claude-directory-agent-coordination-mcp-setup)
  - [Key Files](#key-files)
  - [Subdirectories](#subdirectories)
  - [Usage](#usage)
    - [5. AGENT_COORDINATION.md](#5-agent_coordinationmd)
  - [Legacy Multi-Agent Strategy (Agents 1-9) ✅ COMPLETE](#legacy-multi-agent-strategy-agents-1-9-complete)
  - [Production Phase (Agents 10-17) - NEW](#production-phase-agents-10-17-new)
    - [6. MCP-SERVERS.md](#6-mcp-serversmd)
  - [Sandbox Integration](#sandbox-integration)
  - [📁 FINAL DIRECTORY STRUCTURE](#final-directory-structure)
  - [⚡ EXECUTION PLAN](#execution-plan)
    - [Step 1: Create Archive Directories (1 min)](#step-1-create-archive-directories-1-min)
    - [Step 2: Move Files to Archives (5 min)](#step-2-move-files-to-archives-5-min)
    - [Step 3: Delete Obsolete Files (2 min)](#step-3-delete-obsolete-files-2-min)
    - [Step 4: Move SANDBOX & AGENT GUIDE (1 min)](#step-4-move-sandbox-agent-guide-1-min)
    - [Step 5: Update Core Files (10 min)](#step-5-update-core-files-10-min)
    - [Step 6: Create New Files (10 min)](#step-6-create-new-files-10-min)
    - [Step 7: Clean Serena Memories (3 min)](#step-7-clean-serena-memories-3-min)
    - [Step 8: Consolidate docs/brand/ (2 min)](#step-8-consolidate-docsbrand-2-min)
    - [Step 9: Verify Structure (2 min)](#step-9-verify-structure-2-min)
    - [Step 10: Reindex Repository (5 min)](#step-10-reindex-repository-5-min)
  - [🎯 REINDEXING STRATEGY](#reindexing-strategy)
    - [When to Reindex](#when-to-reindex)
    - [Reindexing Process](#reindexing-process)
- [Using SuperClaude command](#using-superclaude-command)
- [This regenerates:](#this-regenerates)
- [- PROJECT_INDEX.md](#project_indexmd)
- [- PROJECT_INDEX.json](#project_indexjson)
- [- Updates token count](#updates-token-count)
- [- Refreshes entry points, services, workflows](#refreshes-entry-points-services-workflows)
    - [Best Practices](#best-practices)
  - [✅ SUCCESS CRITERIA](#success-criteria)
  - [📝 NEXT SESSION HANDOFF](#next-session-handoff)

<!-- /TOC -->

# Documentation Cleanup Strategy - Midwest Underground Website
**Date:** 2025-11-23
**Purpose:** Eliminate documentation bloat, consolidate knowledge, apply sandbox/agent principles

---

## 🎯 CURRENT STATE ANALYSIS

### Documentation Inventory
- **Root Level:** 58+ markdown files (EXCESSIVE BLOAT)
- **.claude/:** 14 files (mostly organized)
- **docs/:** 43+ files (structured but needs pruning)
- **.serena/memories/:** 67+ files (many session-specific, outdated)
- **NEW STUFF/:** 1 file (SANDBOX & AGENT GUIDE.md - new principles)

### Key Issues
1. ✗ Multiple duplicate guides (HANDOFF, SESSION-SUMMARY, NEXT-SESSION, etc.)
2. ✗ Historical completion reports cluttering root directory
3. ✗ Obsolete migration/phase files from old project structure
4. ✗ Serena memories not cleaned up after multi-agent sessions
5. ✗ No reference to company name (Midwest Underground) in key docs
6. ✗ New sandbox/agent principles not integrated into documentation

---

## 📋 CLEANUP STRATEGY

### Phase 1: Archive Historical Session Files
**Action:** Move to `docs/archive/sessions/`

**Files to Archive (27 files):**
```
Root Level:
- HANDOFF-NEXT-SESSION.md
- HANDOFF-RESUME-SESSION.md
- HANDOFF_MODULE_1.2.md
- HANDOFF_MODULE_1.2_TASK_11.md
- HANDOFF_MODULE_1.2_TASK_13.md
- HANDOFF_MODULE_1.3_COMPLETION_REPORT.md
- HANDOFF_MODULE_1.3_TASKS_16-18.md
- HANDOFF_MODULE_1.3_TESTING_SESSION.md
- MODULE-1.3-COMPREHENSIVE-TESTING-REPORT.md
- NEXT-SESSION-HANDOFF.md
- NEXT-SESSION-MODULE-1.1.md
- NEXT-SESSION-MODULE-1.2.md
- NEXT-SESSION-START-HERE.md
- RESTART-HANDOFF.md
- SESSION-COMPLETE-2025-11-22.md
- SESSION-FIXES-AND-IMPROVEMENTS.md
- SESSION-SUMMARY-2025-10-25.md
- SESSION-SUMMARY-3-FINAL.md
- SESSION-SUMMARY-OCT-25-2025.md
- AGENT-9-TESTING-COMPLETE.md
- AGENT-COORDINATION-TESTING.md
- BUILD-SUCCESS-REPORT.md
- TESTER-SESSION-SUMMARY.md
- TASK_10_CHECKLIST.md
- TASK_10_IMPLEMENTATION_SUMMARY.md
- VISUAL_TESTING_GUIDE_MODULE_1.3.md
- QUICK-START-AFTER-RESTART.md
```

### Phase 2: Archive Completion Reports
**Action:** Move to `docs/archive/completion-reports/`

**Files to Archive (10 files):**
```
Root Level:
- COMPLETE-PROJECT-SUMMARY.md
- FINAL-COMPLETION-REPORT.md
- HDD-OPERATIONS-PHASE-3-7-COMPLETE.md
- OPTIMIZATION-COMPLETE-SUMMARY.md
- PHASE-2-COMPLETE.md
- AREA_TOOL_IMPLEMENTATION.md
- AREA_TOOL_USAGE.md
- CONTRAST-FIX-PLAN.md
- DARK-MODE-CONTRAST-FIXES.md
- IMAGE-OPTIMIZATION-RECOMMENDATIONS.md
```

### Phase 3: Archive Migration/Status Files
**Action:** Move to `docs/archive/migration/`

**Files to Archive (5 files):**
```
Root Level:
- MIGRATION-ROADMAP.md
- MIGRATION-STATUS.md
- MIGRATION-TO-NEXTJS.md
- MERGE-PLAN.md
- DEBUG-SUMMARY.md
```

### Phase 4: Delete Obsolete/Duplicate Files
**Action:** Safe deletion (review first, then delete)

**Files to DELETE (8 files):**
```
Root Level:
- DATABASE-SETUP-REPORT.md (superseded by DATABASE-QUICK-START.md)
- DEPLOYMENT-GUIDE.md (root duplicate - keep in docs/)
- TEST-RESULTS.md (old, superseded by current test suite)
- QA-TEST-RESULTS.md (old, superseded)
- CURRENT-STATUS.md (outdated)
- CHECKLIST.md (vague, not specific)
- BRAND-UPDATE.md (superseded by docs/brand.md)
- WEBSITE-STRUCTURE-GUIDE.md (outdated for Next.js)
```

### Phase 5: Keep Essential Root Files
**Files to KEEP in Root (9 files):**
```
✓ README.md - Main project entry point
✓ CLAUDE.md - Primary context file for AI (UPDATE with Midwest Underground)
✓ PROJECT_INDEX.md - Token-efficient repo overview
✓ QUICK-START.md - Developer onboarding
✓ CLAUDE-TAKEOFF.md - Takeoff system documentation
✓ PROJECT-SUMMARY.md - High-level overview
✓ PRE-LAUNCH-CHECKLIST.md - Production readiness
✓ TROUBLESHOOTING.md - Common issues & solutions
✓ NEXT-STEPS.md - Roadmap for future work
```

### Phase 6: Organize .claude/ Directory
**Action:** Create subdirectory structure

**New Structure:**
```
.claude/
├── README.md (guide to .claude directory)
├── MASTER-SANDBOX-GUIDE.md (MOVE from NEW STUFF/)
├── MCP_SETUP.md (keep)
├── MCP_QUICK_REFERENCE.md (keep)
├── MCP_RESTART_REQUIRED.md (rename from RESTART_REQUIRED.md)
├── takeoff-system.md (keep)
├── agent-configs/ (CREATE NEW)
│   ├── agent-9-testing.json
│   ├── agent-10-content.json
│   ├── agent-11-seo.json
│   ├── agent-12-email.json
│   ├── agent-13-deployment.json
│   ├── agent-14-performance.json
│   ├── agent-15-security.json
│   ├── agent-16-mobile.json
│   └── agent-17-docs.json
├── roles/ (keep as-is)
│   ├── PLANNER.md
│   ├── IMPLEMENTER.md
│   ├── TESTER.md
│   └── DOC.md
└── plans/ (keep as-is)
    ├── P0.1-plan.md
    ├── P0.2-plan.md
    ├── P0.3-plan.md
    ├── module-1.1-plan.md
    └── module-1.2-plan.md
```

### Phase 7: Clean Up Serena Memories
**Action:** Archive old session memories, keep only relevant ones

**Memories to ARCHIVE (Move to .serena/archive/):**
```
All memories older than 2025-11-22:
- session-2025-11-21-*
- checkpoint-2025-11-21-*
- All agent-X-checkpoint files
- All takeoff-module-X-state files (superseded)
- All wave-X-completion-report files
```

**Memories to KEEP (16 files):**
```
✓ project-overview.md (core context)
✓ tech-stack.md (technical decisions)
✓ code-style-conventions.md (standards)
✓ multi-agent-strategy.md (UPDATE with sandbox principles)
✓ final-completion-status.md (project status)
✓ api-endpoints-status.md (API reference)
✓ dashboard-pages-status.md (UI reference)
✓ task-completion-checklist.md (process)
✓ suggested-commands.md (workflows)
✓ current-status.md (UPDATE to "current-status")
✓ session-checkpoint-2025-11-22-final.md (latest checkpoint)
✓ session-2025-11-23-module-1.3-completion.md (latest completion)
✓ autonomous-testing-session-2025-11-22.md (testing approach)
✓ test-fixes-session-2025-11-22.md (test patterns)
✓ mcp-configuration-fix-2025-11-22.md (MCP setup)
✓ multi-agent-coordination-best-practices.md (coordination)
```

**Memories to CREATE:**
```
NEW:
- sandbox-agent-principles.md (from SANDBOX & AGENT GUIDE)
- company-context.md (Midwest Underground details)
- reindexing-best-practices.md (when to reindex)
- production-agent-roadmap.md (Agents 10-17 strategy)
```

### Phase 8: Consolidate docs/ Directory
**Action:** Keep core docs, move feature-specific to subdirectories

**Structure:**
```
docs/
├── ARCHITECTURE.md (keep, UPDATE with sandbox architecture)
├── DEPLOYMENT.md (keep)
├── MAINTENANCE.md (keep)
├── DASHBOARD-USER-GUIDE.md (keep)
├── PLACEHOLDERS.md (keep)
├── features/ (organized feature docs)
│   ├── DARK-MODE.md
│   ├── SERVICE-REQUEST-FORM.md
│   ├── INVOICE-PAYMENT.md
│   └── BUSINESS-DASHBOARD.md
├── brand/ (CONSOLIDATE all brand docs here)
│   ├── brand.md
│   ├── BRAND-REFRESH-SUMMARY.md
│   ├── CONTRAST-AUDIT.md
│   ├── CONTRAST-GUIDE.md
│   ├── LOGO-FILES.md
│   └── LOGO-USAGE.md
├── archive/ (keep, organized by type)
│   ├── sessions/
│   ├── completion-reports/
│   └── migration/
└── takeoff/ (keep as-is, well-organized)
```

**Files to DELETE from docs/:**
```
- DARK-MODE-TEST-PLAN.md (superseded by test suite)
- SERVICE-AREA-MAP-PLAN.md (feature not implemented yet)
- FEATURE-REQUESTS.md (track in GitHub Issues instead)
```

---

## 🔄 FILES TO UPDATE

### 1. CLAUDE.md (Primary Context File)
**Updates Needed:**
```markdown
Add to top:
# Midwest Underground Website - Project Context

## Company Profile
- **Company:** Midwest Underground of Minnesota Inc
- **Location:** 4320 County Rd 8 SE, Willmar, MN 56201
- **Phone:** (320) 382-6636
- **Founded:** 1991 (34+ years in HDD/fiber optic services)
- **Team:** 18 employees, $2.4M annual revenue
- **Status:** First website ever (zero prior digital presence)

## Market Opportunity
- **Minnesota BEAD Funding:** $651.8M for broadband expansion
- **Willmar Fiber Project:** $24.5M local network buildout
- **Target Market:** Central Minnesota (Kandiyohi County)
- **Window:** 6-12 months to dominate local search before competitors

## Sandbox & Agent Architecture
See `.claude/MASTER-SANDBOX-GUIDE.md` for complete agent coordination strategy.
- **Completed Agents:** 1-9 (all successful)
- **Active Agents:** 10-17 (production phase)
- **Sandbox Runtime:** Anthropic sandbox-runtime for secure agent isolation
- **MCP Servers:** Browser MCP (active), additional servers planned
```

### 2. README.md
**Updates Needed:**
```markdown
Add after project description:

## Company Information
Built for **Midwest Underground of Minnesota Inc** - 34+ years of HDD and fiber optic expertise.

## Documentation Structure
- `/CLAUDE.md` - AI assistant context (start here for Claude Code)
- `/PROJECT_INDEX.md` - Repo overview (95.6% token reduction)
- `/.claude/` - Agent coordination, MCP setup, sandbox configs
- `/docs/` - Architecture, deployment, feature documentation
- `/.serena/memories/` - Serena MCP knowledge base
- `/QUICK-START.md` - Developer onboarding
```

### 3. PROJECT_INDEX.md
**Updates Needed:**
```markdown
Add section:

## Company Context
**Midwest Underground of Minnesota Inc**
- Founded 1991, 34+ years of experience
- 18 employees, $2.4M annual revenue
- Services: HDD, fiber optic cable installation, underground utilities
- Target market: Central Minnesota (Kandiyohi County)
- First website ever - zero prior digital presence
- Market opportunity: $651.8M BEAD funding, 6-12 month window

## Agent Architecture
This project uses a multi-agent development strategy with sandbox isolation:
- **Phase 1 (Complete):** Agents 1-9 (database, auth, API, dashboard, testing)
- **Phase 2 (Active):** Agents 10-17 (content, SEO, email, deployment, performance, security, mobile, docs)
- **Sandbox:** Anthropic sandbox-runtime for secure agent isolation
- **Coordination:** See `.claude/MASTER-SANDBOX-GUIDE.md`
```

### 4. .claude/README.md (CREATE NEW)
**Content:**
```markdown
# .claude/ Directory - Agent Coordination & MCP Setup

This directory contains all files for AI agent coordination, MCP server configuration, and sandbox runtime setup.

## Key Files
- **MASTER-SANDBOX-GUIDE.md** - Complete sandbox & agent strategy (agents 10-17)
- **MCP_SETUP.md** - Model Context Protocol server configuration
- **MCP_QUICK_REFERENCE.md** - Quick MCP commands reference
- **takeoff-system.md** - Takeoff system documentation

## Subdirectories
- **agent-configs/** - Sandbox configuration files for each agent
- **roles/** - Role definitions (PLANNER, IMPLEMENTER, TESTER, DOC)
- **plans/** - Module implementation plans

## Usage
1. Read `MASTER-SANDBOX-GUIDE.md` for agent coordination strategy
2. Configure MCP servers using `MCP_SETUP.md`
3. Use agent-specific sandbox configs from `agent-configs/`
```

### 5. AGENT_COORDINATION.md
**Updates Needed:**
```markdown
Add reference at top:
> **Note:** This file documents the legacy multi-agent coordination approach used for Agents 1-9.
> For the current production phase (Agents 10-17) using sandbox runtime, see `.claude/MASTER-SANDBOX-GUIDE.md`

## Legacy Multi-Agent Strategy (Agents 1-9) ✅ COMPLETE
[existing content...]

## Production Phase (Agents 10-17) - NEW
See `.claude/MASTER-SANDBOX-GUIDE.md` for:
- Sandbox runtime configuration
- Agent-specific filesystem/network permissions
- MCP server integration
- Violation tracking and learning
```

### 6. MCP-SERVERS.md
**Updates Needed:**
```markdown
Add reference at top:
> **Note:** For complete MCP setup including sandbox integration, see `.claude/MCP_SETUP.md`

[existing content...]

## Sandbox Integration
All MCP servers now run within Anthropic's sandbox-runtime for security:
- **Network:** Allow-only domain filtering
- **Filesystem:** Restricted read/write permissions
- **Violation Tracking:** Automatic permission learning

Configuration: `.claude/agent-configs/`
```

---

## 📁 FINAL DIRECTORY STRUCTURE

```
midwest-underground-website/
│
├── README.md ✓ (updated)
├── CLAUDE.md ✓ (updated - company context, sandbox ref)
├── PROJECT_INDEX.md ✓ (updated - company, agents)
├── QUICK-START.md ✓
├── CLAUDE-TAKEOFF.md ✓
├── PROJECT-SUMMARY.md ✓
├── PRE-LAUNCH-CHECKLIST.md ✓
├── TROUBLESHOOTING.md ✓
├── NEXT-STEPS.md ✓
├── AGENT_COORDINATION.md ✓ (updated - legacy vs new)
├── MCP-SERVERS.md ✓ (updated - sandbox ref)
├── DATABASE-QUICK-START.md ✓
├── CONTENT-GUIDE.md ✓
├── QA-AUDIT-CHECKLIST.md ✓
│
├── .claude/
│   ├── README.md ✨ NEW
│   ├── MASTER-SANDBOX-GUIDE.md ✨ MOVED from NEW STUFF/
│   ├── MCP_SETUP.md ✓
│   ├── MCP_QUICK_REFERENCE.md ✓
│   ├── MCP_RESTART_REQUIRED.md ✓
│   ├── takeoff-system.md ✓
│   ├── agent-configs/ ✨ NEW
│   │   ├── agent-9-testing.json
│   │   ├── agent-10-content.json
│   │   ├── agent-11-seo.json
│   │   ├── agent-12-email.json
│   │   ├── agent-13-deployment.json
│   │   ├── agent-14-performance.json
│   │   ├── agent-15-security.json
│   │   ├── agent-16-mobile.json
│   │   └── agent-17-docs.json
│   ├── roles/ ✓
│   └── plans/ ✓
│
├── .serena/
│   ├── PROJECT_CONTEXT.md ✓
│   ├── memories/ (cleaned, 16 core + 4 new)
│   │   ├── project-overview.md ✓
│   │   ├── tech-stack.md ✓
│   │   ├── code-style-conventions.md ✓
│   │   ├── multi-agent-strategy.md ✓ (updated)
│   │   ├── company-context.md ✨ NEW
│   │   ├── sandbox-agent-principles.md ✨ NEW
│   │   ├── reindexing-best-practices.md ✨ NEW
│   │   ├── production-agent-roadmap.md ✨ NEW
│   │   └── ... (12 more core memories)
│   └── archive/ ✨ NEW (old session memories)
│
├── docs/
│   ├── ARCHITECTURE.md ✓ (updated - sandbox architecture)
│   ├── DEPLOYMENT.md ✓
│   ├── MAINTENANCE.md ✓
│   ├── DASHBOARD-USER-GUIDE.md ✓
│   ├── PLACEHOLDERS.md ✓
│   ├── features/
│   ├── brand/ ✨ CONSOLIDATED
│   ├── archive/ ✓ (sessions, completion-reports, migration)
│   └── takeoff/ ✓
│
└── NEW STUFF/
    └── (empty after moving SANDBOX & AGENT GUIDE.md)
```

**Total Reduction:**
- **Before:** 138+ markdown files across repo
- **After:** 64 organized files + 50 archived
- **Reduction:** ~46% fewer files in active directories

---

## ⚡ EXECUTION PLAN

### Step 1: Create Archive Directories (1 min)
```bash
mkdir -p "docs/archive/sessions"
mkdir -p "docs/archive/completion-reports"
mkdir -p "docs/archive/migration"
mkdir -p ".serena/archive"
mkdir -p ".claude/agent-configs"
mkdir -p "docs/brand"
```

### Step 2: Move Files to Archives (5 min)
Execute file moves per Phase 1-3 lists above

### Step 3: Delete Obsolete Files (2 min)
Delete files listed in Phase 4 (after verification)

### Step 4: Move SANDBOX & AGENT GUIDE (1 min)
```bash
move "NEW STUFF\SANDBOX & AGENT GUIDE.md" ".claude\MASTER-SANDBOX-GUIDE.md"
```

### Step 5: Update Core Files (10 min)
Update CLAUDE.md, README.md, PROJECT_INDEX.md, AGENT_COORDINATION.md, MCP-SERVERS.md

### Step 6: Create New Files (10 min)
- .claude/README.md
- .serena/memories/company-context.md
- .serena/memories/sandbox-agent-principles.md
- .serena/memories/reindexing-best-practices.md
- .serena/memories/production-agent-roadmap.md
- Agent configs in .claude/agent-configs/

### Step 7: Clean Serena Memories (3 min)
Move old session memories to .serena/archive/

### Step 8: Consolidate docs/brand/ (2 min)
Move all brand-related files to docs/brand/

### Step 9: Verify Structure (2 min)
Check that all essential files are in place

### Step 10: Reindex Repository (5 min)
Run `/sc:index-repo` to regenerate PROJECT_INDEX.md

**Total Time:** ~40 minutes

---

## 🎯 REINDEXING STRATEGY

### When to Reindex
Reindex the repository when any of these occur:
1. ✓ **Major documentation restructure** (like this cleanup)
2. ✓ **New agent phase begins** (e.g., starting Agents 10-17)
3. ✓ **Significant codebase changes** (10+ files modified, new modules added)
4. ✓ **Weekly maintenance** (every Friday, ensures freshness)
5. ✓ **Before new Claude Code session** (ensures latest context)

### Reindexing Process
```bash
# Using SuperClaude command
/sc:index-repo

# This regenerates:
# - PROJECT_INDEX.md
# - PROJECT_INDEX.json
# - Updates token count
# - Refreshes entry points, services, workflows
```

### Best Practices
- **Pre-session:** Always check if PROJECT_INDEX.md is current (check last modified date)
- **Post-cleanup:** Always reindex after major file reorganization
- **Post-merge:** Reindex after merging feature branches
- **Monthly:** Full review of index accuracy vs actual codebase

---

## ✅ SUCCESS CRITERIA

After cleanup, verify:
- [ ] Root directory has ≤15 markdown files
- [ ] All historical sessions in docs/archive/
- [ ] All Serena memories organized (core vs archive)
- [ ] MASTER-SANDBOX-GUIDE.md in .claude/
- [ ] All 9 agent configs created in .claude/agent-configs/
- [ ] CLAUDE.md updated with company info + sandbox ref
- [ ] README.md updated with company info + doc structure
- [ ] PROJECT_INDEX.md updated with company context + agents
- [ ] AGENT_COORDINATION.md updated with legacy vs new approach
- [ ] MCP-SERVERS.md updated with sandbox integration
- [ ] 4 new Serena memories created
- [ ] docs/brand/ directory created and populated
- [ ] PROJECT_INDEX.md regenerated with fresh data

---

## 📝 NEXT SESSION HANDOFF

After completing this cleanup:

1. **Start Fresh Session:**
   ```
   "I've cleaned up the documentation. Ready to continue building.
   Start by reading PROJECT_INDEX.md for current state."
   ```

2. **First Task:**
   - Review `.claude/MASTER-SANDBOX-GUIDE.md`
   - Determine which agent to start (likely Agent 13: Deployment or Agent 11: SEO)
   - Set up sandbox runtime if not already installed
   - Create first agent config from templates

3. **Documentation Reference:**
   - Primary context: `CLAUDE.md`
   - Company info: `.serena/memories/company-context.md`
   - Agent strategy: `.claude/MASTER-SANDBOX-GUIDE.md`
   - MCP setup: `.claude/MCP_SETUP.md`

---

**Status:** Ready for execution
**Estimated Duration:** 40 minutes
**Impact:** 46% reduction in active documentation, better organization, clearer focus
