# v21.6 Category Games — Design

## Goal

Add category-based multiplayer games while preserving the existing single-player behaviour and the known-good v21.5 multiplayer rules, scoring, reconnect, invite-link and rematch behaviour.

Category games will be available in both Local 2 Player and Online 2 Player.

## User interface

The existing multiplayer element-set selector remains the single control for choosing what is playable.

Existing choices remain:
- First 20
- First 36
- All 118

New choices:
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

The full periodic table remains visible. Only elements in the selected set appear in the playable element list. Slots outside the selected set remain visible but inactive for that game.

The same selector is used for Local 2 Player setup, Online 2 Player room creation, and Online Play Again/rematch.

## Category source of truth

The browser will continue using the app's existing `getCategory(...)` classification logic, so colours and category-game membership share the same classification.

In particular, Hydrogen remains in **Reactive non-metals**, matching the current app.

The ten category labels stay exactly as currently used by the app:
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

## Element-set model

The current numeric `elementLimit` model is insufficient for scattered category sets. v21.6 will introduce a stable `elementSetId` for every multiplayer game.

Planned IDs:
- `first20`
- `first36`
- `all118`
- `alkali`
- `alkaline-earth`
- `transition`
- `post-transition`
- `metalloids`
- `reactive-nonmetals`
- `halogens`
- `noble-gases`
- `lanthanides`
- `actinides`

The existing numeric ranges remain supported as named sets rather than being treated as a separate game type.

Each set has:
- a stable ID
- a display label
- a member list
- a required completion count

## Firebase trusted data

Add a protected root node `/elementSets` alongside the existing protected `/answers` node.

Example conceptual shape:

```text
elementSets/
  noble-gases/
    count: 7
    members/
      He: true
      Ne: true
      Ar: true
      Kr: true
      Xe: true
      Rn: true
      Og: true
```

`/elementSets` is not writable by clients. It is trusted lookup data used by Realtime Database security rules.

The existing `/answers/<symbol> = atomicNumber` map remains the authority for the correct table position.

For an online move to be accepted, Firebase must confirm both:
1. the submitted symbol is a member of the room's immutable selected element set; and
2. `/answers` confirms whether the submitted target atomic number is correct.

This preserves server-side protection against a modified browser inventing an easier set or submitting an out-of-set element.

## Room and game schema

Online room settings will store `elementSetId` instead of relying only on `elementLimit`.

The game state will also store the immutable selected `elementSetId` and the required completion count for that set.

For compatibility during deployment, v21.6 rules may continue accepting the existing v21.5 room version while new v21.6 rooms use the new schema. Existing active v21.5 rooms must not be broken by publishing the v21.6 rules.

The selected set may only change during the existing host-controlled rematch transition after a game is finished.

## Playable elements

A shared helper will resolve an `elementSetId` into the playable element array.

For numeric sets:
- `first20` => atomic numbers 1–20
- `first36` => atomic numbers 1–36
- `all118` => all elements

For category sets, membership is determined by the existing category classifier.

Local multiplayer uses this helper directly.

Online multiplayer uses the same resolved list for display, while Firebase independently enforces trusted membership through `/elementSets`.

## Gameplay

Existing competitive rules remain unchanged:
- correct placement permanently locks the element
- correct placement keeps the turn
- scoring remains 10, 12, 14, 16, then 18 for the fifth and later consecutive correct answers
- wrong placement scores 0
- wrong placement resets the current player's streak
- wrong placement changes turn
- the correct answer is not revealed after a wrong placement

The game finishes when every element in the selected set has been correctly placed.

Examples:
- Noble gases finishes after 7 correct unique placements
- First 20 finishes after 20
- All 118 finishes after 118

End-of-game results remain score, correct, accuracy and best streak.

## Rematch

The host can select any element set for Play Again, including switching between numeric ranges and categories.

The same room and players are retained. Scores, streaks, attempts, completed elements and shuffled order reset exactly as they do in v21.5.

Firebase must validate that only the authenticated host can change the selected set as part of a finished-game rematch.

## Presence, reconnect and invitations

No behaviour changes are planned for:
- anonymous authentication
- invite links
- online/offline/reconnecting presence
- 30-second reconnect grace
- automatic pause after the grace period
- room expiry and cleanup
- explicit host leave

These should be treated as regression-sensitive v21.5 behaviour.

## Failure handling

If an online room references an unknown or invalid `elementSetId`, the client must not start the game and should show a clear room/setup error rather than falling back silently to All 118.

If Firebase rejects a move, the local UI must resynchronise from the authoritative room state and display an online error without locally locking or scoring the element.

If trusted `/elementSets` data has not been deployed but the web build expects it, online category-room creation should fail clearly. Existing compatible v21.5 rooms should remain usable under the v21.6 rules.

## Files expected to change

Primary implementation files:
- `index.html` — add category choices and v21.6 version label
- `app.js` — shared element-set resolver, local/online setup, room/game state, rematch and display logic
- `database.rules.v21.6.json` — secure set membership and new room schema validation
- `elementSets.seed.json` — trusted Firebase seed data
- `README.md` / setup notes — deployment and test instructions

`/answers` data does not change.

## Testing strategy

Implementation will be test-driven around the new set resolver and category membership before production logic is changed.

Required checks:
- each named category resolves to the elements classified by the existing app logic
- Hydrogen is included in Reactive non-metals
- Noble gases resolves to exactly 7 elements
- First 20, First 36 and All 118 remain unchanged
- local category game displays only the selected set and finishes at its set count
- online category room stores an immutable valid set ID
- Firebase accepts a correct in-set move
- Firebase rejects an out-of-set symbol even if its table position is otherwise correct
- Firebase rejects a wrong target position for an in-set symbol
- scoring and turn behaviour are unchanged
- rematch can switch between category and numeric sets
- v21.5-compatible rooms remain accepted by the new rules during deployment
- invite links, reconnect grace and presence still work after the change

## Deployment

Because GitHub Pages currently publishes from `v21.2-online`, production code changes should only be pushed after the rules and seed data are ready together.

Recommended deployment order:
1. Prepare and validate the v21.6 web code, rules and `elementSets.seed.json`.
2. Import `/elementSets` into Firebase.
3. Publish `database.rules.v21.6.json`.
4. Push the v21.6 web files to `v21.2-online`.
5. Test a category game over the public GitHub Pages URL on two independent internet connections.

The existing v21.5 state remains the rollback checkpoint until v21.6 passes the live test.
