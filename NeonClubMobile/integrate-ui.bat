@echo off
echo Neon Club UI Integration Script
echo ===============================
echo.

echo Step 1: Backing up current screens...
if not exist "src\screens-backup" mkdir "src\screens-backup"
copy "src\screens\*" "src\screens-backup\" >nul 2>&1
echo ✓ Current screens backed up

echo.
echo Step 2: Extract your friend's ZIP file to temp-ui-extraction folder
echo Then press any key to continue...
pause >nul

echo.
echo Step 3: Copying new UI screens...
if exist "temp-ui-extraction\screens" (
    copy "temp-ui-extraction\screens\*" "src\screens\" >nul 2>&1
    echo ✓ New UI screens copied
) else (
    echo ✗ No screens folder found in temp-ui-extraction
    echo Please check the extracted files structure
)

echo.
echo Step 4: Integration complete!
echo.
echo Next steps:
echo 1. Check src/screens/ for new UI files
echo 2. Update API calls in new screens
echo 3. Test navigation
echo 4. Run: npm run android
echo.
pause