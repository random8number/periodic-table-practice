# Periodic Table Practice v21.2 — Stage 1.2

This replaces the earlier Stage 1 / Stage 1.1 connection-test builds.

## What was fixed

The previous Stage 1.1 ZIP accidentally still contained the original Join Room
transaction code. Stage 1.2 definitely contains the corrected code.

The local launcher now uses **port 8122 instead of 8000**. This prevents an old
Python test server from accidentally serving an earlier extracted folder.

The browser page visibly displays:

**v21.2 Stage 1.2**

next to the title, and the CSS/JavaScript URLs have version query strings to
avoid stale browser-cache copies.

## Test procedure

1. Extract this ZIP to a new folder.
2. Close any old Periodic Table / Python server command windows.
3. Double-click `START_LOCAL_TEST.bat`.
4. Confirm the page says **v21.2 Stage 1.2**.
5. Browser A: Online 2 player -> Create room.
6. Browser B: open the same Stage 1.2 site and join the six-character code.

For a second device on the same network, use:

`http://YOUR-PC-IP:8122`

rather than localhost.

## GitHub

The files may also be uploaded to the `v21.2-online` branch, but the BAT test
does **not** use GitHub Pages. It serves the files directly from the extracted
folder on your PC.

## Firebase

Realtime Database:
`https://periodic-table-practice-default-rtdb.europe-west1.firebasedatabase.app/`

This development build still assumes the Realtime Database is in Test mode.
Security rules/authentication will be added before public multiplayer use.
