@echo off
echo Building Neon Club Mobile APK...
echo.

echo Step 1: Cleaning previous builds...
cd android
call gradlew clean
cd ..

echo.
echo Step 2: Building debug APK...
cd android
call gradlew assembleDebug
cd ..

echo.
echo Step 3: APK built successfully!
echo Location: android\app\build\outputs\apk\debug\app-debug.apk
echo.

echo Do you want to install the APK on connected device? (Y/N)
set /p choice=
if /i "%choice%"=="Y" (
    echo Installing APK...
    adb install android\app\build\outputs\apk\debug\app-debug.apk
    echo APK installed successfully!
) else (
    echo APK ready for manual installation.
)

echo.
echo Build complete!
pause