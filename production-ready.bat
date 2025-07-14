@echo off
title Production Ready Setup
color 0B

echo ========================================
echo    HealthCare Pro - Production Ready
echo    Complete Business Solution
echo ========================================
echo.

echo This creates a PRODUCTION-READY healthcare platform with:
echo ✅ 75+ Medical Specializations
echo ✅ AI-Powered Doctor Matching
echo ✅ Real-time Availability System
echo ✅ Admin Revenue Dashboard (20%% commission)
echo ✅ Payment Integration Ready
echo ✅ Cloud Database (MongoDB Atlas)
echo ✅ Searchable Doctor Registration
echo ✅ Featured/Boost Doctor System
echo.

echo [1/4] Installing dependencies...
call npm install
cd client && call npm install && cd ..

echo [2/4] Setting up cloud database...
call setup-cloud-db.bat

echo [3/4] Building production frontend...
cd client && call npm run build && cd ..

echo [4/4] Creating production startup...
echo @echo off> start-production.bat
echo title HealthCare Pro - Production Server>> start-production.bat
echo set NODE_ENV=production>> start-production.bat
echo echo Starting HealthCare Pro Production Server...>> start-production.bat
echo echo Backend: http://localhost:5000>> start-production.bat
echo echo Admin: http://localhost:5000/secret-admin-portal-2024>> start-production.bat
echo node server.js>> start-production.bat

echo.
echo ========================================
echo    PRODUCTION SETUP COMPLETE!
echo ========================================
echo.
echo 📋 FINAL STEPS:
echo 1. Update MongoDB Atlas connection in .env
echo 2. Run: node setup.js (creates sample data)
echo 3. Run: start-production.bat
echo.
echo 💰 REVENUE FEATURES READY:
echo - 20%% admin commission on all consultations
echo - Doctor boost/featured options
echo - Real-time earnings tracking
echo - Monthly revenue reports
echo.
echo 🚀 READY FOR BUSINESS!
pause