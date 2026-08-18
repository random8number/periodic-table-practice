# Periodic Table Practice v21.1-dev

This is the first development version of the multiplayer game engine.

## Important

Upload these files to the **`v21-development` branch only**.  
Do not replace the files on `main` while v21 is being tested.

## v21.1 changes

- Existing single-player mode retained.
- Added **Local 2 Player** test mode.
- Player names entered before starting.
- Quick **First 20** game and full **All 118** game.
- Correct answer keeps the player's turn.
- Wrong answer resets the streak and changes player.
- Streak scoring: 10 / 12 / 14 / 16 / 18 points.
- Correctly placed elements are locked.
- Hint and Show Answers are disabled during multiplayer.
- Live scores, streaks and current-turn display.
- Results show score, correct placements, accuracy and best streak.
- Multiplayer scoring defaults are stored in `settings.json`.

## Files

- `index.html`
- `styles.css`
- `app.js`
- `settings.json`
- `MULTIPLAYER_RULES.md`
- `README.md`

## Testing

Start with **Local 2 Player → First 20**. This is intended to let us test a complete game quickly before adding online rooms/Firebase in v21.2.
