@echo off
set "PATH=C:\Program Files\nodejs;%PATH%"
cd /d "%~dp0frontend"
echo ====================================================
echo Starting GourmetReserve React Frontend (Vite)...
echo Website running at: http://localhost:5173
echo ====================================================
call npm run dev
pause

