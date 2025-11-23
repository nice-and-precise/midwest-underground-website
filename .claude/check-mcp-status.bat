@echo off
echo ========================================
echo MCP Server Status Check
echo ========================================
echo.

echo [1] Checking Docker Desktop...
docker ps >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Docker Desktop is running
) else (
    echo ✗ Docker Desktop is NOT running
    echo   Please start Docker Desktop and try again
    goto :error
)
echo.

echo [2] Checking uvx installation...
where uvx >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ uvx is installed
) else (
    echo ✗ uvx is NOT installed
    echo   Install with: pip install uv
    goto :error
)
echo.

echo [3] Checking Python version...
python --version
echo.

echo [4] Checking MCP server configuration...
if exist "%APPDATA%\Claude\claude_desktop_config.json" (
    echo ✓ Global MCP config exists
) else (
    echo ✗ Global MCP config NOT found
    goto :error
)
echo.

if exist ".claude\mcp_settings.json" (
    echo ✓ Project MCP config exists
) else (
    echo ✗ Project MCP config NOT found
    goto :error
)
echo.

echo [5] Checking MCP server status...
claude mcp list
echo.

echo ========================================
echo All checks passed!
echo ========================================
echo.
echo If servers show as disconnected:
echo 1. Close all Claude Code windows
echo 2. Restart Claude Code
echo 3. Run this script again to verify
echo.
goto :end

:error
echo.
echo ========================================
echo ✗ ERRORS DETECTED
echo ========================================
echo Please fix the issues above and try again.
echo See .claude\MCP_SETUP.md for troubleshooting.
echo.

:end
pause
