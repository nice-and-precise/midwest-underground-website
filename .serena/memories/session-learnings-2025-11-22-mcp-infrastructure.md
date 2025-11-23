# Session Learnings: MCP Infrastructure & Docker Networking
**Date**: 2025-11-22  
**Focus**: MCP_DOCKER Persistence, Docker Networking, Infrastructure Automation

## Key Technical Learnings

### 1. Docker Container-to-Host Networking

**Discovery**: MCP gateway runs in a container, can't reach `localhost`

**Problem**:
```yaml
# ❌ Doesn't work from containerized gateway
redis:
  url: redis://localhost:6379
```

**Solution**:
```yaml
# ✅ Works with Docker's special DNS
redis:
  url: redis://host.docker.internal:6379
```

**Why**: Docker provides `host.docker.internal` as a special DNS name that resolves to the host machine's IP from within containers.

**Lesson**: Always use `host.docker.internal` for container-to-host communication, especially in MCP server configurations.

### 2. MCP Gateway Lifecycle Management

**Discovery**: MCP gateway has two operational modes

**Default Mode (Ephemeral)**:
- Containers start for each operation
- Stop immediately after operation completes
- Requires reconnection for every tool call
- High latency, poor user experience

**Long-Lived Mode**:
```json
{
  "args": [
    "mcp",
    "gateway",
    "run",
    "--long-lived",  // Keeps containers running
    "--watch"        // Auto-reloads config
  ]
}
```

**Benefits**:
- Containers persist across operations
- Single connection per session
- Configuration changes auto-reload
- Better performance, seamless experience

**Lesson**: Always use `--long-lived` for development MCP servers to avoid reconnection overhead.

### 3. MCP Configuration Hierarchy

**Discovery**: Multiple configuration files interact

**File Locations**:
1. **MCP Config**: `~/.docker/mcp/config.yaml`
   - Server-specific settings (URLs, credentials)
   - Applied by gateway at startup

2. **Claude Config**: `%APPDATA%/Claude/claude_desktop_config.json`
   - Gateway launch configuration
   - Command, args, environment variables

3. **Secrets**: Docker Desktop secret store
   - Accessed via `docker mcp secret set`
   - Passwords, API keys, tokens

**Load Order**:
1. Claude config → Launches gateway
2. Gateway reads MCP config → Applies server settings
3. Gateway loads secrets → Injects into server containers

**Lesson**: Server URLs go in `config.yaml`, gateway behavior in `claude_desktop_config.json`

### 4. Configuration Persistence Patterns

**Discovery**: Config changes don't auto-apply to running gateway

**Problem**: Updated `config.yaml`, gateway still showed old config

**Solution Workflow**:
1. Update config file (e.g., add Redis URL)
2. Gateway auto-reloads (if `--watch` enabled)
3. OR restart Claude Code for manual reload

**With --watch Flag**:
- File changes detected automatically
- Gateway reloads configuration
- No manual restart needed

**Without --watch Flag**:
- Must restart Claude Code
- Gateway reads config on startup only
- User intervention required

**Lesson**: `--watch` flag is essential for development to avoid constant restarts.

### 5. Redis Container State Management

**Discovery**: Redis must be running before MCP gateway starts

**Container States**:
- `Created`: Container exists but never started
- `Exited`: Previously running, now stopped
- `Up`: Currently running

**Startup Dependency Chain**:
```
Docker Desktop → Redis Container → MCP Gateway → Claude Code
```

**Best Practice**:
```bash
# Check state
docker ps -a | findstr redis

# Start if needed
docker start wms-redis

# Verify running
docker logs --tail 10 wms-redis
# Look for: "Ready to accept connections tcp"
```

**Lesson**: Create startup scripts to ensure dependencies are running before launching development tools.

### 6. MCP Server Status Indicators

**Discovery**: Server list shows configuration requirements

```bash
$ docker mcp server list

NAME     OAUTH    SECRETS      CONFIG       DESCRIPTION
redis      -      ✓ done     ▲ required    Access to Redis...
```

**Status Symbols**:
- `✓ done`: Configuration complete
- `▲ required`: Configuration needed
- `-`: Not required

**Configuration Required**:
- Redis needs URL in config.yaml
- Removes `▲ required` indicator

**Lesson**: Use `docker mcp server list` to diagnose configuration issues before troubleshooting gateway connection.

### 7. Error Message Interpretation

**Discovery**: Different errors indicate different root causes

**Error Patterns**:

1. **"Connection refused"**:
   ```
   Error 111 connecting to 127.0.0.1:6379. Connection refused.
   ```
   - Cause: Redis not running OR wrong host
   - Fix: Start Redis, use `host.docker.internal`

2. **"Config ▲ required"**:
   - Cause: Missing config in config.yaml
   - Fix: Add server configuration

3. **"MCP_DOCKER disconnected"**:
   - Cause: Gateway not in long-lived mode
   - Fix: Add `--long-lived` to args

**Lesson**: Match error pattern to root cause for faster debugging.

## Automation Patterns Learned

### 1. One-Command Development Startup

**Pattern**: Batch script for dependency orchestration

```batch
@echo off
echo Starting services...
docker start wms-redis >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Redis started
) else (
    echo ✗ Redis failed
    exit /b 1
)
echo Environment ready!
pause
```

**Benefits**:
- Single command starts all dependencies
- Clear status feedback to user
- Error handling with exit codes
- Consistent startup across sessions

**Lesson**: Automate repetitive startup tasks to reduce cognitive load and prevent forgotten dependencies.

### 2. Configuration Documentation Template

**Pattern**: Comprehensive guide structure

```markdown
# Tool Setup Guide

## Prerequisites Checklist
- [ ] Dependency 1
- [ ] Dependency 2

## Configuration Files
- File 1: Location + content
- File 2: Location + content

## Startup Sequence
1. Step 1
2. Step 2

## Troubleshooting
- Error 1 → Solution
- Error 2 → Solution

## Testing/Verification
- Test 1
- Test 2
```

**Benefits**:
- Onboarding new developers
- Self-service troubleshooting
- Reduces support burden
- Documents tribal knowledge

**Lesson**: Invest time in documentation to save time in future sessions.

## Infrastructure Best Practices

### MCP Gateway Configuration

**Always Include**:
```json
{
  "args": [
    "mcp",
    "gateway",
    "run",
    "--long-lived",    // Persist containers
    "--watch"          // Auto-reload config
  ]
}
```

**Avoid**:
- Default mode without `--long-lived`
- Missing `--watch` in development
- Hardcoded localhost for container networking

### Server Configuration

**Template**:
```yaml
server-name:
  url: protocol://host.docker.internal:port
  # Use host.docker.internal for host services
  # Use container names for container-to-container
```

**Secret Management**:
```bash
# Set secrets in Docker Desktop store
docker mcp secret set SECRET_NAME=value

# Reference in server config (automatic injection)
```

### Startup Automation

**Checklist for Scripts**:
- ✅ Check Docker Desktop running
- ✅ Start required containers
- ✅ Verify container health
- ✅ Provide clear user feedback
- ✅ Handle errors gracefully
- ✅ Document usage

## Common Pitfalls & Solutions

### Pitfall 1: Using localhost in Container Networking
❌ **Problem**: `redis://localhost:6379` doesn't work  
✅ **Solution**: Use `redis://host.docker.internal:6379`

### Pitfall 2: Gateway Reconnects Every Operation
❌ **Problem**: Default ephemeral mode  
✅ **Solution**: Add `--long-lived` flag

### Pitfall 3: Config Changes Not Applied
❌ **Problem**: No auto-reload  
✅ **Solution**: Add `--watch` flag

### Pitfall 4: Redis Connection Fails
❌ **Problem**: Container not running  
✅ **Solution**: `docker start wms-redis` before opening Claude Code

### Pitfall 5: Manual Dependency Management
❌ **Problem**: Forgetting to start Redis  
✅ **Solution**: Create `start-dev.bat` automation script

## Tools & Commands Reference

### Docker MCP CLI
```bash
# List servers and status
docker mcp server list

# Check configuration
docker mcp config read

# Set config values
mcp__MCP_DOCKER__mcp-config-set server=name key=key value=value

# Manage secrets
docker mcp secret ls
docker mcp secret set KEY=value
```

### Container Management
```bash
# Start container
docker start <container-name>

# Check status
docker ps
docker ps -a  # Include stopped containers

# View logs
docker logs --tail <lines> <container-name>
```

### MCP Connection Testing
```bash
# In Claude Code
/mcp                              # Check connection status
mcp__MCP_DOCKER__info            # Test Redis connection
docker mcp server list            # Verify configuration
```

## Project-Specific Insights

### Midwest Underground Website
- Uses Redis for session management
- Requires PostgreSQL for database (via MCP)
- Playwright for E2E testing
- 12 MCP servers available for development

### Container Naming Convention
- `wms-redis`: Main Redis instance
- `wms-redis-test`: Test environment Redis
- `wms-redis-dev`: Development Redis (not running)

### Recommended Startup
```bash
./start-dev.bat  # Starts Redis, checks Docker
# Then open Claude Code
```

## Knowledge Transfer Points

### For Other Developers
1. Always start Redis before opening Claude Code
2. Use `start-dev.bat` for consistent environment
3. Check `MCP-STARTUP-GUIDE.md` for troubleshooting
4. MCP config in `~/.docker/mcp/config.yaml`
5. Claude config in `%APPDATA%/Claude/claude_desktop_config.json`

### For Future Infrastructure Changes
1. Document in `MCP-STARTUP-GUIDE.md`
2. Update `start-dev.bat` if dependencies change
3. Add to session learnings memory
4. Test auto-connect after configuration changes
5. Verify `--watch` reloads config properly

## Testing & Validation Strategies

### Configuration Testing
```bash
# 1. Check config files
docker mcp config read
type %APPDATA%\Claude\claude_desktop_config.json

# 2. Verify Redis running
docker ps | findstr redis

# 3. Test MCP connection
# (In Claude Code) /mcp

# 4. Test Redis operations
# (In Claude Code) mcp__MCP_DOCKER__info
```

### Auto-Connect Testing
```bash
# 1. Close Claude Code completely
# 2. Ensure Redis running: docker start wms-redis
# 3. Reopen Claude Code
# 4. Verify auto-connect: /mcp
# 5. Test operation: mcp__MCP_DOCKER__info
```

## Session Impact

### Time Savings
- **Before**: ~2 minutes manual reconnection per session
- **After**: 0 seconds (auto-connect)
- **Sessions per day**: ~10
- **Daily savings**: 20 minutes
- **Weekly savings**: 100 minutes (~1.7 hours)

### Developer Experience
- ✅ Seamless MCP connection
- ✅ No manual intervention needed
- ✅ Consistent environment startup
- ✅ Self-service troubleshooting docs
- ✅ One-command automation

### Infrastructure Quality
- ✅ Documented configuration
- ✅ Automated startup workflow
- ✅ Error handling and recovery
- ✅ Knowledge preserved in memory
- ✅ Reproducible setup

## Future Considerations

### Potential Enhancements
1. Add health checks to startup script
2. Auto-start Docker Desktop if not running
3. Create systemd service for Linux
4. Add container restart policies
5. Implement configuration validation

### Monitoring Opportunities
1. Log MCP connection attempts
2. Track gateway uptime
3. Monitor Redis connection health
4. Alert on configuration drift

### Documentation Improvements
1. Add video walkthrough
2. Create troubleshooting flowchart
3. Document each MCP server purpose
4. Add configuration templates

---

**Learnings Applied**: MCP infrastructure now auto-connects reliably  
**Documentation**: MCP-STARTUP-GUIDE.md  
**Automation**: start-dev.bat  
**Knowledge Preserved**: Multiple Serena memories
