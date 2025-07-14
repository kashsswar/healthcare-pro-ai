@echo off
title HealthCare Pro - Go Live Now
color 0B

echo.
echo ========================================
echo    HealthCare Pro - Go Live Now
echo    Deploy to Railway in 10 Minutes
echo ========================================
echo.

echo Opening Railway in Chrome...
start chrome https://railway.app
echo.

echo GitHub is already open in Chrome - follow these steps:
echo.
echo STEP 1: Create Repository
echo 1. Click New button green button
echo 2. Repository name: healthcare-pro-ai
echo 3. Make it PRIVATE recommended for business
echo 4. Click Create repository
echo.

echo STEP 2: Upload Files REQUIRED FOR LIVE APP
echo 1. Click uploading an existing file
echo 2. Drag and drop ALL these files:
echo    - server.js main app
echo    - server-without-db.js backup server
echo    - package.json dependencies
echo    - Procfile deployment config
echo    - client folder ENTIRE folder - React app
echo    - All component files needed for live app
echo.
echo WARNING: Do not upload .env files we will set secrets in Railway
echo.

echo STEP 3: Commit Files
echo 1. Scroll down
echo 2. Commit message: HealthCare Pro - Production Ready
echo 3. Click Commit changes
echo.

echo STEP 4: Get Repository URL
echo Copy the repository URL
echo.
set /p repo_url="Paste your GitHub repository URL here: "
echo.
echo Repository created: %repo_url%
echo.

echo STEP 5: Deploy on Railway
echo 1. Railway will open in Chrome
echo 2. Click Start a New Project
echo 3. Select Deploy from GitHub repo
echo 4. Choose your repository: healthcare-pro-ai
echo 5. Click Deploy Now
echo.

echo STEP 6: Set Environment Variables in Railway
echo After deployment starts, add these in Railway dashboard:
echo - NODE_ENV: production
echo - MONGODB_URI: mongodb://localhost:27017/healthcare_pro
echo - JWT_SECRET: healthcare_pro_jwt_secret_2024_super_secure
echo - ADMIN_SECRET_KEY: HEALTH_ADMIN_SECRET_2024
echo - OPENAI_API_KEY: mock-openai-key-for-production
echo - EMAIL_HOST: smtp.gmail.com
echo - EMAIL_PORT: 587
echo - EMAIL_USER: kashsswar@gmail.com
echo - EMAIL_PASS: DoctorHexaware@2025
echo - EMAIL_MOCK_MODE: false
echo.

echo YOUR APP WILL BE LIVE AT: https://yourapp.railway.app
echo ADMIN ACCESS: https://yourapp.railway.app/secret-admin-portal-2024
echo.
echo Ready to go live and start earning 20 percent commission!
echo.
pause