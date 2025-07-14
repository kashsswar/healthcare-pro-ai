@echo off
title HealthCare Pro - Production Server
color 0A

echo ========================================
echo    HealthCare Pro - Production Server
echo    Enterprise Healthcare Platform
echo ========================================
echo.
echo [INFO] Starting production services...
echo.

echo [1/3] Starting MongoDB service...
net start MongoDB >nul 2>nul
if errorlevel 1 (
    echo [WARNING] MongoDB service may already be running
) else (
    echo [SUCCESS] MongoDB service started
)

echo [2/3] Setting production environment...
set NODE_ENV=production
echo [SUCCESS] Environment set to production

echo [3/3] Starting HealthCare Pro server...
echo.
echo ========================================
echo    Server Information
echo ========================================
echo Backend: http://localhost:5000
echo Frontend: Build and serve from client/build
echo Admin Panel: /secret-admin-portal-2024
echo Database: MongoDB (localhost:27017)
echo ========================================
echo.
echo [INFO] Server starting... Press Ctrl+C to stop
node server.js
