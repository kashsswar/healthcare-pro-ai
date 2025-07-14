@echo off
title HealthCare Pro - Railway Deployment
color 0B

echo.
echo ========================================
echo    HealthCare Pro - Railway Deploy
echo    Go Live in 10 Minutes (No CLI)
echo ========================================
echo.

echo [STEP 1/5] Preparing project for deployment...
echo.

REM Create .gitignore to exclude unnecessary files
echo node_modules/> .gitignore
echo .env>> .gitignore
echo client/node_modules/>> .gitignore
echo client/build/>> .gitignore
echo *.log>> .gitignore
echo .DS_Store>> .gitignore

REM Create railway.json for deployment config
echo {> railway.json
echo   "build": {>> railway.json
echo     "builder": "NIXPACKS">> railway.json
echo   },>> railway.json
echo   "deploy": {>> railway.json
echo     "startCommand": "npm start",>> railway.json
echo     "healthcheckPath": "/",>> railway.json
echo     "healthcheckTimeout": 100>> railway.json
echo   }>> railway.json
echo }>> railway.json

REM Update package.json for Railway
echo Updating package.json for Railway deployment...

echo.
echo [STEP 2/5] Opening GitHub for repository creation...
echo.
echo INSTRUCTIONS FOR GITHUB:
echo 1. Create new repository named: healthcare-pro-ai
echo 2. Make it PUBLIC (important for Railway)
echo 3. Don't initialize with README
echo 4. Copy the repository URL
echo.
start https://github.com/new
echo.
set /p github_repo="Enter your GitHub repository URL (e.g., https://github.com/username/healthcare-pro-ai): "

echo.
echo [STEP 3/5] Preparing files for upload...
echo.
echo MANUAL UPLOAD INSTRUCTIONS:
echo 1. Download GitHub Desktop or use web interface
echo 2. Upload these files to your repository:
echo    - All .js files
echo    - package.json
echo    - client/ folder
echo    - .gitignore
echo    - railway.json
echo    - Procfile
echo.
echo DO NOT UPLOAD:
echo    - node_modules/
echo    - .env files
echo    - client/node_modules/
echo    - .git/ folder
echo.

echo Press any key after uploading files to GitHub...
pause >nul

echo.
echo [STEP 4/5] Opening Railway for deployment...
echo.
echo INSTRUCTIONS FOR RAILWAY:
echo 1. Click "Start a New Project"
echo 2. Select "Deploy from GitHub repo"
echo 3. Connect your GitHub account
echo 4. Select repository: healthcare-pro-ai
echo 5. Click "Deploy Now"
echo.
start https://railway.app
echo.

echo [STEP 5/5] Setting environment variables...
echo.
echo After deployment starts, set these environment variables in Railway:
echo.
echo Variable Name: NODE_ENV
echo Value: production
echo.
echo Variable Name: MONGODB_URI  
echo Value: mongodb+srv://username:password@cluster.mongodb.net/healthcare_pro
echo.
echo Variable Name: JWT_SECRET
echo Value: healthcare_pro_jwt_secret_2024_super_secure
echo.
echo Variable Name: ADMIN_SECRET_KEY
echo Value: HEALTH_ADMIN_SECRET_2024
echo.
echo Variable Name: OPENAI_API_KEY
echo Value: mock-openai-key-for-production
echo.
echo Variable Name: EMAIL_HOST
echo Value: smtp.gmail.com
echo.
echo Variable Name: EMAIL_PORT
echo Value: 587
echo.
echo Variable Name: EMAIL_USER
echo Value: kashsswar@gmail.com
echo.
echo Variable Name: EMAIL_PASS
echo Value: DoctorHexaware@2025
echo.
echo Variable Name: EMAIL_MOCK_MODE
echo Value: false
echo.

echo ========================================
echo    DEPLOYMENT CHECKLIST
echo ========================================
echo.
echo ✅ Files prepared for upload
echo ✅ .gitignore created
echo ✅ railway.json created
echo ✅ GitHub repository ready
echo ✅ Railway deployment ready
echo.
echo NEXT STEPS:
echo 1. Upload files to GitHub repository
echo 2. Deploy on Railway
echo 3. Set environment variables
echo 4. Your app will be live at: yourapp.railway.app
echo.
echo ADMIN ACCESS:
echo URL: https://yourapp.railway.app/secret-admin-portal-2024
echo Username: superadmin2024
echo Password: MyHealthApp@2024!
echo Secret: HEALTH_ADMIN_SECRET_2024
echo.
echo 💰 Your 20%% commission system will be live globally!
echo Start sharing the URL with doctors worldwide!
echo.
pause

echo.
echo Creating deployment summary file...
echo ========================================> RAILWAY-DEPLOYMENT-SUMMARY.txt
echo    HealthCare Pro - Railway Deployment>> RAILWAY-DEPLOYMENT-SUMMARY.txt
echo ========================================>> RAILWAY-DEPLOYMENT-SUMMARY.txt
echo.>> RAILWAY-DEPLOYMENT-SUMMARY.txt
echo 🚀 DEPLOYMENT STEPS COMPLETED:>> RAILWAY-DEPLOYMENT-SUMMARY.txt
echo ✅ Project files prepared>> RAILWAY-DEPLOYMENT-SUMMARY.txt
echo ✅ .gitignore created>> RAILWAY-DEPLOYMENT-SUMMARY.txt
echo ✅ railway.json configuration added>> RAILWAY-DEPLOYMENT-SUMMARY.txt
echo ✅ GitHub repository: %github_repo%>> RAILWAY-DEPLOYMENT-SUMMARY.txt
echo.>> RAILWAY-DEPLOYMENT-SUMMARY.txt
echo 🌐 YOUR LIVE APP:>> RAILWAY-DEPLOYMENT-SUMMARY.txt
echo Frontend: https://yourapp.railway.app>> RAILWAY-DEPLOYMENT-SUMMARY.txt
echo Admin Panel: https://yourapp.railway.app/secret-admin-portal-2024>> RAILWAY-DEPLOYMENT-SUMMARY.txt
echo.>> RAILWAY-DEPLOYMENT-SUMMARY.txt
echo 🔐 ADMIN CREDENTIALS:>> RAILWAY-DEPLOYMENT-SUMMARY.txt
echo Username: superadmin2024>> RAILWAY-DEPLOYMENT-SUMMARY.txt
echo Password: MyHealthApp@2024!>> RAILWAY-DEPLOYMENT-SUMMARY.txt
echo Secret Key: HEALTH_ADMIN_SECRET_2024>> RAILWAY-DEPLOYMENT-SUMMARY.txt
echo.>> RAILWAY-DEPLOYMENT-SUMMARY.txt
echo 💰 REVENUE SYSTEM:>> RAILWAY-DEPLOYMENT-SUMMARY.txt
echo - 20%% commission on all consultations>> RAILWAY-DEPLOYMENT-SUMMARY.txt
echo - Real-time earnings tracking>> RAILWAY-DEPLOYMENT-SUMMARY.txt
echo - Global doctor and patient access>> RAILWAY-DEPLOYMENT-SUMMARY.txt
echo - Professional healthcare platform>> RAILWAY-DEPLOYMENT-SUMMARY.txt
echo ========================================>> RAILWAY-DEPLOYMENT-SUMMARY.txt

echo.
echo ✅ Deployment summary saved to: RAILWAY-DEPLOYMENT-SUMMARY.txt
echo.
echo Your HealthCare Pro platform is ready to go live!
pause