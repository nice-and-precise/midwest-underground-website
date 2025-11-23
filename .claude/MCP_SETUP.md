# MCP Server Setup & Troubleshooting

## Overview

This project uses two MCP (Model Context Protocol) servers:
1. **MCP_DOCKER** - Docker MCP Gateway for container operations
2. **Serena MCP** - IDE-optimized code assistant and navigation

## Configuration Files

### Global Configuration
- **Location**: `C:\Users\Owner\AppData\Roaming\Claude\claude_desktop_config.json`
- **Purpose**: MCP servers available globally across all Claude Code sessions
- **Auto-loaded**: Yes, when Claude Code starts

### Project Configuration
- **Location**: `.claude/mcp_settings.json` (this directory)
- **Purpose**: Project-specific MCP settings that override global config
- **Working Directory**: Always set to project root (`C:\Users\Owner\Desktop\midwest-underground-website`)

## Current Configuration

Both configurations include:

```json
{
  "mcpServers": {
    "MCP_DOCKER": {
      "command": "docker",
      "args": ["mcp", "gateway", "run", "--long-lived", "--watch"],
      "cwd": "C:\\Users\\Owner\\Desktop\\midwest-underground-website",
      "env": {
        "LOCALAPPDATA": "C:\\Users\\Owner\\AppData\\Local",
        "ProgramData": "C:\\ProgramData",
        "ProgramFiles": "C:\\Program Files"
      }
    },
    "serena": {
      "command": "C:\\Users\\Owner\\AppData\\Local\\Programs\\Python\\Python312\\Scripts\\uvx.exe",
      "args": [
        "--from", "git+https://github.com/oraios/serena",
        "serena", "start-mcp-server",
        "--context", "ide-assistant",
        "--project", "C:\\Users\\Owner\\Desktop\\midwest-underground-website"
      ],
      "cwd": "C:\\Users\\Owner\\Desktop\\midwest-underground-website",
      "env": {}
    }
  }
}
```

## Key Features

### MCP_DOCKER
- **Flags**:
  - `--long-lived`: Keeps connection alive across sessions
  - `--watch`: Monitors for changes and reconnects automatically
- **Requirements**: Docker Desktop must be running
- **Working Directory**: Project root

### Serena MCP
- **Context**: `ide-assistant` for optimal code navigation
- **Project Path**: Points to project root
- **Working Directory**: Project root
- **Auto-updates**: Pulls latest from GitHub on startup

## Prerequisites

### 1. Docker Desktop
**Status Check**:
```bash
docker ps
```

If you see an error, Docker Desktop is not running. Start it:
- **Windows**: Start menu → Docker Desktop
- **Auto-start**: Docker Desktop Settings → General → "Start Docker Desktop when you log in"

### 2. Python with uvx
**Status Check**:
```bash
uvx --version
```

If not found, install:
```bash
pip install uv
```

## Troubleshooting

### Issue: MCP servers disconnect when changing directories

**Solution**: ✅ **FIXED** - Both configurations now include `"cwd"` parameter set to project root

The `cwd` parameter ensures servers maintain context regardless of your current working directory.

### Issue: MCP_DOCKER fails to connect

**Symptoms**:
- Error: "Docker Desktop is not running"
- Log shows: "Server transport closed unexpectedly"

**Solutions**:
1. **Start Docker Desktop**:
   ```bash
   # Check if running
   docker ps

   # If not running, start Docker Desktop manually
   # Windows: Start menu → Docker Desktop
   ```

2. **Enable auto-start**:
   - Open Docker Desktop
   - Settings → General
   - Check "Start Docker Desktop when you log in"

3. **Check logs**:
   ```bash
   cat ~/AppData/Roaming/Claude/logs/mcp-server-MCP_DOCKER.log
   ```

### Issue: Serena MCP fails to connect

**Symptoms**:
- Serena tools not available
- Connection timeout

**Solutions**:
1. **Verify uvx installation**:
   ```bash
   which uvx
   # Should show: /c/Users/Owner/AppData/Local/Programs/Python/Python312/Scripts/uvx
   ```

2. **Test Serena manually**:
   ```bash
   uvx --from git+https://github.com/oraios/serena serena start-mcp-server --help
   ```

3. **Check Python environment**:
   ```bash
   python --version
   # Should be Python 3.12+
   ```

### Issue: Servers connect but lose context

**Solution**: ✅ **FIXED** - Working directory now set in config

Previously, servers would lose context when changing directories. The `cwd` parameter in both configurations ensures they always operate in the project root.

### Issue: Need to reconnect every new session

**Solution**: ✅ **FIXED** - Dual configuration approach

1. **Global config** (`claude_desktop_config.json`): Loaded on Claude Code startup
2. **Project config** (`.claude/mcp_settings.json`): Loaded when navigating to project
3. **Flags**: `--long-lived` and `--watch` keep connections persistent

## Verification

After configuring, verify both servers are connected:

```bash
claude mcp list
```

Expected output:
```
MCP_DOCKER: docker mcp gateway run - ✓ Connected
serena: uvx --from git+https://github.com/oraios/serena serena start-mcp-server --context ide-assistant --project C:\Users\Owner\Desktop\midwest-underground-website - ✓ Connected
```

## Testing MCP Servers

### Test MCP_DOCKER
Ask Claude Code to:
- List Docker containers: Uses `mcp__MCP_DOCKER__*` tools
- Execute Docker commands
- Manage container secrets

### Test Serena MCP
Ask Claude Code to:
- Find files by symbol: Uses `mcp__serena__find_symbol`
- Search code patterns: Uses `mcp__serena__search_for_pattern`
- Navigate codebase: Uses `mcp__serena__get_symbols_overview`

## Log Locations

- **MCP_DOCKER**: `C:\Users\Owner\AppData\Roaming\Claude\logs\mcp-server-MCP_DOCKER.log`
- **Main MCP**: `C:\Users\Owner\AppData\Roaming\Claude\logs\mcp.log`
- **Claude Logs**: `C:\Users\Owner\AppData\Roaming\Claude\logs\`

## Manual Restart

If servers get stuck, restart Claude Code:
1. Close all Claude Code windows
2. Restart Claude Code
3. Verify connection: `claude mcp list`

## Changes Made

### 2025-11-23 - Fixed Persistent Connection Issues

**Problem**:
- MCP servers required manual reconnection every new session
- Servers lost context when changing to project directory
- Serena MCP configuration was missing from config files

**Solution**:
1. ✅ Added `cwd` parameter to both MCP servers pointing to project root
2. ✅ Added Serena MCP to global configuration (`claude_desktop_config.json`)
3. ✅ Created project-specific configuration (`.claude/mcp_settings.json`)
4. ✅ Configured MCP_DOCKER with `--long-lived` and `--watch` flags
5. ✅ Set proper working directory for both servers
6. ✅ Documented startup requirements and troubleshooting

**Result**:
- ✅ Servers persist across sessions
- ✅ Context maintained when changing directories
- ✅ Auto-reconnect on session start
- ✅ No manual intervention required

## Maintenance

### Update Serena MCP
Serena auto-updates from GitHub on each connection. To force update:
```bash
uvx --from git+https://github.com/oraios/serena serena --version
```

### Update MCP_DOCKER
Docker MCP updates through Docker Desktop updates.

### Backup Configuration
```bash
# Global config
cp ~/AppData/Roaming/Claude/claude_desktop_config.json ~/claude_desktop_config.backup.json

# Project config
cp .claude/mcp_settings.json .claude/mcp_settings.backup.json
```

## Support

- **Claude Code Docs**: https://docs.anthropic.com/claude/docs/claude-code
- **MCP Protocol**: https://modelcontextprotocol.io/
- **Serena MCP**: https://github.com/oraios/serena
- **Docker MCP**: https://github.com/docker/mcp

## Quick Reference

| Command | Purpose |
|---------|---------|
| `claude mcp list` | Check server status |
| `docker ps` | Verify Docker Desktop running |
| `uvx --version` | Verify uvx installed |
| `tail -f ~/AppData/Roaming/Claude/logs/mcp.log` | Watch MCP logs |

---

**Last Updated**: 2025-11-23
**Status**: ✅ All issues resolved
**Next Review**: When upgrading Claude Code or Docker Desktop
