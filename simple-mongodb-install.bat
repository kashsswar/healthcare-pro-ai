@echo off
title Simple MongoDB Installer
color 0B

echo ========================================
echo    Simple MongoDB Installer
echo ========================================
echo.

echo [1/3] Downloading MongoDB installer...
powershell -Command "Invoke-WebRequest -Uri 'https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-7.0.4-signed.msi' -OutFile 'mongodb-installer.msi'"

echo [2/3] Installing MongoDB (this may take a few minutes)...
start /wait msiexec /i mongodb-installer.msi /quiet /norestart INSTALLLOCATION="C:\Program Files\MongoDB\Server\7.0\" ADDLOCAL="ServerService,Client"

echo [3/3] Starting MongoDB service...
if not exist "C:\data\db" mkdir "C:\data\db"
if not exist "C:\data\log" mkdir "C:\data\log"

sc create MongoDB binPath="C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe --service --dbpath=C:\data\db --logpath=C:\data\log\mongodb.log" DisplayName="MongoDB Database Server" start=auto
net start MongoDB

echo.
echo ✅ MongoDB installation complete!
echo Cleaning up...
del mongodb-installer.msi >nul 2>&1

echo.
echo Testing connection...
timeout /t 3 /nobreak >nul
node setup.js

pause