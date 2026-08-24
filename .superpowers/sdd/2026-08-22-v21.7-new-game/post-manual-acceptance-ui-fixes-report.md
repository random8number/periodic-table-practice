# Post-manual-acceptance UI fixes report

## Scope

- Branch: `v21.7-new-game`
- Base: `7ba445832137e8efa8724c65fd0a13e5332c2f5c`
- Implementation commit: `9b423b7 fix: address post-acceptance UI layout`

## Diagnosis and design

1. `.mode-specific-fields { display: grid; }` overrode the browser hidden rule. A component-level `.mode-specific-fields[hidden] { display: none !important; }` now retains the existing JS and DOM behavior while reliably hiding inactive fields.
2. Loose element tiles used the historical 90 percent ratio. `elementTileSize` and CSS fallbacks now use `cellSize * 0.95` and `49.4px`, preserving square proportional tiles.
3. The former viewport-only 980px decision could keep a side-by-side layout with unusable cells. Pure layout metrics now derive a hypothetical side-by-side panel width from workspace width, sidebar width, splitter, margin, and panel chrome. The layout stacks at the existing 980px fallback or below a 40px hypothetical cell. `fitLayoutToViewport()` applies the resulting `layout-stacked` state to the body, which drives CSS reflow, splitter availability, main-height handling, and narrow table scrolling. Side-by-side metric sizing also uses its hypothetical panel width after a stacked-to-wide reflow, preventing a one-frame over-wide table.

## RED evidence

1. Hidden fields:
   `& 'C:\Users\Tom B\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests\ui-contract-v21.7.test.js`
   Result: 17 pass, 1 fail of 18. Expected failure: the CSS did not match `.mode-specific-fields[hidden]` with `display: none !important`.
2. 95 percent metric and 40px calculated responsive rule:
   `& 'C:\Users\Tom B\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests\layout-metrics.test.js`
   Result: 2 pass, 5 fail of 7. Expected failures: `0.9` did not equal `0.95`; `sideBySidePanelWidth` and `sideBySideCellSize` were absent; the above-980px narrow workspace did not stack.
3. Shared app/CSS layout state wiring:
   `& 'C:\Users\Tom B\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests\ui-contract-v21.7.test.js`
   Result: 17 pass, 2 fail of 19. Expected failures: the hidden-field CSS rule and `body.layout-stacked .main`/app state wiring were absent.

Additional self-review RED:

`& 'C:\Users\Tom B\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests\layout-metrics.test.js`

Result: 7 pass, 1 fail of 8. The table width exceeded the hypothetical side-by-side panel after a stacked-to-wide reflow. Metrics now size side-by-side cells from that hypothetical panel.

## Files changed

- `styles.css`
- `layout-metrics.js`
- `app.js`
- `tests/layout-metrics.test.js`
- `tests/ui-contract-v21.7.test.js`
- `.superpowers/sdd/2026-08-22-v21.7-new-game/post-manual-acceptance-ui-fixes-report.md`

## Tests changed

- Added a hidden mode-specific field CSS regression.
- Updated loose-tile assertions to the independent `0.95` literal across wide and stacked metrics.
- Added calculated side-by-side threshold, wide layout, and stacked-to-wide reflow metric coverage.
- Added app/CSS contracts for the shared `layout-stacked` state, splitter behavior, and orientation-sensitive scrolling.

## Verification

- Syntax: `node --check app.js` PASS; `node --check layout-metrics.js` PASS.
- Focused: `node --test tests\layout-metrics.test.js tests\ui-contract-v21.7.test.js` PASS, 27/27.
- Full non-emulator: `node --test tests\ui-contract.test.js tests\ui-contract-v21.7.test.js tests\single-player-sets.test.js tests\rules-v21.6.test.js tests\layout-metrics.test.js tests\game-setup.test.js tests\element-sets.test.js` PASS, 53/53.
- Whitespace: `git diff --check` PASS; Git emitted only existing LF-to-CRLF working-copy warnings.
- Protected Firebase: `git diff origin/v21.6-known-good...HEAD -- database.rules.v21.6.json elementSets.seed.json answers.seed.json firebase-config.js` produced no output. The corresponding working-tree protected-file diff was also empty.

## Self-review and remaining gates

- Self-review found and fixed the stacked-to-wide sizing transition before handoff. No open code findings remain.
- No push, deploy, Firebase schema, Firebase rules, Firebase configuration, or Firebase seed/data changes were made.
- The Firebase emulator release gate and a short post-fix manual visual check remain required. This wave does not declare the branch release-ready.
