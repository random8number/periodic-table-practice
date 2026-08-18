@echo off
cd /d "%~dp0"
title Periodic Table Practice v21.2 Stage 2
echo Starting Periodic Table Practice v21.2 Stage 2
echo.
echo This build uses port 8123.
echo.
echo PC:    http://localhost:8123
echo Phone: http://YOUR-PC-IP:8123
echo.
start "" "http://localhost:8123/?build=21.2-stage2"
py -m http.server 8123
pause
