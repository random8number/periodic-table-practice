# Periodic Table Practice v21.7 - New Game

v21.7 introduces a single New Game flow for starting Single Player, Local 2 Player, and Online 2 Player games. The existing Firebase room format remains `21.6-category-games`; this release does not change Firebase rules, trusted seed data, or the online session key.

## Start or join a game

Use **New Game** to choose the current game type, **Place Elements on Table**, then select Single Player, Local 2 Player, or Online 2 Player.

The common settings are owned by the player starting the game:

- element set
- difficulty
- player names where applicable

For an Online 2 Player room, the host chooses the common settings. **Join Game** accepts a room code or invite-link prefill, then shows an immutable preview of the host's game settings before the guest joins. Guests cannot edit the host's settings. Cancelling either dialog leaves the current board unchanged.

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

Local and Online games use the host-owned common settings and the selected set's actual element count for progress and completion. A correct placement retains the current player's turn; a wrong placement gives no points, resets that player's streak, and passes the turn. Play Again/rematch preserves the current settings unless the host changes them before starting the next game.

## Responsive table and tiles

The periodic-table cells stay square across supported layouts. Loose element tiles are calculated at 90% of the responsive table-cell size, keeping the tiles visually related to their targets while allowing the pool to fit beside the table on wider screens and below it on narrower screens. Saved splitter widths are constrained so they cannot distort narrow layouts.

## Deferred modes

Timed mode, weak-element practice, custom element sets, and quiz modes are intentionally deferred from v21.7. The current supported game type is **Place Elements on Table**.

## Firebase trusted data and rollback

`/answers` and `/elementSets` remain protected trusted data. Firebase validates both the selected set and correct atomic-number position; the browser does not receive authority to alter those records.

Historical Firebase seed and deployment instructions remain in `V21_6_SETUP.md`. Keep `v21.6-known-good` as the rollback checkpoint until the v21.7 release candidate has completed manual acceptance testing. Live promotion of `v21.2-online` is deliberately out of scope for this branch.
