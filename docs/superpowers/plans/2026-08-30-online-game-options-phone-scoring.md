# Online Game Options, Phone Layout and Scoring Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add host-permitted learning aids, private per-player presentation choices, a full-screen sliding landscape-phone interface, and the agreed 10–14 point streak scoring with a 2-point incorrect-answer deduction.

**Architecture:** Add a small pure helper module for permission and preference normalization, then let `app.js` bind those helpers to the existing New Game, room snapshot, list rendering and rematch flows. Shared permissions and scoring remain Firebase-authoritative; each player's sort/colour/view preference remains browser-local. Extend the existing responsive metrics and CSS state classes for the sliding phone layout rather than detecting user-agent strings.

**Tech Stack:** Static HTML/CSS/JavaScript, Node built-in test runner, Firebase Realtime Database transactions/rules/emulator, GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-08-30-online-game-options-phone-scoring-design.md`

## Global Constraints

- Random ordering is always available; atomic-number ordering is not available during online play.
- Host permissions are `allowAlphabetical`, `allowCategoryGrouping`, and `allowCategoryColours` Boolean values.
- Each player's sort, colour and active-phone-view choices remain local and must never be written to the room.
- Category mode uses existing category labels and alphabetically sorts elements within each category.
- Correct points by streak are `[10, 10, 11, 12, 13, 14]`, capped at 14 from the sixth correct answer onward.
- An incorrect answer deducts 2 points with a zero floor, resets the streak, passes the turn, and leaves the element available.
- The sliding layout is chosen from available dimensions/orientation, never from user-agent detection.
- Existing `21.5-first36` and `21.6-category-games` rooms remain readable; new rooms use `21.8-learning-options`.

---

## File structure

- Create `online-options.js`: pure room-permission, local-preference and online-list-order helpers.
- Create `tests/online-options.test.js`: unit tests for normalization, allowed choices and category ordering.
- Modify `index.html`: load the helper, add host permission inputs, private online controls, phone navigation and selected-tile presentation.
- Modify `app.js`: persist host defaults, write/read room permissions, apply private choices, implement scoring, and drive phone-view state.
- Modify `layout-metrics.js`: calculate when the workspace needs full-screen sliding views and the fitted phone cell size.
- Modify `styles.css`: host/private controls, category headings, selected tile, touch targets and sliding transitions.
- Create `database.rules.v21.8.json`: preserve current rules while accepting the new room version, permission schema and scoring transitions.
- Create `tests/rules-v21.8.test.js`: static rules-contract assertions.
- Modify `tests/firebase-room-create-emulator.test.mjs`: create and exercise a `21.8-learning-options` room.
- Modify `tests/game-setup.test.js`, `tests/layout-metrics.test.js`, and `tests/ui-contract-v21.7.test.js`: regression and UI contracts.
- Modify `.github/workflows/firebase-emulator.yml`: run the v21.8 rules/emulator suite.
- Modify `README.md`: document the new online options, scoring and phone flow.

---

### Task 1: Pure online permission and preference model

**Files:**
- Create: `online-options.js`
- Create: `tests/online-options.test.js`
- Modify: `index.html`

**Interfaces:**
- Produces: `PeriodicOnlineOptions.DEFAULT_HOST_PERMISSIONS`
- Produces: `normaliseHostPermissions(input): {allowAlphabetical:boolean, allowCategoryGrouping:boolean, allowCategoryColours:boolean}`
- Produces: `allowedSortModes(permissions): string[]`
- Produces: `normalisePlayerPreferences(input, permissions): {sortMode:string, categoryColours:boolean}`
- Produces: `sortElementsForOnline(elements, mode, getCategory, categoryOrder, random): Array`

- [ ] **Step 1: Write failing normalization and ordering tests**

```js
const test = require('node:test');
const assert = require('node:assert/strict');
const Options = require('../online-options.js');

test('host permissions accept only explicit booleans', () => {
  assert.deepEqual(Options.normaliseHostPermissions({
    allowAlphabetical: true,
    allowCategoryGrouping: 'yes',
    allowCategoryColours: false
  }), {
    allowAlphabetical: true,
    allowCategoryGrouping: false,
    allowCategoryColours: false
  });
});

test('private preferences fall back when the host disables an aid', () => {
  assert.deepEqual(Options.normalisePlayerPreferences(
    { sortMode: 'category', categoryColours: true },
    { allowAlphabetical: true, allowCategoryGrouping: false, allowCategoryColours: false }
  ), { sortMode: 'random', categoryColours: false });
});

test('category order is stable and alphabetical inside each category', () => {
  const elements = [[3,'Li'], [1,'H'], [11,'Na'], [2,'He']];
  const categories = { Li:'Alkali metals', H:'Reactive non-metals', Na:'Alkali metals', He:'Noble gases' };
  const sorted = Options.sortElementsForOnline(
    elements, 'category', (_n, symbol) => categories[symbol],
    ['Alkali metals', 'Reactive non-metals', 'Noble gases'], () => 0.5
  );
  assert.deepEqual(sorted.map(element => element[1]), ['Li', 'Na', 'H', 'He']);
});
```

- [ ] **Step 2: Run the unit test and verify RED**

Run: `node --test tests/online-options.test.js`

Expected: FAIL because `online-options.js` does not exist.

- [ ] **Step 3: Implement the UMD helper**

```js
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.PeriodicOnlineOptions = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  const DEFAULT_HOST_PERMISSIONS = Object.freeze({
    allowAlphabetical: true,
    allowCategoryGrouping: true,
    allowCategoryColours: true
  });

  function normaliseHostPermissions(input = {}) {
    return {
      allowAlphabetical: input.allowAlphabetical === true,
      allowCategoryGrouping: input.allowCategoryGrouping === true,
      allowCategoryColours: input.allowCategoryColours === true
    };
  }

  function allowedSortModes(permissions) {
    const value = normaliseHostPermissions(permissions);
    return ['random']
      .concat(value.allowAlphabetical ? ['alpha'] : [])
      .concat(value.allowCategoryGrouping ? ['category'] : []);
  }

  function normalisePlayerPreferences(input = {}, permissions = {}) {
    const allowed = allowedSortModes(permissions);
    return {
      sortMode: allowed.includes(input.sortMode) ? input.sortMode : 'random',
      categoryColours: normaliseHostPermissions(permissions).allowCategoryColours
        && input.categoryColours === true
    };
  }

  function sortElementsForOnline(elements, mode, getCategory, categoryOrder, random = Math.random) {
    const sorted = [...elements];
    if (mode === 'alpha') return sorted.sort((a, b) => a[2].localeCompare(b[2]));
    if (mode === 'random') return sorted.sort(() => random() - 0.5);
    if (mode !== 'category') return sorted;
    const rank = new Map(categoryOrder.map((category, index) => [category, index]));
    return sorted.sort((a, b) => {
      const categoryA = getCategory(a[0], a[1], a[3], a[4]);
      const categoryB = getCategory(b[0], b[1], b[3], b[4]);
      return (rank.get(categoryA) ?? 999) - (rank.get(categoryB) ?? 999)
        || a[2].localeCompare(b[2]);
    });
  }

  return { DEFAULT_HOST_PERMISSIONS, normaliseHostPermissions, allowedSortModes,
    normalisePlayerPreferences, sortElementsForOnline };
});
```

- [ ] **Step 4: Load `online-options.js` before `app.js` and rerun tests**

Run: `node --test tests/online-options.test.js tests/ui-contract-v21.7.test.js`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add online-options.js index.html tests/online-options.test.js
git commit -m "feat: add online learning-option model"
```

---

### Task 2: Host permissions and private player controls

**Files:**
- Modify: `index.html`
- Modify: `app.js`
- Modify: `styles.css`
- Modify: `tests/ui-contract-v21.7.test.js`

**Interfaces:**
- Consumes: `PeriodicOnlineOptions` from Task 1.
- Produces: `readHostPermissions(): HostPermissions`
- Produces: `getOnlineHostPermissions(roomData): HostPermissions`
- Produces: `applyOnlinePlayerPreferences(nextPreferences): void`
- Local-storage keys: `periodicTableHostPermissions-v21.8`, `periodicTableOnlinePreferences-v21.8`

- [ ] **Step 1: Add failing UI contract tests**

Assert that the Online section of New Game contains `hostAllowAlphabetical`, `hostAllowCategoryGrouping`, and `hostAllowCategoryColours`; assert that the live toolbar contains online-only sort buttons for `random`, `alpha`, and `category`, a colour toggle, and no online atomic-order control. Assert that `app.js` reads host checkboxes, stores private preferences locally, and never includes private preference names in `roomData.settings`.

- [ ] **Step 2: Run and verify RED**

Run: `node --test tests/ui-contract-v21.7.test.js`

Expected: FAIL on the missing host and private controls.

- [ ] **Step 3: Add host and player markup**

Add the following fieldset inside `#newGameOnlineFields` and an `#onlinePrivateOptions` control row above `.main`:

```html
<fieldset id="onlineHostPermissions">
  <legend>Learning aids players may use</legend>
  <label><input id="hostAllowAlphabetical" type="checkbox" checked> Alphabetical sorting</label>
  <label><input id="hostAllowCategoryGrouping" type="checkbox" checked> Group by category</label>
  <label><input id="hostAllowCategoryColours" type="checkbox" checked> Category colours</label>
</fieldset>

<div id="onlinePrivateOptions" hidden>
  <span>My element order:</span>
  <button data-online-sort="random">Random</button>
  <button data-online-sort="alpha">Alphabetical</button>
  <button data-online-sort="category">By category</button>
  <label><input id="onlineCategoryColours" type="checkbox"> Category colours</label>
</div>
```

- [ ] **Step 4: Implement host-default and private-preference storage**

On `openNewGameDialog`, load host defaults or `DEFAULT_HOST_PERMISSIONS` into the three checkboxes. In `createOnlineRoom`, normalize and save those checkboxes, then write only the three permission flags under `settings.learningAids`. On room snapshots, normalize `settings.learningAids`, hide disallowed private controls, normalize the current local preferences, call `buildList(preferences.sortMode)`, and apply category colours locally with both `setTableColours` and `setElementColours` without mutating room state.

- [ ] **Step 5: Remove the online sort lock without unlocking forbidden controls**

Change `setOnlineRoomControls` so the general single-player sort controls remain disabled in online mode, while `#onlinePrivateOptions` is independently enabled from `allowedSortModes`. Change `sortElements(mode)` to permit online calls only when `mode` is in the current room's allowed list; local multiplayer remains locked.

- [ ] **Step 6: Make category grouping alphabetical**

Use `sortElementsForOnline` for online `alpha`, `category`, and random order. Keep the server-provided `game.elementOrder` as the stable random order for `random` so rebuilding the list does not reshuffle mid-turn. Preserve category headings regardless of category-colour state.

- [ ] **Step 7: Render room permissions and verify private isolation**

Extend `#onlineGameSettings` with concise labels such as `A–Z allowed • Categories allowed • Colours allowed`. Open two browsers against the same room, select different allowed sorts/colours, and verify neither snapshot writes or changes the other browser's preference.

- [ ] **Step 8: Run tests and commit**

Run: `node --test tests/online-options.test.js tests/ui-contract-v21.7.test.js tests/game-setup.test.js`

```bash
git add index.html app.js styles.css tests/ui-contract-v21.7.test.js
git commit -m "feat: add host-permitted private online options"
```

---

### Task 3: Versioned Firebase room schema and rematch persistence

**Files:**
- Modify: `app.js`
- Create: `database.rules.v21.8.json`
- Create: `tests/rules-v21.8.test.js`
- Modify: `tests/firebase-room-create-emulator.test.mjs`
- Modify: `.github/workflows/firebase-emulator.yml`

**Interfaces:**
- Consumes: `settings.learningAids` from Task 2.
- Produces: new room version `21.8-learning-options`.
- Preserves: older `21.5-first36` and `21.6-category-games` read/join support.

- [ ] **Step 1: Write failing static rules tests**

Load `database.rules.v21.8.json` and assert it recognizes `21.8-learning-options`, requires exactly the three Boolean `settings/learningAids` children for that version, disallows `$other`, and requires rematch writes to retain all three values unchanged.

- [ ] **Step 2: Extend the emulator fixture and verify RED**

Create a `21.8-learning-options` room fixture with:

```js
learningAids: {
  allowAlphabetical: true,
  allowCategoryGrouping: true,
  allowCategoryColours: false
}
```

Add an `assertFails` case for a string permission and another for a guest attempting to modify permissions. Run the v21.8 rules tests and emulator command; expect failure until the rules exist.

- [ ] **Step 3: Copy the deployed v21.6 rules into v21.8 and add the new branch**

Retain legacy expressions unchanged. For `21.8-learning-options`, require `settings` children `difficulty`, `elementSetId`, `requiredCount`, `elementLimit`, and `learningAids`; require each learning-aid child to be Boolean and reject other children. Creation remains host-authenticated. Rematch settings may change difficulty/element set but must compare each new permission value to its existing value.

- [ ] **Step 4: Update app room creation and compatibility**

Add `21.8-learning-options` to `isSupportedOnlineRoomVersion`; create new rooms at that version; treat both 21.6 and 21.8 as category-set rooms in element-set validation, completion count, and rematch construction. Rematches copy `data.settings.learningAids` verbatim rather than rereading host controls.

- [ ] **Step 5: Run rules and emulator verification**

Run:

```bash
node --test tests/rules-v21.8.test.js tests/firebase-emulator-workflow.test.js
npx --no-install firebase emulators:exec --only database --project demo-periodic-table "node --test tests/firebase-room-create-emulator.test.mjs"
```

Expected: all static and emulator tests PASS; malformed or guest-modified permissions are rejected.

- [ ] **Step 6: Commit**

```bash
git add app.js database.rules.v21.8.json tests/rules-v21.8.test.js tests/firebase-room-create-emulator.test.mjs .github/workflows/firebase-emulator.yml
git commit -m "feat: validate online learning aids in room schema"
```

---

### Task 4: Agreed scoring and authoritative wrong-answer deduction

**Files:**
- Modify: `app.js`
- Modify: `database.rules.v21.8.json`
- Modify: `tests/rules-v21.8.test.js`
- Modify: `tests/firebase-room-create-emulator.test.mjs`
- Create: `tests/multiplayer-scoring.test.js`

**Interfaces:**
- Produces: `pointsForStreak(streak): number` mapping `1..∞` to `10,10,11,12,13,14..`.
- Produces: `scoreAfterIncorrect(score): number` returning `max(0, score - 2)`.
- `lastMove.points` is positive for correct answers and `-2` for incorrect answers.

- [ ] **Step 1: Write failing scoring tests**

```js
test('online streak points use the agreed cap', () => {
  assert.deepEqual([1,2,3,4,5,6,7].map(pointsForStreak), [10,10,11,12,13,14,14]);
});

test('incorrect deduction has a zero floor', () => {
  assert.equal(scoreAfterIncorrect(20), 18);
  assert.equal(scoreAfterIncorrect(1), 0);
  assert.equal(scoreAfterIncorrect(0), 0);
});
```

Extract these two pure functions into an exported UMD helper if direct `app.js` import would initialize the DOM; do not duplicate scoring tables between the test and production function.

- [ ] **Step 2: Run and verify RED**

Run: `node --test tests/multiplayer-scoring.test.js`

Expected: FAIL with the old `[10,12,14,16,18]` schedule and missing deduction helper.

- [ ] **Step 3: Implement transaction scoring**

Set the configured/default streak schedule to `[10,10,11,12,13,14]`. In the incorrect branch of `attemptOnlinePlacement`, set `points = -2`, set `player.score = Math.max(0, Number(player.score || 0) - 2)`, reset streak, and pass the turn. Update feedback to `incorrect — −2 points, streak reset and turn passes.`

- [ ] **Step 4: Update Firebase scoring validation**

For `21.8-learning-options`, accept correct `lastMove.points` only from `10,10,11,12,13,14` according to the prior streak; require incorrect `lastMove.points === -2`; and require the acting player's new score to equal `max(oldScore - 2, 0)` expressed as two rules branches (`oldScore >= 2` and `oldScore < 2`). Preserve old scoring validation for legacy room versions.

- [ ] **Step 5: Add emulator cases**

Verify a correct streak through seven moves produces `10,10,11,12,13,14,14`; verify an incorrect move deducts 2 and passes turn; verify a one-point score becomes zero; reject a client-submitted wrong score, wrong turn, or duplicate move number.

- [ ] **Step 6: Run tests and commit**

Run:

```bash
node --test tests/multiplayer-scoring.test.js tests/rules-v21.8.test.js
npx --no-install firebase emulators:exec --only database --project demo-periodic-table "node --test tests/firebase-room-create-emulator.test.mjs"
```

```bash
git add app.js database.rules.v21.8.json tests/multiplayer-scoring.test.js tests/rules-v21.8.test.js tests/firebase-room-create-emulator.test.mjs
git commit -m "feat: apply capped online streak scoring and penalties"
```

---

### Task 5: Responsive full-screen sliding phone layout

**Files:**
- Modify: `layout-metrics.js`
- Modify: `tests/layout-metrics.test.js`
- Modify: `index.html`
- Modify: `app.js`
- Modify: `styles.css`
- Modify: `tests/ui-contract-v21.7.test.js`

**Interfaces:**
- Extends `calculateWorkspaceMetrics(...)` result with `phoneSliding:boolean`.
- Produces: `setOnlinePhoneView('elements'|'table'): void`.
- Body classes: `online-phone-sliding`, `online-phone-view-elements`, `online-phone-view-table`.

- [ ] **Step 1: Write failing responsive metrics tests**

Add cases proving that a landscape 844×390 viewport with an undersized side-by-side table returns `phoneSliding: true`, a 390×844 portrait viewport returns false and stays stacked, and a sufficiently wide desktop returns false. Assert a landscape phone cell size fits 18 columns while remaining at least 40 CSS pixels when the viewport permits it.

- [ ] **Step 2: Run and verify RED**

Run: `node --test tests/layout-metrics.test.js tests/ui-contract-v21.7.test.js`

Expected: FAIL because `phoneSliding` and phone navigation do not exist.

- [ ] **Step 3: Extend dimension-based layout metrics**

Calculate:

```js
const landscape = Number(viewportWidth) > Number(viewportHeight);
const phoneSliding = stacked && landscape && Number(viewportWidth) <= 1100;
const slidingCellByWidth = (width - TABLE_PANEL_HORIZONTAL_CHROME - (17 * 3)) / 18;
const cellSize = phoneSliding
  ? Math.floor(clamp(40, slidingCellByWidth, 48) * 4) / 4
  : (stacked ? 48 : desktopCell);
```

Pass `viewportHeight` into `calculateWorkspaceMetrics`. Do not inspect `navigator.userAgent`.

- [ ] **Step 4: Add accessible view controls and complete selected tile**

Add `onlineShowElementsButton` in the table panel, `onlineShowTableButton` in the element panel, and `onlineSelectedTile` above the table. The selected tile must reuse `makeElementTile`/element data so it shows symbol, atomic number, name where space permits, and category class rather than a number-only placeholder.

- [ ] **Step 5: Drive sliding state from existing online events**

In `fitLayoutToViewport`, toggle `online-phone-sliding`. On online element selection, call `setOnlinePhoneView('table')`. After `showOnlineMoveFeedback`, wait only for the visible result interval and call `setOnlinePhoneView('elements')`. Preserve the selected symbol during manual button/swipe navigation; clear it only after the authoritative move snapshot or explicit deselection.

- [ ] **Step 6: Add CSS sliding views and touch behavior**

Under `body.online-room-mode.online-phone-sliding`, make `.main` a single overflow-hidden viewport, give table and elements panels full available width, and translate between them using the view classes. Keep buttons at least 44×44 CSS pixels. Add `touch-action: pan-y` to tiles/cells and implement a 55px horizontal swipe threshold that ignores gestures started on a draggable tile or control. Add a portrait notice asking the player to rotate; never block play if they remain in portrait.

- [ ] **Step 7: Verify real content and fallback behavior**

Test all 118 elements on an actual landscape phone. Confirm placed cells show symbols, selected tiles show complete content, category headings scroll, the table is not clipped, animation-disabled/reduced-motion mode switches instantly, and reconnect restores the authoritative board before input returns.

- [ ] **Step 8: Run tests and commit**

Run: `node --test tests/layout-metrics.test.js tests/ui-contract-v21.7.test.js tests/online-options.test.js`

```bash
git add layout-metrics.js tests/layout-metrics.test.js index.html app.js styles.css tests/ui-contract-v21.7.test.js
git commit -m "feat: add full-screen sliding online phone layout"
```

---

### Task 6: Full regression, documentation and deployment handoff

**Files:**
- Modify: `README.md`
- Verify: all files changed in Tasks 1–5

**Interfaces:**
- No new interfaces; this task verifies the integrated feature against the design spec.

- [ ] **Step 1: Update user documentation**

Document host permissions, per-player private choices, category-heading behavior with colours off, rematch persistence, scoring `10,10,11,12,13,14+ / −2 wrong`, and the landscape sliding phone flow. State explicitly that layout selection uses available dimensions rather than phone detection.

- [ ] **Step 2: Run the complete local suite**

Run:

```bash
node --test tests/*.test.js
node --test tests/*.test.mjs
```

Expected: all tests PASS with zero failures.

- [ ] **Step 3: Run Firebase emulator verification**

Run:

```bash
npx --no-install firebase emulators:exec --only database --project demo-periodic-table "node --test tests/firebase-room-create-emulator.test.mjs"
```

Expected: valid v21.8 create/join/correct/wrong/rematch operations pass; malformed permissions, stale turns and incorrect scoring fail.

- [ ] **Step 4: Complete two-browser and phone acceptance checks**

Create one room with all aids permitted. Use alphabetical/no-colours in one browser and category/colours in the other; confirm isolation. Finish enough moves to exercise all streak values, a wrong-answer zero floor, turn passing, reconnect and rematch. On a real phone, rotate to landscape and complete element selection → slide → placement → slide-back using both buttons and swipes.

- [ ] **Step 5: Re-read the design spec requirement by requirement**

Confirm every host-setting, private-state, phone-layout, scoring, rematch, failure-handling and verification requirement is represented in passing evidence. Record any deviation before deployment rather than silently omitting it.

- [ ] **Step 6: Commit documentation**

```bash
git add README.md
git commit -m "docs: describe online options scoring and phone play"
```

- [ ] **Step 7: Deployment checkpoint**

Push the implementation branch and open a pull request into `v21.2-online`. Do not deploy `database.rules.v21.8.json` or merge the web changes until the PR checks and emulator workflow are green. After merge, deploy the v21.8 Realtime Database rules first, then verify the GitHub Pages build and create a live two-player room.
