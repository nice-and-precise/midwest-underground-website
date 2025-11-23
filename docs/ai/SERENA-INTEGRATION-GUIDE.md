<!-- TOC -->

## Table of Contents

  - [Purpose](#purpose)
  - [Table of Contents](#table-of-contents)
  - [Session Start Protocol](#session-start-protocol)
    - [For AI Agents](#for-ai-agents)
      - [Step 1: Read Core Context](#step-1-read-core-context)
- [Priority order](#priority-order)
      - [Step 2: Check Branch and Status](#step-2-check-branch-and-status)
- [Verify environment](#verify-environment)
      - [Step 3: Review Recent Memories (If Relevant)](#step-3-review-recent-memories-if-relevant)
- [Check for relevant context](#check-for-relevant-context)
- [Read specific memories based on your task:](#read-specific-memories-based-on-your-task)
- [- Working on feature? Read feature-related memories](#working-on-feature-read-feature-related-memories)
- [- Fixing bug? Read issue memories](#fixing-bug-read-issue-memories)
- [- Continuing work? Read latest session memory](#continuing-work-read-latest-session-memory)
      - [Step 4: Create Session Start Memory (Optional)](#step-4-create-session-start-memory-optional)
- [Session Start: [Task Description] - YYYY-MM-DD](#session-start-task-description-yyyy-mm-dd)
  - [Objective](#objective)
  - [Context](#context)
  - [Approach](#approach)
  - [Notes](#notes)
    - [For Human Developers](#for-human-developers)
  - [When to Create Memories](#when-to-create-memories)
    - [Create a Memory When:](#create-a-memory-when)
      - [✅ You Should Create](#you-should-create)
      - [❌ Don't Create For](#dont-create-for)
  - [Memory File Templates](#memory-file-templates)
    - [Template 1: Technical Decision](#template-1-technical-decision)
- [Decision: [Decision Title]](#decision-decision-title)
  - [Context](#context)
    - [Requirements](#requirements)
    - [Constraints](#constraints)
  - [Options Considered](#options-considered)
    - [Option 1: [Name]](#option-1-name)
    - [Option 2: [Name]](#option-2-name)
    - [Option 3: [Name]](#option-3-name)
  - [Decision](#decision)
  - [Implementation](#implementation)
    - [Changes Made](#changes-made)
    - [Configuration](#configuration)
    - [Dependencies](#dependencies)
  - [Outcome](#outcome)
    - [Immediate Results](#immediate-results)
    - [Long-term Impact](#long-term-impact)
    - [Lessons Learned](#lessons-learned)
  - [Related](#related)
  - [Next Actions](#next-actions)
    - [Template 2: Implementation Pattern](#template-2-implementation-pattern)
- [Pattern: [Pattern Name]](#pattern-pattern-name)
  - [Problem](#problem)
    - [Symptoms](#symptoms)
    - [Pain Points](#pain-points)
  - [Solution](#solution)
    - [Pattern Structure](#pattern-structure)
    - [Key Principles](#key-principles)
  - [Implementation Guide](#implementation-guide)
    - [Step 1: [Setup]](#step-1-setup)
    - [Step 2: [Implementation]](#step-2-implementation)
    - [Step 3: [Testing]](#step-3-testing)
  - [Examples](#examples)
    - [Example 1: [Use Case]](#example-1-use-case)
    - [Example 2: [Use Case]](#example-2-use-case)
  - [Benefits](#benefits)
  - [Trade-offs](#trade-offs)
    - [Advantages](#advantages)
    - [Disadvantages](#disadvantages)
    - [When to Use](#when-to-use)
    - [When NOT to Use](#when-not-to-use)
  - [Testing](#testing)
    - [Unit Test Pattern](#unit-test-pattern)
    - [Integration Test Pattern](#integration-test-pattern)
  - [Related](#related)
  - [Maintenance](#maintenance)
    - [Known Issues](#known-issues)
    - [Future Improvements](#future-improvements)
    - [Template 3: Known Issue](#template-3-known-issue)
- [Issue: [Issue Title]](#issue-issue-title)
  - [Problem Description](#problem-description)
    - [Symptoms](#symptoms)
    - [Error Messages](#error-messages)
    - [Reproduction Steps](#reproduction-steps)
  - [Root Cause](#root-cause)
    - [Technical Details](#technical-details)
    - [Why This Happens](#why-this-happens)
  - [Solution](#solution)
    - [Immediate Fix](#immediate-fix)
    - [Implementation](#implementation)
    - [Testing the Fix](#testing-the-fix)
  - [Prevention](#prevention)
    - [How to Avoid](#how-to-avoid)
    - [Code Review Checklist](#code-review-checklist)
    - [Automated Detection](#automated-detection)
  - [Impact Assessment](#impact-assessment)
    - [Affected Components](#affected-components)
    - [User Impact](#user-impact)
    - [System Impact](#system-impact)
  - [Related](#related)
  - [Follow-up](#follow-up)
    - [Monitoring](#monitoring)
    - [Future Work](#future-work)
    - [Template 4: Session Summary](#template-4-session-summary)
- [Session: [Session Title]](#session-session-title)
  - [Objective](#objective)
    - [Primary Goals](#primary-goals)
    - [Stretch Goals](#stretch-goals)
  - [Work Completed](#work-completed)
    - [Implemented](#implemented)
    - [Tests Added](#tests-added)
    - [Documentation Updated](#documentation-updated)
  - [Challenges Encountered](#challenges-encountered)
    - [Challenge 1: [Title]](#challenge-1-title)
    - [Challenge 2: [Title]](#challenge-2-title)
  - [Key Decisions](#key-decisions)
  - [Technical Insights](#technical-insights)
    - [Discoveries](#discoveries)
    - [Patterns Identified](#patterns-identified)
    - [Issues Found](#issues-found)
  - [Testing Results](#testing-results)
    - [Unit Tests](#unit-tests)
    - [Integration Tests](#integration-tests)
    - [E2E Tests](#e2e-tests)
  - [Metrics](#metrics)
    - [Code Changes](#code-changes)
    - [Quality](#quality)
    - [Performance](#performance)
  - [Next Steps](#next-steps)
    - [Immediate (Next Session)](#immediate-next-session)
    - [Short-term (This Week)](#short-term-this-week)
    - [Long-term (This Month)](#long-term-this-month)
  - [Handoff Notes](#handoff-notes)
    - [Context](#context)
    - [What's Working](#whats-working)
    - [What Needs Attention](#what-needs-attention)
    - [Recommendations](#recommendations)
  - [Related](#related)
  - [Session Artifacts](#session-artifacts)
    - [Created Files](#created-files)
    - [Modified Files](#modified-files)
    - [Deleted Files](#deleted-files)
  - [Memory Management Workflows](#memory-management-workflows)
    - [Workflow 1: Creating a New Memory](#workflow-1-creating-a-new-memory)
- [1. Identify what needs to be remembered](#1-identify-what-needs-to-be-remembered)
- [Decision, pattern, issue, or session?](#decision-pattern-issue-or-session)
- [2. Choose appropriate template](#2-choose-appropriate-template)
- [Use one of the four templates above](#use-one-of-the-four-templates-above)
- [3. Create memory file with descriptive name](#3-create-memory-file-with-descriptive-name)
- [4. Fill in template with details](#4-fill-in-template-with-details)
- [Be thorough but concise](#be-thorough-but-concise)
- [5. Save and commit (if appropriate)](#5-save-and-commit-if-appropriate)
    - [Workflow 2: Extracting Memory to Documentation](#workflow-2-extracting-memory-to-documentation)
- [1. Identify memory for promotion](#1-identify-memory-for-promotion)
- [Is it valuable for all developers?](#is-it-valuable-for-all-developers)
- [Is it part of core knowledge?](#is-it-part-of-core-knowledge)
- [2. Determine target documentation](#2-determine-target-documentation)
- [docs/architecture/DECISIONS.md](#docsarchitecturedecisionsmd)
- [docs/guides/DEVELOPMENT.md](#docsguidesdevelopmentmd)
- [docs/guides/TROUBLESHOOTING.md](#docsguidestroubleshootingmd)
- [docs/features/[FEATURE].md](#docsfeaturesfeaturemd)
- [3. Extract relevant information](#3-extract-relevant-information)
- [Remove session-specific context](#remove-session-specific-context)
- [Format for human readers](#format-for-human-readers)
- [Add to appropriate section](#add-to-appropriate-section)
- [4. Update memory status](#4-update-memory-status)
- [5. Optional: Archive original memory](#5-optional-archive-original-memory)
- [6. Commit changes](#6-commit-changes)
    - [Workflow 3: Memory Review and Cleanup](#workflow-3-memory-review-and-cleanup)
- [Recommended: Monthly review](#recommended-monthly-review)
- [1. List all active memories](#1-list-all-active-memories)
- [2. For each memory, ask:](#2-for-each-memory-ask)
- [- Is it still relevant?](#is-it-still-relevant)
- [- Should it be documented?](#should-it-be-documented)
- [- Is it obsolete?](#is-it-obsolete)
- [3. Document valuable memories](#3-document-valuable-memories)
- [Follow Workflow 2 above](#follow-workflow-2-above)
- [4. Archive obsolete memories](#4-archive-obsolete-memories)
- [5. Update memory statistics](#5-update-memory-statistics)
- [Document current state](#document-current-state)
- [6. Commit cleanup](#6-commit-cleanup)
  - [For AI Agents](#for-ai-agents)
    - [Best Practices](#best-practices)
      - [Starting a Session](#starting-a-session)
      - [During Work](#during-work)
      - [Ending a Session](#ending-a-session)
    - [Memory Creation Guidelines](#memory-creation-guidelines)
  - [For Human Developers](#for-human-developers)
    - [How to Use Serena Memories](#how-to-use-serena-memories)
      - [Before Starting Work](#before-starting-work)
      - [During Development](#during-development)
      - [After Completing Work](#after-completing-work)
    - [Maintaining Serena](#maintaining-serena)
      - [Monthly Review (Recommended)](#monthly-review-recommended)
- [1. Check memory statistics](#1-check-memory-statistics)
- [2. Review active memories](#2-review-active-memories)
- [3. Identify promotion candidates](#3-identify-promotion-candidates)
- [Memories that should be in docs](#memories-that-should-be-in-docs)
- [4. Archive obsolete memories](#4-archive-obsolete-memories)
- [Old session summaries, outdated decisions](#old-session-summaries-outdated-decisions)
- [5. Update documentation](#5-update-documentation)
- [Extract valuable memories to docs/](#extract-valuable-memories-to-docs)
      - [Quarterly Audit (Recommended)](#quarterly-audit-recommended)
  - [Examples and Case Studies](#examples-and-case-studies)
    - [Example 1: Authentication Decision](#example-1-authentication-decision)
- [Decision: Use NextAuth v5 for Authentication](#decision-use-nextauth-v5-for-authentication)
  - [Options Considered](#options-considered)
  - [Decision](#decision)
  - [Outcome](#outcome)
    - [Example 2: API Pattern Discovery](#example-2-api-pattern-discovery)
- [Pattern: Standardized API Error Handling](#pattern-standardized-api-error-handling)
  - [Problem](#problem)
  - [Solution](#solution)
  - [Benefits](#benefits)
    - [Example 3: Next.js 15 Migration Issue](#example-3-nextjs-15-migration-issue)
- [Issue: Next.js 15 Dynamic Route Params Must Be Awaited](#issue-nextjs-15-dynamic-route-params-must-be-awaited)
  - [Problem](#problem)
  - [Solution](#solution)
  - [Prevention](#prevention)
    - [Example 4: Multi-Agent Session](#example-4-multi-agent-session)
- [Session: Module 1.3 Multi-Agent Coordination](#session-module-13-multi-agent-coordination)
  - [Approach](#approach)
  - [Results](#results)
  - [Key Learning](#key-learning)
  - [Quick Reference](#quick-reference)
    - [File Naming Convention](#file-naming-convention)
    - [Memory Status Values](#memory-status-values)
    - [Category Values](#category-values)
  - [Troubleshooting](#troubleshooting)
    - [Problem: Too Many Memories](#problem-too-many-memories)
    - [Problem: Can't Find Relevant Memory](#problem-cant-find-relevant-memory)
- [Use grep to search content](#use-grep-to-search-content)
- [Use find for file names](#use-find-for-file-names)
- [Check recent memories](#check-recent-memories)
    - [Problem: Memory is Outdated](#problem-memory-is-outdated)
    - [Problem: Don't Know What to Document](#problem-dont-know-what-to-document)
  - [Related Documentation](#related-documentation)
  - [Feedback and Improvements](#feedback-and-improvements)

<!-- /TOC -->

# Serena MCP Integration Guide

**Last Updated:** 2025-11-23
**Version:** 1.0.0

---

## Purpose

This guide provides practical instructions for AI agents and human developers to effectively use the Serena MCP memory system. It includes protocols, templates, and workflows for creating, maintaining, and extracting memories.

---

## Table of Contents

1. [Session Start Protocol](#session-start-protocol)
2. [When to Create Memories](#when-to-create-memories)
3. [Memory File Templates](#memory-file-templates)
4. [Memory Management Workflows](#memory-management-workflows)
5. [For AI Agents](#for-ai-agents)
6. [For Human Developers](#for-human-developers)
7. [Examples and Case Studies](#examples-and-case-studies)

---

## Session Start Protocol

### For AI Agents

**Every session should begin with this protocol:**

#### Step 1: Read Core Context

```bash
# Priority order
1. Read: CLAUDE.md (primary AI context)
2. Read: PROJECT_INDEX.md (project structure, 95.6% token savings)
3. Read: docs/architecture/CURRENT-STATE.md (actual system state)
```

#### Step 2: Check Branch and Status

```bash
# Verify environment
git branch          # Confirm you're on correct branch
git status          # Check for uncommitted changes
git log -1          # See latest commit
```

#### Step 3: Review Recent Memories (If Relevant)

```bash
# Check for relevant context
ls -lt .serena/memories/*.md | head -5  # Most recent memories

# Read specific memories based on your task:
# - Working on feature? Read feature-related memories
# - Fixing bug? Read issue memories
# - Continuing work? Read latest session memory
```

#### Step 4: Create Session Start Memory (Optional)

If this is a significant session, create a checkpoint:

```markdown
# Session Start: [Task Description] - YYYY-MM-DD

**Category:** Session
**Status:** Active

## Objective
[What you plan to accomplish]

## Context
[What led to this work]

## Approach
[How you plan to tackle it]

## Notes
[Any initial observations or concerns]
```

---

### For Human Developers

**Starting work on the project:**

1. **Read the documentation**
   - Start with `README.md` for project overview
   - Review `docs/getting-started/QUICK-START.md`
   - Check `docs/architecture/CURRENT-STATE.md`

2. **Check relevant memories**
   - Browse `.serena/memories/` for your area of work
   - Look for decisions, patterns, and known issues
   - Read `NEXT-SESSION-START-HERE.md` if it exists

3. **Set up environment**
   ```bash
   npm install
   npm run db:push
   npm run db:seed
   npm run dev
   ```

4. **Create feature branch**
   ```bash
   git checkout -b feat/your-feature-name
   ```

---

## When to Create Memories

### Create a Memory When:

#### ✅ You Should Create

1. **Making an architectural decision**
   - Choosing between libraries or approaches
   - Designing database schema
   - Selecting authentication strategy
   - API design patterns

2. **Discovering a reusable pattern**
   - API endpoint structure that works well
   - Form validation approach
   - Testing strategy
   - Component composition pattern

3. **Solving a non-obvious bug**
   - Race conditions
   - Edge cases
   - Configuration issues
   - Framework-specific quirks

4. **Completing significant work**
   - Feature implementation
   - Module completion
   - Major refactoring
   - Migration milestones

#### ❌ Don't Create For

1. **Trivial information**
   - Simple bug fixes
   - Typo corrections
   - Obvious code changes

2. **Temporary notes**
   - Todo lists
   - In-progress thoughts
   - Debugging notes

3. **Duplicate information**
   - Content already in docs
   - Decisions already documented
   - Patterns already established

---

## Memory File Templates

### Template 1: Technical Decision

**File:** `.serena/memories/decision-[name]-YYYY-MM-DD.md`

```markdown
# Decision: [Decision Title]

**Date:** YYYY-MM-DD
**Category:** Decision
**Status:** Active
**Impacts:** [Components, modules, or systems affected]

---

## Context

[What problem were we trying to solve? What was the situation?]

### Requirements
- Requirement 1
- Requirement 2
- Requirement 3

### Constraints
- Constraint 1
- Constraint 2

---

## Options Considered

### Option 1: [Name]
**Pros:**
- Pro 1
- Pro 2

**Cons:**
- Con 1
- Con 2

**Verdict:** [Rejected/Selected]

### Option 2: [Name]
**Pros:**
- Pro 1
- Pro 2

**Cons:**
- Con 1
- Con 2

**Verdict:** [Rejected/Selected]

### Option 3: [Name]
**Pros:**
- Pro 1
- Pro 2

**Cons:**
- Con 1
- Con 2

**Verdict:** [Rejected/Selected]

---

## Decision

We chose **[Option Name]** because:

1. Reason 1
2. Reason 2
3. Reason 3

---

## Implementation

### Changes Made
- Change 1: [file/module affected]
- Change 2: [file/module affected]

### Configuration
```typescript
// Example configuration or code snippet
```

### Dependencies
- Dependency 1: version
- Dependency 2: version

---

## Outcome

### Immediate Results
- Result 1
- Result 2

### Long-term Impact
- Impact 1
- Impact 2

### Lessons Learned
- Lesson 1
- Lesson 2

---

## Related

- **Code:** `path/to/implementation.ts`
- **Docs:** `docs/architecture/DECISIONS.md#section`
- **Memories:** `decision-related-topic-YYYY-MM-DD.md`
- **Issues:** #123 (if applicable)

---

## Next Actions

- [ ] Action 1
- [ ] Action 2
- [ ] Document in formal docs (if needed)

---

**Last Updated:** YYYY-MM-DD
**Status:** [Active | Documented | Archived]
```

---

### Template 2: Implementation Pattern

**File:** `.serena/memories/pattern-[name]-YYYY-MM-DD.md`

```markdown
# Pattern: [Pattern Name]

**Date:** YYYY-MM-DD
**Category:** Pattern
**Status:** Active
**Applies To:** [API Routes | Components | Tests | etc.]

---

## Problem

[What problem does this pattern solve?]

### Symptoms
- Symptom 1
- Symptom 2

### Pain Points
- Pain point 1
- Pain point 2

---

## Solution

[High-level description of the pattern]

### Pattern Structure

```typescript
// Code example showing the pattern
export async function examplePattern() {
  // Step 1: Description
  const step1 = doSomething();

  // Step 2: Description
  const step2 = doSomethingElse(step1);

  // Step 3: Description
  return finalResult(step2);
}
```

### Key Principles

1. **Principle 1:** Description
2. **Principle 2:** Description
3. **Principle 3:** Description

---

## Implementation Guide

### Step 1: [Setup]
```typescript
// Code example
```

### Step 2: [Implementation]
```typescript
// Code example
```

### Step 3: [Testing]
```typescript
// Code example
```

---

## Examples

### Example 1: [Use Case]

**Scenario:** [Description]

**Code:**
```typescript
// Implementation example
```

**Result:** [What happens]

### Example 2: [Use Case]

**Scenario:** [Description]

**Code:**
```typescript
// Implementation example
```

**Result:** [What happens]

---

## Benefits

1. **Benefit 1:** Description
2. **Benefit 2:** Description
3. **Benefit 3:** Description

---

## Trade-offs

### Advantages
- Advantage 1
- Advantage 2

### Disadvantages
- Disadvantage 1
- Disadvantage 2

### When to Use
- Use case 1
- Use case 2

### When NOT to Use
- Avoid case 1
- Avoid case 2

---

## Testing

### Unit Test Pattern
```typescript
describe('Pattern', () => {
  it('should work as expected', () => {
    // Test code
  });
});
```

### Integration Test Pattern
```typescript
describe('Integration', () => {
  it('should integrate correctly', () => {
    // Test code
  });
});
```

---

## Related

- **Examples:** `src/app/api/*/route.ts`
- **Tests:** `tests/integration/*.spec.ts`
- **Docs:** `docs/guides/DEVELOPMENT.md#patterns`
- **Memories:** `pattern-related-topic-YYYY-MM-DD.md`

---

## Maintenance

### Known Issues
- Issue 1
- Issue 2

### Future Improvements
- Improvement 1
- Improvement 2

---

**Last Updated:** YYYY-MM-DD
**Status:** [Active | Documented | Archived]
```

---

### Template 3: Known Issue

**File:** `.serena/memories/issue-[name]-YYYY-MM-DD.md`

```markdown
# Issue: [Issue Title]

**Date:** YYYY-MM-DD
**Category:** Issue
**Status:** Active
**Severity:** [Critical | High | Medium | Low]

---

## Problem Description

[Clear description of the issue]

### Symptoms

- Symptom 1
- Symptom 2
- Symptom 3

### Error Messages

```
Error message or stack trace
```

### Reproduction Steps

1. Step 1
2. Step 2
3. Step 3
4. **Expected:** [What should happen]
5. **Actual:** [What actually happens]

---

## Root Cause

[Detailed explanation of why this happens]

### Technical Details

```typescript
// Code that causes the issue
function problematicCode() {
  // Explanation
}
```

### Why This Happens

1. Reason 1
2. Reason 2
3. Reason 3

---

## Solution

### Immediate Fix

```typescript
// Code showing the fix
function fixedCode() {
  // Explanation of the fix
}
```

### Implementation

1. **Change 1:** Description
   ```typescript
   // Code change
   ```

2. **Change 2:** Description
   ```typescript
   // Code change
   ```

### Testing the Fix

```typescript
// Test to verify the fix
describe('Fix', () => {
  it('should resolve the issue', () => {
    // Test code
  });
});
```

---

## Prevention

### How to Avoid

1. Guideline 1
2. Guideline 2
3. Guideline 3

### Code Review Checklist

- [ ] Check for condition 1
- [ ] Check for condition 2
- [ ] Check for condition 3

### Automated Detection

```typescript
// Lint rule or test to catch this
```

---

## Impact Assessment

### Affected Components
- Component 1
- Component 2
- Component 3

### User Impact
- Impact 1
- Impact 2

### System Impact
- Impact 1
- Impact 2

---

## Related

- **Code:** `path/to/fixed/file.ts`
- **Tests:** `tests/fix-verification.spec.ts`
- **Docs:** `docs/guides/TROUBLESHOOTING.md#issue`
- **Memories:** `issue-related-topic-YYYY-MM-DD.md`
- **Issues:** #123 (if applicable)

---

## Follow-up

### Monitoring

- [ ] Monitor for recurrence
- [ ] Check related components
- [ ] Update documentation

### Future Work

- [ ] Improve error messages
- [ ] Add automated checks
- [ ] Document in troubleshooting guide

---

**Last Updated:** YYYY-MM-DD
**Status:** [Active | Documented | Archived]
```

---

### Template 4: Session Summary

**File:** `.serena/memories/session-[description]-YYYY-MM-DD.md`

```markdown
# Session: [Session Title]

**Date:** YYYY-MM-DD
**Category:** Session
**Status:** Active
**Duration:** [X hours]

---

## Objective

[What was the goal of this session?]

### Primary Goals
1. Goal 1
2. Goal 2
3. Goal 3

### Stretch Goals
1. Stretch goal 1
2. Stretch goal 2

---

## Work Completed

### Implemented

1. **Feature/Fix 1**
   - Description
   - Files changed: `path/to/file.ts`
   - Status: ✅ Complete / 🔄 In Progress

2. **Feature/Fix 2**
   - Description
   - Files changed: `path/to/file.ts`
   - Status: ✅ Complete / 🔄 In Progress

### Tests Added

1. **Test Suite 1**
   - Description
   - Coverage: X%
   - Files: `tests/path/test.spec.ts`

### Documentation Updated

1. **Doc 1**
   - Changes made
   - File: `docs/path/file.md`

---

## Challenges Encountered

### Challenge 1: [Title]

**Problem:** [Description]

**Solution:** [How it was resolved]

**Time:** [Time spent]

**Learning:** [What was learned]

### Challenge 2: [Title]

**Problem:** [Description]

**Solution:** [How it was resolved]

**Time:** [Time spent]

**Learning:** [What was learned]

---

## Key Decisions

1. **Decision 1**
   - What: [Description]
   - Why: [Rationale]
   - Impact: [Effect on project]

2. **Decision 2**
   - What: [Description]
   - Why: [Rationale]
   - Impact: [Effect on project]

---

## Technical Insights

### Discoveries

1. **Insight 1:** [Description]
2. **Insight 2:** [Description]
3. **Insight 3:** [Description]

### Patterns Identified

1. **Pattern 1:** [Description]
2. **Pattern 2:** [Description]

### Issues Found

1. **Issue 1:** [Description and resolution]
2. **Issue 2:** [Description and resolution]

---

## Testing Results

### Unit Tests
- Tests added: X
- Tests passing: X/X
- Coverage: X%

### Integration Tests
- Tests added: X
- Tests passing: X/X
- Coverage: X%

### E2E Tests
- Tests added: X
- Tests passing: X/X
- Scenarios covered: X

---

## Metrics

### Code Changes
- Files changed: X
- Lines added: +X
- Lines removed: -X
- Net change: ±X

### Quality
- Test coverage: X%
- Lint errors: 0
- Type errors: 0
- Build status: ✅ Passing

### Performance
- Build time: X seconds
- Test time: X seconds
- Bundle size: X KB

---

## Next Steps

### Immediate (Next Session)
1. [ ] Task 1
2. [ ] Task 2
3. [ ] Task 3

### Short-term (This Week)
1. [ ] Task 1
2. [ ] Task 2

### Long-term (This Month)
1. [ ] Task 1
2. [ ] Task 2

---

## Handoff Notes

**For Next Developer/Agent:**

### Context
[Important context for continuation]

### What's Working
- Working item 1
- Working item 2

### What Needs Attention
- Item 1: [Description]
- Item 2: [Description]

### Recommendations
1. Recommendation 1
2. Recommendation 2

---

## Related

- **Branch:** `feat/branch-name`
- **Commits:** `abc123f`, `def456a`
- **Memories:** `related-memory-YYYY-MM-DD.md`
- **Docs:** `docs/path/updated-doc.md`
- **Tests:** `tests/path/test.spec.ts`

---

## Session Artifacts

### Created Files
- `path/to/new/file1.ts`
- `path/to/new/file2.ts`

### Modified Files
- `path/to/existing/file1.ts`
- `path/to/existing/file2.ts`

### Deleted Files
- `path/to/old/file.ts` (reason)

---

**Last Updated:** YYYY-MM-DD
**Status:** [Active | Documented | Archived]
```

---

## Memory Management Workflows

### Workflow 1: Creating a New Memory

```bash
# 1. Identify what needs to be remembered
# Decision, pattern, issue, or session?

# 2. Choose appropriate template
# Use one of the four templates above

# 3. Create memory file with descriptive name
touch .serena/memories/[category]-[short-name]-$(date +%Y-%m-%d).md

# 4. Fill in template with details
# Be thorough but concise

# 5. Save and commit (if appropriate)
git add .serena/memories/
git commit -m "docs: add memory for [topic]"
```

---

### Workflow 2: Extracting Memory to Documentation

```bash
# 1. Identify memory for promotion
# Is it valuable for all developers?
# Is it part of core knowledge?

# 2. Determine target documentation
# docs/architecture/DECISIONS.md
# docs/guides/DEVELOPMENT.md
# docs/guides/TROUBLESHOOTING.md
# docs/features/[FEATURE].md

# 3. Extract relevant information
# Remove session-specific context
# Format for human readers
# Add to appropriate section

# 4. Update memory status
echo "\n---\n**Status:** Documented\n**Location:** docs/path/file.md#section" \
  >> .serena/memories/original-memory.md

# 5. Optional: Archive original memory
mkdir -p .serena/memories/archive/
mv .serena/memories/original-memory.md .serena/memories/archive/

# 6. Commit changes
git add docs/ .serena/
git commit -m "docs: extract memory to [location]"
```

---

### Workflow 3: Memory Review and Cleanup

```bash
# Recommended: Monthly review

# 1. List all active memories
grep -r "Status: Active" .serena/memories/

# 2. For each memory, ask:
# - Is it still relevant?
# - Should it be documented?
# - Is it obsolete?

# 3. Document valuable memories
# Follow Workflow 2 above

# 4. Archive obsolete memories
mv .serena/memories/obsolete-memory.md .serena/memories/archive/
echo "Archived: $(date)" >> .serena/memories/archive/obsolete-memory.md

# 5. Update memory statistics
# Document current state

# 6. Commit cleanup
git add .serena/
git commit -m "chore: serena memory review and cleanup"
```

---

## For AI Agents

### Best Practices

#### Starting a Session

1. **Always read CLAUDE.md first**
   - Get current project context
   - Understand architecture and conventions
   - Review Serena protocol

2. **Check relevant memories**
   - Read memories related to your task
   - Look for established patterns
   - Check for known issues

3. **Create session start note (if major work)**
   - Document your objective
   - Outline your approach
   - Note any concerns

#### During Work

1. **Document decisions as you make them**
   - Don't wait until end of session
   - Capture rationale while fresh
   - Include alternatives considered

2. **Note patterns that work well**
   - API structures
   - Testing approaches
   - Component patterns

3. **Record solutions to tricky problems**
   - Non-obvious bugs
   - Edge cases
   - Configuration issues

#### Ending a Session

1. **Create session summary**
   - What was accomplished
   - What was learned
   - What's next

2. **Update relevant memories**
   - Mark as documented if extracted
   - Update status if circumstances changed

3. **Clean up incomplete work**
   - Document what's in progress
   - Note blockers or issues
   - Provide handoff notes

### Memory Creation Guidelines

**Good Memory Title:**
```
✅ Decision: Use NextAuth v5 for Authentication
✅ Pattern: API Endpoint Error Handling
✅ Issue: Next.js 15 Dynamic Route Params Must Be Awaited
✅ Session: Module 1.3 Comprehensive Testing Complete
```

**Bad Memory Title:**
```
❌ Authentication
❌ Fixed a bug
❌ API stuff
❌ Work done on 11-23
```

**Good Memory Content:**
- Clear context and rationale
- Specific examples with code
- References to related files/docs
- Actionable next steps

**Bad Memory Content:**
- Vague descriptions
- Missing rationale
- No examples
- No references

---

## For Human Developers

### How to Use Serena Memories

#### Before Starting Work

1. **Browse `.serena/memories/` directory**
   ```bash
   ls -lt .serena/memories/*.md | head -10  # Recent memories
   find .serena/memories/ -name "*auth*"    # Topic search
   ```

2. **Read relevant memories**
   - Decisions related to your area
   - Patterns you should follow
   - Known issues you might encounter

3. **Check for recent session summaries**
   - Understand what's been worked on
   - See what's in progress
   - Identify potential conflicts

#### During Development

1. **Reference memories for guidance**
   - Follow established patterns
   - Apply documented solutions
   - Avoid known pitfalls

2. **Update memories when you learn something**
   - Add to existing memories
   - Create new memories for discoveries
   - Document solutions you find

3. **Flag memories that need attention**
   - Mark obsolete memories
   - Identify memories for promotion
   - Note inaccuracies

#### After Completing Work

1. **Document your work**
   - Create session summary (optional)
   - Update relevant memories
   - Promote valuable insights to docs

2. **Clean up as you go**
   - Archive obsolete memories
   - Extract important memories to docs
   - Keep memory directory organized

### Maintaining Serena

#### Monthly Review (Recommended)

```bash
# 1. Check memory statistics
find .serena/memories/ -name "*.md" | wc -l

# 2. Review active memories
grep -r "Status: Active" .serena/memories/

# 3. Identify promotion candidates
# Memories that should be in docs

# 4. Archive obsolete memories
# Old session summaries, outdated decisions

# 5. Update documentation
# Extract valuable memories to docs/
```

#### Quarterly Audit (Recommended)

1. **Review all memories**
   - Are they accurate?
   - Are they still relevant?
   - Are they well-organized?

2. **Update memory structure**
   - Reorganize if needed
   - Update categories
   - Improve searchability

3. **Extract to documentation**
   - Promote important memories
   - Update formal docs
   - Archive extracted memories

4. **Update Serena documentation**
   - This guide
   - Templates
   - Best practices

---

## Examples and Case Studies

### Example 1: Authentication Decision

**Scenario:** Choosing authentication library for Next.js app

**Memory Created:**
```markdown
# Decision: Use NextAuth v5 for Authentication

**Date:** 2025-11-20
**Category:** Decision
**Status:** Documented → docs/architecture/DECISIONS.md

## Options Considered
1. NextAuth v5 (Auth.js) ✅
2. Passport.js
3. Custom JWT implementation

## Decision
NextAuth v5 because:
- Native Next.js integration
- Built-in RBAC support
- Active community
- TypeScript first

## Outcome
Successfully implemented in 2 days. Zero security issues.
```

**Later Extracted To:** `docs/architecture/DECISIONS.md#authentication`

---

### Example 2: API Pattern Discovery

**Scenario:** Noticed inconsistent API error handling

**Memory Created:**
```markdown
# Pattern: Standardized API Error Handling

**Date:** 2025-11-21
**Category:** Pattern
**Status:** Active

## Problem
API routes had inconsistent error responses.

## Solution
```typescript
try {
  // Logic
} catch (error) {
  console.error('API error:', error);
  return Response.json(
    { error: 'User-friendly message' },
    { status: 500 }
  );
}
```

## Benefits
- Consistent error format
- Better debugging
- Improved UX
```

**Applied To:** All 32 API routes
**Later Extracted To:** `docs/guides/DEVELOPMENT.md#api-patterns`

---

### Example 3: Next.js 15 Migration Issue

**Scenario:** Type errors after upgrading to Next.js 15

**Memory Created:**
```markdown
# Issue: Next.js 15 Dynamic Route Params Must Be Awaited

**Date:** 2025-11-22
**Category:** Issue
**Status:** Documented → docs/guides/TROUBLESHOOTING.md

## Problem
Dynamic route params now return Promises.

## Solution
```typescript
export async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
}
```

## Prevention
Updated code style conventions.
```

**Later Extracted To:** `docs/guides/TROUBLESHOOTING.md#nextjs-15-migration`

---

### Example 4: Multi-Agent Session

**Scenario:** Three agents working on Module 1.3

**Memory Created:**
```markdown
# Session: Module 1.3 Multi-Agent Coordination

**Date:** 2025-11-23
**Category:** Session
**Status:** Active

## Approach
Sequential handoff pattern:
Agent 1 → Agent 2 → Agent 3

## Results
- Zero conflicts
- 100% test pass rate
- 96% coverage

## Key Learning
Sequential better than parallel for coordinated work.
```

**Later Extracted To:** `.serena/memories/multi-agent-coordination-best-practices.md` (expanded)

---

## Quick Reference

### File Naming Convention

```
[category]-[short-descriptive-name]-YYYY-MM-DD.md

Examples:
decision-nextauth-choice-2025-11-20.md
pattern-api-error-handling-2025-11-21.md
issue-nextjs15-params-2025-11-22.md
session-module-1.3-complete-2025-11-23.md
```

### Memory Status Values

- **Active:** Currently relevant and in use
- **Documented:** Extracted to formal documentation
- **Archived:** Historical, no longer actively used
- **Obsolete:** No longer relevant (candidate for deletion)

### Category Values

- **Decision:** Technical or architectural choices
- **Pattern:** Reusable implementation approaches
- **Issue:** Known bugs, edge cases, solutions
- **Session:** Session summaries and checkpoints

---

## Troubleshooting

### Problem: Too Many Memories

**Solution:**
1. Archive old session summaries (older than 3 months)
2. Extract valuable memories to docs
3. Delete truly obsolete memories
4. Organize into subdirectories if needed

### Problem: Can't Find Relevant Memory

**Solution:**
```bash
# Use grep to search content
grep -r "search term" .serena/memories/

# Use find for file names
find .serena/memories/ -name "*topic*"

# Check recent memories
ls -lt .serena/memories/*.md | head -10
```

### Problem: Memory is Outdated

**Solution:**
1. Update the memory with current information
2. Add note about what changed and when
3. If significantly different, create new memory
4. Mark old memory as archived or obsolete

### Problem: Don't Know What to Document

**Solution:**

Ask yourself:
- Would this help me 3 months from now?
- Would this help another developer?
- Did this take significant time to figure out?
- Is this non-obvious or unique to our project?

If yes to any, document it!

---

## Related Documentation

- **[SERENA-SYSTEM.md](SERENA-SYSTEM.md)** - What Serena is and how it works
- **[AI-CONTEXT-AUDIT.md](AI-CONTEXT-AUDIT.md)** - AI context file inventory
- **[CLAUDE.md](../../CLAUDE.md)** - Primary AI context file
- **[docs/guides/DEVELOPMENT.md](../guides/DEVELOPMENT.md)** - Development guide

---

## Feedback and Improvements

This guide is a living document. If you find:
- Templates that don't work well
- Missing information
- Better approaches
- Errors or unclear sections

Please update this guide or create a memory documenting the improvement!

---

**Maintained By:** AI Documentation Team
**Last Review:** 2025-11-23
**Next Review:** 2026-02-23
