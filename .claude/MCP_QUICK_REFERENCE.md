# MCP Servers - Quick Reference

## 🚀 Quick Start

### First Time Setup
1. Ensure Docker Desktop is running
2. Close all Claude Code windows
3. Restart Claude Code
4. Navigate to project: `cd "C:\Users\Owner\Desktop\midwest-underground-website"`
5. Verify: `claude mcp list`

### Every Session
✅ **Automatic** - MCP servers now connect automatically!

Just ensure Docker Desktop is running before starting Claude Code.

## 📊 Server Status

### Check Status
```bash
claude mcp list
```

### Expected Output
```
✓ MCP_DOCKER: Connected
✓ serena: Connected (project: ...midwest-underground-website)
```

### If Disconnected
1. Check Docker: `docker ps`
2. Restart Claude Code
3. Run: `.claude\check-mcp-status.bat`

## 🛠️ Troubleshooting

| Problem | Solution |
|---------|----------|
| MCP_DOCKER disconnected | Start Docker Desktop |
| Serena disconnected | Check `uvx --version` |
| Servers lose context | ✅ Fixed - config has `cwd` parameter |
| Need to reconnect each session | ✅ Fixed - restart Claude Code once |

## 📁 Configuration Files

### Global Config
```
C:\Users\Owner\AppData\Roaming\Claude\claude_desktop_config.json
```
Loaded when Claude Code starts

### Project Config
```
.claude\mcp_settings.json
```
Loaded when working in this directory

## 🔍 Logs

### View Recent Errors
```bash
# MCP_DOCKER logs
tail -30 ~/AppData/Roaming/Claude/logs/mcp-server-MCP_DOCKER.log

# Main MCP logs
tail -30 ~/AppData/Roaming/Claude/logs/mcp.log
```

### Live Monitoring
```bash
tail -f ~/AppData/Roaming/Claude/logs/mcp.log
```

## ✅ Verification Script

Run anytime to check server health:
```bash
.claude\check-mcp-status.bat
```

Checks:
- Docker Desktop running
- uvx installed
- Config files exist
- Server connection status

## 📚 Detailed Documentation

- **Setup & Troubleshooting**: `.claude\MCP_SETUP.md`
- **After Config Update**: `.claude\RESTART_REQUIRED.md`
- **This Guide**: `.claude\MCP_QUICK_REFERENCE.md`

## 🎯 Common Tasks

### Restart MCP Servers
```bash
# Close all Claude Code windows
# Restart Claude Code
claude mcp list
```

### Update Serena MCP
Auto-updates from GitHub on each connection.

Force check:
```bash
uvx --from git+https://github.com/oraios/serena serena --version
```

### Backup Configuration
```bash
# Global
cp ~/AppData/Roaming/Claude/claude_desktop_config.json backup.json

# Project
cp .claude/mcp_settings.json .claude/backup.json
```

## 🔧 Manual Testing

### Test MCP_DOCKER
In Claude Code: "List running Docker containers"

### Test Serena MCP
In Claude Code: "Find all HTML files in this project"

## 💡 Pro Tips

1. **Enable Docker auto-start**:
   - Docker Desktop → Settings → General
   - ✓ "Start Docker Desktop when you log in"

2. **First command after restart**:
   ```bash
   claude mcp list
   ```
   Should show both servers connected

3. **When changing projects**:
   - MCP servers persist
   - Context switches to new project directory
   - No reconnection needed

## 📋 Checklist

Before starting work each day:
- [ ] Docker Desktop is running (`docker ps`)
- [ ] MCP servers connected (`claude mcp list`)
- [ ] In project directory (`pwd`)

## 🆘 Get Help

1. Run verification: `.claude\check-mcp-status.bat`
2. Check logs: `tail -30 ~/AppData/Roaming/Claude/logs/mcp.log`
3. Review: `.claude\MCP_SETUP.md`
4. Restart Claude Code

---

**Last Updated**: 2025-11-23
**Status**: ✅ Configured and working
**Next Review**: When upgrading Claude Code

---

## Recent Changes (2025-11-23)

### What Was Fixed
- ✅ Servers now persist across sessions
- ✅ No context loss when changing directories
- ✅ Serena MCP added to configuration
- ✅ Both servers have proper working directory

### What You Need to Do
1. Restart Claude Code (one time)
2. Verify: `claude mcp list`
3. Both servers should be ✓ Connected

### What's Automatic Now
- MCP servers load on Claude Code startup
- Connection persists across sessions
- Context maintained in project directory
- No manual reconnection needed

🎉 **Just restart Claude Code once and you're all set!**
