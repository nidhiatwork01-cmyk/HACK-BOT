@echo off
echo ========================================
echo Starting Frontend Server
echo ========================================
cd frontend
echo Installing dependencies...
call npm install
echo.
echo Starting frontend on http://localhost:3000
echo.
call npm run dev
pause

