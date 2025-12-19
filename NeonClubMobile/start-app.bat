@echo off
echo Starting Neon Club Mobile App...
echo.

echo Step 1: Starting Metro bundler...
start "Metro Bundler" cmd /k "npm start"

echo.
echo Step 2: Waiting for Metro to start...
timeout /t 10 /nobreak > nul

echo.
echo Step 3: Building and installing app on device...
echo Make sure your Android device is connected or emulator is running
pause

npm run android

echo.
echo App should now be running on your device!
pause