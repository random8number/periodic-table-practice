# Periodic Table Practice v21.2 — Stage 1.1

This build is the first Firebase online multiplayer connection test.

## Branch

Upload these files to the **`v21.2-online`** branch only.

Keep:
- `main` = stable v20
- `v21-development` = tested v21.1 local multiplayer
- `v21.2-online` = online development

## What Stage 1 does

- Preserves Single Player.
- Preserves v21.1 Local 2 Player.
- Adds **Online 2 player — test**.
- Player 1 can create a six-character room code.
- Player 2 can join the room from another browser/device.
- Both browsers listen to the same Firebase Realtime Database room.
- Both browsers should display the same player names when Player 2 joins.
- The host can leave and close the room.
- The guest can leave and return the room to waiting state.
- Room data is cleaned up with Firebase `onDisconnect` where possible.

## Important

**Element placements are deliberately disabled in online mode in Stage 1.**

This version is only intended to prove:

`Create room → room code → join room → both browsers see both players`

Once this is reliable, Stage 2 will synchronise game state, turns, scores, streaks and completed elements.

## Firebase

The client-side Firebase configuration is in `firebase-config.js`.

The current project uses:

`https://periodic-table-practice-default-rtdb.europe-west1.firebasedatabase.app/`

The build loads the Firebase JavaScript SDK from Google's CDN.

## Security warning

The Realtime Database is currently in **Test mode** for development. Test mode permits broad database access and must not be left as the final security configuration.

Before online multiplayer is considered ready, add Firebase Authentication and restrictive Realtime Database Security Rules.

## Test

Use two browser windows, two Chrome profiles, or ideally two devices.

1. On device/browser A choose **Online 2 player — test**.
2. Enter the first player's name and click **Create room**.
3. Note the six-character code.
4. On device/browser B choose **Online 2 player — test**.
5. Enter the second player's name and room code.
6. Click **Join room**.
7. Both screens should change from waiting to **Connected — both players are in the room**.

If opening `index.html` directly causes a browser/module restriction, serve the folder with a small local web server, for example:

`py -m http.server 8000`

Then open `http://localhost:8000`.


## Stage 1.1 fix

Fixed the Join Room transaction. The previous Stage 1 build could incorrectly report
"That room already has two players" because Firebase transactions may initially receive
a null local value before the server state has been loaded.

Stage 1.1 claims only the room's `guest` slot and treats null there correctly as an
available second-player position.
