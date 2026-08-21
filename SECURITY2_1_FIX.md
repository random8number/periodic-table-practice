# Security 2.1 Rules Fix

Security 2's first rules file rejected normal room creation.

Cause:
- `host` had `$other: false` but did not explicitly declare `uid` and `name`.
- `guest` had the same issue.
- presence records had `$other: false` but did not explicitly declare `role`, `online`, and `lastSeen`.

Firebase therefore rejected those legitimate children during validation.

## What to do

You do **not** need to import `answers.seed.json` again.

In Firebase:

**Realtime Database → Rules**

Replace the current Security 2 rules with:

`database.rules.security2.1.json`

and click **Publish**.

Then retry Create room.

The web app game schema is unchanged from Security 2, so this is primarily a rules correction.
