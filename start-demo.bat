@echo off
title HealthCare Pro - Demo Mode
color 0A

echo ========================================
echo    HealthCare Pro - Demo Mode
echo    No Database Required!
echo ========================================
echo.

echo [1/2] Starting backend server (demo mode)...
start "Backend Demo" cmd /k "node server-no-db.js"

echo [2/2] Starting frontend...
timeout /t 3 /nobreak >nul
cd client && start "Frontend" cmd /k "npm start"

echo.
echo ✅ Demo servers starting!
echo.
echo 🌐 Access: http://localhost:3000
echo 👤 Test Login: patient@test.com / password123
echo 👨‍⚕️ Doctor Login: sarah.johnson@healthconnect.com / password123
echo.
echo ℹ️ This demo works without MongoDB
echo 💾 Data is stored in memory (resets on restart)
echo.
pause