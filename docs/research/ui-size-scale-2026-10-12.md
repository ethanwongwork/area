# UI size: one base type size, five steps (research, 2026-10-12)

Owner question (2026-10-12): compact feels too small next to Cursor; what base text size do
compact products and design systems use, and should Area offer more than two densities, one per
base type size 12, 13, 14, 15, 16, as granular as the radius setting?

Extends [compact-evidence-2026-10-02/density-systems.md](compact-evidence-2026-10-02/density-systems.md)
(how antd, Material, Spectrum, Primer and Carbon shrink controls and spacing). Values are pinned to
sources; **H** = source code, package or official docs; **M** = official but partial or recalled;
**L** = third-party only.

## Products: chrome text and settings

| Product | Chrome px | Reading px | Rows | User size / density options | Source | Conf. |
|---|---|---|---|---|---|---|
| VS Code | 13 / 1.4em | editor 12 (Mac) | 22 | zoom ±20% steps; free font sizes | Cursor bundle `.monaco-workbench{font-size:13px}` | H |
| Cursor IDE / Agents | 13 / 13 | Agents prose 15/24 | 22 / 28 | `composer.textSizeScale` 0.85 / 1 / 1.15 / 1.3 (4 steps, chat only) | workbench.desktop.main.js; workbench.glass.main.css | H |
| Figma UI3 | 11/16 | — | 24 | Interface scale: larger / smaller (scales everything) | area captures; Figma help 360049549913 | H |
| Notion | 14/21 | 16 | 30 | per-page Small text (2 states) | area captures | H |
| ChatGPT | 14/20 | 16/26 | ~36 | Windows app text size ± (zooms app) | area captures; OpenAI help 11958281 | H |
| GitHub (Primer) | 14 | 14 | 28/32/40 | none (browser zoom) | primer.style typography | H |
| Atlassian | 14/20 | 14 (16 long-form) | — | none (suggestion ECO-673 open) | atlassian.design typography | H |
| macOS native | 13pt | 13 | — | sidebar size S/M/L (3); per-app text-size slider | Apple HIG; Mac help | M |
| Windows / Fluent | 14/20 | 14 | 32 | text size 100–225% (text only) | fluent2 typography | H |
| Obsidian | 13 (nav) | 16 | — | font-size slider (editor text only); UI ramp fixed | Obsidian CSS variables | H |
| Zed | 16 | buffer 15 | — | free numeric sizes | default.json | H |
| Raycast | — | — | — | Interface size Default / Large / Larger (3, scales everything) | changelog 0.66 | M |
| Gmail · Google Calendar | — | — | — | density Default / Comfortable / Compact (3, spacing only) | Google support | M/H |
| Discord | — | chat 16 | — | UI density Compact / Default / Spacious (3, spacing); chat font 12–24 (7 stops) | Discord blog | M/L |
| Vercel (Geist) | 14/20 | 14 | — | none | vercel.com/geist | M |

## Design systems: levels and body size

| System | System-wide levels | What a level changes | Body px per level | Source | Conf. |
|---|---|---|---|---|---|
| Radix Themes | **5**: `scaling` 90 / 95 / 100 / 105 / 110% | everything (type, space, radius, heights) × s | UI text 12.6 / 13.3 / 14 / 14.7 / 15.4 (fractional) | @radix-ui/themes@3.3.0 tokens/scaling.css:2-15 | H |
| Angular Material M3 | 6: density 0 to −5 | heights only, 4px a step | held (14 / 16) | existing doc | H |
| SAP Fiori | 3: cozy / compact / condensed | heights 36 / 26 / 22 | 14 held | theming-base-content@11.36.5 base.less | H |
| Salesforce | 3: comfy / cozy / compact | spacing, label placement | 13 held | design-system@2.264.1 tokens | M |
| antd | 2 | type, height, spacing | 14 → 12 | existing doc | H |
| WinUI | 2: standard / compact | heights | 14 held ("both density options") | microsoft-ui-xaml Compact.xaml | H |
| Spectrum · Polaris | 2 platform scales | type, heights | 14↔17 · 13↔16 | existing doc; polaris-tokens@9.4.2 | H |
| Apple Dynamic Type | **12** (7 + 5 accessibility) | every text style, 1pt steps at the low end | iOS body 14 / 15 / 16 / **17** / 19 / 21 / 23 …; macOS 13 fixed | Apple HIG typography | H |
| JetBrains | 9 zoom steps 70–200%, plus Compact mode | zoom scales everything | OS font × zoom | IdeScaleTransformer.kt:79 | H |
| Mantine | continuous `scale` | everything in rem | 16 × scale | @mantine/core@9.7.2 | H |
| Carbon · Fluent v9 · Chakra · shadcn · Base Web | per-component sizes only | height (some type) | 14 (Chakra, Mantine, Radix: 16) | packages | H |

## Findings

1. **Base chrome type is 13 or 14.** 13: VS Code, Cursor, macOS, Obsidian, Salesforce, Polaris
   desktop. 14: Notion, ChatGPT, GitHub, Atlassian, Fluent, WinUI, SAP, Carbon, Primer, Geist,
   EUI. Outliers: Figma 11, Zed 16; general-web systems default to 16 (Radix, Mantine, Chakra).
   Area's compact 12 sits below every dense product measured except Figma.
2. **Density and text size disagree across products, and most keep them apart.** Material, SAP,
   WinUI, Salesforce, Carbon, Primer, Atlassian, Gmail, Calendar and Discord density change
   spacing and heights with type held. antd, Radix, JetBrains zoom, Raycast and Figma scale type
   with the box. Cursor and Discord offer text size as its own control, for reading surfaces.
3. **More than two levels is common; five is precedented.** Radix 5, Material 6, JetBrains 9,
   Apple 12, Cursor chat 4, Discord chat 7; three-step density in Gmail, Calendar, Discord,
   Raycast, SAP, Salesforce. Nobody names a 12 / 13 / 14 / 15 / 16 ladder: Radix's equivalent is
   fractional; Apple's 1pt body steps (14–17) are the closest whole-pixel precedent.
4. **Accessibility.** Apple's minimums: macOS 10pt (default 13), iOS 11pt (default 17). Material
   drops touch targets at density −2 and below; Primer keeps 44 targets for coarse pointers.
   rem-based systems (Atlassian, Polaris, SAP, Mantine) also follow the browser font size.

## Proposal: a UI size setting, 12 to 16

One setting, like radius: a number, every value derived from it. It replaces Compact (12) and
Default (14), whose values it keeps exactly. Values are whole pixels on the ramps; the ramp gains
15 and 17 (Apple's body steps).

| Size | UI text | Caption | Reading | Control md | Row | dense factor |
|---|---|---|---|---|---|---|
| 12 | 12/16 | 12/16 | 14/20 | 28 | 24 | 1 |
| 13 | 13/18 | 12/16 | 15/22 | 30 | 28 | 0.5 |
| 14 | 14/20 | 12/16 | 16/24 | 32 | 32 | 0 |
| 15 | 15/22 | 13/18 | 17/26 | 34 | 36 | −0.5 |
| 16 | 16/24 | 14/20 | 18/28 | 36 | 40 | −1 |

- **Derivation.** UI text = the size; leading on the ramp at the default's ratio (12/16 → 16/24);
  reading = UI + 2; control md = 28 + 2 per pixel; row = leading + 2 × (4 + size − 12). These
  reproduce today's compact and default rows exactly.
- **Components already interpolate.** 15 files size slots as `x − y × --area-ui-dense`
  (0 default, 1 compact). The factor (14 − size) / 2 gives 0.5 at 13 and extrapolates to 15 and
  16. Of its 60 uses, 57 step by 2, 4 or 8 (whole pixels at 0.5); one steps by `1px` and lands on
  half pixels; the rest are ratios (the icon weight). Each still needs checking for sense when
  extrapolated to 15 and 16.
- **Defaults.** The library stays at 14 (the web-product cluster); the app moves to 13 (Cursor,
  VS Code, macOS).
- **Text size for reading surfaces** (Cursor's and Discord's model) can follow as its own setting
  later; it is not needed for this one.
- **Open.** Icons hold 16 at every size (native cuts are 12/16/20/24); larger sizes may want 20
  in lg tiers. Five sizes × the other axes need the registry's orthogonality tests extended and a
  visual pass at 13 and 15, the two new in-between steps.

Supersedes "compact is 12/16, not 13/18" (owner, 2026-10-01, typography.ts) if adopted.

## Follow-up: three settings and their guardrails (owner, 2026-10-12)

Owner: separate type size, density and radius, so text can grow without touching the others;
but no combination should look bad, and some choices may force changes on the others.

### How others handle the interaction

| System | Rule | Behaviour | Source | Conf. |
|---|---|---|---|---|
| antd v5 | derive, clamp at 0 | padding = max((controlHeight − fs·lh)/2 − border, 0); height fixed, so a larger font eats the padding until text touches the border; no warning | antd@5.27.4 button/style/token.js:72-74 | H |
| antd compact | force | compact replaces the base font with fontSizeSM: density drags type down | theme/themes/compact/index.js:7-8 | H |
| Radix Themes | derive (one knob) | `--scaling` multiplies type, space and radius together; no separate type size; the theme panel disables nothing | @radix-ui/themes@3.3.0 styles.css; theme-panel.tsx:197 | H |
| Mantine | independent | heights fixed, font sizes free, no clamp | @mantine/core@9.7.2 Button.css | H |
| Angular Material | clamp + force | density −4px a step, each component stops at its own floor (button −3, chips −2, list −5); at −2 the button drops its 48px touch target; type never changes | _theming.scss:176-188; _m3-button.scss:156-169 | H |
| Fluent 2 (web) | derive | buttons set no height: line height + 2 × padding + border (12/16 + 3 = 24; 14/20 + 5 = 32) | react-button@9.11.1 styles.raw.js | H |
| WinUI | derive | text scale 100–225%: "controls and containers must also resize and reflow"; icons excluded | learn.microsoft.com text-scaling | H |
| Apple Dynamic Type | derive + layout switch + cap | controls grow with text; stack and drop columns at large sizes; apps may cap the range | HIG typography; SwiftUI dynamicTypeSize | H |
| macOS sidebar | force | sidebar icon size also sets sidebar text size | Mac help mchlp1225 | H |
| SAP Fiori | independent type; force | font held across densities; condensed only with compact | sapui5 content-densities doc | H |
| Gmail | clamp (ceiling) | the chosen density is a ceiling; narrow windows compress further | Gmail blog 2011 | H |

Standards: WCAG 2.2 SC 2.5.8 targets at least 24 × 24 CSS px (AA; spacing exception), 2.5.5
44 × 44 (AAA); 1.4.4 text to 200%; 1.4.12 text spacing (line height 1.5×) without loss of
content. Apple control sizes, default / minimum: macOS 28 / 20, iOS 44 / 28. CSS clamps
overlapping corners, so a radius tops out at height / 2.

### Why fixed heights cannot carry a separate type size

Room above and below one line of UI text, (height − leading) / 2, on today's ladders:

| Type | compact sm 24 | compact md 28 | compact row 24 | default sm 28 | default md 32 | default row 32 |
|---|---|---|---|---|---|---|
| 12 | 4 | 6 | 4 | 6 | 8 | 8 |
| 13 | 3 | 5 | 3 | 5 | 7 | 7 |
| 14 | 2 | 4 | 2 | 4 | 6 | 6 |
| 15 | 1 | 3 | 1 | 3 | 5 | 5 |
| 16 | 0 | 2 | 0 | 2 | 4 | 4 |

At 15–16 in compact the text touches the box: antd's failure mode.

### Proposal: derive heights, clamp at the floors, force only after a visual pass

- **Type size** 12–16 sets UI text (and reading = UI + 2, captions floored at 12).
- **Density** Compact / Default / Comfortable sets only the room around text: control padding
  sm 2 / 4 / 6, md 4 / 6 / 8, lg 8 / 10 / 12, rows 4 / 6 / 8.
- **Height is derived**, leading + 2 × padding (Fluent, WinUI, Apple), in emit/base.ts as a
  calc over both axes, so every combination fits its text. Default at 14 reproduces today's
  default exactly (28 / 32 / 40, rows 32). Compact at 12 gives md 24 (today's compact md is 28,
  row 24): the split recalibrates compact.
- **Radius needs no rule**: corners already scale with height (setting × h / 32), pill is h / 2,
  surfaces stop at 24.
- **Clamps**: interactive heights at least 24 (WCAG 2.5.8): compact sm at 12–13 holds 24. Icons
  never below the 16 cut.
- **Forcing** is a judgement, not a geometry need: derived heights never clip. Candidates are the
  corners, 12 with Comfortable (small text in large boxes) and 16 with Compact. Decide them on a
  sheet of the 15 type × density pairs, not in advance.
- **The settings UI stays fixed** (Radix's panel; the app's Inspector already is), so any choice
  can be undone.

| Type | Compact sm / md / row | Default sm / md / row | Comfortable sm / md / row |
|---|---|---|---|
| 12 | 24* / 24 / 24 | 24 / 28 / 28 | 28 / 32 / 32 |
| 13 | 24* / 26 / 26 | 26 / 30 / 30 | 30 / 34 / 34 |
| 14 | 24 / 28 / 28 | 28 / 32 / 32 | 32 / 36 / 36 |
| 15 | 26 / 30 / 30 | 30 / 34 / 34 | 34 / 38 / 38 |
| 16 | 28 / 32 / 32 | 32 / 36 / 36 | 36 / 40 / 40 |

\* held at the 24 floor.

### Refinements from the comparison sheet (owner review, 2026-10-12)

Sheet: claude.ai/artifact/X3hiP88XNgTUYghboPAbcm (real Area markup rendered from @area/react,
each cell scoped to its derived tokens; verdicts in its `verdicts` store).

- **Spacing follows type, not only density.** Every spacing role (card and table insets, gaps
  between groups, surface insets, stacks) is written in components as `x − y × --area-ui-dense`,
  and was constant across type sizes, so 16px text kept compact's 8px table sides. Each density
  now keeps today's ratio of space to type (compact 12 at 12, default 16 at 14, comfortable 20 at
  14), as a spacing step rounded to halves: step = round₀.₅((16 − ratio × type) / 4). Every
  `y` in the 60 formulas is 2, 4 or 8, so half steps stay on whole pixels.

  | Type | Compact step · card text | Default | Comfortable |
  |---|---|---|---|
  | 12 | 1 · 12 | 0.5 · 14 | −0.5 · 18 |
  | 13 | 1 · 12 | 0.5 · 14 | −0.5 · 18 |
  | 14 | 0.5 · 14 | 0 · 16 | −1 · 20 |
  | 15 | 0.5 · 14 | −0.5 · 18 | −1.5 · 22 |
  | 16 | 0 · 16 | −0.5 · 18 | −1.5 · 22 |

  Control heights still come from the density's room around the text line; only spacing moves.
- **Compact at 16 is Default at 14 with larger text** (spacing step 0, md 32): it stops being
  compact. Suggested: force Default at 15 and 16. Suggested: force Default for 12 Comfortable
  (small text floating in large boxes). Owner to confirm on the sheet.
- **Radius: cap surfaces, do not ban settings.** At radius 12, 14 and Pill a compact card at 12
  wrapped 12px-inset text in a 24px corner. Surfaces take the ladder's corner capped at 1.5 × the
  density's text inset (compact at 12: 18; at 14: 20; default and comfortable never reach the
  cap). Controls keep the full setting (a pill control is fine at any density). Card's own
  concentric term still adds to the capped surface corner; extrapolated to negative steps it
  grows (comfortable 16 at radius 14: 34), which the build should bound the same way.
- The first sheet's card spacing (6 / 8 / 10) was a specimen error: text belongs in
  `CardContent`, which adds the card's step.

### Every component sized from the text (owner, 2026-10-12, sheet version 3)

Owner: "every component intentionally sized for everything only when and if necessary, but it has
to make sense and it should be cohesive". Measured on the sheet, five things held still while type
moved: switch 32×20, checkbox 16, badge 16 tall (crammed at 14px text), card title 16 (too large
at 12, too small at 16), icons 16. Rule adopted for the sheet: what holds or sits beside text is
sized from the text line; density adds room; nothing else moves.

| Role | Rule | 12 | 13 | 14 | 15 | 16 |
|---|---|---|---|---|---|---|
| Small text (captions, counts, badges, key hints) | base − 2, floor 10 (owner: 10 at 12) | 10/14 | 11/14 | 12/16 | 13/18 | 14/20 |
| Surface title (Card, Dialog) | reading size, base + 2 | 14 | 15 | 16 | 17 | 18 |
| Checkbox / radio box | UI line − 4, floor 14 | 14 | 14 | 16 | 18 | 20 |
| Switch height | box + 4 | 18 | 18 | 20 | 22 | 24 |
| Badge sm · count md (default) | caption line · + 4 | 14 · 18 | 14 · 18 | 16 · 20 | 18 · 22 | 20 · 24 |
| Icons | native cuts | 16 | 16 | 16 | 16 | 20 |
| Icon stroke | 1.125 × base / 14 | 0.96 | 1.04 | 1.125 | 1.21 | 1.29 |
| Tracking | small text loosens | +0.005em (10: +0.01) | +0.0025em | 0 | 0 | 0 |

Small text at 10 has precedent: macOS Caption 10pt (its floor), antd compact fontSizeSM 10, VS
Code count badges 10. It supersedes the 12 caption floor (owner, 2026-10-01). Surface titles moving
with type keeps Card and Dialog peers, the reason titles were held in 2026-09-30 (audit H-7).

Radius fixes (the three worst, measured corner ÷ text inset): table frames cap at 1.5 × the cell
inset (compact 12–13 at radius 12+: 18 / 8 → 12 / 8); a card's final corner caps at 1.5 × its
text inset (radius 14: 28 / 16 → 24 / 16); a pill field's side inset is at least half its corner
(icon 4 → 6 in at 24px, +2 only). With these, no pairing exceeds 1.5×, so no radius is banned.

## Built (2026-10-12)

- `@area/tokens`: `type` axis (axes/type-size.ts, presets 12–16, default 14) and `density` axis
  (axes/density.ts, compact / default / comfortable); geometry derived in emit/base.ts
  (`sizeDerivations`), re-derived at every axis-bearing element; `data-area-ui` kept as a
  shorthand (axes/ui-scale.ts) in CSS and in `mergeAxes` / `AxisSelection.ui`. `control-md` is no
  longer a registered property (a registered derived token freezes at :root).
- Forced pairs from the suggestions (no verdicts were marked): Compact up to 14, Comfortable from 13.
- `@area/styles`: check box and radio read `mark-box`, Switch `mark-toggle`; card corner, table
  frame and surface corners capped at 1.5 × their text inset; fields clear half their corner
  (inset.css).
- Regression: every token emitted before is still emitted; at the default (14, Default) every
  token resolves to its previous value; under the old compact shorthand only the approved changes
  differ (small text 10, titles 14, medium controls 24, smaller marks).
- Desktop app: chrome at type 13 + Compact (bars 39, traffic lights at 13, 12); Inspector Canvas
  settings Type (Segmented) and Density (Select); Typography shows roles at every type size; the
  Language tab draws Type size and Density.
