@echo off
REM Eventify Repository Setup Script for Windows
REM This script automates the creation of a private eventify repository

echo.
echo 🎉 Eventify Repository Setup
echo ==============================
echo.

REM Check if gh CLI is installed
where gh >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ GitHub CLI (gh) is not installed!
    echo Please install it from: https://cli.github.com/
    echo.
    echo Installation command:
    echo   winget install --id GitHub.cli
    echo.
    pause
    exit /b 1
)

echo ✅ GitHub CLI is installed
echo.

REM Check authentication
gh auth status >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo 🔐 Not authenticated with GitHub. Please login...
    gh auth login
)

echo ✅ Authenticated with GitHub
echo.

REM Get username
for /f "tokens=*" %%i in ('gh api user --jq ".login"') do set GITHUB_USER=%%i
echo 👤 GitHub Username: %GITHUB_USER%
echo.

REM Ask for confirmation
set /p CONFIRM="📋 Create private repository 'eventify'? (y/n) "
if /i not "%CONFIRM%"=="y" (
    echo ❌ Operation cancelled
    exit /b 0
)

echo.
echo 🚀 Creating private repository 'eventify'...

REM Create repository
gh repo create eventify --private --description "Event management and planning platform" --clone

if %ERRORLEVEL% EQU 0 (
    echo ✅ Repository created successfully!
) else (
    echo ❌ Failed to create repository
    exit /b 1
)

echo.
echo 📁 Setting up project structure...
cd eventify

REM Get the path to the template directory
set TEMPLATE_DIR=%~dp0eventify-template

if exist "%TEMPLATE_DIR%" (
    echo 📋 Copying template files...
    
    REM Copy all files
    xcopy /E /I /Y "%TEMPLATE_DIR%\*" .
    
    echo ✅ Template files copied
) else (
    echo ⚠️  Template directory not found
    echo Creating basic structure manually...
    
    mkdir src
    
    REM Create basic package.json
    (
        echo {
        echo   "name": "eventify",
        echo   "version": "1.0.0",
        echo   "description": "Event management platform",
        echo   "main": "src/index.js",
        echo   "type": "module",
        echo   "private": true
        echo }
    ) > package.json
    
    echo ✅ Basic structure created
)

echo.
echo 📝 Committing changes...
git add .
git commit -m "Initial commit: Setup eventify project structure"

echo.
echo ⬆️  Pushing to GitHub...
git push origin main

echo.
echo ✅ Setup complete!
echo.
echo 📍 Repository: https://github.com/%GITHUB_USER%/eventify
echo.
echo 🎯 Next steps:
echo    1. cd eventify
echo    2. npm install
echo    3. copy .env.example .env  (and configure)
echo    4. npm start
echo.
echo 🌐 Open repository in browser:
echo    gh repo view --web
echo.
echo Happy coding! 🎉
echo.
pause
