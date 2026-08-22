@echo off
cd /d "%~dp0"
title Periodic Table Practice v21.5 First 36
echo Starting Periodic Table Practice v21.5 First 36
echo.
echo This build uses port 8130 and binds IPv4 explicitly.
echo.
echo PC local:
echo   http://localhost:8130
echo.
echo PC / phone LAN:
echo   http://YOUR-PC-IP:8130
echo.
start "" "http://localhost:8130/?build=21.5-first36"
py -m http.server 8130 --bind 0.0.0.0
pause
