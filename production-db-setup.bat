@echo off
title HealthCare Pro - Production Database Setup
color 0A

echo.
echo ========================================
echo    HealthCare Pro - MongoDB Setup
echo    Production Database Configuration
echo ========================================
echo.

echo [INFO] Setting up MongoDB for production...
echo.

REM Check if MongoDB is installed
where mongod >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [INFO] MongoDB already installed and in PATH
    mongod --version
) else (
    REM Check if MongoDB exists in common installation paths
    if exist "C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" (
        echo [INFO] MongoDB found at C:\Program Files\MongoDB\Server\7.0
        echo Adding existing MongoDB to PATH...
        setx PATH "%PATH%;C:\Program Files\MongoDB\Server\7.0\bin" /M
        set "PATH=%PATH%;C:\Program Files\MongoDB\Server\7.0\bin"
        echo MongoDB PATH updated successfully!
    ) else if exist "C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe" (
        echo [INFO] MongoDB found at C:\Program Files\MongoDB\Server\6.0
        echo Adding existing MongoDB to PATH...
        setx PATH "%PATH%;C:\Program Files\MongoDB\Server\6.0\bin" /M
        set "PATH=%PATH%;C:\Program Files\MongoDB\Server\6.0\bin"
        echo MongoDB PATH updated successfully!
    ) else (
        echo [INFO] MongoDB not found. Installing automatically...
        echo.
        
        REM Download MongoDB Community Server
        echo Downloading MongoDB Community Server...
        powershell -Command "Invoke-WebRequest -Uri 'https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-7.0.4-signed.msi' -OutFile 'mongodb-installer.msi'"
        
        if exist "mongodb-installer.msi" (
            echo Installing MongoDB...
            msiexec /i mongodb-installer.msi /quiet /norestart INSTALLLOCATION="C:\Program Files\MongoDB\Server\7.0\"
            
            REM Add MongoDB to PATH
            echo Adding MongoDB to system PATH...
            setx PATH "%PATH%;C:\Program Files\MongoDB\Server\7.0\bin" /M
            set "PATH=%PATH%;C:\Program Files\MongoDB\Server\7.0\bin"
            
            echo MongoDB installed successfully!
            del mongodb-installer.msi
        ) else (
            echo [ERROR] Failed to download MongoDB installer
            echo Please install manually from: https://www.mongodb.com/try/download/community
            pause
            exit /b 1
        )
    )
)

echo [STEP 1/5] Creating database directory...
if not exist "C:\data\db" (
    mkdir "C:\data\db"
    echo Created MongoDB data directory
) else (
    echo MongoDB data directory already exists
)

echo.
echo [STEP 2/5] Installing and starting MongoDB service...
REM Install MongoDB as Windows service
"C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --install --serviceName "MongoDB" --serviceDisplayName "MongoDB" --dbpath "C:\data\db" --logpath "C:\data\db\mongodb.log"

REM Start MongoDB service
net start MongoDB >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo MongoDB service started successfully
) else (
    echo Starting MongoDB manually...
    start "MongoDB" "C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --dbpath "C:\data\db"
    timeout /t 10 /nobreak >nul
)

echo.
echo [STEP 3/5] Creating production database schema...

REM Create MongoDB initialization script
echo use healthcare_pro> mongo-init.js
echo.>> mongo-init.js
echo // Create collections>> mongo-init.js
echo db.createCollection("users")>> mongo-init.js
echo db.createCollection("doctors")>> mongo-init.js
echo db.createCollection("patients")>> mongo-init.js
echo db.createCollection("appointments")>> mongo-init.js
echo db.createCollection("payments")>> mongo-init.js
echo db.createCollection("reviews")>> mongo-init.js
echo db.createCollection("admin_earnings")>> mongo-init.js
echo.>> mongo-init.js
echo // Create indexes for performance>> mongo-init.js
echo db.users.createIndex({"email": 1}, {"unique": true})>> mongo-init.js
echo db.doctors.createIndex({"specialization": 1})>> mongo-init.js
echo db.doctors.createIndex({"location.city": 1})>> mongo-init.js
echo db.appointments.createIndex({"scheduled_time": 1})>> mongo-init.js
echo db.payments.createIndex({"created_at": -1})>> mongo-init.js
echo.>> mongo-init.js
echo // Insert admin user>> mongo-init.js
echo db.users.insertOne({>> mongo-init.js
echo   "name": "Super Admin",>> mongo-init.js
echo   "email": "admin@healthcarepro.com",>> mongo-init.js
echo   "password": "$2b$10$encrypted_password_hash",>> mongo-init.js
echo   "role": "admin",>> mongo-init.js
echo   "created_at": new Date()>> mongo-init.js
echo })>> mongo-init.js
echo.>> mongo-init.js
echo print("HealthCare Pro database initialized successfully!")>> mongo-init.js

REM Execute MongoDB script
mongo < mongo-init.js

echo.
echo [STEP 4/5] Creating production environment file...
echo NODE_ENV=production> .env.production
echo MONGODB_URI=mongodb://localhost:27017/healthcare_pro>> .env.production
echo JWT_SECRET=healthcare_pro_jwt_secret_2024_super_secure>> .env.production
echo ADMIN_SECRET_KEY=HEALTH_ADMIN_SECRET_2024>> .env.production
echo PORT=5000>> .env.production
echo.>> .env.production
echo # Payment Gateway (Add your keys)>> .env.production
echo RAZORPAY_KEY_ID=your_razorpay_key_id>> .env.production
echo RAZORPAY_KEY_SECRET=your_razorpay_key_secret>> .env.production
echo.>> .env.production
echo # Email Service (Optional)>> .env.production
echo EMAIL_HOST=smtp.gmail.com>> .env.production
echo EMAIL_PORT=587>> .env.production
echo EMAIL_USER=your_email@gmail.com>> .env.production
echo EMAIL_PASS=your_app_password>> .env.production

echo.
echo [STEP 5/5] Creating production startup script...
echo @echo off> start-production.bat
echo title HealthCare Pro - Production Server>> start-production.bat
echo echo Starting HealthCare Pro in Production Mode...>> start-production.bat
echo echo.>> start-production.bat
echo set NODE_ENV=production>> start-production.bat
echo node server.js>> start-production.bat

echo.
echo [SUCCESS] Production database setup completed!
echo.
echo 📁 Created Files:
echo - mongo-init.js (Database initialization)
echo - .env.production (Production environment)
echo - start-production.bat (Production startup)
echo.
echo 🚀 Next Steps:
echo 1. Update .env.production with your payment gateway keys
echo 2. Run: start-production.bat
echo 3. Your app will be ready at: http://localhost:5000
echo.
echo 💡 For cloud deployment:
echo - MongoDB Atlas: https://cloud.mongodb.com
echo - Heroku: https://heroku.com
echo - Razorpay: https://razorpay.com
echo.
echo 💰 Your 20%% commission system is ready!
echo Admin earnings will be tracked in real-time.
echo.
pause

REM Cleanup
del mongo-init.js >nul 2>nul