# v21.6 — Category Games setup and deployment

## Important

Do not replace the database root when importing the new seed data.

### 1. Import trusted element-set data

In Firebase Realtime Database, create/select a root child named:

`elementSets`

Import `elementSets.seed.json` **into that child**.

The existing `/answers` child is unchanged and should not be re-imported.

Expected checks after import:
- `elementSets/alkali/count = 6`
- `elementSets/noble-gases/count = 7`
- `elementSets/lanthanides/count = 15`
- `elementSets/actinides/count = 15`
- `elementSets/noble-gases/members/He = true`
- `elementSets/noble-gases/members/Og = true`

### 2. Publish Firebase rules

Publish:

`database.rules.v21.6.json`

The rules keep `/answers` and `/elementSets` unreadable/unwritable by normal clients and use them internally as trusted validation data. Existing v21.5 rooms remain accepted during deployment.

### 3. Promote the web build

After both Firebase steps succeed, promote the tested v21.6 files from `v21.6-category-games` to the live `v21.2-online` branch together. Do not partially promote the runtime files.

Primary runtime files:
- `element-sets.js`
- `index.html`
- `app.js`
- `styles.css`
- `settings.json`
- `elementSets.seed.json`
- `database.rules.v21.6.json`

## Public test matrix

1. First 20 still ends at Ca.
2. First 36 still ends at Kr.
3. Noble gases shows exactly He, Ne, Ar, Kr, Xe, Rn, Og and finishes at 7.
4. Alkali metals shows Li, Na, K, Rb, Cs, Fr only; La/Ac are absent.
5. Lanthanides includes La through Lu (15).
6. Actinides includes Ac through Lr (15).
7. Deliberately wrong placement: 0 points, streak reset, turn changes, no answer reveal.
8. Correct placements: 10, 12, 14, 16, 18; turn retained.
9. Online rematch switches Noble gases → First 36 → Actinides.
10. Lock/background one device under 30s: reconnect grace resumes; over 30s: pause/resume still works.
11. Invite link works over mobile data.

Keep the v21.5 live commit as the rollback checkpoint until all eleven checks pass.
