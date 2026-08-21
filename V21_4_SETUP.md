# v21.4 Online Multiplayer Polish — Setup and Test

v21.4 keeps the Security 3.1 authentication, move validation, presence, 30-second reconnect grace and room cleanup.

The existing `/answers` node is unchanged.

## 1. Publish the v21.4 rules

Firebase Console → Realtime Database → Rules

Replace the current rules with:

`database.rules.v21.4.json`

and Publish.

These rules still accept the previous `21.3-security3` room version, so the Security 3.1 checkpoint remains compatible if you need to roll back the web files.

A copy of the previous rules is included as:

`database.rules.security3-backup.json`

## 2. Local test

Run:

`START_LOCAL_TEST.bat`

PC:
`http://localhost:8129`

Phone:
`http://YOUR-PC-IP:8129`

Create a new v21.4 room.

## 3. Invite-link test

The room panel now has:

- Copy code
- Copy invite link

A public/GitHub Pages invite looks like:

`...?room=ABC123`

Opening it automatically opens Online 2 Player, pre-fills the room code and highlights the Join side.

### Local-network detail

If the PC page itself is open at `localhost`, a copied link would also contain `localhost`, which cannot work on the phone.

To test the invite link locally, first open the PC browser using:

`http://YOUR-PC-IP:8129`

Then create a room and press **Copy invite link**. That link will contain the LAN address and can be opened by the phone.

If v21.4 detects localhost, it shows the invite in a prompt and reminds you to replace localhost with the PC's IPv4 address.

## 4. Rematch test

Complete a First 20 game.

At results:
- Host gets **Play again**.
- Guest sees **Waiting for host**.

Host presses Play again and can choose:
- Beginner / Intermediate / Advanced / Custom
- First 20 / All 118

Press **Start rematch**.

Expected:
- same room code;
- same host and guest;
- fresh shuffled element list;
- scores/streaks/attempts reset to zero;
- completed table cleared;
- host starts;
- both devices automatically leave the old results screen and see the new game.

The server rules only permit the authenticated host to perform this finished-game reset.

## 5. Existing Security 3.1 behaviour to recheck

- correct scoring 10/12/14/16/18;
- wrong answer changes turn;
- phone screen lock shows Reconnecting first;
- full pause only after the 30-second grace expires;
- refresh/reconnect restores the same player;
- host Leave removes the room.

