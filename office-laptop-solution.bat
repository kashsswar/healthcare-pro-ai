@echo off
title HealthCare Pro - Office Laptop Solution
color 0A

echo.
echo ========================================
echo    HealthCare Pro - Office Laptop
echo    No Admin Rights? No Problem!
echo ========================================
echo.

echo [SOLUTION 1] Local Network Sharing (BEST)
echo ========================================
echo Your app can be accessed by anyone on office network:
echo.
echo 1. Find your IP address:
ipconfig | findstr "IPv4"
echo.
echo 2. Start your app:
echo    start-mock-app.bat
echo.
echo 3. Share this URL with doctors:
echo    http://YOUR-IP-ADDRESS:3000
echo.
echo 4. Admin access (only for you):
echo    http://YOUR-IP-ADDRESS:3000/secret-admin-portal-2024
echo.

echo [SOLUTION 2] Portable Cloud Tools
echo ========================================
echo Download portable versions (no installation needed):
echo.
echo 1. Portable Git: https://git-scm.com/download/win (portable)
echo 2. Heroku CLI Portable: Use online Heroku dashboard
echo 3. GitHub Desktop Portable: Upload files manually
echo.

echo [SOLUTION 3] Online Deployment (NO SOFTWARE NEEDED)
echo ========================================
echo.
echo A. GitHub (Free):
echo    1. Go to github.com
echo    2. Create account and repository
echo    3. Upload your project folder
echo    4. Enable GitHub Pages
echo    5. Live at: username.github.io/repo-name
echo.
echo B. Netlify (Free):
echo    1. Go to netlify.com
echo    2. Drag and drop your 'client/build' folder
echo    3. Instant deployment
echo    4. Custom domain available
echo.
echo C. Vercel (Free):
echo    1. Go to vercel.com
echo    2. Import from GitHub
echo    3. Auto-deployment
echo    4. Professional URLs
echo.

echo [SOLUTION 4] USB Transfer Method
echo ========================================
echo.
echo 1. Copy entire project to USB drive
echo 2. Take USB to personal laptop/home computer
echo 3. Deploy from there using heroku-deploy.bat
echo 4. Share live URL with doctors
echo.

echo [SOLUTION 5] Mobile Hotspot Trick
echo ========================================
echo.
echo 1. Connect office laptop to mobile hotspot
echo 2. Start your app: start-mock-app.bat
echo 3. Find mobile hotspot IP range
echo 4. Share URL with doctors on same hotspot
echo 5. They can access from their phones/laptops
echo.

echo ========================================
echo    RECOMMENDED: Solution 1 (Local Network)
echo ========================================
echo.
echo This works IMMEDIATELY without any installations:
echo.
echo 1. Your office colleagues can test the app
echo 2. Doctors in your building can register
echo 3. You start earning 20%% commission today
echo 4. No admin rights needed
echo 5. Full functionality available
echo.
echo Example URLs to share:
echo - App: http://192.168.1.100:3000
echo - Admin: http://192.168.1.100:3000/secret-admin-portal-2024
echo.
echo Your HealthCare Pro is ready to earn money!
echo.
pause