# Periodic Table Practice v21.2 — Stage 2

Stage 2 adds the first complete two-device online game.

## Upload
Upload these files to the **`v21.2-online`** branch only.

## Stage 2
- Shared Firebase game state on two devices.
- Same element order.
- Synchronised turns, scores, streaks and completed elements.
- Correct answer keeps the turn.
- Wrong answer scores 0, resets the streak and passes the turn.
- Wrong attempts briefly flash on both screens without revealing the answer.
- End-of-game results.
- First 20 and All 118 modes.
- Existing Single Player and Local 2 Player remain.
- Desktop drag-and-drop remains available.

## Phone / tablet
Online multiplayer now supports:

**Tap an element → tap its table position**

The table remains at touch-friendly cell sizes and scrolls horizontally on smaller screens.

## Test
1. Extract this ZIP into a fresh folder.
2. Close older test-server command windows.
3. Double-click `START_LOCAL_TEST.bat`.
4. Confirm the page says **v21.2 Stage 2**.
5. Create an Online 2 Player game on the PC, preferably First 20.
6. On the phone use `http://YOUR-PC-IP:8123`.
7. Join the room code.
8. Player 1 should have the first turn.

Scoring is 10 / 12 / 14 / 16 / 18, capped at 18 per consecutive correct answer.

## Security
Realtime Database is still in development/Test mode. Authentication and restrictive database rules must be added before a public multiplayer release.
