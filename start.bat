@echo off
REM Beast AI Heroes Academy - Quick Start Script for Windows
REM This script helps you get both the frontend and backend running

echo.
echo 🦸 Beast AI Heroes Academy - Quick Start
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✓ Node.js detected: %NODE_VERSION%
echo.

REM Check if backend directory exists
if not exist "backend" (
    echo ❌ Backend directory not found. Make sure you're in the project root.
    exit /b 1
)

REM Check if frontend src directory exists
if not exist "src" (
    echo ❌ Frontend src directory not found. Make sure you're in the project root.
    exit /b 1
)

echo ✓ Project structure detected
echo.

REM Check and create .env files
if not exist "backend\.env.local" (
    echo ⚠️  backend\.env.local not found
    if exist "backend\.env.example" (
        echo   Copying from template...
        copy backend\.env.example backend\.env.local
        echo   ✓ Created backend\.env.local
        echo   ⚠️  You must fill in OAuth credentials before starting!
    )
)

if not exist ".env.local" (
    echo ⚠️  Frontend .env.local not found
    if exist ".env.example" (
        echo   Copying from template...
        copy .env.example .env.local
        echo   ✓ Created .env.local
    )
)

echo.

REM Check backend dependencies
if not exist "backend\node_modules" (
    echo 📦 Installing backend dependencies...
    cd backend
    call npm install
    cd ..
    echo ✓ Backend dependencies installed
)

REM Check frontend dependencies
if not exist "node_modules" (
    echo 📦 Installing frontend dependencies...
    call npm install
    echo ✓ Frontend dependencies installed
)

echo.
echo ✅ Setup complete!
echo.
echo 📝 NEXT STEPS:
echo 1. Edit backend\.env.local with your OAuth credentials
echo 2. Start backend: cd backend ^&^& npm run dev
echo 3. In another terminal, start frontend: npm run dev
echo 4. Open http://localhost:3001 in your browser
echo.
echo 📚 For detailed setup instructions, see SETUP_GUIDE.md
echo.

REM Optional: Ask to open setup guide
setlocal enabledelayedexpansion
set /p CHOICE="Would you like to view the setup guide now? (y/n) "
if /i "!CHOICE!"=="y" (
    echo.
    echo 📖 Opening SETUP_GUIDE.md...
    start notepad SETUP_GUIDE.md
)

echo.
echo 💡 Quick commands:
echo   - Start backend: cd backend ^&^& npm run dev
echo   - Start frontend: npm run dev
echo   - Build: npm run build
echo   - Lint: npm run lint
echo.
