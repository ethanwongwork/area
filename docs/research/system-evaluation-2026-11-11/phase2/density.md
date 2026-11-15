# Phase 2 · density (B8.1 twins, B8.2 density), running report

## B8.1 one track (done)
- `packages/styles/src/components/segmented.css`, "One track": `:where(.area-segmented, .area-toggle-group--soft)` sets
  `--_track-inset` (2), `--_track-corner` (tier corner on the track height + Pills `segmented` flag × full), `--_thumb`,
  `--_thumb-corner` (concentric, floored, capped on the thumb's own height), `--_thumb-bg/-edge/-shadow`, and draws the
  track: gap, height, padding, corner, control fill, an inset outline at **border-width** in the Buttons group.
  Families set only `--_track-height` and `--_track-tier-corner`. Toggle group's own track copy removed.
- Visible: Segmented's track edge now follows Stroke width (was stroke-width: held at Stroke 0 and 2); soft Toggle group
  is rounded by `data-area-pills="segmented"` (it had no hook). Nothing moves at the defaults.
- material.css: thumb reads `--_thumb-bg/-shadow`; the soft Toggle group track joins Segmented's track lists. The soft
  toggle's raised option is still not in the material's thumb painter (a Button; specificity), left.
- Press paint differs (Segmented `light-dark(#00000013, #fcfcfc2a)`, Toggle group `bg-active`): state paint, wave 3 (B7).
- Pills: `axes/pills.ts` Segmented covers both tracks.
- Test: `packages/react/tests/twins.test.mjs`.

## B8.2 density (done in the listed families)
Lint: `packages/react/tests/density.test.mjs` (sources; a gap, padding, margin or a private property named for one
(gap / pad / spacing / space / inset) holding a fixed step ≥ 6 with no role, no private term and no font unit; a
comment on the line reading "at every density" exempts it; 2 and 4 are joins). The 17 families below must be clean;
the others are a ratchet (`WAITING`). Values (type 13 Compact / Default / Comfortable; all whole at type 12 to 16 and
every density, table printed by `AREA_DENSITY_TABLE=1`):

| Family | Value | Now | 13 C / D / Cf | 12 (C/D/Cf) | 16 (C/D/Cf) |
|---|---|---|---|---|---|
| asset-row | inset | ui-cluster | 6 / 8 / 10 | 6 | 10 / 10 / 12 |
| asset-row | gap | gap-row | 8 / 12 / 16 | 8 | 16 / 16 / 20 |
| asset-row | height | 40 + 2 cluster | 52 / 56 / 60 | 52 | 60 / 60 / 64 |
| board | column inset, cards apart, mat | ui-cluster | 6 / 8 / 10 | 6 | 10 / 10 / 12 |
| board | card and add-row sides | inset-surface-sm | 8 / 10 / 14 | 8 / 10 / 10 | 14 / 14 / 18 |
| board | card block | surface-sm − 2 | 6 / 8 / 12 | 6 / 8 / 8 | 12 / 12 / 16 |
| board | column title start | cluster + surface-sm | 14 / 18 / 24 | 14 / 16 / 16 | 24 / 24 / 30 |
| board | columns apart | gap-row | 8 / 12 / 16 | 8 | 16 / 16 / 20 |
| board | header title→count | ui-stack | 4 / 6 / 8 | 4 | 8 / 8 / 10 |
| setting-row | text→control | inset-surface-md | 12 / **14** / 18 | 12 / 14 / 14 | 18 / 18 / 22 |
| page-header | parent→title | ui-cluster | 6 / 8 / 10 | 6 | 10 / 10 / 12 |
| page-header | title→actions | 2 × cluster | 12 / 16 / 20 | 12 | 20 / 20 / 24 |
| stepper, timeline | content gap | gap-row | 8 / 12 / 16 | 8 | 16 / 16 / 20 |
| stepper, timeline | events apart | 2 × cluster | 12 / 16 / 20 | 12 | 20 / 20 / 24 |
| stepper | open content | ui-cluster | 6 / 8 / 10 | 6 | 10 / 10 / 12 |
| timeline | line gap, time, body | ui-cluster | 6 / 8 / 10 | 6 | 10 / 10 / 12 |
| tabs | lg gap | 24 − 4 gap-step | 20 / 24 / 28 | 20 | 28 / 28 / 32 |
| tabs | vertical panel top | ui-stack | 4 / 6 / 8 | 4 | 8 / 8 / 10 |
| otp-field | slots | ui-cluster | 6 / 8 / 10 | 6 | 10 / 10 / 12 |
| alert | icon→text, text→action | ui-cluster (Toast's) | 6 / 8 / 10 | 6 | 10 / 10 / 12 |
| menu | two-line block | (row − line) / 2 | 5 / 6 / 8 | 5 / 6 / 6 | 6 / 6 / 8 |
| empty-state md | media / actions | 2 cluster / gap-section | 12/16/20 · 16/24/32 | 12 · 16 | 20/20/24 · 32/32/40 |
| empty-state sm | media, actions | gap-row | 8 / 12 / 16 | 8 | 16 / 16 / 20 |
| empty-state | actions apart | ui-cluster | 6 / 8 / 10 | 6 | 10 / 10 / 12 |
| table | caption | gap-row | 8 / 12 / 16 | 8 | 16 / 16 / 20 |
| table | group toggle end | ui-stack | 4 / 6 / 8 | 4 | 8 / 8 / 10 |
| shortcut-list | groups | 32 − 8 gap-step | 24 / 32 / 40 | 24 | 40 / 40 / 48 |
| shortcut-list | name→keys | gap-section | 16 / 24 / 32 | 16 | 32 / 32 / 40 |
| shortcut-list | alternatives | ui-cluster | 6 / 8 / 10 | 6 | 10 / 10 / 12 |

Unchanged values, now tokens: Menu row and label sides `ui-row-inset` (8), vertical Tabs `2 + ui-row-inset`, Tabs'
indicator overhang 8 (marked "at every density"). Drawer stacked footer and Toaster were already `ui-cluster` (A1.2).
Setting row moves at the default (16 → 14), as the plan states; the measured 20 is noted in its spec.

## Hand-overs (done)
- **Static faces** (`apps/desktop/scripts/typefaces.mjs`): a static 400 file is declared `font-weight: 400 470` (the top
  read from `axes/regular-weight.ts`) unless the family has a static file in 401..470 (none does); `src/styles/
  typefaces.css` updated the same way (89 rules; the generator fetches Unicode data, so it was not rerun). Verified in
  headless Edge over the built app: IBM Plex Mono (static 400 and 500) draws its 400 file at 400, 450 and 470, the 500
  file from 480.
- **Docs:** DESIGN_SYSTEM weight table names the Regular weight setting; ARCHITECTURE's count.css example reads the mark
  recipe (`--_mark-height`, `--_mark-side`, `--_mark-corner`).
- **Stepper marker** on the mark recipe's chip corner (`inset.css` `:where` list gains `.area-stepper-step__marker`;
  6 at Corner 10, as before). cohesion "one mark" lists it; its corner exemption is gone.
- **A pill is one value:** the mark recipe's pill role is `max(corner(H), pill × full)`: Badge, Count, Citation and
  Indicator compute 9999px where they computed 10003 / 10005; Segmented's track the same. Test `twins.test.mjs` "a pill
  is one value" with a waiting list (Avatar, Button, Chip, Switch, Input, Composer, the pickers' fields, Pagination, OTP
  slot, Video player still add the flag × full). corners.json: see Verified.
- **Frame leftovers:** Settings group `framed` → `variant="plain|surface"` (alias kept; CSS, layers.css, manifest, React,
  demo, specimen, test) on the frame recipe (block corner, small text inset; same values). Asset card `container`,
  Toolbar, Attachment and one-line option rows keep their own, each with the reason in its spec (asset-card, toolbar,
  attachment, checkbox, radio) and DESIGN_SYSTEM Frames.
- **Choice sizes and Tabs / Nav:** COMPONENTS Boundaries (Tabs vs Nav horizontal; Checkbox · Radio · Switch sizes on one
  box ladder) and the Document tabs candidate moved to Nav horizontal; specs checkbox, radio, switch, tabs, nav.

## Verified (2026-11-14)
- Styles build (parity, token refs), desktop build, typecheck green; check:docs green after regenerating only the Buttons
  row of the Strokes table (Floating and Fields rows differ from in-flight work of other workers; left for them).
- React tests: 863/864 before the last fix (the miss was otp-field's gap, lost to a concurrent rewrite and re-applied);
  density, twins, setting-row green. cohesion: remaining failures are popups' and fields' in-flight work and the bars
  worker's Plan head.
- Tokens `npm test`: 43735 / 43737; failures in emit/brand.test.ts (base.ts, edited by another worker), not mine.
- Rendered (headless Edge, light): my families at the defaults, type 12 Compact and type 13 Comfortable measured equal to
  the table above. Twins: outline 0 / 1 / 2 px at Stroke 0 / 1 / 2, corner 0 at Corner 0, 14 / 12 at Pill, identical.
- Not done: the corners.json update (needs a full capture; the machine was too loaded for one). Expected deliberate
  moves: Badge, Count, Citation, Indicator 10003px / 10005px → 9999px. Type 16 sweep and dark not captured.
