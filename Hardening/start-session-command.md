# Start Session Protocol

Execute these steps in order:

## 1. Verify MCP Connections
Run `/mcp` and confirm these are connected:
- Serena (or serena-mcp) 
- MCP_DOCKER (optional)

If disconnected, run `/mcp reconnect` (may need twice).

## 2. Load Context from Serena
```
read_memory("session_progress")
read_memory("blockers")
```

## 3. Verify Git State
```bash
git status
git branch
git log --oneline -5
```

## 4. Verify Tests Pass
```bash
npm run test -- --run
```

## 5. Report Ready State
After completing above, report:
- Current branch
- Last commit
- Test status
- Next task from TASK.md

Then begin executing the next task autonomously.
