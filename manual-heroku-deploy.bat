@echo off
title HealthCare Pro - Manual Heroku Deploy
color 0B

echo.
echo ========================================
echo    HealthCare Pro - Manual Deploy
echo    Step-by-Step Instructions
echo ========================================
echo.

echo STEP 1: Install Heroku CLI manually
echo ========================================
echo 1. Go to: https://devcenter.heroku.com/articles/heroku-cli
echo 2. Download Heroku CLI installer
echo 3. Install and restart command prompt
echo.

echo STEP 2: Fix Git repository
echo ========================================
echo Run these commands one by one:
echo.
echo del .git\index.lock
echo git init
echo git add .
echo git commit -m "Deploy to Heroku"
echo.

echo STEP 3: Deploy to Heroku
echo ========================================
echo Run these commands after installing Heroku CLI:
echo.
echo heroku login
echo heroku create your-app-name
echo git push heroku main
echo.

echo STEP 4: Set environment variables
echo ========================================
echo heroku config:set NODE_ENV=production
echo heroku config:set MONGODB_URI=mongodb://localhost:27017/healthcare_pro
echo heroku config:set JWT_SECRET=healthcare_pro_jwt_secret_2024_super_secure
echo heroku config:set ADMIN_SECRET_KEY=HEALTH_ADMIN_SECRET_2024
echo heroku config:set OPENAI_API_KEY=mock-openai-key-for-production
echo heroku config:set EMAIL_HOST=smtp.gmail.com
echo heroku config:set EMAIL_PORT=587
echo heroku config:set EMAIL_USER=kashsswar@gmail.com
echo heroku config:set EMAIL_PASS=DoctorHexaware@2025
echo heroku config:set EMAIL_MOCK_MODE=false
echo.

echo ========================================
echo    ALTERNATIVE: Use GitHub Pages
echo ========================================
echo.
echo If Heroku is too complex, you can use GitHub:
echo 1. Create GitHub account
echo 2. Create new repository
echo 3. Upload your project files
echo 4. Enable GitHub Pages
echo 5. Your app will be live at: username.github.io/repo-name
echo.

echo ========================================
echo    OR: Use Local Network Access
echo ========================================
echo.
echo To make your local app accessible to others:
echo 1. Find your IP address: ipconfig
echo 2. Share your IP with doctors: http://YOUR-IP:3000
echo 3. Configure Windows Firewall to allow port 3000
echo 4. Start your app: start-mock-app.bat
echo.

echo Your app will be accessible to anyone on your network!
echo Doctors can register and patients can book appointments.
echo.
pause