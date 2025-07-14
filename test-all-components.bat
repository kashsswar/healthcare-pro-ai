@echo off
title HealthCare Pro - Component Testing
color 0A

echo.
echo ========================================
echo    HealthCare Pro - Component Testing
echo    Testing All Frontend and Backend
echo ========================================
echo.

echo [INFO] Starting comprehensive component testing...
echo.

echo [STEP 1/6] Testing Backend Server...
echo Starting mock server for testing...
start "Test Server" cmd /k "nodemon server-without-db.js"
timeout /t 5 /nobreak >nul

echo.
echo [STEP 2/6] Testing Backend APIs...
echo Testing authentication endpoints...
curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"patient@test.com\",\"password\":\"password123\"}"
echo.
echo Testing doctor endpoints...
curl http://localhost:5000/api/doctors
echo.
echo Testing categories endpoint...
curl http://localhost:5000/api/doctors/categories
echo.

echo [STEP 3/6] Starting Frontend for Testing...
start "Test Frontend" cmd /k "cd client && npm start"
timeout /t 10 /nobreak >nul

echo.
echo [STEP 4/6] Opening Test URLs...
echo Testing main application...
start http://localhost:3000
timeout /t 2 /nobreak >nul

echo Testing login page...
start http://localhost:3000/login
timeout /t 2 /nobreak >nul

echo Testing register page...
start http://localhost:3000/register
timeout /t 2 /nobreak >nul

echo Testing doctors page...
start http://localhost:3000/doctors
timeout /t 2 /nobreak >nul

echo Testing admin panel...
start http://localhost:3000/secret-admin-portal-2024
timeout /t 2 /nobreak >nul

echo.
echo [STEP 5/6] Component Test Checklist...
echo.
echo FRONTEND COMPONENTS TO TEST:
echo [ ] Login Form - Enter: patient@test.com / password123
echo [ ] Register Form - Create new account
echo [ ] Doctor Categories - Click on different categories
echo [ ] Doctor List - View doctor profiles
echo [ ] Appointment Booking - Book a consultation
echo [ ] Payment Form - Test payment flow
echo [ ] Admin Panel - Login with admin@test.com / admin123
echo [ ] Doctor Boost - Test admin controls
echo [ ] Health Recommendations - Click refresh button
echo [ ] Voice Assistant - Say "doctor" or "headache"
echo [ ] Multi-language - Switch languages
echo [ ] Visual Health Alerts - Dismiss notifications
echo.

echo BACKEND APIS TO TEST:
echo [ ] POST /api/auth/login - User authentication
echo [ ] POST /api/auth/register - User registration
echo [ ] GET /api/doctors - Doctor list
echo [ ] GET /api/doctors/categories - Categories
echo [ ] POST /api/appointments/book - Booking
echo [ ] POST /api/admin/boost-doctor - Admin boost
echo [ ] POST /api/ai/health-recommendations - AI tips
echo [ ] GET /api/admin/stats - Admin analytics
echo.

echo [STEP 6/6] Manual Testing Instructions...
echo.
echo TEST SCENARIOS:
echo.
echo 1. PATIENT FLOW:
echo    - Register as new patient
echo    - Login with credentials
echo    - Browse doctor categories
echo    - Select a doctor
echo    - Book appointment
echo    - Make payment
echo    - Check appointment status
echo.
echo 2. DOCTOR FLOW:
echo    - Register as doctor
echo    - Set availability
echo    - Change location
echo    - View appointments
echo    - Update schedule
echo.
echo 3. ADMIN FLOW:
echo    - Access secret admin URL
echo    - Login with triple authentication
echo    - View dashboard analytics
echo    - Boost doctor ratings
echo    - Set first position
echo    - Monitor earnings
echo.
echo 4. AI FEATURES:
echo    - Get health recommendations
echo    - Use voice commands
echo    - Test symptom analysis
echo    - Multi-language support
echo.

echo ========================================
echo    TESTING ENVIRONMENT READY
echo ========================================
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo Admin: http://localhost:3000/secret-admin-portal-2024
echo.
echo TEST CREDENTIALS:
echo Patient: patient@test.com / password123
echo Doctor: doctor@test.com / password123
echo Admin: admin@test.com / admin123
echo.
echo SECRET ADMIN:
echo Username: superadmin2024
echo Password: MyHealthApp@2024!
echo Secret: HEALTH_ADMIN_SECRET_2024
echo.
echo Follow the checklist above to test each component!
echo Report any issues found during testing.
echo.
pause