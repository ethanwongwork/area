# Phase 2 · marks (B5.1, B5.2, B5.3)

Running report for the marks worker. Plan: `../README.md` section B5.

## The recipe

One mark recipe in `packages/styles/src/inset.css` ("One mark"), a `:where()` rule on Badge, Count, Tag, Kbd,
Citation's pill and Indicator's count. Inputs a family sets: `--_mark-height` (a rung), `--_mark-border` (a border it
really draws), `--_mark-pill` (Pills flag), `--_mark-chip` (1 for objects). Outputs: `--_mark-side`, `--_mark-baseline`,
`--_mark-cap-above/-below`, `--_mark-slot-shift`, `--_mark-corner`, `--_mark-text/-leading`, `--_mark-gap`. Inline chips
(inline Code, soft Mention) take `--_chip-pad-block` = max(0, (1lh − 1.3em) / 2 − border) and `--_chip-pad-inline`.

The ladder (`emit/base.ts`): mark-label-sm/md/lg = small line + 0 / 4 / 8 at every density (Compact's md was 14 = sm).

| Type | sm / md / lg | side sm / md / lg | text sm, md / lg | chip corner at Corner 10 (Compact / Default / Comfortable) |
|---|---|---|---|---|
| 12 | 14 / 18 / 22 | 4 / 6 / 8 | 10 / 12 | 6 / 6 / 6 (Comfortable clamps to Default at 12) |
| 13 | 14 / 18 / 22 | 4 / 6 / 8 | 11 / 13 | 6 / 6 / 8 (7 on a 14 key: capped at H / 2) |
| 14 | 16 / 20 / 24 | 5 / 7 / 9 | 12 / 14 | 6 / 6 / 8 |
| 16 | 20 / 24 / 28 | 7 / 9 / 11 | 14 / 16 | 8 / 8 / 10 (Compact is Default from type 15) |

Pill role (Badge, Count by Pills flag; Citation, Indicator count always): a pill; off the Pills set, the Corner
setting's corner for H. At Corner 0 chips are square, pills stay pills while listed. Gaps 2 at sm, 4 above. Baseline
edge + round((H − 2·edge + 1cap) / 2): whole at every setting (the edge is the 1px required stroke).

## Done

- base.ts ladder; inset.css recipe, text-part trim/placement, slot shift, inline chip; Citation's optical lift removed.
- Families on it, own copies removed: badge (gaps 2/4, media gap 4, Plain at 500, lg text from the recipe), count,
  tag (side 5→6, lg 6→8, lg text 13, corner radius-small 4→6), kbd (side 4→6 / 3→4, line 10→14, chip corner; 14 key
  4→6), citation (side 7→6, cap-centred, bg-mark fill), indicator count (16→18, 500→400, data-single, anchor literals
  → tokens), inline code and soft mention (plate = line box), approval keys (Kbd md in the 22 slot, no concentric 2).
- React: Indicator data-single; Approval keys size md; Kbd and Code JSDoc. Manifest: indicator `single` state.
- Demos: Badge content tiles on the default variant. pages.mjs and documentation actions.mjs size notes.
- Tests: cohesion "one mark", "mark ladder", "inline chip"; corners test drops Kbd's and Code's exemptions; kbd and
  mention tests moved to the recipe; agent-chat expects Kbd md keys.
- Docs: DESIGN_SYSTEM "One mark"; specs badge, count, tag, kbd, citation, indicator, code, mention (current state +
  history), badge-group, shortcut-list (history).

## Not built

- V11 (Tag status shape and a smaller size): a Decide row never decided.
- Badge inverse (VS18): Solid inverse, Soft inverse and Solid neutral read the same token (`neutral-solid` =
  `bg-inverse`); making them distinct or dropping inverse from two variants is an API decision for the owner.

## Verified (2026-11-13)

- Styles build (parity, token refs) green; typecheck clean; tokens tests pass; React family tests 58/58; cohesion 94/96
  (the two failures are other workers': regular-weight scope, Input action hit target).
- check:rendered: marks snapshot updated (Kbd line 10 → 14, Kbd sm corner 2/4 → 6, Kbd md 4/6 → 6, Tag md text 11/14,
  Tag lg 13/18); cap-centring: Citation and Shortcut list Kbd fixed and pruned; Tag lg (0.38, the whole-pixel baseline)
  listed beside Badge's. Corners snapshot left to the conductor (Citation 9999 → 10003 is mine, the same pill).
- Sweeps (capture:rendered, Badge/Count/Tag/Kbd/Indicator/Citation): type 12 Compact 14/18/22, text 10, sides 4/6/8;
  type 16 20/24/28, text 14 (lg 16), sides 7/9/11, chip corner 8; Corner 0 + Comfortable (dark) chips 0, pills stay.

## Left

- Nothing in scope. For the conductor: ARCHITECTURE.md's count.css example, Stepper's marker (Kbd's old corner formula),
  Tag picker's inset (tags 18 at Compact now), the corners snapshot.
