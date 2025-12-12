@echo off
echo Starting Events Navigator...
echo.
echo Starting Backend on port 5000...
start "Events Navigator - Backend" cmd /k "cd /d %~dp0backend && python app.py"
timeout /t 3 /nobreak >nul
echo.
echo Starting Frontend on port 3000...
start "Events Navigator - Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"
echo.
echo Both servers starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Close this window when done.
pause

