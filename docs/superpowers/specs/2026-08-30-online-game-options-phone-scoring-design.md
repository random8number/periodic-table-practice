# Online Game Options, Phone Layout and Scoring Design

## Purpose

Improve online multiplayer by giving each player private display choices, allowing the host to control which learning aids are permitted, making the game practical on a landscape phone, and replacing the current scoring with a streak-aware system that keeps later play meaningful.

## Scope

This design covers online multiplayer game creation, room state, rematches, each player's private element-list presentation, the landscape-phone play flow, and scoring. It does not add atomic-number sorting or change the element set selected for a game.

## Host game settings

Before creating an online room, the host is shown three independent permissions:

- Allow alphabetical sorting.
- Allow grouping by category.
- Allow category colours.

Random ordering is always available and cannot be disabled. Atomic-number ordering is not offered.

The selected permissions are stored in the authoritative room configuration. They remain unchanged for every rematch in that room. The host's browser remembers the most recently used permissions and pre-fills them when the host creates a future room, but the settings screen is still shown before that room is created.

Players cannot enable an aid that the host has disabled. Room settings received from another client must be treated as untrusted and validated against the supported permission keys and Boolean values.

## Private player display preferences

Each player independently chooses from the options permitted by the host:

- Random order.
- Alphabetical order, when permitted.
- Grouped by category, when permitted.
- Category colours on or off, when permitted.

These choices affect only that player's browser. They are not written to shared game state and are not sent to the other player. Changing order or colours must not alter element identity, placement, turn, score, streak or any other authoritative game value.

Grouped-by-category mode displays category headings even when category colours are off. Elements within each category are sorted alphabetically by element name. Categories use the game's existing category definitions and labels so sorting, headings and colours cannot disagree.

If a reconnect or refreshed room removes a previously available aid, the local preference falls back safely to random ordering and colours off as applicable.

## Phone play layout

The phone interface is designed for landscape orientation. The element list and periodic table each occupy the full available play area rather than appearing simultaneously.

The two views are spatially adjacent in a horizontal sliding container:

1. The player begins in the full-screen element-list view.
2. Selecting an element slides horizontally to the full-screen periodic-table view.
3. A selected-element bar remains visible above the table and shows the complete tile presentation, including the chemical symbol, atomic number, element name where space permits, and the applicable colour.
4. The player selects a table position.
5. After the result is shown, the interface slides back to the element list. A correct answer retains the same player's turn; an incorrect answer changes the turn before the list returns.

Players may also move between the two views using visible Elements/Table controls or a horizontal swipe. Manual navigation must preserve the currently selected element. Swipe gestures must not interfere with tapping a tile or table cell.

Placed table cells always show the chemical symbol prominently and the atomic number in smaller text. The element name is shown when the available cell size supports it. Unfilled positions remain blank.

Desktop and larger-tablet layouts may retain the existing simultaneous presentation. The sliding interface activates only where responsive sizing shows that displaying the table and element list together would make table targets impractically small.

## Scoring and turns

A correct placement keeps the player's turn and advances the player's current streak. Points for consecutive correct placements are:

| Consecutive correct placement | Points |
| ---: | ---: |
| 1st | 10 |
| 2nd | 10 |
| 3rd | 11 |
| 4th | 12 |
| 5th | 13 |
| 6th and every later placement in the streak | 14 |

An incorrect placement:

- deducts 2 points;
- resets that player's streak to zero;
- passes the turn to the other player; and
- leaves the incorrectly selected element available for a later attempt.

A score cannot fall below zero. The score display shows the current streak and the value of the next correct placement. The online authoritative game transaction calculates the result, updates score and streak, places a correct element or retains an incorrect element, and changes the turn when required. Clients render the committed result rather than independently deciding the score.

## Rematches

A rematch creates a fresh board, scores, streaks and turn state while retaining the room's host permissions. Each player's private display preferences remain local and continue into the rematch only when still permitted by the room settings.

## State boundaries

Shared authoritative state includes:

- host permission flags;
- game and rematch identity;
- available and placed elements;
- active player;
- both scores; and
- both streaks.

Private local state includes:

- selected sort mode;
- category-colour visibility;
- active phone view; and
- the transient selected element before an attempted placement, except where the existing online protocol requires that selection to validate the placement transaction.

## Failure handling

- A client joining with missing settings receives conservative defaults: random ordering only and category colours off.
- Unsupported or malformed room permissions are ignored rather than enabling an aid.
- A placement submitted after the turn has changed is rejected and the client refreshes from authoritative state.
- Repeated taps while a placement is being committed are disabled to prevent duplicate scoring.
- A connection loss during a slide or placement restores the authoritative board, score, streak and turn before input is re-enabled.
- Animation failure must not block play; controls still switch views without animation.

## Verification

Automated tests should cover:

- host settings creation, validation, persistence and rematch reuse;
- restoration of the host's last-used settings for a future room;
- independent player sort and colour preferences;
- hidden or disabled controls for aids that the host did not permit;
- random, alphabetical and category-grouped ordering;
- alphabetical ordering within each category and headings with colours off;
- the complete streak-scoring table, its 14-point cap, the 2-point wrong-answer deduction and the zero score floor;
- correct-answer turn retention and incorrect-answer turn passing;
- atomic updates under simultaneous or repeated placement requests;
- reconnect and stale-turn recovery; and
- responsive full-screen view switching, element-selection preservation, touch target size and swipe/button navigation.

Manual verification should include two browsers using different private settings in the same room, a full rematch, and play on a real phone in landscape orientation.
