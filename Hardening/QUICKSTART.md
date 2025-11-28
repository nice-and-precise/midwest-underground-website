# 🚀 QUICKSTART: Fully Autonomous Claude Code

## Setup (One-Time, ~2 minutes)

### Step 1: Copy Files to Your Project
Copy these files to `C:\Users\Owner\Desktop\midwest-underground-website\`:

```
TASK.md          → project root
CLAUDE.md        → project root
.claude/         → project root (creates .claude/commands/ folder)
```

The .bat files can stay on your Desktop or wherever convenient.

### Step 2: Verify Claude Code Installed
Open terminal and run:
```bash
claude --version
```
If not installed: `npm install -g @anthropic-ai/claude-code`

---

## Launch Options

### Option A: Fresh Start (First Time)
Double-click `START-AUTONOMOUS.bat`

Or manually in terminal:
```bash
cd C:\Users\Owner\Desktop\midwest-underground-website
claude --dangerously-skip-permissions -p "Read CLAUDE.md and TASK.md. Execute Platform Hardening plan. Start with /mcp to verify MCP, then begin Branch 1."
```

### Option B: Resume Previous Session
Double-click `RESUME-SESSION.bat`

Or manually:
```bash
cd C:\Users\Owner\Desktop\midwest-underground-website
claude --dangerously-skip-permissions -p "Read Serena memory 'session_progress' and continue from last checkpoint."
```

### Option C: Interactive Start (Safer)
```bash
cd C:\Users\Owner\Desktop\midwest-underground-website
claude
```
Then type: `/project:start-session`

---

## What Happens

Claude will:
1. ✅ Verify MCP servers connected (Serena)
2. ✅ Read the task plan
3. ✅ Execute tasks one by one
4. ✅ Run tests after each change
5. ✅ Commit after each task
6. ✅ Manage its own context (compact when needed)
7. ✅ Save progress to Serena memory
8. ✅ Complete entire branches autonomously

---

## Commands to Know

Inside Claude Code:
- `/mcp` - Check MCP server status
- `/compact` - Compress context when running low
- `/project:start-session` - Run startup protocol
- `/project:end-session` - Run shutdown protocol
- `/exit` or `Ctrl+C` - Exit Claude Code

---

## If Something Goes Wrong

### MCP Not Connected
```
/mcp
/mcp reconnect
```
May need to run reconnect twice.

### Tests Failing
Claude should fix them, but if stuck:
```bash
npm run test -- --run
```
Check output and guide Claude.

### Context Too Full
Claude auto-compacts, but you can force:
```
/compact
```

### Need to Stop
`Ctrl+C` to interrupt, work is saved via git commits.

---

## Progress Tracking

- Each task commits to git (recoverable checkpoints)
- Serena memory stores session state
- Branch completion merges to main

Check progress:
```bash
git log --oneline -20
```

---

## That's It!

1. Copy files to project ✓
2. Run START-AUTONOMOUS.bat ✓
3. Watch it work ✓
