# Firebase Security 2 Setup

This stage adds server-side validation of the game result.

## Before changing anything

Finish/leave any current online rooms.

Keep `database.rules.security1-backup.json`. It is the known-good Security 1 ruleset.

## Step 1 — seed the trusted answer map

In Firebase Console open:

**Realtime Database → Data**

Create/select a child at the database root named:

`answers`

Import the contents of `answers.seed.json` into that `answers` node.

The result should look roughly like:

- answers
  - H: 1
  - He: 2
  - Li: 3
  - ...
  - Og: 118

Do not put `answers` inside `rooms`.

The answer map is not readable or writable by normal clients once Security 2 rules are published; Firebase Rules can still reference it internally.

## Step 2 — publish the Security 2 rules

Go to:

**Realtime Database → Rules**

Replace the current rules with the complete contents of:

`database.rules.security2.json`

Click **Publish**.

## Step 3 — run Security 2

Extract the package and run:

`START_LOCAL_TEST.bat`

PC:
`http://localhost:8125`

Phone:
`http://YOUR-PC-IP:8125`

Confirm the page says **v21.3 Security 2**.

Create a new room. Old Security 1 rooms use a different schema and should not be reused.

## Test sequence

Use First 20.

1. Player 1 places a correct element: +10 and keeps turn.
2. Player 1 gets another correct: +12.
3. Player 1 makes a deliberate wrong move: 0, streak resets, turn passes.
4. Player 2 makes a correct move: +10 and keeps turn.
5. Refresh one browser: it should restore its existing role.
6. Complete the game and check the winner/results.

## What Firebase now validates

For every move, the rules check:

- the writer is the authenticated player whose turn it is;
- the selected symbol is a real element in the active game range;
- the target table position is within the active range;
- `/answers/<symbol>` determines whether the move is actually correct;
- the browser's `correct` flag must agree with that answer;
- the only permitted points are the exact 10/12/14/16/18 streak score;
- attempts/correct/streak/best streak/score must change by exactly the permitted amount;
- a correct answer keeps the turn;
- a wrong answer changes the turn;
- the completed-element log is append-only and can only append the element from the validated correct move;
- completed count changes by exactly one only on a correct move;
- the game can finish only when the completed count reaches the selected element limit;
- the winner must agree with the final validated scores.

## Rollback

If Security 2 rules reject normal play, republish:

`database.rules.security1-backup.json`

and use the previous v21.3 Security 1 build while the rule is adjusted.
