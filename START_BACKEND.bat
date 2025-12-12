@echo off
echo ========================================
echo Starting Backend Server
echo ========================================
cd backend
echo Installing essential packages...
pip install Flask==3.0.0 flask-cors==4.0.0 PyJWT==2.8.0 bcrypt==4.1.2 python-dotenv==1.0.0
echo.
echo Starting backend on http://localhost:5000
echo.
python app.py
pause

