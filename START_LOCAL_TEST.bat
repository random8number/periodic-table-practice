@echo off
cd /d "%~dp0"
title Periodic Table Practice v21.2 Stage 1.2
echo Starting Periodic Table Practice v21.2 Stage 1.2
echo.
echo IMPORTANT: this build uses port 8122 so it cannot accidentally
echo connect to an older test server on port 8000.
echo.
echo Opening http://localhost:8122
echo.
start "" "http://localhost:8122/?build=21.2-stage1.2"
py -m http.server 8122
pause
