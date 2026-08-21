# Periodic Table Practice — Multiplayer Rules v21

## Players
- Local multiplayer initially supports 2 players.
- For the online version, one player will create a game and the second player will join with a room code.
- Each player uses a display name.

## Game setup
- Both players use the same periodic table and available element pool.
- The element list is shuffled at the start.
- The selected Beginner, Intermediate, Advanced or Custom mode is fixed once the game begins.
- v21.1 includes a First 20 option for quick testing and All 118 for a full game.

## Turns
- Players take turns.
- Only the active player places an element.
- The screen clearly identifies whose turn it is.

## Correct placement
- A correct element remains permanently in place.
- It becomes unavailable in the element list.
- The player scores points and keeps the turn.
- Consecutive correct answers build a streak.

## Scoring
- 1st consecutive correct answer: 10 points
- 2nd: 12 points
- 3rd: 14 points
- 4th: 16 points
- 5th and every subsequent consecutive answer: 18 points

The streak reward is capped at 18 points per element.

## Incorrect placement
- Scores 0 points.
- The element returns to the available list.
- The correct position is not revealed.
- The player's streak resets to zero.
- The turn passes to the other player.

## Completed elements
- Correctly placed elements cannot be moved.
- Both players see completed elements.
- Completed elements cannot be selected again.

## Winning
- The game ends when all included elements are correctly placed.
- Highest score wins; equal scores are a draw.
- Results show final score, correct placements, accuracy and best streak.

## Hints and answers
- Hint and Show Answers are disabled in competitive multiplayer.
- Answers are checked immediately after every placement.
- Tooltip availability is controlled by the selected difficulty mode.
- Difficulty settings cannot be changed after the game begins.

## Timer
- v21 does not require a turn timer.
- A configurable timer may be added later.

## Connection loss
- This applies to the later online multiplayer version.
- A temporary disconnection should not immediately end a game.
- Players should be able to rejoin an existing room.


## v21.2 Stage 1 implementation note

The first online build only tests room creation, joining and synchronised player names.
The gameplay rules above remain the target for the later online gameplay stage.


## v21.2 Stage 2 implementation

Stage 2 implements the agreed multiplayer rules across two browsers/devices using Firebase Realtime Database. Touch devices use **tap an element → tap its table position**; desktop drag-and-drop remains available.


## v21.3 Security 1

Online players now use Firebase Anonymous Authentication. Realtime Database rules restrict room writes to authenticated room members, and refresh/reconnect restores the same authenticated room session.


## v21.3 Security 2

Firebase now validates the proposed move against a trusted symbol-to-atomic-number map and enforces the permitted score, streak, turn and completion-log transition. The browser proposes the move; the database rules independently accept or reject the resulting state.


## v21.3 Security 3

Connection loss pauses the game rather than causing a forfeit. Player presence is shown as Online/Offline and the same authenticated browser can reconnect to its room. Active and completed rooms have protected expiry data and genuinely expired records can be cleaned up opportunistically by later authenticated app launches.


## v21.4 Online Multiplayer Polish

Invite URLs carry only the six-character room code (`?room=ABC123`); player identity still comes from Firebase Anonymous Authentication.

After a game finishes, only the authenticated host may reset the game for a rematch. A rematch may change difficulty and element limit, clears all scores/streaks/attempts/completed elements, creates a fresh element order, and retains the same room/players.
