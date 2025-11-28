@echo off
echo ========================================
echo  AUTONOMOUS CLAUDE CODE LAUNCHER
echo  Midwest Underground Platform Hardening
echo ========================================
echo.
echo WARNING: This runs Claude Code with FULL PERMISSIONS
echo It will execute commands without asking for confirmation.
echo.
echo Press Ctrl+C to cancel, or
pause

cd /d "C:\Users\Owner\Desktop\midwest-underground-website"

echo.
echo Starting Claude Code in FULLY AUTONOMOUS mode...
echo.

claude --dangerously-skip-permissions -p "Read CLAUDE.md and TASK.md. Execute the Midwest Underground Platform Hardening plan autonomously. Start by: 1) Verify MCP connections with /mcp, 2) Check Serena memory for any previous progress, 3) Begin Branch 1: feat/prisma-migrations if starting fresh, or continue from where we left off. Follow all rules in CLAUDE.md. Work continuously until the branch is complete or context reaches 75%."
