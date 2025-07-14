@echo off
color 0C
echo Installing MongoDB Community Server...
echo.
echo 🚀 QUICK OPTION: Run 'quick-setup.bat' for automatic installation!
echo.
echo 📋 Manual Installation Steps:
echo.
echo 1. Go to: https://www.mongodb.com/try/download/community
echo 2. Download MongoDB Community Server for Windows
echo 3. Run the installer (.msi file)
echo 4. Choose "Complete" installation
echo 5. Install MongoDB as a Service (default)
echo 6. Install MongoDB Compass (optional GUI)
echo.
echo After installation:
echo 7. MongoDB service should start automatically
echo 8. Run: node setup.js (to create sample data)
echo 9. Start project: npm run dev
echo.
echo ☁️ Alternative - MongoDB Atlas (Cloud):
echo 1. Go to: https://www.mongodb.com/atlas
echo 2. Create free account and cluster
echo 3. Get connection string
echo 4. Update .env: MONGODB_URI=your-atlas-connection-string
echo.
echo 💡 TIP: Use 'quick-setup.bat' for automated installation!
echo.
pause