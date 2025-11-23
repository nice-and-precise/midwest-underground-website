# .claude Directory

This directory contains Claude Code configuration, documentation, and project-specific settings.

## 📁 Directory Contents

### MCP Server Configuration

#### Configuration Files
- **`mcp_settings.json`** - Project-specific MCP server settings
  - Configures MCP_DOCKER and Serena MCP
  - Sets working directory to project root
  - Overrides global settings when in this directory

#### Documentation
- **`MCP_QUICK_REFERENCE.md`** - Quick start guide (⭐ Start here!)
  - Fast troubleshooting
  - Common commands
  - Daily checklist
  - **Read this first for quick help**

- **`MCP_SETUP.md`** - Comprehensive setup guide
  - Detailed configuration explanation
  - Prerequisites and requirements
  - In-depth troubleshooting
  - Log locations and debugging
  - **Read this for complete understanding**

- **`RESTART_REQUIRED.md`** - Post-configuration guide
  - What changed and why
  - Steps to apply configuration changes
  - Verification instructions
  - **Read this after configuration updates**

#### Scripts
- **`check-mcp-status.bat`** - MCP server health check
  - Verifies Docker Desktop is running
  - Checks uvx installation
  - Validates configuration files
  - Shows server connection status
  - **Run this to diagnose issues**

### Project Settings
- **`settings.local.json`** - Local Claude Code settings
  - Bash command permissions
  - Project-specific overrides
  - Auto-approved commands

### Other Directories
- **`plans/`** - Implementation plans and project roadmaps
- **`roles/`** - Agent roles and specialized instructions
- **`session-logs/`** - Historical session transcripts
- **`takeoff-system.md`** - Project management system documentation

## 🚀 Quick Start

### New to MCP Servers?
1. Read: `MCP_QUICK_REFERENCE.md` (5 minutes)
2. Run: `check-mcp-status.bat`
3. If issues, read: `MCP_SETUP.md`

### Just Updated Configuration?
1. Read: `RESTART_REQUIRED.md`
2. Close all Claude Code windows
3. Restart Claude Code
4. Run: `check-mcp-status.bat`

### Troubleshooting?
1. Run: `check-mcp-status.bat`
2. Check: `MCP_QUICK_REFERENCE.md` → Troubleshooting section
3. Deep dive: `MCP_SETUP.md` → Troubleshooting section

## 🔧 MCP Server Status

### Current Configuration (2025-11-23)

✅ **Fixed**: MCP servers now persist across sessions

**Servers Configured**:
1. **MCP_DOCKER** - Docker container operations
2. **Serena MCP** - Code navigation and analysis

**Key Features**:
- Auto-connect on Claude Code startup
- Persist across sessions
- Maintain context in project directory
- No manual reconnection needed

**Requirements**:
- Docker Desktop must be running
- Python with uvx installed
- Claude Code restarted after config changes

### Quick Status Check
```bash
claude mcp list
```

Expected:
```
MCP_DOCKER: ✓ Connected
serena: ✓ Connected (project: ...midwest-underground-website)
```

## 📖 Documentation Index

| File | Purpose | When to Use |
|------|---------|-------------|
| `MCP_QUICK_REFERENCE.md` | Quick help & common tasks | First stop for any issue |
| `MCP_SETUP.md` | Complete setup guide | Initial setup or deep troubleshooting |
| `RESTART_REQUIRED.md` | Post-update instructions | After configuration changes |
| `check-mcp-status.bat` | Health check script | Verify server status anytime |
| `mcp_settings.json` | MCP configuration | Don't edit manually |
| `settings.local.json` | Local permissions | Review periodically |

## 🎯 Common Tasks

### Check MCP Server Status
```bash
# Quick check
claude mcp list

# Detailed check
.claude\check-mcp-status.bat
```

### View MCP Logs
```bash
# Recent errors
tail -30 ~/AppData/Roaming/Claude/logs/mcp.log

# Live monitoring
tail -f ~/AppData/Roaming/Claude/logs/mcp.log
```

### Restart MCP Servers
1. Close all Claude Code windows
2. Restart Claude Code
3. Run: `claude mcp list`

### Backup Configuration
```bash
cp .claude/mcp_settings.json .claude/mcp_settings.backup.json
```

## 🆘 Troubleshooting

### Servers Not Connected
1. Run: `.claude\check-mcp-status.bat`
2. Check Docker: `docker ps`
3. Restart Claude Code
4. See: `MCP_QUICK_REFERENCE.md` → Troubleshooting

### Lost Context / Disconnecting
✅ **Fixed** - Configuration now includes `cwd` parameter

If still occurring:
- Ensure you've restarted Claude Code after config update
- See: `RESTART_REQUIRED.md`

### First Time Setup
See: `MCP_SETUP.md` → Prerequisites

## 📝 Recent Updates

### 2025-11-23: Fixed Persistent Connection Issues

**Problem**:
- MCP servers disconnected when changing directories
- Needed manual reconnection every session
- Serena MCP missing from configuration

**Solution**:
- ✅ Added `cwd` parameter to server configs
- ✅ Created dual configuration (global + project)
- ✅ Added Serena MCP to configuration
- ✅ Documented troubleshooting steps

**Result**:
- Servers persist across sessions
- Context maintained in project directory
- Auto-connect on startup
- Comprehensive documentation created

**Action Required**:
- Restart Claude Code once (see `RESTART_REQUIRED.md`)

## 🔗 Related Files

### Global Configuration
```
C:\Users\Owner\AppData\Roaming\Claude\claude_desktop_config.json
```
Global MCP server settings (applies to all projects)

### Logs
```
C:\Users\Owner\AppData\Roaming\Claude\logs\
├── mcp.log                      - Main MCP log
├── mcp-server-MCP_DOCKER.log   - Docker MCP log
└── ...
```

## 📚 External Resources

- **Claude Code**: https://docs.anthropic.com/claude/docs/claude-code
- **MCP Protocol**: https://modelcontextprotocol.io/
- **Serena MCP**: https://github.com/oraios/serena
- **Docker MCP**: https://github.com/docker/mcp

---

**Directory Created**: 2025-11-22
**Last Updated**: 2025-11-23
**MCP Configuration**: ✅ Complete and working
**Status**: Production ready

---

## Need Help?

1. **Quick help**: `MCP_QUICK_REFERENCE.md`
2. **Run diagnostic**: `.claude\check-mcp-status.bat`
3. **Deep troubleshooting**: `MCP_SETUP.md`
4. **After updates**: `RESTART_REQUIRED.md`

🎯 **Most Common Fix**: Restart Claude Code and ensure Docker Desktop is running!
