# H — System-level audit (cross-cutting layer)

Repo: worktree `component-audit-visual-guide-ac7bc4` (branch `claude/component-audit-visual-guide-ac7bc4`, HEAD `479ab7d`). Read-only; `git status` identical before and after every check (only the pre-existing `?? .claude/launch.json`). Paths below are relative to the repo root; CSS paths are relative to `packages/styles/src/components/` unless stated.

## Summary

- **The radius axis leaks.** At **Pill**, every non-Button shape that reads `radius-control-*` without a cap turns into a capsule or circle: Card at 22/24/28, the ColorPicker saturation area, the swatch palette grid, AlignmentPicker, Kbd, Calendar days, the Alert banner. The Pill preset promises "containers stay finite". At **Sharp**, the concentric formulas leave Card at 12/16/20, Composer, Message and Prompt suggestions at 8, Toolbar at 8 and Segmented at 2, although the preset promises "square corners throughout". The cohesion audit fixed this for Card once. The owner's later 22/24/28 rule brought it back.
- **Surface is the axis that follows least.** Nine literal copies of the floating lift, plus the Card, Tooltip and Toolbar shadows, ignore `surface=flat`. Required edges drawn with `--area-border-width` disappear at `surface=elevated`: the outline Button border, the checked choice-card edge, ButtonGroup and SplitButton dividers, and Kbd height. Compact density is also far from ready: about 41% of dimension declarations (471 of 1,158) are fixed `space-*` or px values that will not compress. Dark mode rests on 26 `light-dark()` literals whose dark sides were never measured.
- **The weight rule and the code disagree.** DESIGN_SYSTEM.md and the handoff say "400 for every title". The approved code sets 500 on Card, Dialog, Popover, Toast, Alert and Panel titles, Panel section headings, Nav group labels and the Calendar month label, which is what typography.md records. Many other docs statements are stale too: keycap radius 4 and concentric, Checkbox/Radio "16px at sm", Card "twice the container radius", Badge "20/24/28", and "in review" wording across COMPONENTS.md, specs/README.md, 15 spec headers and the handoff.
- **The API has several dialects.** Callbacks are `onValueChange` in 16 places, but Segmented uses `onSelect(value)`, Switch uses `onCheckedChange` while Checkbox has only native `onChange`, and Chip uses `onSelectedChange`. Dismiss is `onDismiss`, `onRemove` or `onClose`, with dismiss controls of 32, 28 and custom sizes. Axis vocabulary varies: Kbd `size=small|normal` with `appearance`, Code `ground` in the manifest but booleans in React, Avatar `inverse` against Badge `inverted`, and several single-value axes with no default. Icon slots are called `icon`, `leadingIcon`, `leadingVisual` or `visual`.
- **Checks are green except packaging.** Build, token (19,491), contrast (370/0), contracts (14), manifest parity and token references, typecheck, icon lint, docs build and audit, and preview all pass. `test:consumer` **fails**: the fixture still uses `Panel size="xs"` and the removed Checkbox `size="sm"`. Two React tests fail on a fresh build because they read `apps/docs/dist`; after `build:docs` all 154 pass. The gallery still renders 15 `GalleryReview*` before/after rows, including a Kbd "proposal, not applied" the owner already rejected.

## Check results

| Check | Result | Detail |
|---|---|---|
| `npm run build` | PASS | tokens, styles (573.5 kB, 51 files), manifest parity (69 components), token refs (48 files), React modules |
| `npm test` | PASS | 19,491 tests, 9 files |
| `npm run typecheck` | PASS | |
| `npm run test:contracts` | PASS | 14/14 |
| `npm run lint:manifest` | PASS | "manifest parity ok (69 components)"; "Token references: 48 files checked, all defined." |
| `node --test packages/react/tests/*.test.mjs` (after `build` only) | **FAIL 2/154** | `badge.test.mjs:47` and `indicator.test.mjs:52`: `ENOENT … apps/docs/dist/gallery-components.html`. The tests depend on a docs build. |
| same, after `npm run build:docs` | PASS | 154/154 |
| `npm run test:consumer` | **FAIL** | `types.tsx(7,150): TS2322 '"xs"' not assignable to '"sm" \| "md"'` (Panel); `types.tsx(7,207): '"sm"' not assignable to 'Size'` (Checkbox); `types.tsx(16,19): '"sm"' not assignable to '"md" \| "lg"'` (`checkboxVariants({size:'sm'})`); runtime `RangeError: area-checkbox: invalid size=sm` from `imports.mjs:20`. Also stale: `imports.mjs:26,28` (`Panel size:'xs'`, `area-panel--xs`) and the `types.tsx:17` comment "public choice controls start at sm". |
| `npm run lint:icons` | PASS | "icon lint ok (504 icons, 7 status marks)" |
| `npm run build:docs` (incl. dogfood `audit`) | PASS | 83 pages, 1,413 demos, components used 69/69, no raw values in docs CSS |
| `npm run test:preview` | PASS | 4/4 |
| `node packages/tokens/src/contrast/report.ts` | PASS | 0 failing, 370 passing, 66 themes |
| `git diff --check` | PASS | |
| Browser fixtures (`lab.html`, `scopes.html`, `contrast.html`, `inset.html`, `switch-audit.html`) | NOT RUN | These need a browser or dev server, which the brief excluded. Every rendering claim below comes from reading code. |

## Findings

### H-1  Pill preset turns non-Button shapes into capsules
- Scope: Card, Card-in-well, ColorPicker, ColorSwatchPicker (palette), AlignmentPicker, Kbd, Calendar (square days), Alert (banner), Avatar (square), CommandPalette hint plates, PropertyList handle, Panel toggle focus
- Category: theming · Severity: high · Type: FIX
- What: the Pill preset sets `radius-control-*` to 999px and keeps `radius-container: 24` so that "containers stay finite" (`packages/tokens/src/axes/radius.ts`, pill note). Button caps its radius with `radius-button-cap`. Message, Composer, Toolbar, Nav, Tree view and the fields also cap theirs. The consumers below have no cap:
  - `surface.css:44,100,104,108`: `--_card-radius: calc(var(--area-radius-control-md) + inset + step)`, so a Card becomes 1,015px, a stadium. Card-in-well at `surface.css:347` uses `control-sm`.
  - `color.css:229`: the `.area-color-picker__area` square becomes a circle. Also `color.css:132` (palette grid clip), `color.css:318` (preview).
  - `alignment-picker.css:12` (picker frame), `kbd.css:18` (`--_radius: control-sm`), `calendar.css:10` (`--_day-radius`), `surface.css:628` (`--_alert-radius` on the 44px banner), `display.css:50` (square avatar), `command-palette.css:135`, `property-list.css:46`, `panel.css:206`.
- Evidence: `grep radius-control` outside button.css, listed above. Not rendered; this comes from reading code.
- Visual: Card, the colour area and the alignment grid shown at Standard beside Pill, where the card is a lozenge and the colour square a circle.

### H-2  Sharp preset is not sharp: concentric derivations keep the inset as a radius
- Scope: Card (12/16/20), Composer (8), Message bubble and Prompt suggestions (8), Toolbar surface (8), Segmented track (2), ColorSwatch (20% of side)
- Category: theming · Severity: medium · Type: DECISION
- What: each concentric corner is `inner + inset`. At Sharp, `inner = 0`, so `outer = inset`. Evidence: `surface.css:44` (Card: 0 + 8 + 8 = 16), `composer.css:22` (`button-radius + composer-inset(8)`), `message.css:30` and `prompt-suggestions.css:34`, `toolbar.css:20` (`toolbar-radius + inset 8`), `segmented.css:49-50` (`radius-control + inset 2`), `color.css:32` (`--_shape: 0.2`). The cohesion audit's fourth pass left one of these open ("Message bubble … at Sharp they stay 8").
- Options:
  - A) Sharp means 0 everywhere: multiply the added inset by a radius-axis factor (0 at Sharp, 1 otherwise), or clamp each derived corner with `min(…, radius-container × k)`.
  - B) Keep concentricity: Sharp becomes "square controls, rounded shells".
  - C) Add derived container roles to the radius axis (`radius-card`, `radius-shell`) with explicit Sharp and Pill values.
- **Recommended: C.** It is the systematization step anyway, keeps the owner's 22/24/28 at Standard, and fixes H-1 in the same place.
- Visual: a Sharp-preset strip of Card, Composer, Message, Toolbar and Segmented, all showing residual rounding.

### H-3  Surface axis: shadows ignore `flat`, and required edges vanish at `elevated`
- Scope: Menu, Popover, Dialog, Toast, Calendar, ColorPicker, CommandPalette, Select picker, Toolbar overflow, Card, Tooltip, Toolbar (surface); outline Button, choice cards, ButtonGroup, SplitButton, Kbd, Nav marker
- Category: theming, system-rule · Severity: high · Type: FIX (edges), DECISION (lift token)
- What (shadows): the shared lift `0 20px 24px shadow-color, 0 5px 8px …50%` is written out nine times: `calendar.css:45`, `color.css:213`, `command-palette.css:42`, `navigation.css:330`, `toolbar.css:76`, `surface.css:782,871,1182,1277`. Other literal shadows: Card `surface.css:60-61`, Tooltip `surface.css:1229` (`0 4px 12px -2px`), Toolbar `toolbar.css:33` (four layers), ColorPicker thumb `color.css:203`. None of them read `--area-shadow-1..4`, so `surface="flat"` ("No elevation anywhere", `axes/surface.ts`) still lifts every overlay. DESIGN_SYSTEM.md:89 documents this only for Card. `--area-shadow-4` is unused.
- What (edges): `surface=elevated` sets `border-width: 0px`. These required or state edges use it:
  - `button.css:69`: the outline Button border, so an outline Button reads as ghost.
  - `choice.css:114,127-129`: the checked Checkbox and Radio card edge, a state cue.
  - `button-group.css:55-57` and `split-button.css:48-50`: dividers (`inline-size: border-width`).
  - `kbd.css:12,57,65`: height `size-10 + space-8 + 2×border-width`, so Kbd shrinks from 20 to 18.
  - `nav.css:160`: the marker becomes 2px instead of 3px.
  - `inset.css:41`: Button inset math.

  DESIGN_SYSTEM.md:103 and CONTRAST.md:27-28 say required edges use `stroke-width`.
- Options (lift):
  - A) Add a `shadow-float` role to the Surface axis: none at Flat, the current lift at Outlined.
  - B) Keep the literal lift and document that overlays ignore Surface.
- **Recommended: A**, and move the listed required edges to `--area-stroke-width`.
- Visual: a Flat-preset overlay stack (menu, popover, toast) still shadowed; an Elevated-preset outline Button beside a ghost Button, looking identical.

### H-4  Compact density readiness: about 41% of dimensions are fixed
- Scope: all families. Worst ratios: Badge, Nav, Tooltip, Choice, Code block, Card, Calendar, Panel, ColorPicker, CommandPalette, Menu, Switch, Popover, Kbd, Dialog, Tabs, Indicator
- Category: theming · Severity: medium · Type: DECISION
- What: of 1,158 dimension declarations (sizes, paddings, gaps, radii, type) in component CSS and inset.css, 570 read density tokens (`control-`, `gutter-`, `icon-`, `gap-`, `ui-`, `text-`, `title-`), 126 read radius tokens, and **471 are fixed** (417 fixed `--area-space-*` or `size-*` primitives, 63 literal px). Per family (fixed of all dimensions): Badge 32/46, Nav 22/40, Tooltip 22/26, Choice 20/40, Code block 20/41, Card 20/48, Calendar 17/30, Panel 17/35, ColorPicker 16/37, CommandPalette 16/31, Menu 16/37, Switch 16/31, Popover 15/24, Kbd 13/17, Dialog 13/19, Tabs 12/32, Indicator 11/13. Nearly density-complete: ButtonGroup 0/24, InputGroup 1/26, NumberField 1/29, Segmented 2/28, Chip 3/33, Input 5/34, Select 7/40, Button 5/33 (the 6px icon gap). Some fixed values are deliberate (hairlines, focus offsets, Badge's own ladder), so treat this as an upper bound.
- Evidence: script output in the scratchpad (`theming.txt`). Concrete non-compressing pieces:
  - the "mark ladder" 16/20/24 (Badge `badge.css:188-191`; Checkbox `choice.css`; Switch `switch.css:38-40`; ColorSwatch; Count; Kbd; Presence);
  - Calendar cells 36/32 literal (`calendar.css` `--_cell`/`--_day`);
  - CommandPalette row `48px` (`command-palette.css:53`);
  - Prompt rows `text-md-leading + 24`;
  - all surface insets (Popover 12, Dialog 16, Card 6/8/12 + 8, Panel 12/16, Tooltip 4/10).
- Options:
  - A) Compress everything by mapping `space-*` inside components onto density-scaled spacing tokens.
  - B) Compress only controls and rows; surfaces and marks stay put. Today's behaviour, documented.
  - C) Add a density-scaled "mark" and "inset" role pair (for example `mark-sm/md/lg`, `inset-surface-sm/md`) and move only the clusters in the value tables below onto them.
- **Recommended: C.** It matches the owner's plan ("dense sizes 24/28 go to compact density", handoff:19-20) without re-deriving every component.
- Visual: one tile per family at default beside compact, with the parts that did not shrink outlined.

### H-5  Dark mode depends on unmeasured `light-dark()` literals and a single shadow ink
- Scope: Card, Alert, Toast, Dialog, CommandPalette, Skeleton, Count, the colour family, Toolbar
- Category: theming · Severity: medium · Type: DECISION
- What: 26 declarations carry `light-dark()` or rgb literals whose dark side was never captured (handoff:3 and 435, "product dark themes need the owner's go-ahead"; "third-pass changes in dark mode" unverified). Risky spots:
  - Toolbar shadow stays **black** in dark (`toolbar.css:33`);
  - Card shadow ink 16% black and edge `neutral-750` (`surface.css:56,60`);
  - Count plate `white / 0.1` (`count.css:72`);
  - Skeleton dark falls back to `bg-component` / `-active` (`display.css:155-156`);
  - the dialog and palette scrim is 13% black light against the 65% `bg-overlay` dark (`surface.css:759,788`, `command-palette.css:19`);
  - Alert and Toast icons are palette rungs in light but `fg-*` roles in dark (`surface.css:740-743,1314-1317`);
  - the shared lift in dark is `shadow-color` 8% black (tokens.css), which is nearly invisible on dark surfaces (unverified).
- Options: A) schedule the dark capture pass per approval batch; B) accept derived dark values and verify only contrast.
- **Recommended: A**, starting with the floating surfaces and Card, which all rest on the one lift and Card literal.
- Visual: the same eight overlays and cards in light and dark, side by side.

### H-6  Title weight: rule says 400, approved code says 500
- Scope: Card, Dialog, Popover, Toast, Alert, Panel (title and section heading), Nav group label, Calendar month title, Code block marker
- Category: consistency, docs-drift · Severity: high · Type: DECISION
- What: DESIGN_SYSTEM.md:41-44 says "400 for text and every title or heading; 500 only for labels on fills". The handoff says "weight 400 everywhere except labels on fills (500)" (:42) and "Lighter UI: regular-weight titles" (:17). The code (all Complete):
  - `surface.css:233` Card, `:570` Alert, `:825` Dialog, `:979` Popover, `:1297` Toast;
  - `panel.css:110,176`; `nav.css:83`; `calendar.css:58`; `code.css:320`.

  `docs/specs/typography.md:76-92` records "Surface title … strong" as the role table. The demo `gallery.tsx:1926` (GallerySpinnerEmpty) hand-styles a 500 title.
- Options:
  - A) Titles are 500 (update DESIGN_SYSTEM and the handoff to typography.md's role table).
  - B) Titles are 400 (ink and size carry hierarchy; touches nine families).
  - C) 500 only for compact surface titles (14/20) and 400 for standalone ones (16/24).
- **Recommended: A.** It reflects every approval since 2026-09-26. Fix the docs so later passes stop re-litigating it.
- Visual: the nine title sites in a strip at 400 against 500.

### H-7  Surface titles split in compact: Card shrinks, Dialog does not
- Scope: Card, Dialog (and anything on `text-md`)
- Category: consistency, theming · Severity: medium · Type: FIX
- What: both are "Surface title, standalone 16/24 strong" (typography.md:86). Card uses `--area-text-md-size/leading` (`surface.css:47-48`), which compact maps to 14/20 (`axes.css` compact block). Dialog uses the primitives `--area-size-16` and `--area-leading-24` (`surface.css:823-824`), which stay 16/24. `typographyRamps` keeps `title-*` fixed in compact, but neither family uses a `title-*` token for these titles.
- Options: A) both read a new or reused title role that stays fixed in compact (`title-xs`); B) both read `text-md`. **Recommended: A** (handoff: "titles fixed in compact").
- Visual: a compact Card and a compact Dialog header side by side.

### H-8  Icon-to-label gap: 6 in Button, 8 in every other control, 12 in Menu
- Scope: Button, Tree view vs Chip, Input, Select, Segmented, Nav, Tabs, Toolbar; Menu and CommandPalette
- Category: consistency, tokens · Severity: medium · Type: DECISION
- What: `button.css:27,459,469` sets `--_gap: 6px /* spec */` (Notion) at md and lg, and `gap-sm` (4) at sm. Tree view also uses 6 literal. Chip, Input, Select, Segmented and InputGroup use `gap-md` (8 at default, 6 in compact) and `gap-lg` (8). Menu uses 12 (`surface.css:989`, `command-palette.css:28`). A Button with an icon and a Segmented option with an icon at the same height differ by 2px. The density comment (`axes/density.ts`) still describes the gap as "Primer's 8px control gap".
- Options: A) set `gap-md` and `gap-lg` to 6 in the density axis (every control follows Button and Notion); B) Button returns to `gap-md` 8; C) keep both as intended roles. Menu's 12 is a column rule and stays either way.
- **Recommended: A.** One number, measured from Notion; compact is already 6.
- Visual: Button, Chip, Input, Segmented and Select with a leading icon at md, stacked on one left edge.

### H-9  Value clusters that should become tokens (systematization input)
- Scope: system
- Category: tokens · Severity: medium · Type: DECISION
- What:
  - the floating lift, 9 copies (H-3);
  - the scrim `rgb(0 0 0 / .133)`, 3 copies (`surface.css:759,788`, `command-palette.css:19`);
  - disabled `opacity: 0.5`, 16 literal sites (`button.css:154`, `chip.css:127`, `choice.css:40,313,347`, `alignment-picker.css:89`, `calendar.css:140`, `color.css:119,367`, `command-palette.css:144`, `nav.css:175`, `navigation.css:111`, `segmented.css:108`, `slider.css:162`, `surface.css:1047`, `switch.css:104`);
  - the 16/20/24 mark ladder across 8 families (H-4);
  - the nested dismiss (H-11);
  - Card's `neutral-100/750` edge and `neutral-25/800` media fill;
  - Alert and Toast icon rungs `blue-500`, `red-500`, `orange-550`, `green-550`, 8 sites, the only direct palette rungs apart from ColorSwatch `neutral-50/800` (`color.css:41`).

  Tokens already exist but are **unused**:
  - a z-index scale `--area-z-base…--area-z-tooltip` (0–80), while Toolbar overflow uses a literal `z-index: 10` (`toolbar.css:76`);
  - radius primitives `--area-radius-0…32` and `--area-radius-nested`, while components hand-compute nested radii;
  - `--area-shadow-4`; `--area-ease-in`, `-in-out`, `-linear`; `--area-duration-instant`;
  - `--area-display-*`, `--area-title-md-*`, `--area-title-sm-tracking`, `--area-text-xs-tracking`;
  - `--area-badge-bg`, `--area-badge-fg`, `--area-badge-tracking-wide`;
  - `--area-fg-*-strong`, `--area-*-border-subtle`;
  - `gap-`, `gutter-`, `icon-` `xs` and `xl`, and `--area-radius-control-xl`.
- Options: A) create `opacity-disabled`, `shadow-float`, `scrim`, `mark-*` and `z-*` roles now (they are behaviour-neutral); B) wait for the whole systematization phase.
- **Recommended: A** for the five behaviour-neutral roles, and prune or park the unused tokens.
- Visual: a cluster chart per role with the family chips that use each value (see the Value inventory tables).

### H-10  Anchored gap: Popover spec says 4, overlay spec and JS say 8
- Scope: Popover (React `trigger`), CSS-anchored Popover, Model picker
- Category: consistency, docs-drift · Severity: low · Type: DECISION
- What: `docs/specs/popover.md:104` says "anchored · offset **4** from the trigger". `docs/specs/overlay.md:66,79` says "popover gap 8". `packages/react/src/components/Overlays.tsx:17-18` sets `MENU_OFFSET = 4` and `POPOVER_OFFSET = 8`. The CSS-only anchor path sets `--_popover-offset: 4px` (`surface.css:910`), and `model-picker.css:21` sets `margin-block: 4px /* spec: every anchored surface is 4 */`. A React trigger popover therefore sits 8px out, while the framework-free anchored popover sits at 4.
- Options: A) 4 everywhere (Notion, shadcn); B) 8 for popovers, 4 for menus and tooltips. **Recommended: B**, with the CSS path and popover.md aligned to it (an overlay pass read nine systems for 8).
- Visual: a trigger with its popover at 4 and at 8.

### H-11  Close and dismiss: three prop names, four sizes, three constructions
- Scope: Alert, Toast, Badge, PromptSuggestions (`onDismiss`); Chip (`onRemove`); Dialog (`onClose`)
- Category: api, consistency · Severity: medium · Type: DECISION
- What: props are at `primitives.tsx:158,1180,843,1283`, `Badge.tsx:11`, `PromptSuggestions.tsx:19`. Visuals:
  - Dialog close is a 32px Button md (`primitives.tsx:1326`);
  - Toast is a Button sm, 28 (`primitives.tsx:1197`);
  - Alert is a custom 28px button with a 12% ink plate (`surface.css:696-719`);
  - Badge is a 12px glyph in its media box (`Badge.tsx:41`);
  - Chip is a concentric circle.

  DESIGN_SYSTEM.md:76-77 says "Nested dismiss and close actions are 28px". Accessible names: `dismissLabel` (Alert, Toast, Badge) and `removeLabel` (Chip), while Dialog hard-codes "Close dialog".
- Options: A) one `onDismiss` + `dismissLabel` everywhere, with Dialog keeping `onClose` as an alias; B) keep the family-specific names. For size: A) 28 everywhere (Dialog goes to Button sm); B) keep Dialog at 32 and amend the rule. **Recommended: A/A**, or record Dialog's 32 as the exception.
- Visual: the six closes lined up with sizes annotated.

### H-12  Value, checked and open callbacks are inconsistent
- Scope: Segmented, Switch, Checkbox, Chip, RadioGroup, Dialog, HoverCard, ContextMenu, Tooltip
- Category: api · Severity: medium · Type: FIX
- What:
  - `onValueChange` in 16 places, but Segmented uses `onSelect?: (value) => void` (`primitives.tsx:1378`);
  - Switch has `onCheckedChange` (`Switch.tsx:11`), but Checkbox exposes only native `onChange` (`forms.tsx:100-114`), and Chip uses `onSelectedChange` (`primitives.tsx:836`);
  - RadioGroup, AlignmentPicker and ColorSwatchPicker pass `(value, event)`; all others pass `(value)`;
  - Popover, Menu, Tooltip, CommandPalette and PanelSection have `open`/`defaultOpen`/`onOpenChange`; Dialog, HoverCard and ContextMenu have only `onOpenChange` (not controllable);
  - HoverCard exposes `openDelay`/`closeDelay`, while Tooltip's delays are constants (`Overlays.tsx:26-28`).
- Visual: n/a (API table).

### H-13  Axis vocabulary drift in the manifest
- Scope: Kbd, Code/Token, Avatar/Badge, Button, IndicatorAnchor, Nav, Slider, Tabs, Table, Checkbox/Radio, Indicator, Toast, Alert, Card, Presence
- Category: api · Severity: medium · Type: DECISION
- What:
  - Kbd `size=small|normal` and `appearance=default|quiet|on-color|on-emphasis`, plus a deprecated `quiet` boolean (`primitives.tsx:1801`). The rest of the library uses `sm|md` and `variant`.
  - Code and Token have `ground=on-color|subtle` in the manifest, but React exposes the booleans `subtle`/`onColor` (`primitives.tsx:1449-1455,1847-1860`).
  - Avatar tone `inverse` against Badge tone `inverted`.
  - Values that repeat the axis name, against DESIGN_SYSTEM.md:126-128: Button `align=align-start|align-end` (React maps `start|end`) and IndicatorAnchor `overlap=overlap-rectangular|…`.
  - Single-value axes with no default: Nav `orientation=horizontal`, `tone=accent` and `selection=marker` (React adds `vertical` and `neutral`); Slider `orientation=vertical` and `labelPosition=top` (React `inline|top`); Tabs `orientation=vertical`; Checkbox and Radio `variant=card` and `layout=row|tile`.
  - Tabs and Table `size` have no default, although DESIGN_SYSTEM.md:154 says "default to md".
  - Indicator's default tone is `danger`, against the "neutral by default" rule (DESIGN_SYSTEM.md:46).
  - Tone sets differ without a stated reason: Toast has no `accent`; Alert has no `caution`/`discovery`; Switch has a `custom` tone.
  - Card `layout=compact` shares a word with the compact density.
  - Presence exposes `xs` (DESIGN_SYSTEM.md:156 says do not).
  - React-only axes missing from the manifest: SplitButton `tone`/`size`, ModelPicker `size`, BoxField `kind`, Skeleton `animated`/`lines`.
- Options: A) normalize in one breaking pass while the library is unpublished; B) document each exception. **Recommended: A** (nothing is published; see DEVELOPMENT.md "Package contract").
- Visual: n/a (see the API matrix).

### H-14  Slot and collection naming
- Scope: all composites
- Category: api · Severity: low · Type: DECISION
- What:
  - Leading content is `icon` (Button, Alert, Toast, Avatar, Nav, Chip, ToolbarOverflow), `leadingIcon` (Input, where `icon` is `@deprecated`, `Input.tsx:11`), `leadingVisual` (Checkbox, Radio), `visual` (InputGroupText, a boolean), plus `avatar`, `swatch`, `image` and `flag`.
  - Trailing content is `trailingIcon` (Button, Input, ChipLink) or `trailing` (NavItem).
  - Collections are `tabs` (Tabs), `options` (Segmented, Combobox, ColorSwatchPicker), `items` (CommandPalette, TreeView), `models` (ModelPicker) and `suggestions` (PromptSuggestions).
  - `label` is sometimes visible (Switch, Field, NavGroup) and sometimes only the accessible name (Segmented, AlignmentPicker, ColorSwatchPicker, Spinner).
- **Recommended:** `icon`/`trailingIcon` for glyphs and `leadingVisual` for media; `items` for collections; `label` visible and `aria-label` for names.
- Visual: n/a.

### H-15  Packaging gate red; React tests depend on the docs build
- Scope: `tests/consumer/`, `packages/react/tests/badge.test.mjs`, `indicator.test.mjs`
- Category: system-rule · Severity: medium · Type: FIX
- What: see the Check results table. The fixture predates Panel xs removal and Checkbox/Radio sm removal (owner, handoff:138). The handoff (:257) knows only the Panel half; its Verification section (:443) still says "consumer check" passes. `badge.test.mjs:50` and `indicator.test.mjs:54` read `apps/docs/dist/gallery-components.html`, so `npm run build` followed by the React tests fails until `build:docs` has run.
- Visual: n/a.

### H-16  Forced colours: fill-only states with no system-colour fallback
- Scope: Progress, Spinner, Nav (current plate and marker), Tree view (selected and current), Table (selected rows), Code block (selected tab), Panel (resize focus pill), Avatar (active ring)
- Category: a11y · Severity: medium · Type: FIX (verify in emulation first)
- What: `forced-colors.css` covers fields, Menu rows, Button/Chip/Segmented selected, Checkbox/Radio, Slider, Tabs and PropertyList. In-file blocks exist in 9 CSS files (alignment-picker, badge, calendar, color, count, indicator, message, presence, switch). 33 of 42 component files have none. Forced colours drop authored backgrounds and box-shadows:
  - the Progress bar and Spinner arc (`background` + `mask`, `display.css:233-245,272`) would paint Canvas;
  - the Nav current row (`nav.css:241`) and marker (`nav.css:164`), the Tree view `[aria-selected]` / `[aria-current]` plate (`tree-view.css:45-46`, no rail since pass 3), and interactive Table selection lose their only visual cue;
  - Avatar's active ring is a box-shadow.

  CONTRAST.md:59-61 promises system colours for "required marks, selected states".
- Evidence: code reading only. The handoff lists forced colours as unverified (:445).
- Visual: the listed families in a forced-colours emulation frame.

### H-17  Hover on touch: no `(hover: hover)` guard; Tree view actions unreachable
- Scope: all hover rules; Tree view, Badge, Switch, Checkbox/Radio
- Category: a11y, system-rule · Severity: medium · Type: DECISION + FIX
- What: 63 `:hover` rules, **0** inside `@media (hover: hover)`, so touch devices get sticky plates. Hover-revealed controls with a `(hover: none)` fallback: Message (`message.css:55`), Panel chevron (`panel.css:223`), Prompt suggestions (`:73`), PropertyList (`:60`), Card overlay (`surface.css:442`). HoverCard hides on touch (`hover-card.css:11`). **Tree view row actions** (`tree-view.css:80-82`) have none, and are revealed on the row's `:hover`/`:focus-visible`, not `:focus-within`. A focused action inside the row may stay invisible (unverified; depends on whether actions are tabbable). Coarse-pointer target enlargement exists only for Badge (`badge.css:186`) and Switch (`switch.css:121`).
- Options: A) wrap hover plates in `@media (hover: hover)` system-wide; B) keep ungated hover and accept sticky plates. **Recommended: A**, plus a Tree view `(hover: none)` and `:focus-within` fix.
- Visual: a phone frame showing a tapped row with its stuck plate, and a Tree view row with its hidden actions.

### H-18  Tree view disabled rows repaint instead of dimming
- Scope: Tree view
- Category: system-rule · Severity: low · Type: FIX
- What: `tree-view.css:49` sets `[data-disabled] { color: var(--area-fg-disabled) }`. The shared rule (DESIGN_SYSTEM.md:71-72) is "rows … dim to 50% as a whole". Nav was fixed exactly this way in the cohesion audit; Menu (`surface.css:1045-1048`) dims. No other family dims and repaints at once: Calendar resets ink inside a disabled calendar (`calendar.css:92`).
- Visual: a disabled Tree view row beside a disabled Nav row.

### H-19  Physical placement and dead RTL rules
- Scope: Model picker, Select
- Category: a11y (RTL) · Severity: low · Type: FIX
- What: `model-picker.css:20` uses `position-area: bottom span-left`, which is physical. The fourth pass converted Combobox and HoverCard to self-logical; Model picker was missed. `navigation.css:246,250` (`.area-select` `background-position: right var(--_gutter)` and the `[dir="rtl"]` twin) are dead, overridden by `inset.css:130-132`. Other physical uses are intentional: pointer coordinates (`context-menu.css:15-16`), the 2-D colour area (`color.css:249`), physical `side` arrows (`surface.css:938-941`).
- Visual: the Model picker menu in LTR and RTL.

### H-20  Motion: one literal transition, and literal loops ignore `expressive`
- Scope: Card, Spinner, Message, Progress, Skeleton
- Category: system-rule · Severity: low · Type: FIX
- What: `surface.css:439` sets `transition: opacity 200ms` (Card reveal), which ignores `motion=none` and reduced motion. The loops (Spinner 1s `display.css:247`, Message pulse `1s ease-in-out` `message.css:66`, Progress 1.8s `:295`, Skeleton 3s `:167`) stop correctly under both `data-area-motion="none"` and `prefers-reduced-motion` (`display.css:312-354`, `message.css:68-69`), but do not scale with `expressive`. Indicator is the exception: `duration-slow × 4`. Spinner slows to 1.8s under reduced motion but stops under `motion=none`; that asymmetry is intended and documented.
- Visual: n/a.

### H-21  DESIGN_SYSTEM.md contradicts code and owner decisions
- Scope: `docs/DESIGN_SYSTEM.md`
- Category: docs-drift · Severity: medium · Type: FIX
- What:
  - **:81-83**: keycap "radius 4 … concentric inside Buttons". Code: `kbd.css:16-18` is 6 (`radius-control-sm`) in every host; handoff:120 records "6px keycap corner everywhere as a rule".
  - **:163-164**: "Checkbox and Radio … 16px at sm and md". The manifest is `md|lg` only (sm removed 2026-09-28).
  - **:162**: "Badge has a dedicated 20/24/28px label ramp". Code is 16/20/24 (`badge.css:188-191`; spec badge.md "16 / 20 / 24").
  - **:170-173**: "Card is twice the container radius … Every surface, Card included, uses the container role". Code: `control-md + inset + step`, giving 22/24/28 (owner, handoff:196-197).
  - **:88** says Card's edge is "neutral 100"; **:100-101** says "A Card's edge … take[s] the divider role". The code is `neutral-100` (`surface.css:56`).
  - **:52-55**: Checkbox, Radio, Chip and AlignmentPicker tone "await owner review". All are Complete.
  - **:41-44**: titles at 400 (H-6).
  - **:76**: dismisses are 28px (H-11).
  - The Elevation section omits Toolbar's own literal bar shadow (`toolbar.css:33`), while cohesion-audit's "Kept" table still says Toolbar uses `shadow-1` and a 4 inset.
- Visual: n/a.

### H-22  COMPONENTS.md, specs/README.md and spec headers still say "in review"
- Scope: `docs/COMPONENTS.md`, `docs/specs/README.md`, 15 spec headers, `docs/specs/checkbox.md`
- Category: docs-drift · Severity: low · Type: FIX
- What (COMPONENTS.md):
  - :20-25 (20 families "back in review"), :37 ("Breadcrumb … is in review"), :57 ("Items marked built are in review"), and :62, :70, :75, :77, :83, :88, :103, :106, :118 ("built, in review"), :155 (Count and Banner "in review"). All 58 families are Complete (`component-status.mjs`; `REVIEW_COMPONENTS` is empty).
  - The "Existing library" list (:32-41) omits 13 built families: Toolbar, ButtonGroup, AlignmentPicker, BoxField, PropertyList, Combobox, CommandPalette, ContextMenu, HoverCard, Message, PromptSuggestions, ModelPicker, ScrollToLatest.
  - The gap audit and inventory still list built items as missing (:124 Breadcrumbs, Tree, ContextMenu, CommandPalette; :130 HoverCard, Resizable; :134 Banner; :146-154 Combobox and overlay behavior "missing/partial").
  - :96-97 says ColorPicker is "still missing … a contrast check" right after :95 says a contrast check was added.

  specs/README.md: 34 rows say "in review", and `count.md` has no row. Spec headers still "in review": alignment-picker, checkbox, color-picker, color-swatch-picker, input, input-group, nav, overlay, radio, resizable-panel, segmented, select, switch, table, toolbar. `checkbox.md:29` still lists "sm, md (default), lg" and `:59` "shadow-1" on the control, which was removed.
- Visual: n/a.

### H-23  Handoff contains stale and contradictory sections
- Scope: `.Codex/HANDOFF.md`
- Category: docs-drift · Severity: low · Type: FIX
- What:
  - :6 "Indicator stays In review": it is Complete.
  - :41 "small controls 12/16": `density.ts` sm is 14/20.
  - :108 "Tooltip … behavior is new and unreviewed": approved in batch 17.
  - There are two `## Next` sections (:343 and :407). The first still asks the owner to "review the 20 In-review families" and says "custom Select listbox, then Combobox" (Combobox is Complete).
  - :277 cites `GalleryReviewSpinner`, which no longer exists.
  - :341 says "Pass reviews for Card, Table, Chip, Alert and Slider … (remove once the owner has seen them)": still present (H-24).
  - Verification (:437-446) claims 114 React tests and a passing consumer check; there are now 154 tests and the consumer check fails.
  - The seven "Open for the owner" questions in cohesion-audit's fourth pass have no recorded answers (H-26).
- Visual: n/a.

### H-24  Gallery: leftover review rows, dead demos, off-vocabulary copy
- Scope: `apps/docs/src/demos/*`, `apps/docs/src/practices.mjs`
- Category: gallery · Severity: low · Type: FIX
- What:
  - **15 `GalleryReview*` exports still render inside each family's Pass review** (`build.mjs:1049-1055`): Button (`button.tsx:129`); Table, Card, Chip, Alert, Slider (`reviews.tsx:18-96`, whose header says "Remove a review once the owner has seen it"); ButtonGroup, Dialog, NumberField, Kbd, Menu, Popover, Toast, TreeView, Composer (`gallery.tsx:137,737,1284,1337,1473,1688,2005,2096,2172`). `GalleryReviewKbd` still shows "Proposal, not applied: a drawn edge", which the owner rejected (handoff:124). `GalleryReviewChip` shows sm, md and lg in one row (`reviews.tsx:59`), against the one-size-per-tile rule.
  - **Likely dead demo exports** (no reference in build.mjs, pages.mjs or the clients, and not built by name):
    - Buttons and groups: GalleryButtonAccent, GalleryButtonGhost, GalleryButtonOutline, GalleryButtonSoft, GalleryButtonSuccess, GalleryButtonGroupOutline, GalleryButtonGroupSizes;
    - fields: GalleryInputGroupSizes, GalleryField, GalleryInput, GallerySelect, GalleryTextarea;
    - Switch: GallerySwitch, GallerySwitchDisabled, GallerySwitchLarge, GallerySwitchMedium, GallerySwitchOn, GallerySwitchSmall;
    - Token: GalleryToken, TokenDefault, TokenInProse, TokenOnColor, TokenSubtle, TokenSwatch;
    - Popover: GalleryPopoverArrow, GalleryPopoverLeft, GalleryPopoverRight;
    - Badge: BadgeAnchorPlacements, BadgeCountIndicators, BadgeIndicatorActivity, BadgePresenceIndicators, BadgePresenceOutside, BadgePresenceSizes.

    Treat the list as unverified: a name could be built dynamically.
  - Multi-size demos used on the (hidden) docs pages: GalleryToolbarSizes, AlignmentPicker, ColorField, ColorSwatch and ColorSwatchPicker Sizes, BadgeSizes (`gallery.tsx:247,358,385,410,438`, `badge.tsx:19`). The gallery itself uses split tiles.
  - People: only Irene Yamaguchi in demos (43 uses), but `practices.mjs:106` uses "Jane Doe".
  - Copy outside the vocabulary (DESIGN_SYSTEM.md:239-241): Breadcrumb "Dashboard / Reports" (`gallery.tsx:14-27`), HoverCard "Roadmap … inspector foundation" (`gallery.tsx:1077-1079`), Nav "Library", "Launch plan" (`gallery.tsx:1535-1540`), Card "Popular" (`card.tsx:324`).
- Visual: a Pass review screenshot with the stale proposal row.

### H-25  Presence and Token "compatibility" is not reflected in code
- Scope: Presence, Indicator, Token, Code
- Category: api, docs-drift · Severity: low · Type: DECISION
- What: COMPONENTS.md:38-39 says "Presence is its [Indicator's] compatibility export". In code, Presence is a full public component: its own manifest (`status` × 8, `size=xs|sm|md|lg`), an exported component (`index.ts` last line) with no `@deprecated`, and 8+4+5 gallery tiles under Indicator. Indicator duplicates it through `status`, `size` and `outOfOffice` props (`Indicator.tsx:111-113`). The Token manifest says "Deprecated compatibility alias" (`manifest.ts:664`), but React `Token` is not `@deprecated` and its demos are dead.
- Options: A) Presence becomes the status mark (public) and Indicator stops taking `status`; B) mark Presence and Token `@deprecated` and remove them before publishing. **Recommended: B for Token; A for Presence** (its sizes serve Avatar).
- Visual: n/a.

### H-26  Open owner questions from cohesion-audit pass 4 still unanswered
- Scope: Menu, ScrollToLatest, Combobox, Message, ModelPicker, SplitButton, ButtonGroup
- Category: consistency · Severity: low · Type: DECISION
- What (`docs/research/cohesion-audit.md`, "Open for the owner"):
  - Menu keyboard ring: the code is plate-only (`surface.css:1041-1042`, forced colours get a ring).
  - ScrollToLatest has no shadow (`scroll-to-latest.css:27`).
  - Combobox shows its selection with a check only.
  - Message radius at Sharp is 8 (H-2).
  - ModelPicker `size` is React-only (`ModelPicker.tsx:25`).
  - SplitButton and ButtonGroup disabled: each Button dims on its own, so the 1px overlap seam double-dims (no group-level disabled rule in `split-button.css` or `button-group.css`). This is the only one with a visible defect.
- **Recommended:** dim SplitButton and ButtonGroup as a group; keep the other current behaviours and record them.
- Visual: a disabled SplitButton with its darker seam.

### H-27  Hard-coded English accessible names
- Scope: Dialog, Calendar, CodeBlock, ModelPicker
- Category: api · Severity: low · Type: FIX
- What: `primitives.tsx:1326` "Close dialog"; `Calendar.tsx:206,218,233,235` "Previous/Next week/month"; `primitives.tsx:1620,1657` "Language"; `ModelPicker.tsx:30` `label = "Model"`. Other families take `dismissLabel`, `removeLabel`, `copyLabel`, `submitLabel`, `toggleLabel` and similar props.
- Visual: n/a.

## Value inventory tables

Effective values are at defaults (Standard radius, default UI, Outlined surface, Subtle motion). "Fixed" means a `--area-space-*`/`size-*` primitive or a px literal that does not follow the UI or density axis.

### Radius (default Standard)

| px | Source | Families |
|---|---|---|
| 0 | explicit | Alert `flush`, ButtonGroup and SplitButton inner joints, Panel docked edge, colour pieces |
| 4 | `control-xs`; `min(small, size/4)`; container − 4 | xs controls, CommandPalette hint plates, PropertyList handle, Panel toggle focus, Checkbox md (16/4), Tree view check and chevron plate, AlignmentPicker cell, Token (small − 2), Skeleton (`min(small, 4px)` spec) |
| 5 | `min(small, size/4)` | Checkbox lg (20/4) |
| 6 | `control-sm`, `radius-small` | Button sm, **Kbd (all hosts)**, Calendar day, Alert banner, Alert dismiss, ColorPicker area and preview, swatch palette, Breadcrumb plate, Code inline, Code block inner plates |
| 8 | `control-md`, `radius-row`, container − 4 | Button md, ButtonGroup, Toolbar item, Segmented item, Avatar square, AlignmentPicker frame, Nav row, Tree row, Select option, Menu, Combobox and palette rows |
| 10 | `control-lg`; control + 2 | Button lg, Tooltip (`min(control-lg, half height)`), Segmented track (8 + 2) |
| 12 | `radius-container` | Menu, Popover, Toast, Alert, Calendar, ColorPicker, Code block, Table wrapper, Panel, Select picker, Checkbox/Radio card, CommandPalette (`min(24, 8 + 4)`) |
| 14 | control-sm + 4 + 4 | Card in a well |
| 16 | control-md + 8 (concentric) | Dialog, Composer, Message bubble, Prompt suggestions rows, Toolbar surface |
| 22 / 24 / 28 | control-md + inset + step | Card sm / md / lg |
| 20% of side | literal 0.2 | ColorSwatch (swatch picker cells concentric) |
| full | `radius-full` | Badge, Count, Chip, Avatar, Indicator, Presence, Switch, Slider, Progress, Spinner, Calendar circle days |

Uncapped control-radius consumers (break at Pill): see H-1. Unused tokens: `radius-0…32`, `radius-nested`, `radius-control-xl`.

### Control and element heights

| px (default → compact) | Role / source | Families |
|---|---|---|
| 24 / 28 / 32 / 40 / 48 → 20 / 24 / 28 / 32 / 36 | `control-xs…xl` | Button, ButtonGroup, SplitButton, Chip, Input, NumberField, InputGroup, Select, Textarea (min 2×), Segmented, Tabs, Toolbar, Slider rows, Avatar (sm/md/lg), Menu, Nav and Tree rows (md), Alert and Toast controls (sm) |
| **16 / 20 / 24 (fixed)** | `space-16/20/24`, the "mark ladder" | Badge sm/md/lg, Count sm/md, Checkbox/Radio md/lg (16/20), Switch track h (16/20/24; width h + 12), Slider thumb (16/16/20), ColorSwatch, Kbd (small 16 / normal 20 via `size-10 + space-4/8 + 2×border`), Presence (10/12/16/20), Indicator count 16 (literal) |
| 6 (fixed) | literal / `space-6` | Indicator dot, Badge dot |
| 12 / 16 / 24 (fixed) | `space-*` | Spinner sm/md/lg |
| 4 / 6 / 8 (fixed) | `space-*` | Progress sm/md/lg, Slider track 4 |
| 32 / 36 (fixed literal) | `calendar.css` | Calendar day / cell |
| 40 | control-sm + 2 × 6 | Toast, Alert single line |
| 44 | space-12 × 2 + 20 | Alert banner; Card in a well |
| 48 (literal) | `command-palette.css:53` | CommandPalette search row |
| 48 | `text-md-leading + 24` | Prompt suggestions row; ModelPicker two-line rows (Menu `description`) |

### Inline paddings and surface insets

| px | Source | Families |
|---|---|---|
| 8 / 8 / 12 / 12 / 16 (compact 6 / 8 / 10 / 12 / 14) | `gutter-xs…xl` via inset.css | Button, Chip, Input, NumberField, InputGroup, Select, Segmented, Slider |
| 2 | `space-2` | Badge media gutter, Kbd small, Segmented track inset, Switch |
| 4 | `space-4` | Menu, Combobox and CommandPalette list inset; Kbd normal; Tooltip block; Table sm cell |
| 6 | `space-6` | Badge icon gutter; Card sm media inset; Code inline (2 × 6) |
| 8 | `space-8` | Badge text gutter; Card md inset and step; Composer inset; Table md cell; Toolbar surface; Prompt rows start; Select picker 6/8 |
| 10 | `space-10` | Tooltip inline; Toast block (10/12); Message bubble (10/16) |
| 12 | `space-12` (−border) | Popover, Toast inline, Alert block, Panel sm, Card lg inset, Calendar (literal `12px − border`), Checkbox/Radio card, Table lg cell |
| 16 | `space-16` (−border) | Dialog, Panel md, Alert banner inline, Card md text column, ColorPicker (literal `16px − border`), Code block gutter |
| 14 / 16 / 20 | inset + step | Card text column sm / md / lg |

### Gaps

| px | Source | Families |
|---|---|---|
| 4 / 8 / 8 (compact 4 / 6 / 6) | `gap-sm/md/lg` | Chip, Input, NumberField, InputGroup, Select, Segmented, Slider, Switch, Tabs, Toolbar, ButtonGroup, Breadcrumb, Field, Checkbox |
| **6 (literal)** | spec | Button icon gap md/lg (`button.css:27,459,469`), Tree view |
| **12 (literal)** | spec | Menu icon-to-label (`surface.css:989`), CommandPalette (`space-12`) |
| 5 (literal) | spec | Popover title row-gap (`surface.css:956`) |
| 2 | `space-2` | Badge dismiss, Nav/Tree actions, Menu, Segmented, Choice label, Prompt suggestions |
| 4 | `space-4` | 20 families (Alert, Badge, Card, Code, Dialog, Field, Menu, Nav, Panel, Tabs, Toast, …) |
| 6 / 8 | `space-6` `space-8` | Badge group (6 lines / 8 tags); Card, Dialog, Popover, Toast, Tooltip, Checkbox and Radio groups |
| 12 / 16 / 20 / 24 | `space-*` | Card, Panel, Message; Dialog, Popover, Calendar, Checkbox and Radio groups; Tabs (20/24) |

### Type (size / line-height)

| Size / leading | Token | Used by |
|---|---|---|
| 12/16 (compact 11/14) | `text-xs` | Field and Menu labels, captions, Calendar days, HoverCard meta, Switch description, Panel sm labels |
| 12/16 | `control-xs-text` | Badge sm/md, Count, Chip avatar initials |
| 14/20 (compact 13/18) | `ui-*`, `control-sm/md/lg-text` | every control label, Menu, Nav, Table, Alert, Toast, Popover, Select |
| 14/20 (compact 13/18) | `text-sm` | Card body, Code block, Panel |
| 16/24 (compact 14/20) | `text-md` | Card title, Composer, Message, Prompt suggestions, CommandPalette search |
| 16/24 (fixed primitives) | `size-16` / `leading-24` | Dialog title (H-7) |
| 32/40 | `title-lg` | Card value |
| 12/10 · 11/10 | `text-xs` / `size-11` + `size-10` leading | Kbd normal / small |
| 10/14 (literal) | spec | Indicator count (`indicator.css:8-9`) |
| 0.875em / 1.35 (literal) | | Code inline (`code.css:175-176`) |

Unused: `title-md-*`, `display-*`.

### Weights

| Weight | Sites |
|---|---|
| 400 `weight-regular` | default everywhere; Button soft, outline and ghost labels |
| 500 on fills (rule-conformant) | solid Button, Badge, Count soft, Indicator count, Avatar initials, Segmented (every option), Kbd, file-selector button |
| 500 on non-fill text (conflicts with DESIGN_SYSTEM; matches typography.md) | Card, Dialog, Popover, Toast and Alert titles; Panel title and section heading; Nav group label; Calendar month; Code block marker |
| other | none (no numeric `font-weight` in component CSS) |

### Border and stroke widths

| Width | Token | Notes |
|---|---|---|
| 1 (0 at Elevated) | `border-width` (Surface) | decorative, but also used for the required edges in H-3 (87 uses in component CSS) |
| 1 | `stroke-width` | required edges: fields, Switch, Slider, Checkbox mark, AlignmentPicker, Tree check (44 uses) |
| 2 / 2 | `focus-width` / `focus-offset` | all rings; inset rings use `-focus-width` (Select option, Tabs, Prompt row, colour cells) |
| 2 + 2 × contrast | `field-focus-halo-width` | Input, Select, Textarea, NumberField, InputGroup, Composer |
| 1 (literal) | hairline | Separator, Menu separator, Count divider, Slider marks, colour hairlines (`color.css:134,230,260,302,319`) |
| 2 / 4 | `space-2/4` rings | Avatar active ring (2 gap + 4), Indicator cutout |
| 4 (literal) | `--_thumb-ring` | ColorPicker thumbs (`color.css:200`) |

### Shadows

| Recipe | Where | Follows Surface? |
|---|---|---|
| `shadow-1` `0 .5 1 -.5` | outline fields, Badge `modern`, Segmented selected item, Select, Slider and Switch thumbs | yes |
| `shadow-2` `0 1 2 -.5` | Panel | yes |
| floating lift `0 20 24 c, 0 5 8 c/2` (literal × 9) | Menu, Popover, Dialog, Toast, Calendar, ColorPicker, CommandPalette, Select picker, Toolbar overflow | **no** |
| `0 4 12 -2 c` (literal) | Tooltip | no |
| `0 1 2 -1 ink, 0 2 8 0 ink` (ink 3% / 16%) | Card | no (documented) |
| `inset ring + 0 0 .5 18% + 0 3 8 10% + 0 1 3 10%` | Toolbar `surface` | no |
| `0 1 3 -2 10%, 0 5 12 -2 13%` | ColorPicker thumb | no |
| focus halos, rings, markers (box-shadow) | fields, Avatar, Indicator, Code block line marker, swatch cells | n/a |

`shadow-3` and `shadow-4` are unused by components.

### Motion

| Value | Source | Sites |
|---|---|---|
| 100 / 150 / 250 ms (none 0; expressive 150 / 250 / 400) | `duration-fast/base/slow` | `--area-transition` (colour, border and shadow, 25 sites), overlays (base; tooltip fast), SplitButton chevron (base), Switch thumb (slow), Progress width (slow), Indicator anchor (base) |
| 200 ms (literal) | spec | Card reveal (`surface.css:439`), H-20 |
| 1 s / 1 s / 1.8 s / 3 s (literal) | spec | Spinner, Message pulse, Progress indeterminate (and Spinner under reduced motion), Skeleton shimmer |
| slow × 4 | token | Indicator pulse |
| easing | `ease-out` everywhere; `ease-spring` Checkbox mark; literal `linear` (loops) and `ease-in-out` (Message) | `ease-in`, `ease-in-out` and `ease-linear` tokens unused |

### Opacity

| Value | Use | Sites |
|---|---|---|
| 0.5 (literal × 16) | disabled | see H-9 |
| 0.4 | dragging | PropertyList (`property-list.css:65`) |
| 0.5 | inactive value | PropertyList (`:29`) |
| 0 → 1 | hover or focus reveal | Message actions, Prompt dismiss, PropertyList handle, Panel chevron, Tree actions, Card overlay, Input action tooltip, ScrollToLatest |
| 0.3 / 0.6 → 0 | keyframes | Message pulse; Indicator pulse |

### z-index

| Value | Sites |
|---|---|
| −2 … 2 (local stacking) | Card (media −2/−1, link 1–2), Slider (0–2), Calendar range (0–1), Switch (2), focus lifts in groups (1), Tooltip arrow (0) |
| 10 (literal) | Toolbar overflow, the only floating surface outside the top layer (`toolbar.css:76`) |
| token scale `z-base 0` … `z-tooltip 80` | **unused** |

## API matrix

Legend: ✔ = present. "Value API" names the controlled trio. All 109 `forwardRef` components forward refs and spread native props (heuristic scan, spot-checked Badge). Exceptions: `NavSeparator` (no props, no ref), `ToolbarItem` (cloneElement), `Glyph` (internal).

| Family | variant | tone | size | Other axes / booleans | Value / open API | Dismiss / slots |
|---|---|---|---|---|---|---|
| Button | solid·soft·outline·ghost (solid) | 8 semantic (neutral) | sm·md·lg | align start·end (manifest `align-start`), fullWidth, iconOnly, pill, selected, loading | — | icon, trailingIcon |
| ButtonGroup | soft·outline | — | sm·md·lg | fullWidth | — | — |
| SplitButton | solid·soft·outline·ghost | ButtonTone (**React only**) | Button's (**React only**) | iconOnly, selected, disabled | onClick; menu | icon, menuLabel |
| Toolbar | plain·surface | — | sm·md·lg | orientation, fullWidth | — | Overflow icon |
| AlignmentPicker | surface·plain | neutral·accent | sm·md·lg | stretch | value/default/onValueChange(v, e) | label (accessible name) |
| ColorSwatch | — | — | sm·md·lg | color | — | — |
| ColorSwatchPicker | — | — | sm·md·lg | layout grid·row·palette | onValueChange(v, e) | label |
| ColorField | — | — | sm·md·lg | alpha, fullWidth | onValueChange(v) | opacityLabel |
| ColorPicker | (none in manifest) | — | — | view, model | onValueChange, onModelChange, onViewChange, onAddSwatch | swatchesLabel |
| Calendar | plain·surface | neutral·accent | — | days, layout, selectionMode single·range·multiple | onValueChange, month/onMonthChange | hard-coded prev/next names |
| Field | — | — | — | orientation, inline (@deprecated) | validationStatus error·success·warning + `error` | label, description |
| Input | outline·soft | — | sm·md·lg | fullWidth, monospace, loading | native | icon (@deprecated), leadingIcon, trailingIcon, prefix, suffix, trailingAction |
| NumberField | outline·soft | — | sm·md·lg | fullWidth | onValueChange / onValueCommit (number \| null) | scrubLabel |
| InputGroup | outline·soft | — | sm·md·lg | fullWidth | — | InputGroupText `visual` |
| Select | outline·soft | — | sm·md·lg | fullWidth | native; validationStatus / invalid | — |
| Textarea | outline·soft | — | sm·md·lg | resize, fullWidth | native | — |
| Combobox | — | — | (none) | fullWidth | onValueChange, onInputChange, onCreate | toggleLabel |
| Checkbox | card | neutral·accent | md·lg | layout row·tile | **native onChange only** | leadingVisual, caption |
| CheckboxGroup | — | — | — | orientation | validationStatus success·warning | — |
| Radio / RadioGroup | card | neutral·accent | md·lg | layout; orientation | onValueChange(v, e) | leadingVisual, caption |
| Switch | — | neutral·accent·custom | sm·md·lg | labelPosition end·start, track short·long, fullWidth | checked/default/**onCheckedChange** | label, description |
| Slider | — | neutral·accent | sm·md·lg | labelPosition inline·top, orientation, stepMarks | onValueChange(number) | label |
| Chip | kind assist·filter·input·suggestion | neutral·accent | sm·md·lg | pill, swatchOnly, link, linkIcon | selected/default/**onSelectedChange** | **onRemove**/removeLabel; icon, swatch, avatar, image; ChipLink `treatment` |
| Badge | soft·solid·outline·color·modern | 8 + **inverted** | sm·md·lg | pill, dot, dotOnly, iconOnly, truncate | — | **onDismiss**/dismissLabel; icon, trailingIcon, avatar, flag |
| BadgeGroup | — | — | — | overflow inline·overlay | — | overflowLabel |
| Count | plain·soft | neutral·accent | sm·md | showZero, max | — | label |
| Indicator | kind count·dot | 6 (**default danger**) | via Presence | processing, withBorder (manifest state `border`), status, outOfOffice | — | — |
| IndicatorAnchor | — | — | — | placement, overlap (manifest `overlap-*`), compact, invisible | — | indicator |
| Presence | — | — | **xs**·sm·md·lg | status × 8, outOfOffice | — | — |
| Avatar | — | neutral·accent·**inverse** | sm·md·lg | shape circle·square, active | — | icon, fallback |
| Separator | — | — | — | orientation, spacing, inset | — | — |
| Skeleton | shape block·text·circle | — | — | static, wrap (manifest) · animated, lines, loading (React) | — | — |
| Spinner / Progress | — | neutral·accent | sm·md·lg | indeterminate | value/max | label |
| Panel | — | — | sm·md | flush, bareBar, actionColumn, resizable start·end | width/defaultWidth/onWidthChange; PanelSection open/defaultOpen/onOpenChange | title, action, footer |
| PropertyList | — | — | — | — | onReorder | label |
| BoxField | — | — | sm·md·lg | kind sides·corners (**React only**) | onValueChange, onIndependentChange | label |
| CommandPalette | — | — | — | inline | open/defaultOpen/onOpenChange, onQueryChange | items[].onSelect |
| ContextMenu | — | — | — | — | **onOpenChange only** | menu, label |
| HoverCard | — | — | — | side | **onOpenChange only**; openDelay, closeDelay | trigger |
| PromptSuggestions | — | — | — | layout list·chips | onSelect, **onDismiss**(suggestion) | — |
| Message | — | — | — | author user·assistant, streaming | — | actions |
| ModelPicker | — | — | size (**React only**) | — | onValueChange | label default "Model" |
| Composer | — | — | — | layout inline·stacked | value/default/onValueChange, onSubmit | submitLabel |
| Card | — | — | sm·md·lg | layout vertical·horizontal·**compact**·immersive | — | CardMedia well·bleed; CardOverlay placement·reveal |
| Alert | — | 6 (no caution or discovery) | — | layout single-line·multiline·banner, flush | — | **onDismiss**; icon, title, action, link |
| Toast | — | 5 (**no accent**) | — | — | — | **onDismiss**; icon, title, action |
| Dialog | — | — | — | showCloseButton | trigger + onOpenChange (**no open**); **onClose** | title, description, footer; "Close dialog" hard-coded |
| Popover / Tooltip / Menu | — | MenuItem tone danger | — | side, arrow | trigger/open/defaultOpen/onOpenChange | MenuItem shortcut, checked, indicator, description |
| Tabs | — | — | sm·md·lg (**no default**) | orientation vertical (only), track | tabs[] value/default/onValueChange | — |
| Table | — | — | sm·md·lg (**no default**) | interactive, striped, columnDividers | — | — |
| Segmented | — | — | sm·md·lg | fullWidth, iconOnly | options[] value/default/**onSelect(v)** | label (accessible name) |
| Nav | — | accent (manifest) / neutral·accent (React) | — | orientation horizontal (manifest) / + vertical (React), selection marker | NavItem current | icon, trailing, actions; NavSeparator (no props) |
| TreeView | — | — | — | selectionMode navigation·checkbox | expandedIds/default/onExpandedChange; onSelectedChange; onActivate | — |
| Code / Token | ground on-color·subtle (manifest) → `onColor`, `subtle` booleans (React) | — | — | swatch | — | — |
| CodeBlock | — | — | — | flush, wrap, unnumbered | language/onLanguageChange | copyLabel; "Language" hard-coded |
| Kbd | **appearance** default·quiet·on-color·on-emphasis (+ quiet @deprecated) | — | **small·normal** | — | — | keys |
| Breadcrumb | — | — | — | — | — | separator, ellipsis parts |

Inconsistencies flagged in the matrix: H-11 (dismiss), H-12 (callbacks and open), H-13 (axis vocabulary, React-only axes, defaults), H-14 (slots and collections), H-27 (hard-coded names).

---
Verification notes: every CSS and TS citation above was read at the cited line in this worktree. Unverified (code reading only; no browser run per the brief): the rendering under Pill and Sharp (H-1, H-2), Surface presets (H-3), compact (H-4, H-7), dark (H-5), forced colours (H-16), touch (H-17), RTL (H-19), and whether Tree view actions are tabbable. The dead-demo list (H-24) and the unused-token list (H-9) come from text search and may miss names built dynamically. The scratchpad `audit/` folder holds the raw outputs: `decls.json`, `theming.txt`, `cat_*.txt`, `manifest.txt`, `props.txt`, `unused-tokens.txt` and the check logs.
