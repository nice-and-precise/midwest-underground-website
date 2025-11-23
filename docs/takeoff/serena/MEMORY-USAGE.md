<!-- TOC -->

## Table of Contents

  - [Overview](#overview)
  - [Memory Operations](#memory-operations)
    - [Writing Memory](#writing-memory)
  - [Example 1: Update System Context](#example-1-update-system-context)
  - [Current State](#current-state)
  - [Integration Points](#integration-points)
  - [Example 2: Update Progress Tracker](#example-2-update-progress-tracker)
  - [Module Progress Map](#module-progress-map)
    - [Phase 1: Takeoff Core (2/4 complete - 50%)](#phase-1-takeoff-core-24-complete-50)
  - [Recent Activity](#recent-activity)
    - [${new Date().toISOString()} - Module 1.2 COMPLETED ✅](#new-datetoisostring-module-12-completed)
  - [Example 3: Update Module State](#example-3-update-module-state)
  - [Implementation Status](#implementation-status)
  - [Files Modified](#files-modified)
  - [Commits](#commits)
  - [Blockers](#blockers)
  - [Example 4: Reading Memory](#example-4-reading-memory)
  - [Common Patterns](#common-patterns)
    - [Pattern 1: Update After Each Task](#pattern-1-update-after-each-task)
    - [Pattern 2: Check Module Status](#pattern-2-check-module-status)
    - [Pattern 3: Mark Module Complete](#pattern-3-mark-module-complete)
  - [Best Practices](#best-practices)
    - [When to Write](#when-to-write)
    - [Content Format](#content-format)
    - [Error Handling](#error-handling)
    - [Memory Size](#memory-size)
  - [Testing Memory Operations](#testing-memory-operations)
- [This is conceptual - actual execution via Claude Code](#this-is-conceptual-actual-execution-via-claude-code)
  - [Related Documentation](#related-documentation)

<!-- /TOC -->

# Serena MCP Memory Usage Guide

**Purpose:** Comprehensive guide for using Serena MCP memory operations in the takeoff system
**Validated:** 2025-11-22 (Module P0.2)
**Test Scripts:** `tests/serena/`

---

## Overview

Serena MCP provides persistent memory storage for the autonomous takeoff system. Memory state survives across agent sessions, enabling true autonomous multi-agent execution.

**Three Primary Memory Types:**
1. **System Context** - Overall system state and integration points
2. **Progress Tracker** - Module completion tracking and history
3. **Module State** - Per-module planning, implementation, testing state

---

## Memory Operations

### Writing Memory

**Syntax:**
```javascript
write_memory(memory_file_name, content)
```

**Parameters:**
- `memory_file_name` (string) - Name of the memory file (e.g., "takeoff-system-context")
- `content` (string) - Markdown or text content to store

**Returns:**
- Success: `{"result": "Memory {name} written."}`
- Error: `{"error": "...details..."}`

---

## Example 1: Update System Context

**Use Case:** Record current phase and module information

```javascript
// Read current system context
const systemContext = read_memory("takeoff-system-context");

// Update with new phase information
const updatedContext = `# Takeoff & Estimating System - System Context

**Last Updated:** ${new Date().toISOString()}
**Project:** Takeoff & Estimating System for Midwest Underground
**Status:** Phase 1 - Takeoff Core

## Current State

**Phase:** Phase 1 - Takeoff Core (4 modules)
**Current Module:** 1.2 - Basic measurement tools
**Completed Modules:** 4 (P0.1, P0.2, P0.3, 1.1)

## Integration Points

- Next.js App: Read-only access to project data
- Dashboard: Takeoff system pages added
- Serena MCP: ✅ Connected and operational
...
`;

// Write updated context
write_memory("takeoff-system-context", updatedContext);
```

---

## Example 2: Update Progress Tracker

**Use Case:** Mark module as complete and advance to next module

```javascript
// Read current progress
const progress = read_memory("takeoff-progress-tracker");

// Update module status and move to next
const updatedProgress = `# Takeoff System - Progress Tracker

**Last Updated:** ${new Date().toISOString()}
**Current Module:** 1.3 - Quantity calculator
**Next Module:** 1.4 - Data export and persistence
**Last Completed:** 1.2 - Basic measurement tools ✅

## Module Progress Map

### Phase 1: Takeoff Core (2/4 complete - 50%)

| Module | Name | Status | Current Role |
|--------|------|--------|--------------|
| 1.1 | PDF plan viewer | completed ✅ | null |
| 1.2 | Basic measurement tools | completed ✅ | null |
| 1.3 | Quantity calculator | not_started | planner |
| 1.4 | Data export and persistence | not_started | null |

## Recent Activity

### ${new Date().toISOString()} - Module 1.2 COMPLETED ✅
- **Role:** DOC
- **Module:** 1.2 - Basic measurement tools
- **Action:** Added implementation notes and marked complete
- **Outcome:** Module fully documented, all tests passing
- **Next:** Module 1.3 planning to begin
...
`;

write_memory("takeoff-progress-tracker", updatedProgress);
```

---

## Example 3: Update Module State

**Use Case:** IMPLEMENTER updates task completion status

```javascript
// Read current module state
const moduleState = read_memory("takeoff-module-1.2-state");

// Update with task completion
const updatedState = `# Module 1.2 State - Basic Measurement Tools

**Module ID:** 1.2
**Status:** in_progress
**Current Role:** implementer

## Implementation Status

**Tasks Completed:** 3/7 (42.9%)
**Current Task:** Task 4 - Add area measurement tool

**Completed Tasks:**
1. ✅ Create measurement-tools.js file structure
2. ✅ Add linear measurement functionality
3. ✅ Add scale calibration UI

**In Progress:**
- Task 4 - Add area measurement tool

## Files Modified

- dashboard/takeoff.html (added measurement controls)
- dashboard/js/measurement-tools.js (linear + scale functions)
- dashboard/css/takeoff.css (tool styles)

## Commits

- a1b2c3d - Task 1: Create measurement-tools.js structure
- e4f5g6h - Task 2: Add linear measurement with Fabric.js
- i7j8k9l - Task 3: Add scale calibration UI

## Blockers

**None**
...
`;

write_memory("takeoff-module-1.2-state", updatedState);
```

---

## Example 4: Reading Memory

**Use Case:** PLANNER reads current module state to create plan

```javascript
// Read module state to understand what was already planned
const moduleState = read_memory("takeoff-module-1.3-state");

// Read progress tracker to know which module to work on
const progress = read_memory("takeoff-progress-tracker");

// Parse the progress tracker to find current module
const currentModuleMatch = progress.match(/\*\*Current Module:\*\* (.+)/);
const currentModule = currentModuleMatch ? currentModuleMatch[1] : null;

console.log(`Planning for module: ${currentModule}`);
```

---

## Common Patterns

### Pattern 1: Update After Each Task

**When:** After completing each atomic task in IMPLEMENTER role

```javascript
// After finishing a task, update both module state and progress log
function updateAfterTask(moduleId, taskNumber, taskTitle, filesModified, commitSha) {
  // 1. Update module state
  const state = read_memory(`takeoff-module-${moduleId}-state`);
  const updated = updateTaskStatus(state, taskNumber, 'completed');
  write_memory(`takeoff-module-${moduleId}-state`, updated);

  // 2. Append to progress (in docs/takeoff/PROGRESS.md, not Serena)
  appendToProgressLog(moduleId, taskNumber, taskTitle, filesModified);
}
```

### Pattern 2: Check Module Status

**When:** At start of agent session to determine what to do next

```javascript
// Read progress tracker
const tracker = read_memory("takeoff-progress-tracker");

// Extract current module
const currentModuleMatch = tracker.match(/\*\*Current Module:\*\* ([\d.A-Z]+)/);
const moduleId = currentModuleMatch[1]; // e.g., "1.2"

// Read module state
const state = read_memory(`takeoff-module-${moduleId}-state`);

// Extract current role
const roleMatch = state.match(/\*\*Current Role:\*\* (\w+)/);
const role = roleMatch[1]; // e.g., "implementer"

// Load role instructions and continue
loadRole(role); // Read .claude/roles/{ROLE}.md
```

### Pattern 3: Mark Module Complete

**When:** DOC role finishes documentation

```javascript
// Update module state to completed
const moduleState = `...existing content...

**Status:** completed ✅
**Current Role:** null
**Completed At:** ${new Date().toISOString()}
`;

write_memory("takeoff-module-1.2-state", moduleState);

// Update progress tracker to next module
const progress = read_memory("takeoff-progress-tracker");
const updated = moveToNextModule(progress, "1.2", "1.3");
write_memory("takeoff-progress-tracker", updated);
```

---

## Best Practices

### When to Write

✅ **DO write:**
- After completing each atomic task
- After role transition (PLANNER → IMPLEMENTER → TESTER → DOC)
- After module completion
- When blockers are encountered
- When module status changes

❌ **DON'T write:**
- During intermediate processing (wait for task completion)
- For temporary state (use local variables)
- Too frequently (creates noise, use atomic task boundaries)

### Content Format

✅ **Use Markdown:**
- Headers for structure (#, ##, ###)
- Tables for module progress
- Lists for tasks and files
- Code blocks for examples
- Bold for key metadata

✅ **Include Timestamps:**
```markdown
**Last Updated:** 2025-11-22T13:30:00.000Z
```

✅ **Be Consistent:**
- Use same format across all memories
- Use predictable field names
- Make content easily parseable

### Error Handling

```javascript
try {
  const content = read_memory("takeoff-system-context");

  if (!content) {
    console.warn("Memory not found, creating default...");
    write_memory("takeoff-system-context", defaultSystemContext);
  }

  // Process content...
} catch (error) {
  console.error("Serena memory error:", error);
  // Fallback: Document blocker, ask user
}
```

### Memory Size

⚠️ **Keep memories reasonable:**
- System Context: < 10 KB
- Progress Tracker: < 20 KB (archive old entries if > 500 lines)
- Module State: < 5 KB per module

Large memories slow reads/writes. Archive old data to separate files when needed.

---

## Testing Memory Operations

**Test Scripts Available:**
- `tests/serena/memory-write-test.js` - Validates write operations
- `tests/serena/memory-read-test.js` - Validates read operations
- `tests/serena/memory-persistence-test.js` - Validates session persistence

**Run Validation:**
```bash
# This is conceptual - actual execution via Claude Code
node tests/serena/memory-write-test.js
node tests/serena/memory-read-test.js
node tests/serena/memory-persistence-test.js
```

---

## Related Documentation

- **Architecture:** `docs/takeoff/ARCHITECTURE.md`
- **Memory Structure:** `docs/takeoff/MEMORY.md`
- **Troubleshooting:** `docs/takeoff/serena/TROUBLESHOOTING.md`
- **Role Prompts:** `.claude/roles/*.md`

---

**Last Updated:** 2025-11-22
**Validation Status:** ✅ All memory operations tested and working
**Next:** See TROUBLESHOOTING.md for common issues
