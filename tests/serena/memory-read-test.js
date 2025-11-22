/**
 * Serena Memory Read Test
 *
 * This script reads and validates the test data written by memory-write-test.js
 * to confirm that Serena MCP read operations work correctly and data persists.
 *
 * Usage: This script is designed to be executed via Claude Code's Serena MCP tools.
 *        Claude will read this file and execute the read/validation operations.
 *
 * Test Memories to Read:
 * 1. takeoff-system-context-test - Should contain system state test data
 * 2. takeoff-progress-tracker-test - Should contain progress tracking test data
 * 3. takeoff-module-P0.2-state-test - Should contain module state test data
 */

const validationRules = {
  systemContext: {
    memoryName: 'takeoff-system-context-test',
    requiredStrings: [
      'TEST DATA',
      'Test Timestamp:',
      'Validate Serena MCP write operations',
      'Phase 0 - Platform Scaffolding (TEST)',
      'P0.2 - Serena memory wiring (TEST)',
      'Testing memory write operations',
      'Serena MCP: ✅ Connected and being validated',
      'tests/serena/memory-write-test.js',
      'Expected to persist: Yes'
    ],
    description: 'System context test memory'
  },

  progressTracker: {
    memoryName: 'takeoff-progress-tracker-test',
    requiredStrings: [
      'TEST DATA',
      'Test Timestamp:',
      'Validate progress tracking memory persistence',
      'P0.2 - Serena memory wiring',
      'Status: testing',
      'Module Progress Map (TEST)',
      'P0.1 | Repo context | completed',
      'P0.2 | Serena wiring | testing',
      'P0.3 | Test harness | not_started',
      'Memory Write Test',
      'Validate write operations',
      'Expected to persist: Yes'
    ],
    description: 'Progress tracker test memory'
  },

  moduleState: {
    memoryName: 'takeoff-module-P0.2-state-test',
    requiredStrings: [
      'TEST DATA',
      'Test Timestamp:',
      'Validate module state persistence',
      'Module ID: P0.2',
      'Serena MCP Wiring and Validation',
      'Phase 0 - Platform Scaffolding',
      'Status: testing',
      'Current Role: implementer',
      'Tasks Completed: 2/8 (testing)',
      'Task 2 - Create memory write test script',
      'Expected to persist across sessions: Yes',
      'tests/serena/memory-read-test.js',
      'TEST DATA - Will be validated in next step'
    ],
    description: 'Module state test memory'
  }
};

// Instructions for Claude Code to execute these reads
const instructions = {
  title: 'Serena Memory Read & Validation Test Instructions',
  description: 'Claude Code should execute the following Serena read operations',

  operations: [
    {
      step: 1,
      action: 'read_memory',
      memoryName: validationRules.systemContext.memoryName,
      validate: validationRules.systemContext.requiredStrings,
      description: validationRules.systemContext.description
    },
    {
      step: 2,
      action: 'read_memory',
      memoryName: validationRules.progressTracker.memoryName,
      validate: validationRules.progressTracker.requiredStrings,
      description: validationRules.progressTracker.description
    },
    {
      step: 3,
      action: 'read_memory',
      memoryName: validationRules.moduleState.memoryName,
      validate: validationRules.moduleState.requiredStrings,
      description: validationRules.moduleState.description
    }
  ],

  validationLogic: {
    forEach: 'memory',
    steps: [
      '1. Read memory using read_memory tool',
      '2. Check that memory exists (not null)',
      '3. Check that all required strings are present',
      '4. Print PASS if all checks succeed',
      '5. Print FAIL if any check fails, with details'
    ]
  },

  expectedResults: {
    allReads: 'Should complete successfully without errors',
    allData: 'All three memories should contain their expected test data',
    validation: 'All required strings should be found in each memory',
    status: 'PASS - All validations successful'
  }
};

// Validation function (for documentation purposes)
function validateMemory(memoryContent, requiredStrings, memoryName) {
  if (!memoryContent) {
    return {
      pass: false,
      error: `Memory "${memoryName}" is null or empty`
    };
  }

  const missingStrings = requiredStrings.filter(str => !memoryContent.includes(str));

  if (missingStrings.length > 0) {
    return {
      pass: false,
      error: `Missing ${missingStrings.length} required string(s) in "${memoryName}"`,
      missing: missingStrings
    };
  }

  return {
    pass: true,
    message: `✅ PASS - "${memoryName}" contains all ${requiredStrings.length} required strings`
  };
}

// Export for documentation and debugging
module.exports = {
  validationRules,
  instructions,
  validateMemory
};

// Print test plan
console.log('='.repeat(70));
console.log('Serena Memory Read & Validation Test Plan');
console.log('='.repeat(70));
console.log('\nOperations to Execute:\n');

instructions.operations.forEach(op => {
  console.log(`${op.step}. ${op.action}("${op.memoryName}")`);
  console.log(`   Description: ${op.description}`);
  console.log(`   Validate: ${op.validate.length} required strings`);
  console.log('');
});

console.log('Validation Logic:');
instructions.validationLogic.steps.forEach(step => {
  console.log(`  ${step}`);
});

console.log('\nExpected Results:');
Object.entries(instructions.expectedResults).forEach(([key, value]) => {
  console.log(`  - ${key}: ${value}`);
});

console.log('='.repeat(70));
console.log('\nNext: Claude Code will execute read/validation operations via Serena MCP');
console.log('Status: Waiting for Claude to run validation...\n');
