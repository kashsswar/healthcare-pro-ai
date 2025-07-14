@echo off
echo Starting HealthConnect AI Platform...

echo.
echo Installing backend dependencies...
call npm install

echo.
echo Installing frontend dependencies...
cd client
call npm install
cd ..

echo.
echo Setting up database with sample data...
node setup.js

echo.
echo Starting backend server...
start cmd /k "npm run dev"

echo.
echo Starting frontend development server...
cd client
start cmd /k "npm start"
cd ..

echo.
echo HealthConnect AI Platform is starting up!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit...
pause