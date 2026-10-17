# Balance over 1× crispness, 2026-10-16

Owner: the set's optical balance, size and even spacing come before 1× pixel crispness (spec "Balance over 1×
crispness"). Two parts.

## Restore of the 1× frames moves

273 sources back to their 2026-10-13 drawings (qr-code, diamond, gamepad kept). Sheets: `document-family-*.png` (the
case that raised it), `1-whole-icon-moved-*.png`, `2-parts-moved-*.png`, `3-redrawn.png` (14 Oct above, restored
below).

## Balance pass

`measure.mjs` renders Area (built `dist/svg/24`) and the Lucide and Phosphor counterparts (`area-map.json`) the same
way at 96px and writes `measure.json`: apparent size (√ ink hull) and ink centre. `compare.py measure.json` compares
the spread of the three sets and lists icons Area draws smaller or larger than both references do (where they agree),
and ink centres off where theirs are centred. `outliers.mjs` and `bal.mjs` render sheets; `bal.mjs out.png names`
lints, measures and shows Before (built dist) beside After (sources) between info, square-plus, document and folder.
The reference SVGs come from `refs.mjs fetch` (`packages/icons/.cache/refs`; the path in `measure.mjs` points at the
worktree that had them). `audit.txt` is `generate.mjs --check --audit` after the restore.

Result before the pass (511 concepts in all three): within ±8% of each set's median, Area 64%, Lucide 55%, Phosphor
73%; Area within ±8% of the references' reading of the same concept: 83%. Round 1: `5-balance-round-1.png`.

Rounds 1–4 (spec "Balance pass, round 1" … "round 4"): `5-balance-round-1.png`, `6-pencil-family.png`,
`7-toggle-pairs.png` (`toggle.mjs`: pairs overlaid, Before = main), `8-tools.png`, `9-whole-set-*.png` (`grid.mjs`).
`body.py` draws the shared writing tool from tip, half-width and end. `measure.json` is the set after round 4.
