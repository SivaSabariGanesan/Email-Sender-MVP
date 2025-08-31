@echo off
echo ========================================
echo    Email Sender - Initialization
echo ========================================
echo.

echo Installing Python dependencies...
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo Error: Failed to install Python dependencies
    pause
    exit /b 1
)
echo ✓ Python dependencies installed successfully
echo.

echo Installing React dependencies...
cd frontend
npm install
if %errorlevel% neq 0 (
    echo Error: Failed to install React dependencies
    pause
    exit /b 1
)
echo ✓ React dependencies installed successfully
cd ..
echo.

echo ========================================
echo    Setup Complete!
echo ========================================
echo.
echo To start the application:
echo 1. Run start_backend.bat (or cd backend && python app.py)
echo 2. Run start_frontend.bat (or cd frontend && npm start)
echo.
echo The application will be available at:
echo - Frontend: http://localhost:3000
echo - Backend:  http://localhost:5000
echo.
pause
