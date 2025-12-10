@echo off
REM Quick script to update manifest after config changes
echo.
echo ========================================
echo  ContextOS Extension Config Updater
echo ========================================
echo.

cd /d "%~dp0"
node update-manifest.js

echo.
echo ========================================
echo  Done! Now reload the extension:
echo  1. Go to chrome://extensions/
echo  2. Click reload on ContextOS Reader
echo ========================================
echo.
pause
