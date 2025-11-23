# MCP Servers Configuration & Troubleshooting

Last Updated: 2025-11-23
Status: Active - Docker MCP Persistence Issue Being Addressed

## Active MCP Servers

| Server | Status | Purpose | Issues |
|--------|--------|---------|--------|
| Serena MCP | Working | Code navigation, semantic search | None |
| Docker MCP | Reconnect Required | Docker operations | Persistence issue |
| Browser MCP | Working | Browser automation | None |

## CRITICAL: Docker MCP Persistence Issue

### Problem
Docker MCP requires manual reconnection every Claude Code session.

Symptoms:
- /mcp command shows "Reconnected to MCP_DOCKER"
- Must run /mcp at start of every session
- Connection does not persist across restarts

### Solution Options

#### Option 1: Auto-Reconnect Script

Create .claude/startup.sh:

```bash
#!/bin/bash
echo "Reconnecting Docker MCP..."
if docker mcp list; then
    echo "Docker MCP connected"
else
    echo "Docker MCP connection failed"
fi
```

#### Option 2: Persistent Connection Config

Add to Claude Code settings:

```json
{
  "mcpServers": {
    "MCP_DOCKER": {
      "autoReconnect": true,
      "persistentConnection": true
    }
  }
}
```

## Serena MCP Configuration

### Status: WORKING

Active Project: midwest-underground-website
Location: C:\Users\Owner\Desktop\midwest-underground-website

### Available Memories (69 total)

Key memories:
- current-status (project at 93.5%)
- project-overview
- code-style-conventions
- tech-stack
- session-2025-11-23-module-1.3-completion

### Serena Capabilities

Code Navigation:
- Symbol-level search
- Semantic analysis
- Token-efficient reads

Memory Operations:
- write_memory - Store knowledge
- read_memory - Retrieve knowledge  
- edit_memory - Update memories
- list_memories - List all memories

## Troubleshooting

### Docker MCP Disconnects

Solution:
1. Implement auto-reconnect
2. Verify Docker daemon: docker ps
3. Check config: docker mcp list

### Serena Memory Not Loading

Solution:
- List memories: ls .serena/memories/
- Recreate if missing

## Quick Commands

Docker MCP:
- docker mcp list
- /mcp (manual reconnect)

Serena MCP:
- Use Serena tools for memory operations

Prepared by: Claude Code
Date: 2025-11-23
