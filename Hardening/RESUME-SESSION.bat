@echo off
echo ========================================
echo  RESUME AUTONOMOUS SESSION
echo  Midwest Underground Platform Hardening
echo ========================================
echo.

cd /d "C:\Users\Owner\Desktop\midwest-underground-website"

echo Starting Claude Code to resume previous session...
echo.

claude --dangerously-skip-permissions -p "Read Serena memory 'session_progress' to see where we left off. Then read CLAUDE.md and TASK.md. Continue the Platform Hardening plan from the last checkpoint. Verify MCP connections first with /mcp."
