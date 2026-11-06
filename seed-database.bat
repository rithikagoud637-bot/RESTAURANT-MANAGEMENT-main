@echo off
set "PATH=C:\Program Files\nodejs;%PATH%"
cd /d "%~dp0backend"
echo ====================================================
echo Seeding MongoDB database with restaurants and users...
echo ====================================================
node seed.js
pause

