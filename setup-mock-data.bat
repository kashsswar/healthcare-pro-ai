@echo off
echo ========================================
echo    HealthCare Pro - Mock Data Setup
echo    Enterprise Healthcare Platform
echo ========================================
echo.

echo [INFO] Setting up comprehensive mock data...
echo.

REM Create mock data directory
if not exist "mock-data" mkdir mock-data

REM Generate comprehensive mock data
echo [STEP 1/4] Generating Professional Doctors Database...
echo {> mock-data\doctors.json
echo   "doctors": [>> mock-data\doctors.json
echo     {>> mock-data\doctors.json
echo       "id": "doc_001",>> mock-data\doctors.json
echo       "name": "Dr. Rajesh Kumar Sharma",>> mock-data\doctors.json
echo       "email": "dr.rajesh@healthcarepro.com",>> mock-data\doctors.json
echo       "password": "doctor123",>> mock-data\doctors.json
echo       "specialization": "General Medicine",>> mock-data\doctors.json
echo       "qualification": ["MBBS", "MD Internal Medicine"],>> mock-data\doctors.json
echo       "experience": 12,>> mock-data\doctors.json
echo       "rating": 4.3,>> mock-data\doctors.json
echo       "consultationFee": 800,>> mock-data\doctors.json
echo       "location": "Mumbai, Maharashtra",>> mock-data\doctors.json
echo       "verified": true>> mock-data\doctors.json
echo     },>> mock-data\doctors.json
echo     {>> mock-data\doctors.json
echo       "id": "doc_002",>> mock-data\doctors.json
echo       "name": "Dr. Priya Patel",>> mock-data\doctors.json
echo       "email": "dr.priya@healthcarepro.com",>> mock-data\doctors.json
echo       "password": "doctor123",>> mock-data\doctors.json
echo       "specialization": "Dentistry",>> mock-data\doctors.json
echo       "qualification": ["BDS", "MDS Oral Surgery"],>> mock-data\doctors.json
echo       "experience": 8,>> mock-data\doctors.json
echo       "rating": 4.1,>> mock-data\doctors.json
echo       "consultationFee": 1200,>> mock-data\doctors.json
echo       "location": "Delhi, NCR",>> mock-data\doctors.json
echo       "verified": true>> mock-data\doctors.json
echo     }>> mock-data\doctors.json
echo   ]>> mock-data\doctors.json
echo }>> mock-data\doctors.json

echo [STEP 2/4] Generating Patient Database...
echo {> mock-data\patients.json
echo   "patients": [>> mock-data\patients.json
echo     {>> mock-data\patients.json
echo       "id": "pat_001",>> mock-data\patients.json
echo       "name": "Amit Singh",>> mock-data\patients.json
echo       "email": "amit.singh@email.com",>> mock-data\patients.json
echo       "password": "patient123",>> mock-data\patients.json
echo       "phone": "+91-9876543210",>> mock-data\patients.json
echo       "age": 32,>> mock-data\patients.json
echo       "location": "Mumbai, Maharashtra">> mock-data\patients.json
echo     },>> mock-data\patients.json
echo     {>> mock-data\patients.json
echo       "id": "pat_002",>> mock-data\patients.json
echo       "name": "Sunita Devi",>> mock-data\patients.json
echo       "email": "sunita.devi@email.com",>> mock-data\patients.json
echo       "password": "patient123",>> mock-data\patients.json
echo       "phone": "+91-9876543211",>> mock-data\patients.json
echo       "age": 45,>> mock-data\patients.json
echo       "location": "Delhi, NCR">> mock-data\patients.json
echo     }>> mock-data\patients.json
echo   ]>> mock-data\patients.json
echo }>> mock-data\patients.json

echo [STEP 3/4] Generating Admin Configuration...
echo {> mock-data\admin.json
echo   "admin": {>> mock-data\admin.json
echo     "username": "superadmin2024",>> mock-data\admin.json
echo     "password": "MyHealthApp@2024!",>> mock-data\admin.json
echo     "secretKey": "HEALTH_ADMIN_SECRET_2024",>> mock-data\admin.json
echo     "email": "admin@healthcarepro.com",>> mock-data\admin.json
echo     "permissions": ["all"]>> mock-data\admin.json
echo   }>> mock-data\admin.json
echo }>> mock-data\admin.json

echo [STEP 4/4] Generating Test Credentials Summary...
echo ========================================> mock-data\credentials.txt
echo    HealthCare Pro - Test Credentials>> mock-data\credentials.txt
echo    Professional Healthcare Platform>> mock-data\credentials.txt
echo ========================================>> mock-data\credentials.txt
echo.>> mock-data\credentials.txt
echo ADMIN ACCESS:>> mock-data\credentials.txt
echo URL: /admin-login>> mock-data\credentials.txt
echo Username: superadmin2024>> mock-data\credentials.txt
echo Password: MyHealthApp@2024!>> mock-data\credentials.txt
echo Secret Key: HEALTH_ADMIN_SECRET_2024>> mock-data\credentials.txt
echo.>> mock-data\credentials.txt
echo DOCTOR ACCOUNTS:>> mock-data\credentials.txt
echo 1. Dr. Rajesh Kumar Sharma (MBBS, MD)>> mock-data\credentials.txt
echo    Email: dr.rajesh@healthcarepro.com>> mock-data\credentials.txt
echo    Password: doctor123>> mock-data\credentials.txt
echo    Specialization: General Medicine>> mock-data\credentials.txt
echo    Fee: Rs. 800>> mock-data\credentials.txt
echo.>> mock-data\credentials.txt
echo 2. Dr. Priya Patel (BDS, MDS)>> mock-data\credentials.txt
echo    Email: dr.priya@healthcarepro.com>> mock-data\credentials.txt
echo    Password: doctor123>> mock-data\credentials.txt
echo    Specialization: Dentistry>> mock-data\credentials.txt
echo    Fee: Rs. 1200>> mock-data\credentials.txt
echo.>> mock-data\credentials.txt
echo PATIENT ACCOUNTS:>> mock-data\credentials.txt
echo 1. Amit Singh>> mock-data\credentials.txt
echo    Email: amit.singh@email.com>> mock-data\credentials.txt
echo    Password: patient123>> mock-data\credentials.txt
echo    Location: Mumbai>> mock-data\credentials.txt
echo.>> mock-data\credentials.txt
echo 2. Sunita Devi>> mock-data\credentials.txt
echo    Email: sunita.devi@email.com>> mock-data\credentials.txt
echo    Password: patient123>> mock-data\credentials.txt
echo    Location: Delhi>> mock-data\credentials.txt
echo ========================================>> mock-data\credentials.txt

echo.
echo [SUCCESS] Mock data setup completed!
echo.
echo Generated Files:
echo - mock-data\doctors.json (Professional Doctor Profiles)
echo - mock-data\patients.json (Patient Database)
echo - mock-data\admin.json (Admin Configuration)
echo - mock-data\credentials.txt (All Test Credentials)
echo.
echo [NEXT STEPS]
echo 1. Run: npm run start-with-mock
echo 2. Or: npm run start-clean (without mock data)
echo 3. Check credentials.txt for login details
echo.
pause