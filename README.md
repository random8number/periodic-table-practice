# Periodic Table Practice v21.6 — Category Games

v21.6 adds secure category-based multiplayer while preserving the known-good v21.5 internet multiplayer behaviour.

## Multiplayer element sets

The same selector is used for Local 2 Player, Online room creation and Online Play Again/rematch:

- First 20
- First 36 — H to Kr
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

The full periodic table remains visible. Slots outside the selected set are muted and inactive during multiplayer.

## Category classification correction

Hydrogen remains a **Reactive non-metal**. v21.6 corrects the f-block ordering so **Lanthanum (La) is a Lanthanide** and **Actinium (Ac) is an Actinide**, rather than being picked up by the Group 1 rule.

Key set counts:
- Alkali metals: 6 — Li, Na, K, Rb, Cs, Fr
- Noble gases: 7
- Lanthanides: 15 — La through Lu
- Actinides: 15 — Ac through Lr

## Firebase security

`/answers` is unchanged.

v21.6 adds protected trusted data at `/elementSets`. The browser selects a set, but Firebase independently validates that a submitted symbol belongs to that set and continues to use `/answers` to validate its correct atomic-number position.

Deployment requires:
1. Import `elementSets.seed.json` into the root child `/elementSets`.
2. Publish `database.rules.v21.6.json`.
3. Only then promote the v21.6 web files to the live Pages branch.

The v21.6 rules remain compatible with existing v21.5 rooms during the deployment transition.

See `V21_6_SETUP.md` for the exact deployment and public test sequence.
