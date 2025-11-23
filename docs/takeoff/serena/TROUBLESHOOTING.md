# Serena MCP Troubleshooting Guide

**Purpose:** Common issues, diagnostic steps, and solutions for Serena MCP memory operations
**Last Updated:** 2025-11-22
**Validated:** Module P0.2

---

## Quick Diagnostics Checklist

Before investigating specific issues, run these quick checks:

```markdown
✅ Is Serena MCP installed? (Check MCP server list)
✅ Is Serena MCP connected? (Look for connection status in Claude Code)
✅ Is the project activated? (Run activate_project command)
✅ Can you list memories? (Run list_memories command)
✅ Can you read a known memory? (Try reading an existing memory)
```

If any of these fail, see [Connection Issues](#connection-issues) below.

---

## Common Issues

### Issue 1: "Memory not found" Error

**Symptom:**
```
Error: Memory "takeoff-system-context" not found
```

**Causes:**
1. Memory was never created
2. Wrong memory name (typo)
3. Project not activated in Serena
4. Memory was deleted

**Diagnostic Steps:**
```javascript
// 1. List all available memories
list_memories()

// 2. Check if similar names exist (case-sensitive!)
// Correct: "takeoff-system-context"
// Wrong: "takeoff-system-context.md" (don't include .md)
// Wrong: "Takeoff-System-Context" (case matters)

// 3. Verify project is activated
get_current_config() // Check active project
```

**Solutions:**
```javascript
// Option 1: Create the missing memory
write_memory("takeoff-system-context", defaultContent);

// Option 2: Fix the memory name
// Change: read_memory("takeoff-system-context.md")
// To: read_memory("takeoff-system-context")

// Option 3: Activate the correct project
activate_project("midwest-underground-website");
```

---

### Issue 2: Serena Connection Timeout

**Symptom:**
```
Error: Timeout connecting to Serena MCP server
Error: Serena MCP server not responding
```

**Causes:**
1. Serena MCP server not running
2. Network/port conflict
3. Serena configuration issue
4. Process crashed

**Diagnostic Steps:**
```bash
# Check if Serena MCP is running
# (This depends on your Serena setup - check Serena docs)

# Check Claude Code MCP configuration
cat ~/.config/claude-code/mcp.json
# or on Windows:
type %APPDATA%\Claude Code\mcp.json

# Look for Serena server entry
```

**Solutions:**
```bash
# Option 1: Restart Serena MCP server
# (Restart process - check Serena documentation)

# Option 2: Reconnect in Claude Code
# Close and reopen Claude Code

# Option 3: Check configuration
# Ensure Serena MCP is properly configured in mcp.json

# Option 4: Reinstall Serena MCP
# Follow Serena MCP installation guide
```

---

### Issue 3: Memory Write Failures

**Symptom:**
```
Error: Failed to write memory
Error: Permission denied
Error: Memory write returned null
```

**Causes:**
1. File system permissions issue
2. Serena storage directory full
3. Invalid content format
4. Memory name contains invalid characters

**Diagnostic Steps:**
```javascript
// 1. Test with simple content
write_memory("test-memory", "Simple test");

// 2. Check memory name is valid
// Valid: "takeoff-system-context", "module-1.2-state", "test_memory"
// Invalid: "takeoff/system", "module 1.2", "test.memory.md"

// 3. Check content size
const content = "..."; // Your content
console.log(`Content size: ${content.length} bytes`);
// If > 100KB, consider splitting into multiple memories
```

**Solutions:**
```javascript
// Option 1: Simplify memory name
// Change: write_memory("module 1.2 state", content)
// To: write_memory("module-1.2-state", content)

// Option 2: Reduce content size
// If too large, archive old data and keep only recent entries

// Option 3: Check for special characters
// Avoid: /, \, :, *, ?, ", <, >, |
// Use: Letters, numbers, hyphens, underscores

// Option 4: Retry with error handling
try {
  write_memory("takeoff-system-context", content);
} catch (error) {
  console.error("Write failed:", error);
  // Implement retry logic
}
```

---

### Issue 4: Session State Loss

**Symptom:**
```
Memory exists but doesn't contain recent updates
Data from previous session is missing
Module state reverted to earlier version
```

**Causes:**
1. Write operation failed silently
2. Reading old cached version
3. Wrong memory name being read
4. Memory was overwritten

**Diagnostic Steps:**
```javascript
// 1. Verify last write succeeded
const result = write_memory("test", "content");
console.log(result); // Should show success message

// 2. Immediately read back to confirm
const content = read_memory("test");
console.log(content); // Should match what you wrote

// 3. Check timestamps in memory
// Look for **Last Updated:** field to verify recency

// 4. List all memories to check for duplicates
list_memories(); // Look for similar names
```

**Solutions:**
```javascript
// Option 1: Always verify writes
function safeWrite(name, content) {
  write_memory(name, content);
  const verify = read_memory(name);
  if (!verify || !verify.includes("Last Updated")) {
    throw new Error("Write verification failed");
  }
  return true;
}

// Option 2: Include timestamps
const content = `**Last Updated:** ${new Date().toISOString()}
${restOfContent}`;

// Option 3: Use unique identifiers
// Include unique IDs in content for tracking updates
```

---

### Issue 5: Memory Read Returns Null

**Symptom:**
```javascript
const content = read_memory("takeoff-system-context");
console.log(content); // null
```

**Causes:**
1. Memory doesn't exist (never created)
2. Project not activated
3. Serena MCP not connected
4. Wrong memory name

**Diagnostic Steps:**
```javascript
// 1. Check if memory exists
list_memories(); // Look for the memory name in the list

// 2. Check project activation
get_current_config(); // Verify correct project is active

// 3. Try creating and immediately reading
write_memory("test-read", "Test content");
const test = read_memory("test-read");
console.log(test); // If this works, original memory doesn't exist
```

**Solutions:**
```javascript
// Option 1: Create memory if it doesn't exist
let content = read_memory("takeoff-system-context");
if (!content) {
  content = createDefaultSystemContext();
  write_memory("takeoff-system-context", content);
}

// Option 2: Use defensive reading
function safeRead(memoryName, defaultContent) {
  const content = read_memory(memoryName);
  return content || defaultContent || "";
}

// Option 3: Initialize all memories at project start
function initializeMemories() {
  const required = [
    "takeoff-system-context",
    "takeoff-progress-tracker"
  ];

  required.forEach(name => {
    if (!read_memory(name)) {
      write_memory(name, getDefaultContent(name));
    }
  });
}
```

---

### Issue 6: Serena MCP Not Connected

**Symptom:**
```
Error: No active project
Error: Serena MCP tools not available
Cannot find write_memory function
```

**Causes:**
1. Serena MCP server not configured
2. Project not initialized
3. Claude Code not detecting Serena
4. MCP configuration issue

**Diagnostic Steps:**
```bash
# 1. Check MCP configuration
# On macOS/Linux:
cat ~/.config/claude-code/mcp.json

# On Windows:
type %APPDATA%\Claude Code\mcp.json

# 2. Verify Serena is listed

# 3. Check project is registered
# Look for project in known projects list
```

**Solutions:**
```javascript
// Option 1: Activate project
activate_project("midwest-underground-website");

// Option 2: Check current config
get_current_config(); // Shows active project and available tools

// Option 3: Verify Serena is in MCP config
// If not, add Serena MCP to configuration

// Option 4: Restart Claude Code
// Close and reopen to reload MCP servers
```

---

## Prevention Strategies

### Strategy 1: Defensive Memory Operations

```javascript
// Always check read results
function getMemory(name, defaultValue = "") {
  try {
    const content = read_memory(name);
    return content || defaultValue;
  } catch (error) {
    console.warn(`Failed to read ${name}:`, error);
    return defaultValue;
  }
}

// Always verify writes
function setMemory(name, content) {
  try {
    write_memory(name, content);
    const verify = read_memory(name);
    if (!verify) {
      throw new Error("Write verification failed");
    }
    return true;
  } catch (error) {
    console.error(`Failed to write ${name}:`, error);
    return false;
  }
}
```

### Strategy 2: Include Metadata

```markdown
# Memory Name

**Last Updated:** 2025-11-22T13:30:00.000Z
**Version:** 1.2.3
**Updated By:** IMPLEMENTER (Task 4)
**Checksum:** abc123 (optional hash of content)

... rest of content ...
```

### Strategy 3: Regular Validation

```javascript
// Periodically validate critical memories exist
function validateCriticalMemories() {
  const critical = [
    "takeoff-system-context",
    "takeoff-progress-tracker"
  ];

  const missing = critical.filter(name => !read_memory(name));

  if (missing.length > 0) {
    console.error("Missing critical memories:", missing);
    // Alert user or recreate defaults
  }
}
```

---

## Getting Help

If these solutions don't resolve your issue:

1. **Check Serena Documentation**
   - Serena MCP official docs
   - GitHub issues for known bugs
   - Community forums

2. **Document the Issue**
   - Exact error message
   - Steps to reproduce
   - System info (OS, Claude Code version, Serena version)
   - Recent operations before error

3. **Create a Minimal Reproducible Example**
```javascript
// Simplest possible test that shows the issue
activate_project("midwest-underground-website");
write_memory("test", "Hello");
const result = read_memory("test");
console.log(result); // What does this print?
```

4. **Check Serena Logs**
   - Location depends on Serena setup
   - Look for error messages or stack traces
   - Check timestamps match when issue occurred

5. **Ask for Help**
   - Serena MCP GitHub: [Report Issue]
   - Claude Code Support: [Contact Support]
   - Include minimal reproducible example

---

## Related Documentation

- **Memory Usage:** `docs/takeoff/serena/MEMORY-USAGE.md`
- **Memory Structure:** `docs/takeoff/MEMORY.md`
- **Test Scripts:** `tests/serena/*.js`
- **Serena MCP Docs:** [Link to official documentation]

---

**Last Updated:** 2025-11-22
**Validation Status:** ✅ All issues documented with solutions
**Next:** See MEMORY-USAGE.md for proper usage patterns
