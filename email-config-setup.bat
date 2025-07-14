@echo off
title HealthCare Pro - Email Configuration Setup
color 0E

echo.
echo ========================================
echo    HealthCare Pro - Email Setup
echo    Configure Email Settings Globally
echo ========================================
echo.

echo [INFO] This will configure email settings for all environments
echo (Development, Production, and Client configurations)
echo.

REM Get email configuration from user
set /p email_host="Enter SMTP Host (default: smtp.gmail.com): "
if "%email_host%"=="" set email_host=smtp.gmail.com

set /p email_port="Enter SMTP Port (default: 587): "
if "%email_port%"=="" set email_port=587

set /p email_user="Enter your email address: "
if "%email_user%"=="" (
    echo [ERROR] Email address is required!
    pause
    exit /b 1
)

set /p email_pass="Enter your app password (not regular password): "
if "%email_pass%"=="" (
    echo [ERROR] App password is required!
    echo.
    echo For Gmail:
    echo 1. Enable 2-factor authentication
    echo 2. Go to Google Account settings
    echo 3. Generate App Password for 'Mail'
    echo 4. Use that 16-character password here
    pause
    exit /b 1
)

echo.
echo [STEP 1/4] Updating development environment (.env)...
echo PORT=5000> .env
echo MONGODB_URI=mongodb://localhost:27017/healthcare_pro>> .env
echo JWT_SECRET=healthcare_pro_jwt_secret_2024_super_secure>> .env
echo ADMIN_SECRET_KEY=HEALTH_ADMIN_SECRET_2024>> .env
echo.>> .env
echo # Email Configuration (MOCK - For Development Only)>> .env
echo EMAIL_HOST=%email_host%>> .env
echo EMAIL_PORT=%email_port%>> .env
echo EMAIL_USER=%email_user%>> .env
echo EMAIL_PASS=%email_pass%>> .env
echo EMAIL_MOCK_MODE=true>> .env
echo.>> .env
echo # Frontend URL>> .env
echo CLIENT_URL=http://localhost:3000>> .env

echo.
echo [STEP 2/4] Updating production environment (.env.production)...
echo NODE_ENV=production> .env.production
echo MONGODB_URI=mongodb://localhost:27017/healthcare_pro>> .env.production
echo JWT_SECRET=healthcare_pro_jwt_secret_2024_super_secure>> .env.production
echo ADMIN_SECRET_KEY=HEALTH_ADMIN_SECRET_2024>> .env.production
echo PORT=5000>> .env.production
echo.>> .env.production
echo # Email Configuration (PRODUCTION - REAL EMAILS)>> .env.production
echo EMAIL_HOST=%email_host%>> .env.production
echo EMAIL_PORT=%email_port%>> .env.production
echo EMAIL_USER=%email_user%>> .env.production
echo EMAIL_PASS=%email_pass%>> .env.production
echo EMAIL_MOCK_MODE=false>> .env.production
echo.>> .env.production
echo # Payment Gateway>> .env.production
echo RAZORPAY_KEY_ID=your_razorpay_key_id>> .env.production
echo RAZORPAY_KEY_SECRET=your_razorpay_key_secret>> .env.production

echo.
echo [STEP 3/4] Updating server configuration...
REM Create email service configuration file
if not exist "config" mkdir config
echo module.exports = {> config\email.js
echo   host: '%email_host%',>> config\email.js
echo   port: %email_port%,>> config\email.js
echo   secure: false,>> config\email.js
echo   auth: {>> config\email.js
echo     user: '%email_user%',>> config\email.js
echo     pass: '%email_pass%'>> config\email.js
echo   },>> config\email.js
echo   from: '%email_user%'>> config\email.js
echo };>> config\email.js

echo.
echo [STEP 4/4] Creating email templates...
if not exist "templates" mkdir templates

echo ^<!DOCTYPE html^>> templates\appointment-confirmation.html
echo ^<html^>>> templates\appointment-confirmation.html
echo ^<head^>>> templates\appointment-confirmation.html
echo   ^<title^>Appointment Confirmation - HealthCare Pro^</title^>>> templates\appointment-confirmation.html
echo ^</head^>>> templates\appointment-confirmation.html
echo ^<body style="font-family: Arial, sans-serif;"^>>> templates\appointment-confirmation.html
echo   ^<h2^>🏥 HealthCare Pro - Appointment Confirmed^</h2^>>> templates\appointment-confirmation.html
echo   ^<p^>Dear {{patientName}},^</p^>>> templates\appointment-confirmation.html
echo   ^<p^>Your appointment has been confirmed:^</p^>>> templates\appointment-confirmation.html
echo   ^<ul^>>> templates\appointment-confirmation.html
echo     ^<li^>Doctor: Dr. {{doctorName}}^</li^>>> templates\appointment-confirmation.html
echo     ^<li^>Date: {{appointmentDate}}^</li^>>> templates\appointment-confirmation.html
echo     ^<li^>Time: {{appointmentTime}}^</li^>>> templates\appointment-confirmation.html
echo     ^<li^>Fee: ₹{{consultationFee}}^</li^>>> templates\appointment-confirmation.html
echo   ^</ul^>>> templates\appointment-confirmation.html
echo   ^<p^>Thank you for choosing HealthCare Pro!^</p^>>> templates\appointment-confirmation.html
echo ^</body^>>> templates\appointment-confirmation.html
echo ^</html^>>> templates\appointment-confirmation.html

echo.
echo [SUCCESS] Email configuration completed!
echo.
echo 📧 Email Settings Applied:
echo Host: %email_host%
echo Port: %email_port%
echo User: %email_user%
echo Password: [CONFIGURED]
echo.
echo 📁 Updated Files:
echo - .env (Development)
echo - .env.production (Production)
echo - config\email.js (Server configuration)
echo - templates\appointment-confirmation.html (Email template)
echo.
echo 💡 Email Features Now Available:
echo ✅ Appointment confirmation emails
echo ✅ Payment receipt emails
echo ✅ Doctor notification emails
echo ✅ Admin earning reports
echo ✅ Password reset emails
echo.
echo 🔧 To change email settings later:
echo Just run this script again with new credentials
echo.
echo 🚀 Your email system is ready!
echo All environments will use these settings automatically.
echo.
pause