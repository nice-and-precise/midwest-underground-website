@echo off
echo ================================================
echo Midwest Underground - Development Environment
echo ================================================
echo.
echo Starting services...
echo.

REM Start Redis container
echo [1/2] Starting Redis...
docker start wms-redis >nul 2>&1
if %errorlevel% equ 0 (
    echo   ✓ Redis started successfully
) else (
    echo   ✗ Redis failed to start
    echo   Run: docker ps -a to check container status
)

echo.
echo [2/2] Checking Docker Desktop...
docker ps >nul 2>&1
if %errorlevel% equ 0 (
    echo   ✓ Docker is running
) else (
    echo   ✗ Docker Desktop is not running
    echo   Please start Docker Desktop first
    pause
    exit /b 1
)

echo.
echo ================================================
echo Environment Ready!
echo ================================================
echo.
echo Next steps:
echo   1. Open Claude Code
echo   2. Navigate to this project
echo   3. MCP_DOCKER will auto-connect
echo.
echo Services running:
docker ps --format "  - {{.Names}} ({{.Status}})"
echo.
pause
