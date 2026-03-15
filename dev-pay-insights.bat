@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0"

where node >nul 2>nul
if %errorlevel% neq 0 (
  echo [ERROR] Node.js is not installed or not in PATH.
  exit /b 1
)

if not exist "node_modules" (
  echo Installing dependencies...
  if exist "package-lock.json" (
    call npm ci
  ) else (
    call npm install
  )
  if %errorlevel% neq 0 exit /b %errorlevel%
)

echo Starting Pay Insights in development mode on http://localhost:3000 ...
call npm run dev:win
exit /b %errorlevel%
