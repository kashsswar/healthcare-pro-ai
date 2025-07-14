@echo off
title Auto MongoDB Installer
color 0B

echo ========================================
echo    Auto MongoDB Community Installer
echo ========================================
echo.

echo [1/5] Checking if MongoDB is already installed...
sc query MongoDB >nul 2>&1
if %errorlevel% == 0 (
    echo MongoDB service already exists. Starting it...
    net start MongoDB >nul 2>&1
    echo MongoDB is ready!
    goto :setup_data
)

echo [2/5] Installing Chocolatey package manager...
powershell -Command "Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))" >nul 2>&1

echo [3/5] Installing MongoDB Community Server...
choco install mongodb -y

echo [4/5] Creating MongoDB directories and service...
if not exist "C:\data\db" mkdir "C:\data\db"
if not exist "C:\data\log" mkdir "C:\data\log"

echo [5/5] Starting MongoDB service...
net start MongoDB >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ MongoDB installed and started successfully!
) else (
    echo ⚠️ MongoDB installed but service start failed. Trying manual start...
    "C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --install --serviceName "MongoDB" --dbpath "C:\data\db" --logpath "C:\data\log\mongodb.log"
    net start MongoDB
)

:setup_data
echo.
echo ========================================
echo    Setting up sample data...
echo ========================================
node setup.js

echo.
echo ✅ MongoDB setup complete!
echo Backend: npm run dev
echo Frontend: cd client && npm start
pause