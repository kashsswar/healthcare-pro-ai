@echo off
title HealthCare Pro - Fix and Start
color 0A

echo.
echo ========================================
echo    HealthCare Pro - Fix and Start
echo    Fixing Environment Issues
echo ========================================
echo.

echo [STEP 1/4] Stopping any running servers...
taskkill /f /im node.exe >nul 2>nul
taskkill /f /im nodemon.exe >nul 2>nul

echo.
echo [STEP 2/4] Creating correct environment files...
echo REACT_APP_API_URL=http://localhost:5000> client\.env
echo GENERATE_SOURCEMAP=false>> client\.env

echo PORT=5000> .env
echo MONGODB_URI=mongodb://localhost:27017/healthcare_pro>> .env
echo JWT_SECRET=healthcare_pro_jwt_secret_2024_super_secure>> .env
echo ADMIN_SECRET_KEY=HEALTH_ADMIN_SECRET_2024>> .env
echo OPENAI_API_KEY=mock-openai-key-for-development>> .env
echo EMAIL_HOST=smtp.gmail.com>> .env
echo EMAIL_PORT=587>> .env
echo EMAIL_USER=kashsswar@gmail.com>> .env
echo EMAIL_PASS=DoctorHexaware@2025>> .env
echo EMAIL_MOCK_MODE=true>> .env
echo CLIENT_URL=http://localhost:3000>> .env

echo.
echo [STEP 3/4] Starting backend server...
echo Backend: http://localhost:5000
start "Backend Server" cmd /k "nodemon server-without-db.js"

echo.
echo [STEP 4/4] Waiting and starting frontend...
timeout /t 5 /nobreak >nul
echo Frontend: http://localhost:3000
start "Frontend Client" cmd /k "cd client && npm start"

echo.
echo ========================================
echo    HealthCare Pro Started Successfully!
echo ========================================
echo.
echo 🌐 URLs:
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5000
echo Admin:    http://localhost:3000/secret-admin-portal-2024
echo.
echo 🔑 Test Credentials:
echo Patient: patient@test.com / password123
echo Doctor:  doctor@test.com / password123
echo Admin:   admin@test.com / admin123
echo.
echo ✅ Environment files created
echo ✅ Backend server started
echo ✅ Frontend client started
echo.
echo Wait for both servers to fully start, then test login!
pause