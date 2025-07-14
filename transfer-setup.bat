@echo off
title HealthCare Pro - Transfer Setup Guide
color 0C

echo.
echo ========================================
echo    HealthCare Pro - Transfer Setup
echo    Quick Setup for New Laptop/Server
echo ========================================
echo.

echo [INFO] This guide helps you transfer HealthCare Pro to a new laptop/server
echo.

echo STEP 1: Copy these files to new laptop:
echo ========================================
echo 📁 Copy entire project folder containing:
echo - All source code files
echo - complete-production-installer.bat
echo - package.json and package-lock.json
echo - client folder with all React files
echo - All .bat setup files
echo.

echo STEP 2: On new laptop, run this single command:
echo ========================================
echo complete-production-installer.bat
echo.
echo This will automatically install:
echo ✅ Node.js and npm
echo ✅ MongoDB Community Server
echo ✅ AWS CLI and S3 setup
echo ✅ SSL certificate tools
echo ✅ All dependencies
echo ✅ Production configuration
echo.

echo STEP 3: Manual configuration (5 minutes):
echo ========================================
echo 1. Update .env.production with your API keys:
echo    - OpenAI API key
echo    - Razorpay keys
echo    - Email credentials
echo.
echo 2. Run: start-production-server.bat
echo.
echo 3. Access your app:
echo    - Frontend: http://localhost:3000
echo    - Admin: http://localhost:3000/secret-admin-portal-2024
echo.

echo STEP 4: Go live (Optional):
echo ========================================
echo 1. Get a domain name
echo 2. Point DNS to your server IP
echo 3. Run: generate-ssl.bat
echo 4. Update DOMAIN in .env.production
echo.

echo ========================================
echo    TRANSFER CHECKLIST
echo ========================================
echo.
echo 📋 Files to copy:
echo [ ] Entire project folder
echo [ ] complete-production-installer.bat
echo [ ] All .bat files
echo [ ] package.json files
echo.
echo 🔧 On new laptop:
echo [ ] Run complete-production-installer.bat
echo [ ] Update API keys in .env.production
echo [ ] Run start-production-server.bat
echo [ ] Test admin login
echo.
echo 💰 Revenue system:
echo [ ] Admin panel accessible
echo [ ] 20%% commission tracking active
echo [ ] Doctor boost features working
echo [ ] Payment system configured
echo.
echo ========================================
echo.
echo 🚀 TOTAL SETUP TIME: 30 minutes
echo - 20 minutes: Automated installation
echo - 5 minutes: API key configuration
echo - 5 minutes: Testing and verification
echo.
echo Your HealthCare Pro platform will be ready to earn!
echo.
pause