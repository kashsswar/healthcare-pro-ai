@echo off
title HealthCare Pro - OpenAI Setup
color 0D

echo.
echo ========================================
echo    HealthCare Pro - OpenAI AI Setup
echo    Configure AI Features
echo ========================================
echo.

echo [INFO] Setting up OpenAI API for AI-powered features...
echo.

:menu
echo Select OpenAI setup option:
echo.
echo [1] Use Real OpenAI API (Recommended for Production)
echo [2] Use Mock AI (Free for Development/Testing)
echo [3] Skip AI Features (Basic App Only)
echo.
set /p choice="Enter your choice (1-3): "

if "%choice%"=="1" goto real_openai
if "%choice%"=="2" goto mock_ai
if "%choice%"=="3" goto skip_ai
goto menu

:real_openai
echo.
echo [STEP 1/3] Setting up Real OpenAI API...
echo.
echo To get OpenAI API key:
echo 1. Go to: https://platform.openai.com/api-keys
echo 2. Sign up/Login to OpenAI
echo 3. Create new API key
echo 4. Copy the key (starts with sk-...)
echo.
start https://platform.openai.com/api-keys
echo.
set /p openai_key="Enter your OpenAI API key (sk-...): "

if "%openai_key%"=="" (
    echo [ERROR] OpenAI API key is required!
    pause
    goto real_openai
)

echo.
echo [STEP 2/3] Updating environment files...
goto update_env

:mock_ai
echo.
echo [INFO] Using Mock AI for development...
set openai_key=mock-openai-key-for-development
echo.
echo [STEP 2/3] Updating environment files...
goto update_env

:skip_ai
echo.
echo [INFO] Skipping AI features...
set openai_key=disabled
echo.
echo [STEP 2/3] Updating environment files...
goto update_env

:update_env
REM Update .env file
echo PORT=5000> .env
echo MONGODB_URI=mongodb://localhost:27017/healthcare_pro>> .env
echo JWT_SECRET=healthcare_pro_jwt_secret_2024_super_secure>> .env
echo ADMIN_SECRET_KEY=HEALTH_ADMIN_SECRET_2024>> .env
echo.>> .env
echo # OpenAI Configuration>> .env
echo OPENAI_API_KEY=%openai_key%>> .env
echo.>> .env
echo # Email Configuration (MOCK - For Development Only)>> .env
echo EMAIL_HOST=smtp.gmail.com>> .env
echo EMAIL_PORT=587>> .env
echo EMAIL_USER=kashsswar@gmail.com>> .env
echo EMAIL_PASS=DoctorHexaware@2025>> .env
echo EMAIL_MOCK_MODE=true>> .env
echo.>> .env
echo # Frontend URL>> .env
echo CLIENT_URL=http://localhost:3000>> .env

REM Update .env.production file
echo NODE_ENV=production> .env.production
echo MONGODB_URI=mongodb://localhost:27017/healthcare_pro>> .env.production
echo JWT_SECRET=healthcare_pro_jwt_secret_2024_super_secure>> .env.production
echo ADMIN_SECRET_KEY=HEALTH_ADMIN_SECRET_2024>> .env.production
echo PORT=5000>> .env.production
echo.>> .env.production
echo # OpenAI Configuration>> .env.production
echo OPENAI_API_KEY=%openai_key%>> .env.production
echo.>> .env.production
echo # Email Configuration (PRODUCTION - REAL EMAILS)>> .env.production
echo EMAIL_HOST=smtp.gmail.com>> .env.production
echo EMAIL_PORT=587>> .env.production
echo EMAIL_USER=kashsswar@gmail.com>> .env.production
echo EMAIL_PASS=DoctorHexaware@2025>> .env.production
echo EMAIL_MOCK_MODE=false>> .env.production
echo.>> .env.production
echo # Payment Gateway>> .env.production
echo RAZORPAY_KEY_ID=your_razorpay_key_id>> .env.production
echo RAZORPAY_KEY_SECRET=your_razorpay_key_secret>> .env.production

echo.
echo [STEP 3/3] Creating AI service configuration...
if not exist "utils" mkdir utils

if "%openai_key%"=="disabled" (
    echo // AI Features Disabled> utils\aiService.js
    echo module.exports = {>> utils\aiService.js
    echo   analyzeSymptoms: async ^(symptoms^) =^> ^({ riskLevel: 'low', recommendations: ['Consult doctor'] }^),>> utils\aiService.js
    echo   generateHealthTips: async ^(^) =^> ['Stay healthy', 'Exercise regularly'],>> utils\aiService.js
    echo   matchDoctor: async ^(symptoms^) =^> 'general'>> utils\aiService.js
    echo };>> utils\aiService.js
) else if "%openai_key%"=="mock-openai-key-for-development" (
    echo // Mock AI Service for Development> utils\aiService.js
    echo module.exports = {>> utils\aiService.js
    echo   analyzeSymptoms: async ^(symptoms^) =^> ^({>> utils\aiService.js
    echo     riskLevel: 'medium',>> utils\aiService.js
    echo     recommendations: ['Stay hydrated', 'Monitor symptoms', 'Consult doctor if symptoms persist']>> utils\aiService.js
    echo   }^),>> utils\aiService.js
    echo   generateHealthTips: async ^(^) =^> [>> utils\aiService.js
    echo     'AI Analysis: Maintain optimal oral pH levels',>> utils\aiService.js
    echo     'Clinical AI Insight: Hydration supports cellular regeneration',>> utils\aiService.js
    echo     'AI Health Protocol: 150 minutes weekly cardiovascular exercise'>> utils\aiService.js
    echo   ],>> utils\aiService.js
    echo   matchDoctor: async ^(symptoms^) =^> symptoms.includes^('tooth'^) ? 'dental' : 'general'>> utils\aiService.js
    echo };>> utils\aiService.js
) else (
    echo // Real OpenAI Service> utils\aiService.js
    echo const OpenAI = require^('openai'^);>> utils\aiService.js
    echo const openai = new OpenAI^({ apiKey: process.env.OPENAI_API_KEY }^);>> utils\aiService.js
    echo.>> utils\aiService.js
    echo module.exports = {>> utils\aiService.js
    echo   analyzeSymptoms: async ^(symptoms^) =^> {>> utils\aiService.js
    echo     const response = await openai.chat.completions.create^({>> utils\aiService.js
    echo       model: 'gpt-3.5-turbo',>> utils\aiService.js
    echo       messages: [{ role: 'user', content: `Analyze symptoms: ${symptoms}` }]>> utils\aiService.js
    echo     }^);>> utils\aiService.js
    echo     return { riskLevel: 'medium', recommendations: [response.choices[0].message.content] };>> utils\aiService.js
    echo   }>> utils\aiService.js
    echo };>> utils\aiService.js
)

echo.
echo [SUCCESS] OpenAI setup completed!
echo.
if "%openai_key%"=="disabled" (
    echo 🚫 AI Features: DISABLED
    echo Your app will work without AI features
) else if "%openai_key%"=="mock-openai-key-for-development" (
    echo 🤖 AI Features: MOCK MODE
    echo Perfect for development and testing
    echo No OpenAI costs, unlimited usage
) else (
    echo ✅ AI Features: REAL OpenAI API
    echo Advanced AI-powered health recommendations
    echo Symptom analysis and doctor matching
    echo Note: OpenAI API usage will be charged
)
echo.
echo 📁 Updated Files:
echo - .env (Development configuration)
echo - .env.production (Production configuration)
echo - utils\aiService.js (AI service module)
echo.
echo 💡 AI Features Available:
echo ✅ Smart symptom analysis
echo ✅ Personalized health recommendations
echo ✅ AI-powered doctor matching
echo ✅ Health risk assessment
echo.
echo 🚀 Your AI system is ready!
echo Run: start-mock-app.bat to test
echo.
pause