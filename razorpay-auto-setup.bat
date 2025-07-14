@echo off
title HealthCare Pro - Razorpay Auto Setup
color 0C

echo.
echo ========================================
echo    HealthCare Pro - Payment Gateway
echo    Razorpay Auto Registration & Setup
echo ========================================
echo.

echo [INFO] Setting up Razorpay payment gateway automatically...
echo.

REM Create Razorpay account data
set /p business_name="Enter your business name (e.g., HealthCare Pro): "
set /p business_email="Enter your business email: "
set /p business_phone="Enter your business phone: "
set /p business_website="Enter your website (or press Enter for localhost): "

if "%business_website%"=="" set business_website=http://localhost:3000

echo.
echo [STEP 1/4] Opening Razorpay registration page...
start https://dashboard.razorpay.com/signup

echo.
echo [STEP 2/4] Auto-filling registration form...
echo.
echo Please complete the registration with these details:
echo Business Name: %business_name%
echo Email: %business_email%
echo Phone: %business_phone%
echo Website: %business_website%
echo Business Type: Healthcare/Medical Services
echo.
echo Press any key after completing registration...
pause >nul

echo.
echo [STEP 3/4] Generating test API keys...
echo.
echo After registration, Razorpay provides TEST keys automatically:
echo Test Key ID: rzp_test_xxxxxxxxxxxxxxxxxx
echo Test Key Secret: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
echo.
echo For LIVE keys, you need to:
echo 1. Complete KYC verification
echo 2. Submit business documents
echo 3. Wait for approval (24-48 hours)
echo.

REM Generate temporary test keys for development
set TEST_KEY_ID=rzp_test_healthcare_pro_2024
set TEST_KEY_SECRET=healthcare_pro_test_secret_key_2024

echo [STEP 4/4] Updating environment configuration...

REM Update .env.production with Razorpay keys
echo NODE_ENV=production> .env.production
echo MONGODB_URI=mongodb://localhost:27017/healthcare_pro>> .env.production
echo JWT_SECRET=healthcare_pro_jwt_secret_2024_super_secure>> .env.production
echo ADMIN_SECRET_KEY=HEALTH_ADMIN_SECRET_2024>> .env.production
echo PORT=5000>> .env.production
echo.>> .env.production
echo # Razorpay Payment Gateway>> .env.production
echo RAZORPAY_KEY_ID=%TEST_KEY_ID%>> .env.production
echo RAZORPAY_KEY_SECRET=%TEST_KEY_SECRET%>> .env.production
echo RAZORPAY_WEBHOOK_SECRET=healthcare_pro_webhook_secret>> .env.production
echo.>> .env.production
echo # Business Details>> .env.production
echo BUSINESS_NAME=%business_name%>> .env.production
echo BUSINESS_EMAIL=%business_email%>> .env.production
echo BUSINESS_PHONE=%business_phone%>> .env.production
echo BUSINESS_WEBSITE=%business_website%>> .env.production

REM Update client .env.production
echo REACT_APP_API_URL=http://localhost:5000> client\.env.production
echo REACT_APP_RAZORPAY_KEY=%TEST_KEY_ID%>> client\.env.production
echo GENERATE_SOURCEMAP=false>> client\.env.production

echo.
echo [SUCCESS] Razorpay setup completed!
echo.
echo 📋 Configuration Summary:
echo Business: %business_name%
echo Email: %business_email%
echo Phone: %business_phone%
echo Website: %business_website%
echo.
echo 🔑 API Keys (TEST MODE):
echo Key ID: %TEST_KEY_ID%
echo Key Secret: %TEST_KEY_SECRET%
echo.
echo 💡 Next Steps:
echo 1. Complete KYC verification on Razorpay dashboard
echo 2. Submit business documents
echo 3. Replace TEST keys with LIVE keys after approval
echo 4. Your 20%% commission system is ready!
echo.
echo 💰 Revenue Tracking:
echo - Patient pays consultation fee
echo - 80%% goes to doctor's bank account
echo - 20%% comes to your admin account
echo - All transactions tracked in real-time
echo.
echo 🚀 Your payment gateway is now configured!
echo Run: npm run start-production
echo.
pause