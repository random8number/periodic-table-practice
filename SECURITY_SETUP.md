# Firebase Security Setup — v21.3 Security 1

Use this order.

## 1. Enable Anonymous Authentication

Firebase Console:

**Security → Authentication → Sign-in method → Anonymous → Enable → Save**

Then run v21.3 Security 1 while Realtime Database is still in Test mode.

The online dialog should say:

`Firebase connected securely (anonymous session …)`

Create a First 20 room and join it from the phone.

Refresh either browser while the room is open. The same browser should automatically restore its room and role.

## 2. Replace Realtime Database Test rules

Only after the authenticated build works:

Firebase Console:

**Realtime Database → Rules**

Replace the Test-mode rules with all of `database.rules.json`, then click **Publish**.

Retest:
- create room
- join room
- correct move
- wrong move
- refresh/reconnect
- explicit Leave room

## What this first rule set does

- Unauthenticated clients cannot read or write.
- `/rooms` cannot be read as a complete list.
- Authenticated users must address a specific room code.
- The authenticated host owns room creation/deletion.
- The authenticated guest owns the guest slot.
- Only the host or guest can write game state.
- Presence can only be written by the matching Firebase UID.
- Basic room/game values are validated.

## Remaining limitation

This is the first security layer, not final anti-cheat protection.

A legitimate host or guest who deliberately modifies their own JavaScript is still a valid room member and could attempt to submit altered game-state values. Strict per-move validation or trusted server-side scoring is the next security stage.
