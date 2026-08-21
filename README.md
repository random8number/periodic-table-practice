# Periodic Table Practice v21.4 — Online Multiplayer Polish

Built from the known-good v21.3 Security 3.1 checkpoint.

## New in v21.4

### Invite links
- Copy room code.
- Copy invite link.
- `?room=ABC123` links open the multiplayer dialog automatically.
- Room code is pre-filled and the Join panel is highlighted.
- Invite query is removed after successful join/create so normal refresh uses the authenticated saved session.

### Rematch
- Host can choose Play again after a completed online game.
- Same room and same two players.
- Host can choose difficulty and First 20 / All 118 again.
- Scores, streaks, attempts and completed elements reset.
- Fresh shuffled order.
- Host starts the new game.
- Guest automatically follows into the new game.

### Lobby/status polish
- Removed the old “Connection Test” wording.
- Online mode no longer says “test”.
- Current game settings are shown in the room panel.
- Room expiry is visible again.
- Security 3.1 Online/Reconnecting/Offline presence remains.

## Firebase

Publish `database.rules.v21.4.json`.

The `/answers` node is unchanged.

The v21.4 rules continue accepting old `21.3-security3` rooms, so the Security 3.1 web build remains usable as a rollback.

## Local test
Port 8129, IPv4-bound launcher.

See `V21_4_SETUP.md`.
