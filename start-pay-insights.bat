@echo off
cd /d %~dp0
if not exist node_modules (
  echo Installing dependencies...
  npm install
)
echo Building Pay Insights for production...
npm run build
if %errorlevel% neq 0 exit /b %errorlevel%
echo Starting Pay Insights production server on http://localhost:3000
npm run start
