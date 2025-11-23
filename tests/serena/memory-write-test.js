/**
 * Serena Memory Write Test
 *
 * This script writes test data to all three Serena memory types to validate
 * that write operations work correctly.
 *
 * Usage: This script is designed to be executed via Claude Code's Serena MCP tools.
 *        Claude will read this file and execute the write operations.
 *
 * Test Memories Created:
 * 1. takeoff-system-context-test - System state test data
 * 2. takeoff-progress-tracker-test - Progress tracking test data
 * 3. takeoff-module-P0.2-state-test - Module state test data
 */

const timestamp = new Date().toISOString();

// Test data structures
const testData = {
  systemContext: {
    memoryName: 'takeoff-system-context-test',
    content: `# Takeoff System Context - TEST DATA

**Test Timestamp:** ${timestamp}
**Test Purpose:** Validate Serena MCP write operations

## Test System State

**Current Phase:** Phase 0 - Platform Scaffolding (TEST)
**Current Module:** P0.2 - Serena memory wiring (TEST)
**Status:** Testing memory write operations

## Test Integration Points

- Next.js App: Not modified (test)
- Dashboard: Coexists with takeoff system (test)
- Serena MCP: ✅ Connected and being validated

## Test Notes

This is test data created by tests/serena/memory-write-test.js
to validate that Serena MCP write operations function correctly.

**Created:** ${timestamp}
**Expected to persist:** Yes (across agent sessions)
`
  },

  progressTracker: {
    memoryName: 'takeoff-progress-tracker-test',
    content: `# Takeoff Progress Tracker - TEST DATA

**Test Timestamp:** ${timestamp}
**Test Purpose:** Validate progress tracking memory persistence

## Current Status (TEST)

**Module:** P0.2 - Serena memory wiring
**Status:** testing
**Next Role:** IMPLEMENTER
**Blockers:** None

## Module Progress Map (TEST)

| Module | Name | Status | Test Timestamp |
|--------|------|--------|----------------|
| P0.1 | Repo context | completed | ${timestamp} |
| P0.2 | Serena wiring | testing | ${timestamp} |
| P0.3 | Test harness | not_started | - |

## Recent Activity (TEST)

### ${timestamp} - Memory Write Test
- **Role:** TEST
- **Action:** Writing test data to Serena
- **Purpose:** Validate write operations
- **Next:** Read test to validate data

---

This is test data created by tests/serena/memory-write-test.js

**Expected to persist:** Yes
`
  },

  moduleState: {
    memoryName: 'takeoff-module-P0.2-state-test',
    content: `# Module P0.2 State - TEST DATA

**Test Timestamp:** ${timestamp}
**Test Purpose:** Validate module state persistence

**Module ID:** P0.2
**Name:** Serena MCP Wiring and Validation
**Phase:** Phase 0 - Platform Scaffolding
**Status:** testing
**Current Role:** implementer

## Implementation Status (TEST)

**Tasks Completed:** 2/8 (testing)
**Current Task:** Task 2 - Create memory write test script

## Timeline (TEST)

**Created:** ${timestamp}
**Testing Started:** ${timestamp}
**Expected Completion:** After all 3 tests pass

## Test Data

This is test data created to validate Serena MCP memory persistence.

**Write Timestamp:** ${timestamp}
**Expected to persist across sessions:** Yes
**Will be validated by:** tests/serena/memory-read-test.js

---

**Status:** TEST DATA - Will be validated in next step
`
  }
};

// Instructions for Claude Code to execute these writes
const instructions = {
  title: 'Serena Memory Write Test Instructions',
  description: 'Claude Code should execute the following Serena write operations',

  operations: [
    {
      step: 1,
      action: 'write_memory',
      memoryName: testData.systemContext.memoryName,
      content: testData.systemContext.content
    },
    {
      step: 2,
      action: 'write_memory',
      memoryName: testData.progressTracker.memoryName,
      content: testData.progressTracker.content
    },
    {
      step: 3,
      action: 'write_memory',
      memoryName: testData.moduleState.memoryName,
      content: testData.moduleState.content
    }
  ],

  expectedResults: {
    allWrites: 'Should complete successfully without errors',
    timestamp: `All memories should contain timestamp: ${timestamp}`,
    persistence: 'Data should be readable by memory-read-test.js',
    validation: 'Read test should confirm data matches what was written'
  }
};

// Export for documentation and debugging
module.exports = {
  testData,
  instructions,
  timestamp
};

// Print test plan
console.log('='.repeat(70));
console.log('Serena Memory Write Test Plan');
console.log('='.repeat(70));
console.log(`Test Timestamp: ${timestamp}\n`);
console.log('Operations to Execute:');
instructions.operations.forEach(op => {
  console.log(`  ${op.step}. ${op.action}("${op.memoryName}")`);
});
console.log('\nExpected Results:');
Object.entries(instructions.expectedResults).forEach(([key, value]) => {
  console.log(`  - ${key}: ${value}`);
});
console.log('='.repeat(70));
console.log('\nNext: Claude Code will execute these write operations via Serena MCP');
console.log('Then: Run memory-read-test.js to validate writes succeeded\n');
