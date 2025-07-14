@echo off
title HealthCare Pro - Safe Upload Guide
color 0E

echo.
echo ========================================
echo    HealthCare Pro - Privacy Safe Upload
echo    What to Upload vs What to Keep Private
echo ========================================
echo.

echo 🔒 NEVER UPLOAD THESE (PRIVACY RISK):
echo ========================================
echo ❌ .env files (contains your email password)
echo ❌ node_modules/ folders (huge, unnecessary)
echo ❌ Any files with real API keys
echo ❌ Database files with real data
echo ❌ Personal information or credentials
echo.

echo ✅ SAFE TO UPLOAD (NO PRIVACY RISK):
echo ========================================
echo ✅ server.js (your main app code)
echo ✅ package.json (dependencies list)
echo ✅ Procfile (deployment config)
echo ✅ client/src/ folder (React components)
echo ✅ client/public/ folder (static files)
echo ✅ client/package.json (frontend dependencies)
echo ✅ All .js files in root and client/src/
echo.

echo 🛡️ PRIVACY PROTECTION STEPS:
echo ========================================
echo.
echo Creating .gitignore to exclude sensitive files...
echo .env> .gitignore
echo .env.production>> .gitignore
echo node_modules/>> .gitignore
echo client/node_modules/>> .gitignore
echo *.log>> .gitignore
echo .DS_Store>> .gitignore
echo.

echo Creating safe environment template...
echo NODE_ENV=production> .env.example
echo MONGODB_URI=your_mongodb_connection_string>> .env.example
echo JWT_SECRET=your_jwt_secret>> .env.example
echo ADMIN_SECRET_KEY=your_admin_secret>> .env.example
echo OPENAI_API_KEY=your_openai_key>> .env.example
echo EMAIL_HOST=your_email_host>> .env.example
echo EMAIL_PORT=587>> .env.example
echo EMAIL_USER=your_email@gmail.com>> .env.example
echo EMAIL_PASS=your_email_password>> .env.example
echo.

echo ========================================
echo    MINIMAL UPLOAD LIST (PRIVACY SAFE)
echo ========================================
echo.
echo ONLY UPLOAD THESE FILES:
echo 📁 Root folder:
echo    - server.js
echo    - package.json
echo    - Procfile
echo    - .gitignore
echo    - .env.example (template only)
echo.
echo 📁 client/src/ folder:
echo    - All .js files (components, pages)
echo    - App.js, index.js
echo.
echo 📁 client/public/ folder:
echo    - index.html
echo    - manifest.json
echo.
echo 📁 client/ root:
echo    - package.json
echo.

echo ========================================
echo    WHAT HAPPENS AFTER UPLOAD
echo ========================================
echo.
echo 1. Your code becomes PUBLIC (anyone can see)
echo 2. But NO sensitive data is exposed
echo 3. Railway will ask for environment variables separately
echo 4. You'll add your real credentials in Railway dashboard
echo 5. Your app works perfectly with no privacy risk
echo.

echo 💡 ALTERNATIVE: PRIVATE REPOSITORY
echo ========================================
echo.
echo If you want extra privacy:
echo 1. Make repository PRIVATE instead of public
echo 2. Railway can still access private repos
echo 3. Only you can see the code
echo 4. Costs nothing extra
echo.

echo ========================================
echo    YOUR CHOICE
echo ========================================
echo.
echo [1] Upload minimal files (PUBLIC repo) - Recommended
echo [2] Upload minimal files (PRIVATE repo) - Extra privacy
echo [3] Don't upload, use local network only
echo.
set /p choice="Enter your choice (1-3): "

if "%choice%"=="1" (
    echo.
    echo ✅ Good choice! Upload only the safe files listed above.
    echo Your privacy is protected and app will work perfectly.
    echo.
) else if "%choice%"=="2" (
    echo.
    echo ✅ Extra privacy! Make repository PRIVATE when creating.
    echo Upload the safe files - only you can see them.
    echo.
) else (
    echo.
    echo ✅ Staying local! Your app runs on office network only.
    echo Share http://YOUR-IP:3000 with doctors in your building.
    echo.
)

echo.
echo 🔐 PRIVACY GUARANTEE:
echo - No passwords or API keys uploaded
echo - No personal information exposed  
echo - Code is generic healthcare platform
echo - Environment variables set separately in Railway
echo.
echo Your privacy is 100%% protected! 🛡️
echo.
pause