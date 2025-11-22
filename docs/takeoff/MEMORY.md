# Serena Memory Documentation

**Version:** 1.0
**Last Updated:** 2025-11-22
**Purpose:** Structured state management for autonomous agent coordination

---

## Table of Contents

1. [Overview](#overview)
2. [Memory Architecture](#memory-architecture)
3. [Primary Memories](#primary-memories)
4. [Update Patterns](#update-patterns)
5. [Memory Structure Examples](#memory-structure-examples)
6. [Best Practices](#best-practices)
7. [Access Patterns](#access-patterns)

---

## Overview

### What is Serena Memory?

Serena is an MCP (Model Context Protocol) server that provides **structured entity and relation management** for autonomous agents. It acts as a **persistent knowledge graph** that maintains state across multiple agent sessions.

### Why Use Serena for Takeoff System?

**Traditional Approach:**
- Agents read markdown files for context
- Context grows unbounded over time
- Token budget consumed by rereading old entries
- Difficult to query specific state

**Serena Approach:**
- Structured entities with typed observations
- Efficient queries for specific information
- Agents update only relevant entities
- Persistent state across sessions
- Enables true autonomous development

### Core Concepts

**Entity:**
- A named object in the knowledge graph
- Has a `type` (e.g., "module", "system", "tracker")
- Contains `observations` (structured data points)

**Relation:**
- Directional link between two entities
- Has a `type` (e.g., "depends_on", "implements", "tests")
- Enables graph traversal and queries

**Observation:**
- A single piece of information about an entity
- Always strings (JSON-serialized for complex data)
- Timestamped and immutable once created
- Can be queried and updated

---

## Memory Architecture

### Three-Layer Knowledge Model

```
┌─────────────────────────────────────────────────────────┐
│  Layer 1: Live Context (Current Session)               │
│  - CLAUDE.md                                            │
│  - .claude/takeoff-system.md                            │
│  - Current module spec                                  │
│  - Tail of PROGRESS.md (last 40 lines)                  │
├─────────────────────────────────────────────────────────┤
│  Layer 2: Repository Files (Long-Term Memory)           │
│  - docs/takeoff/PROGRESS.md                             │
│  - docs/takeoff/DECISIONS.md                            │
│  - docs/takeoff/TESTING.md                              │
│  - docs/takeoff/modules/*/module-{ID}-context.md        │
├─────────────────────────────────────────────────────────┤
│  Layer 3: Serena Entities (Structured State)            │
│  - serena:/takeoff-system-context                       │
│  - serena:/takeoff-progress-tracker                     │
│  - serena:/takeoff-module-{ID}-state                    │
└─────────────────────────────────────────────────────────┘
```

### Token Budget Optimization

**Before Serena:**
- Reread entire PROGRESS.md (500+ lines = ~10KB)
- Parse all module specs (~20KB)
- Context bloat after 5-10 modules

**With Serena:**
- Query specific module state (~1KB)
- Get current progress status (~0.5KB)
- Read only relevant context
- **Token savings: 80%+**

---

## Primary Memories

### 1. System Context Entity

**Entity Name:** `takeoff-system-context`

**Purpose:** High-level system state and configuration

**Observations:**
- `project_name`: "Midwest Underground Takeoff System"
- `branch_name`: "feat/takeoff-system"
- `base_directory`: "C:/Users/Owner/Desktop/midwest-underground-website"
- `current_phase`: "Phase 0" | "Phase 1" | "Phase 2" | "Phase 3"
- `total_modules`: 15
- `modules_completed`: 3
- `last_updated`: ISO timestamp
- `tech_stack`: JSON-serialized array of libraries
- `data_storage`: "client-side JSON files in dashboard/api/data/"
- `integration_strategy`: "coexist with Next.js app and legacy dashboard"

**Update Frequency:** Once per phase completion

**Example Query:**
```javascript
// Get current system state
const systemContext = await serena.open_nodes({ names: ['takeoff-system-context'] });
```

---

### 2. Progress Tracker Entity

**Entity Name:** `takeoff-progress-tracker`

**Purpose:** Track overall development progress across all phases and modules

**Observations:**
- `phase_0_status`: "completed" | "in_progress" | "not_started"
- `phase_1_status`: "completed" | "in_progress" | "not_started"
- `phase_2_status`: "completed" | "in_progress" | "not_started"
- `phase_3_status`: "completed" | "in_progress" | "not_started"
- `current_module`: "P0.1" | "1.2" | etc.
- `modules_completed_list`: JSON array of completed module IDs
- `modules_in_progress`: JSON array of in-progress module IDs
- `blockers`: JSON array of blocker descriptions
- `last_session_date`: ISO timestamp
- `last_session_summary`: Text summary of last session

**Update Frequency:** After each module status change

**Example Query:**
```javascript
// Find next module to work on
const tracker = await serena.open_nodes({ names: ['takeoff-progress-tracker'] });
const currentModule = tracker.observations.find(o => o.includes('current_module'));
```

---

### 3. Module State Entities

**Entity Name Pattern:** `takeoff-module-{ID}-state`

Examples:
- `takeoff-module-P0.1-state`
- `takeoff-module-1.2-state`
- `takeoff-module-2.3-state`

**Purpose:** Track detailed state for individual modules

**Observations:**
- `module_id`: "P0.1" | "1.2" | etc.
- `module_name`: "Repository Context and Documentation Skeleton"
- `status`: "planned" | "in_progress" | "completed" | "blocked"
- `phase`: "Phase 0" | "Phase 1" | etc.
- `plan_exists`: "true" | "false"
- `plan_path`: ".claude/plans/P0.1-plan.md"
- `tasks_total`: Number as string
- `tasks_completed`: Number as string
- `files_created`: JSON array of file paths
- `files_modified`: JSON array of file paths
- `tests_added`: JSON array of test file paths
- `tests_passing`: "true" | "false" | "N/A"
- `implementation_notes`: Text notes from implementer
- `known_limitations`: Text notes on limitations
- `blockers`: JSON array of blocker descriptions
- `started_at`: ISO timestamp
- `completed_at`: ISO timestamp (or null)
- `estimated_hours`: Number as string
- `actual_hours`: Number as string (or null)

**Update Frequency:** After each task completion, multiple times per module

**Example Query:**
```javascript
// Get state for Module 1.2
const moduleState = await serena.open_nodes({ names: ['takeoff-module-1.2-state'] });
const tasksCompleted = moduleState.observations.find(o => o.includes('tasks_completed'));
```

---

## Update Patterns

### Pattern 1: Module Initialization

**When:** Planner creates a new module plan

**Actions:**
1. Create module state entity
2. Set status to "planned"
3. Record plan path and task count
4. Update progress tracker with new module

**Example:**
```javascript
// Create new module entity
await serena.create_entities({
  entities: [{
    name: 'takeoff-module-1.2-state',
    entityType: 'module',
    observations: [
      'module_id: 1.2',
      'module_name: Measurement Tools',
      'status: planned',
      'phase: Phase 1',
      'plan_exists: true',
      'plan_path: .claude/plans/1.2-plan.md',
      'tasks_total: 5',
      'tasks_completed: 0',
      'files_created: []',
      'files_modified: []',
      'started_at: null',
      'completed_at: null'
    ]
  }]
});

// Update progress tracker
await serena.add_observations({
  observations: [{
    entityName: 'takeoff-progress-tracker',
    contents: [
      'current_module: 1.2',
      'modules_in_progress: ["1.2"]'
    ]
  }]
});
```

---

### Pattern 2: Task Completion Update

**When:** Implementer completes a task

**Actions:**
1. Increment `tasks_completed`
2. Add created/modified files to lists
3. Update `status` if all tasks done

**Example:**
```javascript
// After completing Task 3 of 5
await serena.add_observations({
  observations: [{
    entityName: 'takeoff-module-1.2-state',
    contents: [
      'tasks_completed: 3',
      'files_created: ["dashboard/js/measurement-tools.js"]',
      'files_modified: ["dashboard/takeoff.html", "dashboard/css/takeoff.css"]'
    ]
  }]
});
```

---

### Pattern 3: Module Completion

**When:** All tasks done, tests pass

**Actions:**
1. Set module status to "completed"
2. Record completion timestamp
3. Update progress tracker
4. Set next module as current

**Example:**
```javascript
// Mark module complete
await serena.add_observations({
  observations: [{
    entityName: 'takeoff-module-1.2-state',
    contents: [
      'status: completed',
      'tasks_completed: 5',
      'tests_passing: true',
      'completed_at: 2025-11-22T15:30:00Z',
      'actual_hours: 3.5',
      'implementation_notes: All measurement tools implemented successfully. Fabric.js integration works well.',
      'known_limitations: None identified'
    ]
  }]
});

// Update progress tracker
await serena.add_observations({
  observations: [{
    entityName: 'takeoff-progress-tracker',
    contents: [
      'current_module: 1.3',
      'modules_completed_list: ["P0.1", "P0.2", "P0.3", "1.1", "1.2"]',
      'modules_in_progress: ["1.3"]'
    ]
  }]
});
```

---

### Pattern 4: Blocker Recording

**When:** Agent encounters a blocker

**Actions:**
1. Add blocker observation to module state
2. Set status to "blocked"
3. Update progress tracker

**Example:**
```javascript
await serena.add_observations({
  observations: [{
    entityName: 'takeoff-module-1.2-state',
    contents: [
      'status: blocked',
      'blockers: ["Fabric.js version conflict with Chart.js, needs research"]'
    ]
  }]
});

await serena.add_observations({
  observations: [{
    entityName: 'takeoff-progress-tracker',
    contents: [
      'blockers: ["Module 1.2 blocked: Fabric.js version conflict"]'
    ]
  }]
});
```

---

## Memory Structure Examples

### Example 1: System Context Entity (Full)

```json
{
  "name": "takeoff-system-context",
  "entityType": "system",
  "observations": [
    "project_name: Midwest Underground Takeoff System",
    "branch_name: feat/takeoff-system",
    "base_directory: C:/Users/Owner/Desktop/midwest-underground-website",
    "current_phase: Phase 1",
    "total_modules: 15",
    "modules_completed: 4",
    "last_updated: 2025-11-22T15:30:00Z",
    "tech_stack: [\"PDF.js\", \"Fabric.js\", \"jsPDF\", \"Chart.js\", \"Three.js\"]",
    "data_storage: client-side JSON files in dashboard/api/data/",
    "integration_strategy: coexist with Next.js app and legacy dashboard"
  ]
}
```

---

### Example 2: Progress Tracker Entity (Full)

```json
{
  "name": "takeoff-progress-tracker",
  "entityType": "tracker",
  "observations": [
    "phase_0_status: completed",
    "phase_1_status: in_progress",
    "phase_2_status: not_started",
    "phase_3_status: not_started",
    "current_module: 1.3",
    "modules_completed_list: [\"P0.1\", \"P0.2\", \"P0.3\", \"1.1\", \"1.2\"]",
    "modules_in_progress: [\"1.3\"]",
    "blockers: []",
    "last_session_date: 2025-11-22T15:30:00Z",
    "last_session_summary: Completed Module 1.2 (Measurement Tools). All tests passing. Starting Module 1.3 (Quantity Calculator)."
  ]
}
```

---

### Example 3: Module State Entity (Full)

```json
{
  "name": "takeoff-module-1.2-state",
  "entityType": "module",
  "observations": [
    "module_id: 1.2",
    "module_name: Measurement Tools",
    "status: completed",
    "phase: Phase 1",
    "plan_exists: true",
    "plan_path: .claude/plans/1.2-plan.md",
    "tasks_total: 5",
    "tasks_completed: 5",
    "files_created: [\"dashboard/js/measurement-tools.js\"]",
    "files_modified: [\"dashboard/takeoff.html\", \"dashboard/js/pdf-viewer.js\", \"dashboard/css/takeoff.css\"]",
    "tests_added: [\"tests/takeoff/measurement-tools.spec.js\"]",
    "tests_passing: true",
    "implementation_notes: Integrated Fabric.js canvas overlay successfully. Linear, area, and count tools all working. Scale calibration implemented with visual feedback.",
    "known_limitations: None identified",
    "blockers: []",
    "started_at: 2025-11-22T10:00:00Z",
    "completed_at: 2025-11-22T15:30:00Z",
    "estimated_hours: 4",
    "actual_hours: 3.5"
  ]
}
```

---

## Best Practices

### For Autonomous Agents

#### 1. Read Before Write

**Always query existing state before updating:**

```javascript
// BAD: Blindly update without reading
await serena.add_observations({
  observations: [{
    entityName: 'takeoff-module-1.2-state',
    contents: ['tasks_completed: 3']
  }]
});

// GOOD: Read current state, then update
const currentState = await serena.open_nodes({ names: ['takeoff-module-1.2-state'] });
const currentTasks = parseInt(currentState.observations.find(o => o.includes('tasks_completed')).split(': ')[1]);
const newTasks = currentTasks + 1;

await serena.add_observations({
  observations: [{
    entityName: 'takeoff-module-1.2-state',
    contents: [`tasks_completed: ${newTasks}`]
  }]
});
```

#### 2. Update After Every Task

**Don't batch updates at end of session:**

```javascript
// BAD: Wait until all tasks done
// (Session could crash, lose all progress)

// GOOD: Update after each task
async function completeTask(taskNumber) {
  // Do the work...

  // Immediately update Serena
  await serena.add_observations({
    observations: [{
      entityName: 'takeoff-module-1.2-state',
      contents: [`tasks_completed: ${taskNumber}`]
    }]
  });
}
```

#### 3. Use Structured Data for Lists

**Always JSON-serialize arrays and objects:**

```javascript
// BAD: String concatenation
contents: ['files_created: dashboard/js/file1.js, dashboard/js/file2.js']

// GOOD: JSON array
contents: ['files_created: ["dashboard/js/file1.js", "dashboard/js/file2.js"]']
```

#### 4. Include Timestamps

**Always record when state changes:**

```javascript
await serena.add_observations({
  observations: [{
    entityName: 'takeoff-module-1.2-state',
    contents: [
      'status: completed',
      `completed_at: ${new Date().toISOString()}`
    ]
  }]
});
```

#### 5. Clear Blockers When Resolved

**Mark blockers as empty array when fixed:**

```javascript
// When blocker is resolved
await serena.add_observations({
  observations: [{
    entityName: 'takeoff-module-1.2-state',
    contents: [
      'status: in_progress',
      'blockers: []'
    ]
  }]
});
```

---

### For Human Developers

#### Query State Between Sessions

```bash
# Check current progress
claude "Query serena:/takeoff-progress-tracker and show me current status"

# Check specific module
claude "Query serena:/takeoff-module-1.2-state and show detailed state"

# Find all completed modules
claude "Query all takeoff module entities and list which are completed"
```

#### Manual State Corrections

```javascript
// If agent incorrectly marked something complete, fix it:
await serena.add_observations({
  observations: [{
    entityName: 'takeoff-module-1.2-state',
    contents: [
      'status: in_progress',
      'tasks_completed: 3',
      'completed_at: null'
    ]
  }]
});
```

---

## Access Patterns

### Session Start Pattern

```javascript
// 1. Load system context
const systemContext = await serena.open_nodes({
  names: ['takeoff-system-context']
});

// 2. Load progress tracker
const tracker = await serena.open_nodes({
  names: ['takeoff-progress-tracker']
});

// 3. Parse current module
const currentModuleId = tracker.observations
  .find(o => o.includes('current_module'))
  .split(': ')[1];

// 4. Load current module state
const moduleState = await serena.open_nodes({
  names: [`takeoff-module-${currentModuleId}-state`]
});

// 5. Determine role and next action
const status = moduleState.observations
  .find(o => o.includes('status'))
  .split(': ')[1];

if (status === 'planned') {
  // Run as IMPLEMENTER
} else if (status === 'in_progress') {
  // Continue IMPLEMENTER work
} else if (status === 'testing') {
  // Run as TESTER
}
```

---

### Search Pattern

```javascript
// Find all blocked modules
const searchResults = await serena.search_nodes({
  query: 'status: blocked'
});

// Find modules with specific file
const modulesWithFile = await serena.search_nodes({
  query: 'dashboard/js/measurement-tools.js'
});
```

---

### Relation Pattern (Optional Advanced Use)

```javascript
// Create dependency relation between modules
await serena.create_relations({
  relations: [{
    from: 'takeoff-module-1.3-state',
    to: 'takeoff-module-1.2-state',
    relationType: 'depends_on'
  }]
});

// Query dependencies
const graph = await serena.read_graph();
// Parse graph to find all dependencies for Module 1.3
```

---

## Migration and Maintenance

### When to Archive Old State

**Criteria:**
- After phase completion (e.g., all Phase 1 modules done)
- Module state entities > 50

**Process:**
1. Export completed module states to markdown
2. Archive in `docs/takeoff/archive/serena-state-{phase}.md`
3. Keep only in-progress and upcoming modules in Serena

**Example Archive:**
```markdown
# Serena State Archive - Phase 1

## Module 1.1 - PDF Viewer
Status: completed
Files Created: dashboard/takeoff.html, dashboard/js/pdf-viewer.js
Completed: 2025-11-20T14:00:00Z

## Module 1.2 - Measurement Tools
...
```

---

### Schema Evolution

**If observation schema changes:**

1. Update this MEMORY.md documentation
2. Add migration notes in PROGRESS.md
3. Update all active module entities with new fields
4. Mark old fields as deprecated (don't delete)

**Example:**
```javascript
// Old schema
'files_created: ["file1.js"]'

// New schema (adds file sizes)
'files_created: [{"path": "file1.js", "size": 1024}]'

// Migration: Keep both until all modules updated
'files_created: ["file1.js"]'
'files_created_v2: [{"path": "file1.js", "size": 1024}]'
```

---

## Reference Documentation

For related documentation, see:

- **`.claude/takeoff-system.md`** - Complete system architecture
- **`docs/takeoff/ARCHITECTURE.md`** - High-level system overview
- **`docs/takeoff/PROGRESS.md`** - Development progress log
- **`docs/takeoff/TESTING.md`** - Testing strategy

---

**Document Version:** 1.0
**Maintained By:** Autonomous Development Team
**Review Frequency:** After each phase completion
