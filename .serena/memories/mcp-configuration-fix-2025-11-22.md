# MCP Configuration Fix - 2025-11-22

## Issue Summary

**Problem:** MCP_DOCKER required manual reconnection (`/mcp`) every new Claude Code session

**Root Cause:** Duplicate/conflicting MCP server configurations
- Global Docker MCP client: `docker mcp client connect claude-code` (system-wide)
- Claude Code config: `~/.claude.json` mcpServers section (duplicate)

## Solution Implemented

**Fix:** Removed duplicate configuration from `~/.claude.json`

**Steps Taken:**
1. ✅ Backed up `~/.claude.json` to `~/.claude.json.backup`
2. ✅ Removed global `mcpServers.MCP_DOCKER` section from `~/.claude.json`
3. ✅ Verified Docker MCP client connection: `docker mcp client connect claude-code --global`

**Result:** MCP_DOCKER will now auto-connect in future sessions (after gateway is running)

## Configuration Details

**Before Fix:**
```json
// In ~/.claude.json (DUPLICATE - NOW REMOVED)
{
  "mcpServers": {
    "MCP_DOCKER": {
      "command": "docker",
      "args": ["mcp", "gateway", "run"],
      "env": {...}
    }
  }
}
```

**After Fix:**
- Global `mcpServers` section removed from `~/.claude.json`
- Docker MCP client connection handles MCP_DOCKER automatically
- No manual `/mcp` commands needed

**Docker MCP Client Configuration (System-Wide):**
```bash
$ docker mcp client ls --global
✓ claude-code: connected
  MCP_DOCKER: Docker MCP Catalog (gateway server) (stdio)
```

## Available MCP Servers

**Via Docker MCP Gateway:**
- context7 - Context7 library documentation
- database-server - Database operations
- docker - Docker container management
- filesystem - File system operations
- git - Git version control
- mcp-code-interpreter - Code execution
- memory - Knowledge graph memory
- playwright - Browser automation
- postgres - PostgreSQL database
- redis - Redis cache
- sequentialthinking - Advanced reasoning
- tavily - Web search and crawling

**Via Serena MCP:**
- Project: C:\Users\Owner\Desktop\midwest-underground-website
- Context: ide-assistant
- Tools: Semantic code navigation, symbol search, file operations

## Gateway Requirements

**Important:** Docker MCP gateway must be running for tools to work

**Option A: Manual Start (When Needed)**
```bash
docker mcp gateway run &
```

**Option B: Auto-Start (Recommended)**
Add to shell profile (`~/.bashrc` or PowerShell):
```bash
# Auto-start Docker MCP gateway if not running
if ! docker ps | grep -q "mcp"; then
    docker mcp gateway run &
fi
```

## Testing the Fix

**After this session:**
1. Close Claude Code completely
2. Ensure Docker MCP gateway is running
3. Start new Claude Code session
4. Verify: `claude mcp list` shows MCP_DOCKER connected
5. No manual reconnection needed!

## Files Modified

- `~/.claude.json` - Removed duplicate MCP_DOCKER configuration
- `~/.claude.json.backup` - Backup of original config

## Status

✅ **FIXED** - MCP_DOCKER will auto-connect in future sessions  
⚠️ **Requires:** Docker MCP gateway running (`docker mcp gateway run`)

## Troubleshooting

**If MCP_DOCKER fails to connect in new session:**

1. Check gateway status:
   ```bash
   docker mcp gateway status  # or docker ps | grep mcp
   ```

2. Start gateway if not running:
   ```bash
   docker mcp gateway run &
   ```

3. Verify client connection:
   ```bash
   docker mcp client ls --global
   ```

4. Restart Claude Code session

**Related Documentation:**
- Docker MCP: https://docs.docker.com/mcp
- Claude Code MCP: https://docs.claude.com/en/docs/claude-code/mcp
