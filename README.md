# Periodic Table Practice v21.8 - Online learning options

v21.8 adds host-controlled online learning aids, private display choices for each player, more competitive streak scoring, and a landscape-phone interface. New rooms use the `21.8-learning-options` format; older `21.5-first36` and `21.6-category-games` rooms remain readable.

## Start or join a game

Use **New Game** to choose the current game type, **Place Elements on Table**, then select Single Player, Local 2 Player, or Online 2 Player.

The common settings are owned by the player starting the game:

- element set
- difficulty
- player names where applicable

For an Online 2 Player room, the host chooses the common settings. **Join Game** accepts a room code or invite-link prefill, then shows an immutable preview of the host's game settings before the guest joins. Guests cannot edit the host's settings. Cancelling either dialog leaves the current board unchanged.

The host also chooses which learning aids players may use:

- alphabetical element order
- grouping elements by category
- category colours

Random order is always available. Atomic-number order is intentionally unavailable online. Each player privately chooses from the options the host permitted, so one player can use alphabetical order while the other uses category grouping or random order. Category groups retain their headings and list elements alphabetically within each group. These permissions carry into rematches, and the host's latest choices are remembered for the next new game.

## Single Player element sets

Single Player supports the same element sets as multiplayer:

- First 20
- First 36 - H to Kr
- All 118
- Alkali metals
- Alkaline earth metals
- Transition metals
- Post-transition metals
- Metalloids
- Reactive non-metals
- Halogens
- Noble gases
- Lanthanides
- Actinides

The full periodic table remains visible. When a subset is selected, only its elements are draggable and its corresponding target slots are active. For example, Noble gases contains seven elements, and Lanthanides runs from La through Lu.

## Local and Online 2 Player

Local and Online games use the host-owned common settings and the selected set's actual element count for progress and completion. Online correct placements retain the turn and award 10, 10, 11, 12, 13, then 14 points as the streak grows; later correct answers remain capped at 14. An incorrect online placement deducts 2 points without taking the score below zero, resets the streak, passes the turn, and leaves that element available. A rematch preserves the room's settings.

## Responsive table and tiles

The periodic-table cells stay square across supported layouts. Loose element tiles are calculated at 95% of the responsive table-cell size, keeping the tiles visually related to their targets while allowing the pool to fit beside the table on wider screens and below it on narrower screens. Saved splitter widths are constrained so they cannot distort narrow layouts.

During online play on a landscape phone, the element list and periodic table each use a full-width view. Selecting an element slides to the table; after an attempt, play returns to the list. Players can also use the **Choose element** and **Show table** buttons or swipe between views. The table view keeps a complete selected tile—atomic number, symbol, and name—visible above the board. Portrait phones use the normal stacked layout and show a suggestion to rotate. This behavior is determined from the viewport size and orientation, not by identifying the device.

## Deferred modes

Timed mode, weak-element practice, custom element sets, and quiz modes are intentionally deferred from v21.7. The current supported game type is **Place Elements on Table**.

## Firebase trusted data and rollback

`/answers` and `/elementSets` remain protected trusted data. Firebase validates both the selected set and correct atomic-number position; the browser does not receive authority to alter those records.

Historical Firebase seed and deployment instructions remain in `V21_6_SETUP.md`. The v21.8 rules are in `database.rules.v21.8.json`; the CI emulator workflow runs them with Java 21. Release promotion is handled through a reviewed pull request into `v21.2-online` after the acceptance gates pass.
