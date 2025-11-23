# MCP_DOCKER Startup Guide

## Problem Solved
This guide ensures MCP_DOCKER automatically connects when you start Claude Code, eliminating the "disconnected" error every session.

## Prerequisites Checklist

### 1. Docker Desktop Running
```bash
docker --version
# Should return: Docker version 29.0.1 or similar
```

### 2. Redis Container Running
```bash
# Start Redis container
docker start wms-redis

# Verify it's running
docker ps | findstr redis
# Should show: wms-redis with status "Up"
```

### 3. MCP Configuration Complete

**Redis Configuration** (`C:\Users\Owner\.docker\mcp\config.yaml`):
```yaml
redis:
  url: redis://host.docker.internal:6379
```

**Claude Code Configuration** (`C:\Users\Owner\AppData\Roaming\Claude\claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "MCP_DOCKER": {
      "command": "docker",
      "args": [
        "mcp",
        "gateway",
        "run",
        "--long-lived",
        "--watch"
      ],
      "env": {
        "LOCALAPPDATA": "C:\\Users\\Owner\\AppData\\Local",
        "ProgramData": "C:\\ProgramData",
        "ProgramFiles": "C:\\Program Files"
      }
    }
  }
}
```

## Startup Sequence

### Every Time You Start Working on This Project

1. **Start Docker Desktop** (if not already running)

2. **Start Redis Container**:
   ```bash
   docker start wms-redis
   ```

3. **Start Claude Code**:
   - The MCP_DOCKER gateway will automatically start
   - With `--long-lived` and `--watch` flags, it persists across sessions
   - Connection will be maintained until you close Claude Code

4. **Verify MCP Connection**:
   ```bash
   /mcp
   ```
   Should show: "Reconnected to MCP_DOCKER" or "Connected to MCP_DOCKER"

## Available MCP Servers (12 Total)

| Server | Status | Purpose |
|--------|--------|---------|
| **redis** | ✓ Configured | Cache operations, session storage |
| **postgres** | ✓ Configured | Database access (WMS project) |
| **dockerhub** | ✓ Configured | Docker image management |
| **git** | ✓ Configured | Git operations |
| **filesystem** | ✓ Configured | File system access |
| **context7** | ✓ Available | Code documentation lookup |
| **docker** | ✓ Available | Docker CLI operations |
| **memory** | ✓ Available | Knowledge graph memory |
| **playwright** | ✓ Available | Browser automation |
| **sequentialthinking** | ✓ Available | Problem-solving workflows |
| **tavily** | ✓ Configured | Web research |
| **mcp-code-interpreter** | ✓ Available | Python execution |

## Testing MCP Connection

Run these commands to verify everything works:

```bash
# Test Redis connection
docker mcp server list
# Redis should show: ✓ done for SECRETS and CONFIG

# Test Redis operations (via Claude Code)
# Ask Claude: "Check Redis connection with mcp__MCP_DOCKER__info"
```

## Troubleshooting

### Error: "MCP_DOCKER disconnected"

**Solution**: Restart Claude Code
- Close Claude Code completely
- Ensure `docker start wms-redis` is running
- Reopen Claude Code

### Error: "Redis config ▲ required"

**Solution**: Check config file
```bash
# View current config
docker mcp config read

# Should include:
# redis:
#   url: redis://host.docker.internal:6379
```

If missing, run:
```bash
# From Claude Code
mcp__MCP_DOCKER__mcp-config-set server=redis key=url value=redis://host.docker.internal:6379
```

### Error: "Connection refused to Redis"

**Solutions**:
1. Check Redis is running:
   ```bash
   docker ps | findstr redis
   ```

2. Restart Redis:
   ```bash
   docker restart wms-redis
   ```

3. Check Redis logs:
   ```bash
   docker logs --tail 20 wms-redis
   ```
   Should show: "Ready to accept connections tcp"

### Gateway Not Persisting

**Solution**: Verify `--long-lived` flag in Claude config
- Check `C:\Users\Owner\AppData\Roaming\Claude\claude_desktop_config.json`
- Ensure args include `--long-lived` and `--watch`

## Key Configuration Changes Made

1. **Added Redis URL**: `redis://host.docker.internal:6379`
   - Uses Docker's internal networking
   - Avoids localhost connection issues from containerized gateway

2. **Enabled Long-Lived Mode**: `--long-lived`
   - Keeps MCP server containers running
   - Prevents reconnection on every operation

3. **Enabled Auto-Reload**: `--watch`
   - Automatically picks up config changes
   - No manual gateway restarts needed

## Integration with Midwest Underground Website Project

This MCP setup supports:
- **Database Operations**: Access PostgreSQL for user data
- **Cache Management**: Redis for session caching
- **Testing**: Playwright for E2E browser tests
- **Research**: Tavily for content research
- **Code Analysis**: Context7 for library documentation

## One-Command Startup Script

Create `start-dev.bat` in project root:
```batch
@echo off
echo Starting Midwest Underground Development Environment...
docker start wms-redis
echo Redis started
echo.
echo Ready! Open Claude Code to continue.
pause
```

Usage:
```bash
./start-dev.bat
```

## Status Verification

Run this in Claude Code to confirm everything:
```
Check:
1. docker ps (Redis should be Up)
2. /mcp (Should show "Reconnected to MCP_DOCKER")
3. docker mcp server list (Redis config should be ✓ done)
```

## Next Session Startup

**Quick Start**:
1. `docker start wms-redis`
2. Open Claude Code
3. Navigate to project: `cd C:\Users\Owner\Desktop\midwest-underground-website`
4. Start working!

The MCP_DOCKER gateway will automatically connect and all 12 servers will be available.

---

**Configuration Files Updated**:
- ✅ `C:\Users\Owner\.docker\mcp\config.yaml`
- ✅ `C:\Users\Owner\AppData\Roaming\Claude\claude_desktop_config.json`

**Last Updated**: 2025-11-22
