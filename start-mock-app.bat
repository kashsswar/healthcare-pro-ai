@echo off
title HealthCare Pro - Mock Development Server
color 0A

echo.
echo ========================================
echo    HealthCare Pro - Mock Development
echo    Testing with Mock Data
echo ========================================
echo.

echo [INFO] Starting HealthCare Pro with mock data...
echo.

echo [STEP 1/3] Setting up mock data...
if exist "quick-test-setup.bat" (
    call quick-test-setup.bat
) else (
    echo Mock data setup not found, using default mock data...
)

echo.
echo [STEP 2/3] Starting backend server (Mock Mode)...
echo Backend will run on: http://localhost:5000
echo Setting environment variables...
set OPENAI_API_KEY=mock-openai-key-for-development
start "HealthCare Pro Backend" cmd /k "set OPENAI_API_KEY=mock-openai-key-for-development && nodemon server-without-db.js"

echo.
echo [STEP 3/3] Starting frontend client...
echo Frontend will run on: http://localhost:3000
echo Setting frontend environment...
echo REACT_APP_API_URL=http://localhost:5000> client\.env
timeout /t 3 /nobreak >nul
start "HealthCare Pro Frontend" cmd /k "cd client && npm start"

echo.
echo ========================================
echo    HealthCare Pro Mock App Started!
echo ========================================
echo.
echo 🌐 URLs:
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5000
echo Admin:    http://localhost:3000/secret-admin-portal-2024
echo.
echo 🔑 Test Credentials:
echo.
echo ADMIN ACCESS:
echo Username: superadmin2024
echo Password: MyHealthApp@2024!
echo Secret:   HEALTH_ADMIN_SECRET_2024
echo.
echo DOCTOR LOGIN:
echo Email:    dr.rajesh@healthcarepro.com
echo Password: doctor123
echo.
echo PATIENT LOGIN:
echo Email:    amit.singh@email.com
echo Password: patient123
echo.
echo 💡 Note: Using MOCK backend - no real database needed
echo All data is temporary and resets on server restart
echo.
pause