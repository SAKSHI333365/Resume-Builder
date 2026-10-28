@echo off
setlocal

set "ROOT_DIR=%~dp0"
set "BACKEND_DIR=%ROOT_DIR%Backend"
set "FRONTEND_DIR=%ROOT_DIR%Fronted"

where npm >nul 2>nul
if errorlevel 1 (
  echo Node.js and npm were not found in PATH.
  echo Install Node.js from https://nodejs.org and then run this script again.
  pause
  exit /b 1
)

if not exist "%BACKEND_DIR%\package.json" (
  echo Backend folder not found at "%BACKEND_DIR%".
  pause
  exit /b 1
)

if not exist "%FRONTEND_DIR%\package.json" (
  echo Frontend folder not found at "%FRONTEND_DIR%".
  pause
  exit /b 1
)

if not exist "%BACKEND_DIR%\.env" (
  echo Missing Backend/.env
  echo Copy "%BACKEND_DIR%\.env.example" to "%BACKEND_DIR%\.env" and fill in your MongoDB and API credentials.
  pause
  exit /b 1
)

if not exist "%BACKEND_DIR%\node_modules" (
  echo Installing backend dependencies...
  call npm install --prefix "%BACKEND_DIR%"
  if errorlevel 1 exit /b 1
)

if not exist "%FRONTEND_DIR%\node_modules" (
  echo Installing frontend dependencies...
  call npm install --prefix "%FRONTEND_DIR%"
  if errorlevel 1 exit /b 1
)

start "Resume Studio Backend" cmd /k "cd /d ^"%BACKEND_DIR%^" && npm run dev"
start "Resume Studio Frontend" cmd /k "cd /d ^"%FRONTEND_DIR%^" && npm run dev -- --host 127.0.0.1"

echo Starting Resume Studio.
echo Frontend: http://127.0.0.1:5173
echo Backend health: http://127.0.0.1:3000/api/health
echo.
echo If either terminal closes immediately, check the console output for startup errors.
