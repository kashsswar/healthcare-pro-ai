@echo off
title MongoDB Status Checker
color 0A

echo Checking MongoDB status...
echo.

echo [1] Checking MongoDB service...
sc query MongoDB >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ MongoDB service exists
    net start MongoDB >nul 2>&1
    if %errorlevel% == 0 (
        echo ✅ MongoDB service started
    ) else (
        echo ⚠️ MongoDB service already running
    )
) else (
    echo ❌ MongoDB service not found
    echo Run: install-mongodb.bat
    pause
    exit
)

echo.
echo [2] Testing database connection...
node setup.js

echo.
echo [3] Starting application...
echo Backend: npm run dev
echo Frontend: cd client && npm start
pause