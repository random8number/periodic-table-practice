@echo off
cd /d "%~dp0"
echo Starting Periodic Table Practice v21.2 test server...
echo.
echo Open http://localhost:8000 in Chrome if it does not open automatically.
start "" http://localhost:8000
py -m http.server 8000
pause
