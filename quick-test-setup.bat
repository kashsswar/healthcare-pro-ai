@echo off
title HealthCare Pro - Complete Test Setup
color 0B

echo.
echo ========================================
echo    HealthCare Pro v2.1 - Quick Setup
echo    Enterprise Healthcare Platform
echo ========================================
echo.

echo [INFO] Setting up complete test environment...
echo.

REM Create all necessary directories
if not exist "test-data" mkdir test-data
if not exist "logs" mkdir logs

echo [STEP 1/5] Generating Complete Mock Database...
echo.

REM Generate comprehensive test data
echo -- HealthCare Pro Test Data> test-data\complete-test-data.json
echo {>> test-data\complete-test-data.json
echo   "admins": [>> test-data\complete-test-data.json
echo     {>> test-data\complete-test-data.json
echo       "id": "admin_001",>> test-data\complete-test-data.json
echo       "name": "Super Admin",>> test-data\complete-test-data.json
echo       "email": "admin@healthcarepro.com",>> test-data\complete-test-data.json
echo       "password": "admin123",>> test-data\complete-test-data.json
echo       "secretUrl": "/secret-admin-portal-2024",>> test-data\complete-test-data.json
echo       "credentials": {>> test-data\complete-test-data.json
echo         "username": "superadmin2024",>> test-data\complete-test-data.json
echo         "password": "MyHealthApp@2024!",>> test-data\complete-test-data.json
echo         "secretKey": "HEALTH_ADMIN_SECRET_2024">> test-data\complete-test-data.json
echo       }>> test-data\complete-test-data.json
echo     }>> test-data\complete-test-data.json
echo   ],>> test-data\complete-test-data.json
echo   "doctors": [>> test-data\complete-test-data.json
echo     {>> test-data\complete-test-data.json
echo       "id": "doc_001",>> test-data\complete-test-data.json
echo       "name": "Dr. Rajesh Kumar Sharma",>> test-data\complete-test-data.json
echo       "email": "dr.rajesh@healthcarepro.com",>> test-data\complete-test-data.json
echo       "password": "doctor123",>> test-data\complete-test-data.json
echo       "specialization": "General Medicine",>> test-data\complete-test-data.json
echo       "qualification": ["MBBS", "MD Internal Medicine"],>> test-data\complete-test-data.json
echo       "experience": 12,>> test-data\complete-test-data.json
echo       "rating": 4.3,>> test-data\complete-test-data.json
echo       "consultationFee": 800,>> test-data\complete-test-data.json
echo       "location": "Mumbai, Maharashtra",>> test-data\complete-test-data.json
echo       "category": "general",>> test-data\complete-test-data.json
echo       "bankDetails": {>> test-data\complete-test-data.json
echo         "accountNumber": "ACC001234567890",>> test-data\complete-test-data.json
echo         "ifscCode": "HDFC0001234",>> test-data\complete-test-data.json
echo         "bankName": "HDFC Bank">> test-data\complete-test-data.json
echo       }>> test-data\complete-test-data.json
echo     },>> test-data\complete-test-data.json
echo     {>> test-data\complete-test-data.json
echo       "id": "doc_002",>> test-data\complete-test-data.json
echo       "name": "Dr. Priya Patel",>> test-data\complete-test-data.json
echo       "email": "dr.priya@healthcarepro.com",>> test-data\complete-test-data.json
echo       "password": "doctor123",>> test-data\complete-test-data.json
echo       "specialization": "Dentistry",>> test-data\complete-test-data.json
echo       "qualification": ["BDS", "MDS Oral Surgery"],>> test-data\complete-test-data.json
echo       "experience": 8,>> test-data\complete-test-data.json
echo       "rating": 4.1,>> test-data\complete-test-data.json
echo       "consultationFee": 1200,>> test-data\complete-test-data.json
echo       "location": "Delhi, NCR",>> test-data\complete-test-data.json
echo       "category": "dental">> test-data\complete-test-data.json
echo     }>> test-data\complete-test-data.json
echo   ],>> test-data\complete-test-data.json
echo   "patients": [>> test-data\complete-test-data.json
echo     {>> test-data\complete-test-data.json
echo       "id": "pat_001",>> test-data\complete-test-data.json
echo       "name": "Amit Singh",>> test-data\complete-test-data.json
echo       "email": "amit.singh@email.com",>> test-data\complete-test-data.json
echo       "password": "patient123",>> test-data\complete-test-data.json
echo       "phone": "+91-9876543220",>> test-data\complete-test-data.json
echo       "age": 32,>> test-data\complete-test-data.json
echo       "location": "Mumbai, Maharashtra">> test-data\complete-test-data.json
echo     },>> test-data\complete-test-data.json
echo     {>> test-data\complete-test-data.json
echo       "id": "pat_002",>> test-data\complete-test-data.json
echo       "name": "Sunita Devi",>> test-data\complete-test-data.json
echo       "email": "sunita.devi@email.com",>> test-data\complete-test-data.json
echo       "password": "patient123",>> test-data\complete-test-data.json
echo       "phone": "+91-9876543221",>> test-data\complete-test-data.json
echo       "age": 45,>> test-data\complete-test-data.json
echo       "location": "Delhi, NCR">> test-data\complete-test-data.json
echo     }>> test-data\complete-test-data.json
echo   ]>> test-data\complete-test-data.json
echo }>> test-data\complete-test-data.json

echo [STEP 2/5] Creating Test Credentials File...
echo ========================================> test-data\TEST-CREDENTIALS.txt
echo    HealthCare Pro - Complete Test Setup>> test-data\TEST-CREDENTIALS.txt
echo    Professional Healthcare Platform>> test-data\TEST-CREDENTIALS.txt
echo ========================================>> test-data\TEST-CREDENTIALS.txt
echo.>> test-data\TEST-CREDENTIALS.txt
echo 🔐 ADMIN ACCESS (SECRET):>> test-data\TEST-CREDENTIALS.txt
echo URL: http://localhost:3000/secret-admin-portal-2024>> test-data\TEST-CREDENTIALS.txt
echo Username: superadmin2024>> test-data\TEST-CREDENTIALS.txt
echo Password: MyHealthApp@2024!>> test-data\TEST-CREDENTIALS.txt
echo Secret Key: HEALTH_ADMIN_SECRET_2024>> test-data\TEST-CREDENTIALS.txt
echo.>> test-data\TEST-CREDENTIALS.txt
echo 👨‍⚕️ DOCTOR ACCOUNTS:>> test-data\TEST-CREDENTIALS.txt
echo 1. Dr. Rajesh Kumar Sharma (MBBS, MD)>> test-data\TEST-CREDENTIALS.txt
echo    Email: dr.rajesh@healthcarepro.com>> test-data\TEST-CREDENTIALS.txt
echo    Password: doctor123>> test-data\TEST-CREDENTIALS.txt
echo    Specialization: General Medicine>> test-data\TEST-CREDENTIALS.txt
echo    Fee: Rs. 800 (You get Rs. 160 per consultation)>> test-data\TEST-CREDENTIALS.txt
echo.>> test-data\TEST-CREDENTIALS.txt
echo 2. Dr. Priya Patel (BDS, MDS)>> test-data\TEST-CREDENTIALS.txt
echo    Email: dr.priya@healthcarepro.com>> test-data\TEST-CREDENTIALS.txt
echo    Password: doctor123>> test-data\TEST-CREDENTIALS.txt
echo    Specialization: Dentistry>> test-data\TEST-CREDENTIALS.txt
echo    Fee: Rs. 1200 (You get Rs. 240 per consultation)>> test-data\TEST-CREDENTIALS.txt
echo.>> test-data\TEST-CREDENTIALS.txt
echo 👥 PATIENT ACCOUNTS:>> test-data\TEST-CREDENTIALS.txt
echo 1. Amit Singh (32 years, Mumbai)>> test-data\TEST-CREDENTIALS.txt
echo    Email: amit.singh@email.com>> test-data\TEST-CREDENTIALS.txt
echo    Password: patient123>> test-data\TEST-CREDENTIALS.txt
echo.>> test-data\TEST-CREDENTIALS.txt
echo 2. Sunita Devi (45 years, Delhi)>> test-data\TEST-CREDENTIALS.txt
echo    Email: sunita.devi@email.com>> test-data\TEST-CREDENTIALS.txt
echo    Password: patient123>> test-data\TEST-CREDENTIALS.txt
echo.>> test-data\TEST-CREDENTIALS.txt
echo 💰 YOUR REVENUE TRACKING:>> test-data\TEST-CREDENTIALS.txt
echo - 20%% commission from every consultation>> test-data\TEST-CREDENTIALS.txt
echo - Direct bank transfer to your account>> test-data\TEST-CREDENTIALS.txt
echo - Real-time earnings dashboard>> test-data\TEST-CREDENTIALS.txt
echo - Monthly revenue reports>> test-data\TEST-CREDENTIALS.txt
echo ========================================>> test-data\TEST-CREDENTIALS.txt

echo [STEP 3/5] Setting up Auto-Marketing Campaigns...
echo {> test-data\marketing-campaigns.json
echo   "campaigns": [>> test-data\marketing-campaigns.json
echo     {>> test-data\marketing-campaigns.json
echo       "name": "WhatsApp Health Tips Broadcast",>> test-data\marketing-campaigns.json
echo       "status": "active",>> test-data\marketing-campaigns.json
echo       "reach": "1000+ daily contacts",>> test-data\marketing-campaigns.json
echo       "roi": "340%% return on investment">> test-data\marketing-campaigns.json
echo     },>> test-data\marketing-campaigns.json
echo     {>> test-data\marketing-campaigns.json
echo       "name": "Medical College Outreach",>> test-data\marketing-campaigns.json
echo       "status": "ready",>> test-data\marketing-campaigns.json
echo       "target": "Fresh medical graduates",>> test-data\marketing-campaigns.json
echo       "roi": "Expected 280%% ROI">> test-data\marketing-campaigns.json
echo     }>> test-data\marketing-campaigns.json
echo   ]>> test-data\marketing-campaigns.json
echo }>> test-data\marketing-campaigns.json

echo [STEP 4/5] Creating Quick Start Guide...
echo ========================================> test-data\QUICK-START-GUIDE.txt
echo    HealthCare Pro - Quick Start Guide>> test-data\QUICK-START-GUIDE.txt
echo ========================================>> test-data\QUICK-START-GUIDE.txt
echo.>> test-data\QUICK-START-GUIDE.txt
echo 🚀 TESTING WORKFLOW:>> test-data\QUICK-START-GUIDE.txt
echo.>> test-data\QUICK-START-GUIDE.txt
echo 1. START APPLICATION:>> test-data\QUICK-START-GUIDE.txt
echo    - Run: npm run start-with-mock>> test-data\QUICK-START-GUIDE.txt
echo    - Wait for both servers to start>> test-data\QUICK-START-GUIDE.txt
echo    - Open: http://localhost:3000>> test-data\QUICK-START-GUIDE.txt
echo.>> test-data\QUICK-START-GUIDE.txt
echo 2. TEST PATIENT FLOW:>> test-data\QUICK-START-GUIDE.txt
echo    - Login as: amit.singh@email.com / patient123>> test-data\QUICK-START-GUIDE.txt
echo    - Browse doctor categories>> test-data\QUICK-START-GUIDE.txt
echo    - Book appointment with payment>> test-data\QUICK-START-GUIDE.txt
echo    - Test referral sharing (get Rs. 50)>> test-data\QUICK-START-GUIDE.txt
echo.>> test-data\QUICK-START-GUIDE.txt
echo 3. TEST DOCTOR FLOW:>> test-data\QUICK-START-GUIDE.txt
echo    - Login as: dr.rajesh@healthcarepro.com / doctor123>> test-data\QUICK-START-GUIDE.txt
echo    - Manage appointment queue>> test-data\QUICK-START-GUIDE.txt
echo    - Add bank details for payments>> test-data\QUICK-START-GUIDE.txt
echo    - Refer patients to other doctors>> test-data\QUICK-START-GUIDE.txt
echo.>> test-data\QUICK-START-GUIDE.txt
echo 4. TEST ADMIN PANEL:>> test-data\QUICK-START-GUIDE.txt
echo    - Go to: http://localhost:3000/secret-admin-portal-2024>> test-data\QUICK-START-GUIDE.txt
echo    - Login with triple authentication>> test-data\QUICK-START-GUIDE.txt
echo    - View real-time earnings dashboard>> test-data\QUICK-START-GUIDE.txt
echo    - Boost doctor ratings secretly>> test-data\QUICK-START-GUIDE.txt
echo    - Monitor auto-marketing campaigns>> test-data\QUICK-START-GUIDE.txt
echo.>> test-data\QUICK-START-GUIDE.txt
echo 💡 FEATURES TO TEST:>> test-data\QUICK-START-GUIDE.txt
echo ✅ Multi-language support (5 Indian languages)>> test-data\QUICK-START-GUIDE.txt
echo ✅ Voice assistant for non-readers>> test-data\QUICK-START-GUIDE.txt
echo ✅ AI health recommendations>> test-data\QUICK-START-GUIDE.txt
echo ✅ Payment processing with 80-20 split>> test-data\QUICK-START-GUIDE.txt
echo ✅ Auto-marketing campaigns>> test-data\QUICK-START-GUIDE.txt
echo ✅ Doctor category filtering>> test-data\QUICK-START-GUIDE.txt
echo ✅ Patient referral system>> test-data\QUICK-START-GUIDE.txt
echo ✅ Admin earnings tracking>> test-data\QUICK-START-GUIDE.txt
echo ========================================>> test-data\QUICK-START-GUIDE.txt

echo [STEP 5/5] Final Setup...
echo.
echo [SUCCESS] Complete test environment ready!
echo.
echo 📁 Generated Files:
echo - test-data\complete-test-data.json (Full Database)
echo - test-data\TEST-CREDENTIALS.txt (All Login Details)
echo - test-data\marketing-campaigns.json (Auto-Marketing)
echo - test-data\QUICK-START-GUIDE.txt (Testing Instructions)
echo.
echo 🚀 NEXT STEPS:
echo 1. Run: npm run start-with-mock
echo 2. Open: http://localhost:3000
echo 3. Check TEST-CREDENTIALS.txt for login details
echo 4. Test admin panel at secret URL
echo 5. Monitor your 20%% earnings in real-time!
echo.
echo 💰 REVENUE POTENTIAL:
echo - 2 test doctors × 5 patients daily = Rs. 400 daily commission
echo - Scale to 100 doctors = Rs. 20,000 daily commission
echo - Monthly potential = Rs. 6,00,000 passive income
echo.
pause