@echo off
set "PATH=C:\Program Files\nodejs;%PATH%"
cd /d "%~dp0backend"
echo ====================================================
echo Starting GourmetReserve Backend Server...
echo API running at: http://localhost:5000
echo ====================================================
node server.js
pause

