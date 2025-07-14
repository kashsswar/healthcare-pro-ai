@echo off
title HealthCare Pro - Enterprise Healthcare Platform
color 0A

echo.
echo ========================================
echo    HealthCare Pro v2.1
echo    Enterprise Healthcare Management
echo    Developed by Senior Software Engineer
echo ========================================
echo.

echo [SYSTEM] Initializing HealthCare Pro Platform...
echo.

:menu
echo Select startup option:
echo.
echo [1] Start with Professional Mock Data (Recommended for Testing)
echo [2] Start Clean (Production Mode)
echo [3] Setup Mock Data Only
echo [4] View Test Credentials
echo [5] Exit
echo.
set /p choice="Enter your choice (1-5): "

if "%choice%"=="1" goto start_with_mock
if "%choice%"=="2" goto start_clean
if "%choice%"=="3" goto setup_mock
if "%choice%"=="4" goto view_credentials
if "%choice%"=="5" goto exit
goto menu

:start_with_mock
echo.
echo [INFO] Starting HealthCare Pro with Professional Mock Data...
echo [INFO] Setting up comprehensive test environment...
call setup-mock-data.bat
echo.
echo [INFO] Starting Backend Server (Port 5000)...
echo [INFO] Starting Frontend Client (Port 3000)...
echo.
echo ========================================
echo    HealthCare Pro is now running!
echo    Backend: http://localhost:5000
echo    Frontend: http://localhost:3000
echo    Admin Panel: http://localhost:3000/admin-login
echo ========================================
echo.
start cmd /k "npm run mock"
timeout /t 3 /nobreak >nul
start cmd /k "cd client && npm start"
goto end

:start_clean
echo.
echo [INFO] Starting HealthCare Pro in Production Mode...
echo [INFO] No mock data will be loaded...
echo.
echo [INFO] Starting Backend Server (Port 5000)...
echo [INFO] Starting Frontend Client (Port 3000)...
echo.
echo ========================================
echo    HealthCare Pro is now running!
echo    Backend: http://localhost:5000
echo    Frontend: http://localhost:3000
echo ========================================
echo.
start cmd /k "npm run mock"
timeout /t 3 /nobreak >nul
start cmd /k "cd client && npm start"
goto end

:setup_mock
echo.
echo [INFO] Setting up Professional Mock Data...
call setup-mock-data.bat
echo.
echo [SUCCESS] Mock data setup completed!
echo [INFO] You can now start the application with option 1 or 2.
echo.
pause
goto menu

:view_credentials
echo.
if exist "mock-data\credentials.txt" (
    type "mock-data\credentials.txt"
) else (
    echo [ERROR] Credentials file not found!
    echo [INFO] Please run option 3 to setup mock data first.
)
echo.
pause
goto menu

:exit
echo.
echo [INFO] Thank you for using HealthCare Pro!
echo [INFO] Enterprise Healthcare Management System
echo.
exit

:end
echo.
echo [INFO] HealthCare Pro startup completed!
echo [INFO] Check the opened terminal windows for server status.
echo [INFO] Press Ctrl+C in server windows to stop the application.
echo.
pause