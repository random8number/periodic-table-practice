@echo off
cd /d "%~dp0"
title Periodic Table Practice v21.4 Online Multiplayer
echo Starting Periodic Table Practice v21.4 Online Multiplayer
echo.
echo This build uses port 8129 and binds IPv4 explicitly.
echo.
echo PC local:
echo   http://localhost:8129
echo.
echo PC / phone LAN:
echo   http://YOUR-PC-IP:8129
echo.
echo For testing "Copy invite link" with a phone, open the PC copy using
echo http://YOUR-PC-IP:8129 first. A localhost invite only works on the PC itself.
echo.
start "" "http://localhost:8129/?build=21.4-online-polish"
py -m http.server 8129 --bind 0.0.0.0
pause
