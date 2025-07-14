@echo off
title HealthCare Pro - Heroku Deployment
color 0B

echo.
echo ========================================
echo    HealthCare Pro - Heroku Deploy
echo    Go Live in 3 Minutes
echo ========================================
echo.

echo [STEP 1/5] Installing Heroku CLI...
choco install heroku-cli -y
refreshenv

echo.
echo [STEP 2/5] Login to Heroku...
heroku login

echo.
echo [STEP 3/5] Creating Heroku app...
set /p app_name="Enter your app name (e.g., healthcare-pro-2024): "
if "%app_name%"=="" set app_name=healthcare-pro-%random%

heroku create %app_name%

echo.
echo [STEP 4/5] Setting Heroku environment variables...
heroku config:set NODE_ENV=production --app %app_name%
heroku config:set MONGODB_URI=mongodb://localhost:27017/healthcare_pro --app %app_name%
heroku config:set JWT_SECRET=healthcare_pro_jwt_secret_2024_super_secure --app %app_name%
heroku config:set ADMIN_SECRET_KEY=HEALTH_ADMIN_SECRET_2024 --app %app_name%
heroku config:set OPENAI_API_KEY=mock-openai-key-for-production --app %app_name%
heroku config:set EMAIL_HOST=smtp.gmail.com --app %app_name%
heroku config:set EMAIL_PORT=587 --app %app_name%
heroku config:set EMAIL_USER=kashsswar@gmail.com --app %app_name%
heroku config:set EMAIL_PASS=DoctorHexaware@2025 --app %app_name%
heroku config:set EMAIL_MOCK_MODE=false --app %app_name%

echo.
echo [STEP 5/5] Deploying to Heroku...
git init
git add .
git commit -m "Deploy HealthCare Pro to Heroku"
git push heroku main

echo.
echo ========================================
echo    🚀 DEPLOYMENT COMPLETED!
echo ========================================
echo.
echo 🌐 Your app is LIVE at:
echo https://%app_name%.herokuapp.com
echo.
echo 🔐 Secret admin access:
echo https://%app_name%.herokuapp.com/secret-admin-portal-2024
echo.
echo 👑 Admin credentials:
echo Username: superadmin2024
echo Password: MyHealthApp@2024!
echo Secret: HEALTH_ADMIN_SECRET_2024
echo.
echo 💰 Your 20%% commission system is now live!
echo Start onboarding doctors and earning money globally!
echo.
echo Opening your live app...
start https://%app_name%.herokuapp.com
echo.
pause