# v21.6 Category Games Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add secure category-based Local 2 Player and Online 2 Player games, with La/Ac classification corrected, while preserving all known-good v21.5 multiplayer behaviour.

**Architecture:** Move element data, category classification and element-set resolution into a small browser/Node-compatible `element-sets.js` module so it can be tested independently from the large UI file. New online rooms store a stable `elementSetId` plus trusted count/max-target metadata; Firebase independently validates membership against a protected `/elementSets` lookup while `/answers` remains authoritative for positions. v21.5 room validation remains accepted during deployment so publishing the new rules does not break existing rooms.

**Tech Stack:** Vanilla HTML/CSS/JavaScript, Node.js built-in test runner (`node:test`), Firebase Realtime Database security rules, Firebase Anonymous Auth, GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-08-22-category-games-design.md`

## Global Constraints

- Preserve single-player behaviour unchanged.
- Preserve v21.5 scoring: 10, 12, 14, 16, then 18 for fifth and later consecutive correct answers.
- Correct answer keeps the turn; wrong answer scores 0, resets streak and changes turn.
- Wrong answers must not reveal the correct location.
- Hydrogen stays `Reactive non-metals`.
- Lanthanum is `Lanthanides`; Actinium is `Actinides`.
- Intended category counts: Alkali metals 6, Lanthanides 15, Actinides 15, Noble gases 7.
- Category games are available in Local 2 Player, Online room creation and Online Play Again/rematch.
- Full periodic table remains visible; out-of-set slots are visibly inactive and cannot accept multiplayer attempts.
- `/answers` remains unchanged and protected.
- `/elementSets` is protected trusted data and is never writable by clients.
- Existing v21.5 rooms remain accepted by v21.6 rules during deployment.
- Preserve invite links, anonymous auth, live presence, 30-second reconnect grace, room expiry/cleanup and host leave behaviour.
- Do not push runtime v21.6 files to the live `v21.2-online` branch until seed data and rules are ready to deploy together.

---

### Task 1: Create the testable element-set core and correct La/Ac classification

**Files:**
- Create: `element-sets.js`
- Create: `tests/element-sets.test.js`
- Modify later in Task 3: `app.js`

**Interfaces:**
- Produces browser global: `window.PeriodicElementSets`
- Produces Node export with: `elements`, `categoryOrder`, `ELEMENT_SET_OPTIONS`, `getCategory(number, symbol, group, period)`, `resolveElementSet(setId)`, `getElementSetMeta(setId)`, `normaliseElementSetId(value)`, `buildElementSetsSeed()`
- `getElementSetMeta(setId)` returns `{ id, label, count, maxTarget, elements }` and throws `Error("Unknown element set: <id>")` for an invalid ID.

- [ ] **Step 1: Write the failing classification/set tests**

Create `tests/element-sets.test.js` using only Node built-ins:

```js
const test = require('node:test');
const assert = require('node:assert/strict');
const Sets = require('../element-sets.js');

function symbols(id) {
  return Sets.resolveElementSet(id).map(el => el[1]);
}

test('Hydrogen remains a reactive non-metal', () => {
  assert.equal(Sets.getCategory(1, 'H', 1, 1), 'Reactive non-metals');
});

test('La and Ac are in their f-block categories', () => {
  assert.equal(Sets.getCategory(57, 'La', 1, 8), 'Lanthanides');
  assert.equal(Sets.getCategory(89, 'Ac', 1, 9), 'Actinides');
  assert.ok(!symbols('alkali').includes('La'));
  assert.ok(!symbols('alkali').includes('Ac'));
});

test('corrected category counts are stable', () => {
  assert.equal(symbols('alkali').length, 6);
  assert.equal(symbols('lanthanides').length, 15);
  assert.equal(symbols('actinides').length, 15);
  assert.equal(symbols('noble-gases').length, 7);
});

test('legacy numeric sets are unchanged', () => {
  assert.deepEqual(symbols('first20').map(s => s), Sets.elements.slice(0, 20).map(el => el[1]));
  assert.deepEqual(symbols('first36').map(s => s), Sets.elements.slice(0, 36).map(el => el[1]));
  assert.equal(symbols('all118').length, 118);
  assert.equal(symbols('first36').at(-1), 'Kr');
});

test('categories partition all 118 elements exactly once', () => {
  const categoryIds = Sets.ELEMENT_SET_OPTIONS.filter(x => x.kind === 'category').map(x => x.id);
  const all = categoryIds.flatMap(symbols);
  assert.equal(all.length, 118);
  assert.equal(new Set(all).size, 118);
});

test('unknown element set is rejected', () => {
  assert.throws(() => Sets.getElementSetMeta('made-up-set'), /Unknown element set/);
});
```

- [ ] **Step 2: Run the test and verify RED**

Run:

```bash
node --test tests/element-sets.test.js
```

Expected: FAIL because `element-sets.js` does not exist.

- [ ] **Step 3: Implement `element-sets.js` minimally**

Move the existing 118-element array and `categoryOrder` from `app.js` into a UMD-style module. Correct classification order so the f-block checks occur before Group 1/2 checks:

```js
function getCategory(number, symbol, group, period) {
  const noble = ['He','Ne','Ar','Kr','Xe','Rn','Og'];
  const halogens = ['F','Cl','Br','I','At','Ts'];
  const metalloids = ['B','Si','Ge','As','Sb','Te','Po'];
  const nonMetals = ['H','C','N','O','P','S','Se'];
  const post = ['Al','Ga','In','Sn','Tl','Pb','Bi','Nh','Fl','Mc','Lv'];

  if (noble.includes(symbol)) return 'Noble gases';
  if (halogens.includes(symbol)) return 'Halogens';
  if (period === 8) return 'Lanthanides';
  if (period === 9) return 'Actinides';
  if (group === 1 && symbol !== 'H') return 'Alkali metals';
  if (group === 2) return 'Alkaline earth metals';
  if (group >= 3 && group <= 12) return 'Transition metals';
  if (metalloids.includes(symbol)) return 'Metalloids';
  if (nonMetals.includes(symbol)) return 'Reactive non-metals';
  if (post.includes(symbol)) return 'Post-transition metals';
  return 'Other';
}
```

Define the 13 sets once:

```js
const ELEMENT_SET_OPTIONS = [
  { id: 'first20', label: 'First 20 — quick game', kind: 'range', limit: 20 },
  { id: 'first36', label: 'First 36 — H to Kr', kind: 'range', limit: 36 },
  { id: 'all118', label: 'All 118', kind: 'range', limit: 118 },
  { id: 'alkali', label: 'Alkali metals', kind: 'category', category: 'Alkali metals' },
  { id: 'alkaline-earth', label: 'Alkaline earth metals', kind: 'category', category: 'Alkaline earth metals' },
  { id: 'transition', label: 'Transition metals', kind: 'category', category: 'Transition metals' },
  { id: 'post-transition', label: 'Post-transition metals', kind: 'category', category: 'Post-transition metals' },
  { id: 'metalloids', label: 'Metalloids', kind: 'category', category: 'Metalloids' },
  { id: 'reactive-nonmetals', label: 'Reactive non-metals', kind: 'category', category: 'Reactive non-metals' },
  { id: 'halogens', label: 'Halogens', kind: 'category', category: 'Halogens' },
  { id: 'noble-gases', label: 'Noble gases', kind: 'category', category: 'Noble gases' },
  { id: 'lanthanides', label: 'Lanthanides', kind: 'category', category: 'Lanthanides' },
  { id: 'actinides', label: 'Actinides', kind: 'category', category: 'Actinides' }
];
```

`resolveElementSet(id)` filters by atomic number for ranges and `getCategory` for categories. `normaliseElementSetId` must map legacy `20`, `36`, `118` values (number or string) to `first20`, `first36`, `all118` and otherwise return a valid ID or `null`.

- [ ] **Step 4: Run tests and verify GREEN**

```bash
node --test tests/element-sets.test.js
```

Expected: PASS, 6 tests.

- [ ] **Step 5: Commit Task 1 on isolated branch**

```bash
git add element-sets.js tests/element-sets.test.js
git commit -m "feat: add tested multiplayer element sets"
```

---

### Task 2: Generate trusted Firebase element-set seed data

**Files:**
- Modify: `element-sets.js`
- Modify: `tests/element-sets.test.js`
- Create: `scripts/generate-element-sets-seed.js`
- Create: `elementSets.seed.json`

**Interfaces:**
- `buildElementSetsSeed()` returns `{ [setId]: { count, maxTarget, members } }` where every member value is `true`.
- Generator writes exactly that object to `elementSets.seed.json`.

- [ ] **Step 1: Add failing seed-shape tests**

Append:

```js
test('trusted seed matches resolver membership', () => {
  const seed = Sets.buildElementSetsSeed();
  const noble = seed['noble-gases'];
  assert.equal(noble.count, 7);
  assert.equal(noble.members.He, true);
  assert.equal(noble.members.Og, true);
  assert.equal(noble.members.H, undefined);
  assert.equal(noble.maxTarget, 118);

  for (const option of Sets.ELEMENT_SET_OPTIONS) {
    const resolved = Sets.resolveElementSet(option.id);
    const seeded = Object.keys(seed[option.id].members);
    assert.deepEqual(seeded, resolved.map(el => el[1]));
    assert.equal(seed[option.id].count, resolved.length);
    assert.equal(seed[option.id].maxTarget, Math.max(...resolved.map(el => el[0])));
  }
});
```

- [ ] **Step 2: Verify RED**

```bash
node --test tests/element-sets.test.js
```

Expected: FAIL because `buildElementSetsSeed` is not implemented.

- [ ] **Step 3: Implement seed builder and generator**

In `element-sets.js`:

```js
function buildElementSetsSeed() {
  const out = {};
  for (const option of ELEMENT_SET_OPTIONS) {
    const resolved = resolveElementSet(option.id);
    out[option.id] = {
      count: resolved.length,
      maxTarget: Math.max(...resolved.map(el => el[0])),
      members: Object.fromEntries(resolved.map(el => [el[1], true]))
    };
  }
  return out;
}
```

Create generator:

```js
const fs = require('node:fs');
const path = require('node:path');
const Sets = require('../element-sets.js');

const target = path.join(__dirname, '..', 'elementSets.seed.json');
fs.writeFileSync(target, JSON.stringify(Sets.buildElementSetsSeed(), null, 2) + '\n');
console.log(`Wrote ${target}`);
```

Run:

```bash
node scripts/generate-element-sets-seed.js
```

- [ ] **Step 4: Verify GREEN and generated file**

```bash
node --test tests/element-sets.test.js
node -e "const x=require('./elementSets.seed.json'); if(x.alkali.count!==6 || x.lanthanides.count!==15 || x.actinides.count!==15 || x['noble-gases'].count!==7) process.exit(1)"
```

Expected: both commands exit 0.

- [ ] **Step 5: Commit Task 2**

```bash
git add element-sets.js tests/element-sets.test.js scripts/generate-element-sets-seed.js elementSets.seed.json
git commit -m "feat: generate trusted Firebase element sets"
```

---

### Task 3: Integrate category sets into Local 2 Player and shared UI

**Files:**
- Modify: `index.html`
- Modify: `app.js`
- Modify: `styles.css`
- Create: `tests/ui-contract.test.js`

**Interfaces:**
- `populateElementSetSelects()` populates `localElementSetSelect`, `onlineElementSetSelect`, `onlineRematchElementSetSelect` from `PeriodicElementSets.ELEMENT_SET_OPTIONS`.
- Local game stores `elementSetId`, `requiredCount`, `elementLimit` (`maxTarget`), and `elementOrder`.
- `getPlayableElements()` resolves from the active game set ID.
- `isElementPlayable(symbol)` returns whether the element belongs to the current multiplayer set.

- [ ] **Step 1: Write failing static UI contract tests**

Create `tests/ui-contract.test.js`:

```js
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const html = fs.readFileSync('index.html', 'utf8');
const js = fs.readFileSync('app.js', 'utf8');

test('v21.6 loads element set core before app', () => {
  assert.match(html, /element-sets\.js\?v=21\.6-category-games/);
  assert.match(html, /app\.js\?v=21\.6-category-games/);
  assert.ok(html.indexOf('element-sets.js') < html.indexOf('app.js'));
});

test('all three multiplayer selectors use shared population logic', () => {
  assert.match(js, /function populateElementSetSelects\(/);
  assert.match(js, /localElementSetSelect/);
  assert.match(js, /onlineElementSetSelect/);
  assert.match(js, /onlineRematchElementSetSelect/);
});

test('multiplayer has an inactive slot guard', () => {
  assert.match(js, /function isElementPlayable\(/);
  assert.match(js, /multiplayer-inactive/);
});
```

- [ ] **Step 2: Verify RED**

```bash
node --test tests/ui-contract.test.js
```

Expected: FAIL because v21.6 integration is not present.

- [ ] **Step 3: Integrate the module and selectors**

In `index.html`:
- bump visible build label to `v21.6 Category Games`;
- clear the hard-coded 20/36/118 options from the three multiplayer set selectors (keep the `<select>` elements);
- load `element-sets.js?v=21.6-category-games` before `app.js`;
- bump CSS/app cache-busting query strings to `21.6-category-games`.

In `app.js`:
- replace the embedded `elements`, `categoryOrder`, and category implementation with references/wrapper calls to `window.PeriodicElementSets`;
- add `populateElementSetSelects()` and call it during startup;
- normalise old config values `20/36/118` to named set IDs;
- change `startLocalMultiplayer()` to obtain `const meta = PeriodicElementSets.getElementSetMeta(selectedId)` and store `elementSetId`, `requiredCount`, `elementLimit: meta.maxTarget`, `elementOrder: shuffled symbols from meta.elements`;
- change Local Play Again reset to regenerate order from `elementSetId`;
- change local completion test from `completedSymbols.length >= elementLimit` to `completedSymbols.length >= requiredCount`;
- make `getPlayableElements()` resolve the active set instead of filtering only by `elementLimit`.

Add `isElementPlayable(symbol)` and have `makeSlot(...)`/multiplayer interaction classes add `multiplayer-inactive` to out-of-set slots. `handleMultiplayerDrop(...)`, tap placement and drag/drop entry points must return without scoring if the slot's element is outside the active set.

In `styles.css`, make inactive multiplayer slots visibly muted without hiding the table:

```css
body.local-game-mode .slot.multiplayer-inactive,
body.online-room-mode .slot.multiplayer-inactive {
  opacity: 0.35;
  cursor: default;
}
```

Do not set a fixed colour; preserve category colour logic.

- [ ] **Step 4: Run tests and syntax check**

```bash
node --check element-sets.js
node --check app.js
node --test tests/element-sets.test.js tests/ui-contract.test.js
```

Expected: PASS.

- [ ] **Step 5: Commit Task 3**

```bash
git add index.html app.js styles.css tests/ui-contract.test.js
git commit -m "feat: add local category games and shared selectors"
```

---

### Task 4: Add v21.6 Firebase rules with trusted membership validation and v21.5 compatibility

**Files:**
- Create from v21.5 rules: `database.rules.v21.6.json`
- Create: `tests/rules-v21.6.test.js`

**Interfaces:**
- Root `/elementSets` is read=false/write=false for clients, like `/answers`.
- New room version: `21.6-category-games`.
- New v21.6 settings/game fields: `elementSetId`, `requiredCount`; retain `elementLimit` as the trusted set `maxTarget` to minimise disruption to existing move logic.
- v21.5 room versions keep their existing numeric-limit validation path unchanged.

- [ ] **Step 1: Write failing rules contract tests**

Create `tests/rules-v21.6.test.js`:

```js
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const rules = JSON.parse(fs.readFileSync('database.rules.v21.6.json', 'utf8'));
const text = JSON.stringify(rules);

test('trusted elementSets is client immutable', () => {
  assert.equal(rules.rules.elementSets['.read'], false);
  assert.equal(rules.rules.elementSets['.write'], false);
});

test('rules accept both v21.5 and v21.6 room versions', () => {
  const expr = rules.rules.rooms['$room'].version['.validate'];
  assert.match(expr, /21\.5-first36/);
  assert.match(expr, /21\.6-category-games/);
});

test('v21.6 rules validate trusted set id, count and max target', () => {
  assert.match(text, /elementSets/);
  assert.match(text, /elementSetId/);
  assert.match(text, /requiredCount/);
  assert.match(text, /maxTarget/);
});

test('move validation requires trusted membership', () => {
  assert.match(text, /members/);
  assert.match(text, /lastMove\/symbol/);
});
```

- [ ] **Step 2: Verify RED**

```bash
node --test tests/rules-v21.6.test.js
```

Expected: FAIL because `database.rules.v21.6.json` does not exist.

- [ ] **Step 3: Create v21.6 rules from the exact v21.5 rules**

Copy `database.rules.v21.5.json` first, then make only scoped changes:

1. Add protected root node:

```json
"elementSets": {
  ".read": false,
  ".write": false
}
```

2. Permit `21.6-category-games` in room version validation while retaining `21.3-security3`, `21.4-online-polish`, and `21.5-first36`.

3. For `settings`, retain the old validation branch for pre-v21.6 rooms. For v21.6 rooms require `difficulty`, `elementLimit`, `elementSetId`, `requiredCount`, and validate:

```text
root/elementSets/<elementSetId> exists
settings/requiredCount == root/elementSets/<elementSetId>/count
settings/elementLimit == root/elementSets/<elementSetId>/maxTarget
```

Only the authenticated host may change these during the existing finished-game rematch transition.

4. For initial v21.6 `game`, require the same `elementSetId`, `requiredCount`, and `elementLimit` as settings. Preserve score/streak/attempt defaults and waiting/host-start behaviour.

5. On every non-rematch transition, require `elementSetId`, `requiredCount`, and `elementLimit` to remain unchanged.

6. In the v21.6 move branch, add trusted membership validation before correctness validation:

```text
root.child('elementSets')
    .child(data.child('elementSetId').val())
    .child('members')
    .child(newData.child('lastMove/symbol').val())
    .val() === true
```

Keep `/answers` correctness checks unchanged.

7. For v21.6 completion, use `requiredCount` instead of `elementLimit`. Keep the exact v21.5 completion rule for old room versions.

8. Rematch may replace set metadata only when old game status is `finished`, authenticated user is host, and the new set metadata exactly matches trusted `/elementSets`.

Do not weaken any host/guest UID, scoring, timestamp, presence, expiry or cleanup validation.

- [ ] **Step 4: Verify JSON and rules contracts**

```bash
node -e "JSON.parse(require('node:fs').readFileSync('database.rules.v21.6.json','utf8')); console.log('rules JSON OK')"
node --test tests/rules-v21.6.test.js
```

Expected: PASS.

- [ ] **Step 5: Commit Task 4**

```bash
git add database.rules.v21.6.json tests/rules-v21.6.test.js
git commit -m "feat: validate category games in Firebase rules"
```

---

### Task 5: Integrate secure category sets into Online 2 Player and rematches

**Files:**
- Modify: `app.js`
- Modify: `tests/ui-contract.test.js`
- Modify: `tests/element-sets.test.js`

**Interfaces:**
- `getOnlineElementSetId()` returns v21.6 `settings.elementSetId`; for legacy rooms it maps `settings.elementLimit` to `first20`, `first36`, or `all118`.
- `getOnlineRequiredCount()` returns v21.6 `requiredCount`; for legacy rooms it returns `elementLimit`.
- `createInitialOnlineGame(meta)` stores `elementSetId`, `requiredCount`, `elementLimit: meta.maxTarget`, and an order containing only set members.

- [ ] **Step 1: Extend failing UI contract tests for online schema**

Append:

```js
test('online category schema has legacy fallback helpers', () => {
  assert.match(js, /function getOnlineElementSetId\(/);
  assert.match(js, /function getOnlineRequiredCount\(/);
  assert.match(js, /21\.6-category-games/);
});

test('online completion uses required count', () => {
  assert.match(js, /getOnlineRequiredCount\(\)/);
});
```

- [ ] **Step 2: Verify RED**

```bash
node --test tests/ui-contract.test.js
```

Expected: FAIL because online schema helpers do not yet exist.

- [ ] **Step 3: Implement online room creation**

In `createOnlineRoom()`:
- read selected ID from `onlineElementSetSelect`;
- resolve `meta`; if invalid, display `Unknown element set` and do not write Firebase;
- write room version `21.6-category-games`;
- settings: `{ difficulty, elementSetId: meta.id, requiredCount: meta.count, elementLimit: meta.maxTarget }`;
- game from `createInitialOnlineGame(meta)`.

Before creating a category room, perform a lightweight Firebase read of `/elementSets/<id>/count` using the authenticated client. Because client reads are intentionally denied by rules, do **not** depend on reading trusted data from the browser. Instead, detect deployment problems from room-create permission rejection and show: `Category game could not be created. Check that the v21.6 Firebase elementSets data and rules are deployed.` Do not silently fall back.

- [ ] **Step 4: Implement online play and legacy room fallback**

Add:

```js
function getOnlineElementSetId() {
  const data = getOnlineRoomData();
  if (data?.settings?.elementSetId) return data.settings.elementSetId;
  return PeriodicElementSets.normaliseElementSetId(data?.settings?.elementLimit) || null;
}

function getOnlineRequiredCount() {
  const data = getOnlineRoomData();
  return Number(data?.settings?.requiredCount || data?.settings?.elementLimit || 0);
}
```

Use the set ID in `getPlayableElements()`, online list order, selected-element validation, tap/drop validation and game settings display. If a v21.6 room has an invalid set ID, stop interaction and show a room error; do not use All 118 as fallback.

In `attemptOnlinePlacement(...)`, reject locally before transaction if either selected symbol or target slot symbol is outside the resolved set. Firebase remains the authority and independently validates membership.

Change client finish condition from `completedCount >= elementLimit` to `completedCount >= getOnlineRequiredCount()`.

- [ ] **Step 5: Implement secure rematch set switching**

`startOnlineRematch()` resolves the selected set and updates settings plus the fresh game in the same existing host-controlled rematch operation:

```js
settings: {
  difficulty,
  elementSetId: meta.id,
  requiredCount: meta.count,
  elementLimit: meta.maxTarget
}
```

The new game's order is a fresh shuffle of only `meta.elements`. Guest observes the room update and transitions automatically as in v21.5.

- [ ] **Step 6: Verify tests and syntax**

```bash
node --check app.js
node --test tests/element-sets.test.js tests/ui-contract.test.js tests/rules-v21.6.test.js
```

Expected: PASS.

- [ ] **Step 7: Commit Task 5**

```bash
git add app.js tests/ui-contract.test.js tests/element-sets.test.js
git commit -m "feat: add secure online category games"
```

---

### Task 6: Documentation, regression verification and deployment checkpoint

**Files:**
- Modify: `README.md`
- Create: `V21_6_SETUP.md`
- Modify: `MULTIPLAYER_RULES.md`

**Interfaces:**
- Deployment docs give exact Firebase import/rules order before live web promotion.

- [ ] **Step 1: Update documentation**

Document:
- v21.6 category list and corrected La/Ac classification;
- `elementSets.seed.json` must be imported into Firebase as root child `/elementSets`, not over the database root;
- publish `database.rules.v21.6.json` after importing the seed;
- `/answers` is unchanged;
- rules remain backwards-compatible with existing v21.5 rooms;
- then promote the web files to live `v21.2-online`.

Include public test matrix:

```text
1. First 20 still ends at Ca.
2. First 36 still ends at Kr.
3. Noble gases shows exactly He, Ne, Ar, Kr, Xe, Rn, Og and finishes at 7.
4. Alkali metals shows Li, Na, K, Rb, Cs, Fr only; La/Ac absent.
5. Lanthanides includes La through Lu (15).
6. Actinides includes Ac through Lr (15).
7. Deliberately wrong placement: 0 points, streak reset, turn changes, no answer reveal.
8. Correct placements: 10, 12, 14, 16, 18; turn retained.
9. Online rematch switches Noble gases -> First 36 -> Actinides.
10. Lock/background one device under 30s: reconnect grace resumes; over 30s: pause/resume still works.
11. Invite link works over mobile data.
```

- [ ] **Step 2: Run complete automated verification on the development branch**

```bash
node --check element-sets.js
node --check app.js
node --test tests/*.test.js
node -e "JSON.parse(require('node:fs').readFileSync('elementSets.seed.json','utf8')); JSON.parse(require('node:fs').readFileSync('database.rules.v21.6.json','utf8')); console.log('JSON OK')"
```

Expected: all tests PASS, both syntax checks exit 0, `JSON OK` printed.

- [ ] **Step 3: Review branch diff against v21.5 checkpoint**

Verify only the intended runtime files plus tests/docs changed. Specifically confirm no changes to:
- `firebase-config.js`
- `/answers` seed data
- presence/reconnect constants except version/session key
- scoring point schedule

- [ ] **Step 4: Commit docs**

```bash
git add README.md V21_6_SETUP.md MULTIPLAYER_RULES.md
git commit -m "docs: add v21.6 category games deployment guide"
```

- [ ] **Step 5: Firebase deployment checkpoint — do not promote web code yet**

User action in Firebase Console:
1. Import `elementSets.seed.json` into a root child named `elementSets`.
2. Publish `database.rules.v21.6.json`.
3. Confirm both actions succeeded.

Because v21.6 rules accept v21.5 rooms, the existing live v21.5 web build should continue working at this checkpoint.

- [ ] **Step 6: After Firebase confirmation, promote the fully verified v21.6 runtime to `v21.2-online`**

Promote the tested development-branch versions together:
- `element-sets.js`
- `index.html`
- `app.js`
- `styles.css`
- `elementSets.seed.json`
- `database.rules.v21.6.json`
- docs/tests as desired

Do not partially promote runtime files.

- [ ] **Step 7: Verify public GitHub Pages deployment**

On `https://random8number.github.io/periodic-table-practice/`, verify the visible label is `v21.6 Category Games`, then run the 11-item public test matrix above using two devices, with the second device on mobile data for the internet test.

- [ ] **Step 8: Mark v21.6 as known-good only after live test passes**

Keep the last v21.5 commit SHA as the rollback point until all live checks pass.
