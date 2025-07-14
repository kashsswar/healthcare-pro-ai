@echo off
title Direct MongoDB Installer
color 0B

echo Installing MongoDB directly...
echo.

echo [1/4] Downloading MongoDB...
powershell -Command "Invoke-WebRequest -Uri 'https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-7.0.4-signed.msi' -OutFile 'mongodb.msi'"

echo [2/4] Installing MongoDB...
msiexec /i mongodb.msi /quiet /norestart

echo [3/4] Creating directories...
if not exist "C:\data\db" mkdir "C:\data\db"

echo [4/4] Starting MongoDB manually...
start "MongoDB Server" "C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --dbpath "C:\data\db"

echo.
echo ✅ MongoDB started! 
echo Wait 5 seconds then run: node setup.js
timeout /t 5 /nobreak >nul

node setup.js

del mongodb.msi >nul 2>&1
pause