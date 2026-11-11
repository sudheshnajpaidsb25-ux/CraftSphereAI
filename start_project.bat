@echo off
TITLE CraftSphere AI Platform Launcher
COLOR 0A

echo ====================================================================
echo        CraftSphere AI - Cultural Heritage and Artisan Platform
echo             Goa AI Hackathon 2026 - Artisan Development
echo ====================================================================
echo.

REM Navigate to project root directory
cd /d "%~dp0"

REM Activate virtual environment if present
if exist "venv\Scripts\activate.bat" (
    echo [*] Activating virtual environment (venv)...
    call venv\Scripts\activate.bat
) else if exist ".venv\Scripts\activate.bat" (
    echo [*] Activating virtual environment (.venv)...
    call .venv\Scripts\activate.bat
) else (
    echo [*] No dedicated venv found. Utilizing system Python environment.
)

REM Verify Python installation
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed or not in PATH!
    pause
    exit /b 1
)

REM Verify Node installation
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed or not in PATH!
    pause
    exit /b 1
)

echo.
echo [*] Initializing SQLite database and verifying seeds...
python backend/seed_data.py

echo.
echo ====================================================================
echo [1/2] Starting FastAPI Backend Server on port 8000...
echo ====================================================================
start "CraftSphere AI - FastAPI Backend" cmd /k "cd backend && python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload"

echo.
echo ====================================================================
echo [2/2] Starting React Vite Frontend Server on port 5173...
echo ====================================================================
start "CraftSphere AI - React Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ====================================================================
echo               CraftSphere AI Platform is Launching!
echo ====================================================================
echo.
echo   Local Web Application:    http://localhost:5173
echo   FastAPI REST Backend:     http://localhost:8000
echo   Interactive Swagger Docs: http://localhost:8000/docs
echo   Health Check Endpoint:    http://localhost:8000/api/health
echo.
echo Leave the opened terminal windows running to keep the services alive.
echo Press any key to exit this launcher window...
pause >nul

