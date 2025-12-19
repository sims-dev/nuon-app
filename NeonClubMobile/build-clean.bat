@echo off
echo Neon Club Mobile - Clean Build Process
echo =====================================
echo.

echo Step 1: Cleaning Metro cache...
npx react-native start --reset-cache --port 8081 &
timeout /t 3 /nobreak > nul
taskkill /f /im node.exe 2>nul

echo.
echo Step 2: Cleaning Android build...
cd android
call gradlew clean
cd ..

echo.
echo Step 3: Clearing npm cache...
npm cache clean --force

echo.
echo Step 4: Reinstalling node modules...
rmdir /s /q node_modules 2>nul
npm install

echo.
echo Step 5: Building debug APK...
cd android
call gradlew assembleDebug
cd ..

echo.
echo Step 6: Build completed!
echo APK Location: android\app\build\outputs\apk\debug\app-debug.apk
echo.

echo Do you want to install the APK on connected device? (Y/N)
set /p choice=
if /i "%choice%"=="Y" (
    echo Installing APK...
    adb install -r android\app\build\outputs\apk\debug\app-debug.apk
    echo APK installed successfully!
    echo Starting the app...
    adb shell am start -n com.neonclubmobile/.MainActivity
) else (
    echo APK ready for manual installation.
)

echo.
echo Build process complete!
pause