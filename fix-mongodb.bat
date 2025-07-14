@echo off
title Fix MongoDB Service
color 0B

echo Fixing MongoDB service...
echo.

echo [1] Creating data directories...
if not exist "C:\data\db" mkdir "C:\data\db"
if not exist "C:\data\log" mkdir "C:\data\log"

echo [2] Installing MongoDB service...
"C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --install --serviceName "MongoDB" --serviceDisplayName "MongoDB Database" --dbpath "C:\data\db" --logpath "C:\data\log\mongodb.log"

echo [3] Starting MongoDB service...
net start MongoDB

echo [4] Testing connection...
timeout /t 3 /nobreak >nul
node setup.js

pause