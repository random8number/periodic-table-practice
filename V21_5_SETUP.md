# v21.5 — First 36

v21.5 adds a new **First 36** element set.

First 36 means atomic numbers **1–36: H through Kr**.

It is available in:
- Local 2 Player
- Online room creation
- Online rematch

First 20 and All 118 remain available.

## Firebase

The existing `/answers` node is unchanged.

Publish:

`database.rules.v21.5.json`

The only security-rule change is to permit element limit `36` and the new v21.5 room version. All v21.4 validation, authentication, presence, reconnect grace, invite links, rematch rules and cleanup remain.

`database.rules.v21.4-backup.json` is included as a rollback copy.

The v21.5 rules continue to accept v21.4 and Security 3 room versions, so the older working web build remains usable if required.

## Local test

Run:

`START_LOCAL_TEST.bat`

PC:
`http://localhost:8130`

Phone:
`http://YOUR-PC-IP:8130`

## Suggested test

### Online First 36
1. Create an online room.
2. Select **First 36 — H to Kr**.
3. Join from the second device.
4. Confirm the available elements run from H through Kr only.
5. Confirm elements 37 onward are not active in the game.
6. Place a few correct and wrong answers and check scoring/turn changes.
7. Finish or use the game sufficiently to test a rematch.
8. From rematch choose First 20, First 36 and All 118 in turn to confirm the selector works.

### Local First 36
Start Local 2 Player and choose First 36. Confirm the same H–Kr range is used.

## Public GitHub Pages

After testing locally, upload this build to the online branch and publish the v21.5 rules first. The existing invite-link and internet multiplayer behaviour is unchanged.
