@echo off
title HealthCare Pro - Cloud Deployment
color 0B

echo.
echo ========================================
echo    HealthCare Pro - Cloud Deployment
echo    Deploy to Heroku in 5 Minutes
echo ========================================
echo.

echo [INFO] This will deploy your app to Heroku cloud platform
echo Your app will be live at: https://your-healthcare-app.herokuapp.com
echo.

echo [STEP 1/8] Installing Heroku CLI...
choco install heroku-cli -y
refreshenv

echo.
echo [STEP 2/8] Login to Heroku...
echo Please login to your Heroku account in the browser
heroku login

echo.
echo [STEP 3/8] Creating Heroku app...
set /p app_name="Enter your app name (e.g., healthcare-pro-2024): "
if "%app_name%"=="" set app_name=healthcare-pro-%random%

heroku create %app_name%

echo.
echo [STEP 4/8] Setting up MongoDB Atlas (Cloud Database)...
echo Opening MongoDB Atlas signup...
start https://cloud.mongodb.com/
echo.
echo Please:
echo 1. Create free MongoDB Atlas account
echo 2. Create a cluster (free tier)
echo 3. Get connection string
echo.
set /p mongo_uri="Enter MongoDB Atlas connection string: "

echo.
echo [STEP 5/8] Configuring Heroku environment variables...
heroku config:set NODE_ENV=production --app %app_name%
heroku config:set MONGODB_URI="%mongo_uri%" --app %app_name%
heroku config:set JWT_SECRET=healthcare_pro_jwt_secret_2024_super_secure --app %app_name%
heroku config:set ADMIN_SECRET_KEY=HEALTH_ADMIN_SECRET_2024 --app %app_name%
heroku config:set OPENAI_API_KEY=mock-openai-key-for-production --app %app_name%
heroku config:set EMAIL_HOST=smtp.gmail.com --app %app_name%
heroku config:set EMAIL_PORT=587 --app %app_name%
heroku config:set EMAIL_USER=kashsswar@gmail.com --app %app_name%
heroku config:set EMAIL_PASS=DoctorHexaware@2025 --app %app_name%
heroku config:set EMAIL_MOCK_MODE=false --app %app_name%

echo.
echo [STEP 6/8] Creating Procfile for Heroku...
echo web: node server.js> Procfile

echo.
echo [STEP 7/8] Preparing for deployment...
REM Initialize git if not already done
git init
git add .
git commit -m "Production ready for Heroku deployment"

echo.
echo [STEP 8/8] Deploying to Heroku...
git push heroku main

echo.
echo ========================================
echo    DEPLOYMENT COMPLETED!
echo ========================================
echo.
echo 🌐 Your app is live at:
echo https://%app_name%.herokuapp.com
echo.
echo 🔐 Admin access:
echo https://%app_name%.herokuapp.com/secret-admin-portal-2024
echo.
echo 📊 Admin credentials:
echo Username: superadmin2024
echo Password: MyHealthApp@2024!
echo Secret: HEALTH_ADMIN_SECRET_2024
echo.
echo 💰 Your 20%% commission system is now live!
echo Start onboarding doctors and earning money!
echo.
pause