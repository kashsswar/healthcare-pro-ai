@echo off
title Production Setup - Cloud Database
color 0A

echo ========================================
echo    Production Setup - Cloud Database
echo    No Local MongoDB Installation Needed
echo ========================================
echo.

echo [STEP 1] Go to: https://www.mongodb.com/atlas
echo [STEP 2] Create FREE account
echo [STEP 3] Create FREE cluster (M0 Sandbox)
echo [STEP 4] Get connection string
echo [STEP 5] Update .env file below
echo.

echo Creating production .env file...
echo NODE_ENV=production> .env
echo PORT=5000>> .env
echo MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/healthcare-pro>> .env
echo JWT_SECRET=healthcare_pro_jwt_secret_2024>> .env
echo.>> .env
echo # Update this with your MongoDB Atlas connection string>> .env
echo # Format: mongodb+srv://username:password@cluster.mongodb.net/healthcare-pro>> .env

echo.
echo ✅ .env file created!
echo.
echo 📝 NEXT STEPS:
echo 1. Open .env file
echo 2. Replace MONGODB_URI with your Atlas connection string
echo 3. Run: npm install
echo 4. Run: node setup.js
echo 5. Run: npm start
echo.
echo 🌐 MongoDB Atlas is FREE and works from any laptop!
pause