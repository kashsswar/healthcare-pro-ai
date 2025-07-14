@echo off
title HealthCare Pro - Quick Setup
color 0A

echo ========================================
echo    HealthCare Pro - Quick Setup
echo    One-Click Installation
echo ========================================
echo.

echo [INFO] This will automatically:
echo ✅ Install MongoDB Community Server
echo ✅ Install all dependencies
echo ✅ Create sample data (10 doctors + 1 patient)
echo ✅ Start the application
echo.
echo Press any key to start setup...
pause >nul

echo.
echo [1/4] Installing MongoDB...
call auto-install-mongodb.bat

echo.
echo [2/4] Installing backend dependencies...
call npm install

echo.
echo [3/4] Installing frontend dependencies...
cd client && call npm install && cd ..

echo.
echo [4/4] Starting the application...
echo.
echo ========================================
echo    HealthCare Pro is Ready!
echo ========================================
echo.
echo 🌐 Frontend: http://localhost:3000
echo 🔧 Backend: http://localhost:5000
echo 👑 Admin: http://localhost:3000/secret-admin-portal-2024
echo.
echo 📋 Test Accounts:
echo Patient: patient@test.com / password123
echo Doctor: sarah.johnson@healthconnect.com / password123
echo.
echo Starting servers...
start "Backend Server" cmd /k "npm run dev"
timeout /t 3 /nobreak >nul
start "Frontend Server" cmd /k "cd client && npm start"

echo.
echo ✅ Setup Complete! Both servers are starting...
echo Check the opened windows for server status.
pause