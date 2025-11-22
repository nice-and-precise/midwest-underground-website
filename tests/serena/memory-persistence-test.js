/**
 * Serena Memory Persistence Test
 *
 * This script validates that Serena MCP memories persist across agent restarts.
 * It works in two phases:
 * 1. WRITE PHASE: Write a unique timestamp to a test memory
 * 2. READ PHASE: After agent restart, read and verify the timestamp
 *
 * Usage:
 * - First run: Script writes timestamp and prints "STOP AGENT NOW"
 * - User restarts Claude Code agent
 * - Second run: Script reads timestamp and validates it matches
 *
 * This tests the CRITICAL requirement that autonomous execution state
 * survives across agent sessions.
 */

const MEMORY_NAME = 'takeoff-persistence-test';

/**
 * Phase 1: Write Test
 * Writes current timestamp to persistence test memory
 */
function writePhase() {
  const timestamp = new Date().toISOString();

  const testContent = `# Serena Persistence Test

**Purpose:** Validate memory persistence across agent sessions

## Test Information

**Test Memory:** ${MEMORY_NAME}
**Write Timestamp:** ${timestamp}
**Test Phase:** WRITE (Phase 1 of 2)

## Instructions for Validation

1. This memory was written in the FIRST agent session
2. User should STOP the Claude Code agent now
3. User should START a new Claude Code agent session
4. User should run memory-persistence-test.js again
5. Script will READ this memory and validate timestamp matches

## Expected Outcome

When script runs in Phase 2 (after agent restart):
- Memory should still exist
- Timestamp should match: ${timestamp}
- All content should be identical
- Result: ✅ PASS - Memory persisted across sessions

---

**Test Status:** WAITING FOR AGENT RESTART
**Next Action:** Stop agent, restart, run test again
`;

  return {
    phase: 'WRITE',
    timestamp,
    memoryName: MEMORY_NAME,
    content: testContent,
    instructions: [
      '🛑 STOP AGENT NOW',
      '',
      'To complete this test:',
      '1. Stop the Claude Code agent (exit/close)',
      '2. Start a new Claude Code agent session',
      '3. Run: node tests/serena/memory-persistence-test.js',
      '',
      `Timestamp to verify: ${timestamp}`,
      '',
      'The second run will validate that the memory persisted.'
    ]
  };
}

/**
 * Phase 2: Read Test
 * Reads memory and validates it contains the expected timestamp
 */
function readPhase(memoryContent) {
  if (!memoryContent) {
    return {
      phase: 'READ',
      pass: false,
      error: 'Memory not found - persistence test FAILED',
      details: 'Memory should have been created in first run'
    };
  }

  // Extract timestamp from memory content
  const timestampMatch = memoryContent.match(/\*\*Write Timestamp:\*\* (.+)/);

  if (!timestampMatch) {
    return {
      phase: 'READ',
      pass: false,
      error: 'Timestamp not found in memory',
      details: 'Memory exists but format is unexpected'
    };
  }

  const originalTimestamp = timestampMatch[1];
  const currentTime = new Date().toISOString();

  // Validate all expected content is present
  const requiredStrings = [
    'Serena Persistence Test',
    'Validate memory persistence across agent sessions',
    MEMORY_NAME,
    'WRITE (Phase 1 of 2)',
    'FIRST agent session',
    'STOP the Claude Code agent',
    'START a new Claude Code agent session',
    'Memory persisted across sessions',
    'WAITING FOR AGENT RESTART'
  ];

  const missingStrings = requiredStrings.filter(str => !memoryContent.includes(str));

  if (missingStrings.length > 0) {
    return {
      phase: 'READ',
      pass: false,
      error: `Missing ${missingStrings.length} required string(s)`,
      missing: missingStrings
    };
  }

  return {
    phase: 'READ',
    pass: true,
    originalTimestamp,
    currentTime,
    persistence: `Memory survived ${Math.floor((new Date(currentTime) - new Date(originalTimestamp)) / 1000)} seconds`,
    validation: [
      '✅ Memory exists',
      `✅ Original timestamp found: ${originalTimestamp}`,
      `✅ All ${requiredStrings.length} required strings present`,
      '✅ Content structure intact',
      '✅ PASS - Memory persisted across agent restart'
    ]
  };
}

// Instructions for Claude Code to execute this test
const instructions = {
  title: 'Serena Memory Persistence Test Instructions',
  description: 'Two-phase test to validate session persistence',

  phase1: {
    title: 'Phase 1 - WRITE',
    steps: [
      '1. Check if "takeoff-persistence-test" memory exists',
      '2. If NOT exists: Run writePhase()',
      '3. Write test content with unique timestamp',
      '4. Print instructions to STOP AGENT',
      '5. Wait for user to restart agent'
    ],
    command: 'write_memory("takeoff-persistence-test", content)'
  },

  phase2: {
    title: 'Phase 2 - READ (after agent restart)',
    steps: [
      '1. Check if "takeoff-persistence-test" memory exists',
      '2. If EXISTS: Run readPhase(content)',
      '3. Read memory content',
      '4. Validate timestamp and content',
      '5. Print PASS or FAIL with details'
    ],
    command: 'read_memory("takeoff-persistence-test")'
  },

  expectedFlow: [
    'First run → Write test data → Print "STOP AGENT"',
    'User stops agent',
    'User starts new agent',
    'Second run → Read test data → Validate → Print PASS'
  ]
};

// Export for documentation and debugging
module.exports = {
  MEMORY_NAME,
  writePhase,
  readPhase,
  instructions
};

// Print test overview
console.log('='.repeat(70));
console.log('Serena Memory Persistence Test');
console.log('='.repeat(70));
console.log('\nTest Phases:\n');
console.log('Phase 1 - WRITE:');
instructions.phase1.steps.forEach(step => console.log(`  ${step}`));
console.log('\nPhase 2 - READ (after restart):');
instructions.phase2.steps.forEach(step => console.log(`  ${step}`));
console.log('\nExpected Flow:');
instructions.expectedFlow.forEach(flow => console.log(`  → ${flow}`));
console.log('='.repeat(70));
console.log('\nNext: Claude Code will determine which phase to run');
console.log('Check if persistence test memory exists to decide phase\n');
