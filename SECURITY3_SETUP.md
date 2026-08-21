# v21.3 Security 3 — Setup and test

The `/answers` node is unchanged. Do not import it again.

## Publish
Firebase Console → Realtime Database → Rules

Replace the current rules with `database.rules.security3.json` and Publish.

Rollback: `database.rules.security2.1-backup.json`

## Run
Close older server windows and run `START_LOCAL_TEST.bat`.

PC: `http://localhost:8127`
Phone: `http://YOUR-PC-IP:8127`

Confirm **v21.3 Security 3** and create a new First 20 room.

## Connection test
1. Join from the phone.
2. Both badges should say Online.
3. Turn phone Wi-Fi off or close the phone browser.
4. When Firebase detects the disconnect, the PC shows that player Offline.
5. The game pauses and refuses moves.
6. Reconnect/reopen the same browser.
7. The existing authenticated session restores the same room.
8. Both badges return Online and play resumes with the same board/score/turn.

No automatic forfeit is applied.

## Expiry/cleanup
Active rooms roll forward to about 24 hours. Finished rooms shorten to about 1 hour.

A protected cleanupQueue lets later authenticated app sessions query up to 20 already-expired entries and remove rooms whose own server-protected expiry has passed.

This is opportunistic cleanup, not a continuously running scheduled server job. If nobody opens the app after expiry, the record can remain until the next app launch. This avoids requiring Cloud Functions / Cloud Scheduler for the project.

## Explicit leave
Host Leave removes the cleanup entry and room immediately.
Guest Leave releases the guest slot and returns the room to waiting.
