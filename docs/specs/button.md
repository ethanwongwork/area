# Button spec

**Status:** in review · 2026-09-26 (cohesion audit; second pass the same day)
**Captures:** `docs/research/captures/button/` (Area tiles, `notion--*` 7, `figma--*` 5), `docs/research/captures/baseline/chatgpt--*`
**Peers:** Button group and Toolbar (host Buttons), Segmented, Chip, Menu / Nav / Tree view rows (hover plate), Kbd (shortcut inside), Alert and Dialog dismiss

## Owner decisions

- 2026-09-26: **Neutral by default, accent by override** (DESIGN_SYSTEM.md, Color and focus).
  Button already followed it: the base tone is `neutral` (`button.css:37-45`) and `accent` is
  opt-in (`button.css:204-214`).
- 2026-09-26: audit every family accepted under the earlier process against the evidence
  process (cohesion audit). Button was reopened for its neutral ghost hover.
- 2026-09-26 (second pass): decide every open item with the most calculated option
  consistent with the system. For Button: height, radius and weight stay (audit decision 18,
  Primary button row); a nested Kbd is concentric with the button's corner.

No Button section existed in [prior decisions](PRIOR_DECISIONS.md).

## Job and boundaries

Button triggers an action, or with `selected` shows a toggle that is on. It does not pick a
value from a set (Segmented, Chip), navigate (Nav, Link) or host keyboard focus management
for a row of commands (Toolbar).

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| variant | solid (default), soft, outline, ghost | Emphasis ladder; ghost is the transparent icon/text button every product uses | ChatGPT header icon buttons (ghost); Notion 28px icon and text buttons (ghost), 32px primary (solid) and outline; Figma 24px icon buttons (ghost), 32px primary (solid), 24px secondary (outline); Untitled secondary (bordered) |
| tone | neutral (default), accent, info, success, warning, caution, danger, discovery | Meaning, independent of emphasis | OpenAI tone vocabulary (`button.css:155-160`) |
| size | sm 28, md 32 (default), lg 40 | Control tiers | Untitled sm–lg; Notion 28 / 32, Figma 24 / 32, ChatGPT 36 |
| shape | `pill` | Opt-in full round | ChatGPT model picker (`chatgpt--model-picker--rest`), Figma product button (`figma--product-button--rest`), both radius 9999px |
| layout | `iconOnly`, `fullWidth`, `align` start/end | Square icon button; stretched; label aligned to text above | ChatGPT 36×36 icon button |
| state | selected (`aria-pressed`), loading, disabled | Toggle, pending, unavailable | Untitled loading and disabled |
| composition | leading/trailing icon, trailing Kbd | Command with glyph or shortcut | Gallery `with-icon`, `with-shortcut` |

Excluded: Untitled's xs (32) and xl (48) tiers; DESIGN_SYSTEM.md (Size and shape) exposes only sm/md/lg.

## Sources

| Id | Type | What | Link / commit / path | License | Captures |
|---|---|---|---|---|---|
| chatgpt | target product | Header ghost icon button; model picker (transparent pill) at rest and hover | chatgpt.com, owner's session, 2026-09-26 | evidence only | `baseline/chatgpt--icon-button-ghost--{rest,hover}--light`, `baseline/chatgpt--model-picker--{rest,hover}--light` |
| notion | target product | Share popover primary and outline buttons; page icon and text buttons at rest and hovered; a view-toolbar icon button; Calendar month nav (earlier pass) | app.notion.com, owner's workspace (page menu, Share popover, tasks board), light, read-only, 2026-09-26 | evidence only | `notion--{primary-button,outline-button,toolbar-icon}--rest`, `notion--{icon-button,text-button}--{rest,hover}`, `calendar/notion--nav-button--hover` |
| figma | target product | Editor primary (Share) and full-width secondary buttons, inspector icon button at rest and hovered; file-browser product pill; colour picker eyedropper (earlier pass) | figma.com file browser and editor, light, read-only, 2026-09-26 | evidence only | `figma--{primary-button,secondary-button,product-button}--rest`, `figma--icon-button--{rest,hover}`, `color-picker/figma--eyedropper--hover` |
| uui | design system (source) | Button | `untitleduico/react@4702dc0`, `components/base/buttons/button.tsx:13-127, 176-248` ([reference](../research/untitled-ui-reference.md)) | MIT | none (source reading) |
| area | this system | Every gallery tile, re-taken after the second pass | localhost gallery | — | `button/area--*` |

The ChatGPT icon-button "hover" file records its 5% black `::before` plate at `opacity: 0`, the
same as rest, so the visible hover was not caught; the model-picker hover (`background
rgba(0, 0, 0, 0.05)`) is the measured ChatGPT hover. Product labels are redacted, so text
widths are not comparable; heights, insets, radii and paint are.

## Anatomy

```
chatgpt  button 36×36, radius 8, ink rgb(93); ::before 5% black plate (hover)
  icon   svg 20×20 at 8px inset
notion   div 28 (ghost) / 32 (primary, outline), radius 6, padding 0 8 (text) / 0 12 (primary)
  icon   svg 20×20 at 4px (icon button) or 16×16 at 6px (toolbar icon), rgb(142,139,134)
figma    button 24 (icon, secondary) / 32 (primary), radius 5, outline 1px at −1px offset
  icon   svg 24×24 filling the button, glyph about 10px
area     button.area-button  owns: height, gutter, 1px border, radius, fill, shadow, focus ring
  icon   span.area-button__icon  square 16px viewport (all tiers)
  label  span.area-button__label  truncation; becomes inline-flex with a 4px gap around a Kbd (`kbd.css:136-140`)
```

Inset equation (`inset.css:7-19`, border counted once at `inset.css:41`): outer inset =
(height − edge item) / 2, padding = that − 1px border. Text edge item is 1cap (Geist 14px cap
9.94, `kbd/area--on-emphasis` capture): md (32 − 9.94) / 2 − 1 = 10.03; sm (28 − 8.52) / 2 − 1
= 8.74; lg (40 − 9.94) / 2 − 1 = 14.03. Icon end: (32 − 16) / 2 − 1 = 7. Kbd end: (32 − 20) /
2 − 1 = 5 (`inset.css:109-111`).

## Measurements

`node scripts/capture-compare.mjs` (Area, rest, re-taken after the second pass):

| slot · property | area · default | area · size-small | area · size-large | area · neutral ghost | area · selected | area · with-icon | area · with-shortcut |
|---|---|---|---|---|---|---|---|
| **shell** size | 65.76 × 32 | 56.94 × 28 | 73.76 × 40 | 65.76 × 32 | 80.56 × 32 | 86.73 × 32 | 100.15 × 32 |
| **shell** padding | 0 10.03 0 10.03 | 0 8.74 0 8.74 | 0 14.03 0 14.03 | 0 10.03 0 10.03 | 0 10.03 0 10.03 | 0 10.03 0 7 | 0 5 0 10.03 |
| **shell** radius | 8px | 6px | 10px | 8px | 8px | 8px | 8px |
| **shell** gap | 8px | 4px | 8px | 8px | 8px | 8px | 8px |
| **shell** font | 14px/20px 500 Geist | 12px/16px 500 Geist | 14px/20px 500 Geist | 14px/20px 500 Geist | 14px/20px 500 Geist | 14px/20px 500 Geist | 14px/20px 500 Geist |
| **shell** color | rgb(250, 250, 250) | rgb(250, 250, 250) | rgb(250, 250, 250) | rgb(40, 40, 40) | rgb(250, 250, 250) | rgb(250, 250, 250) | rgb(250, 250, 250) |
| **shell** background | rgb(40, 40, 40) | rgb(40, 40, 40) | rgb(40, 40, 40) |  | rgb(29, 29, 29) | rgb(40, 40, 40) | rgb(40, 40, 40) |

Products (shell, `node scripts/capture-compare.mjs --slots shell`, trimmed):

| slot · property | chatgpt · model-picker · hover | notion · primary-button | notion · outline-button | notion · text-button · hover | notion · icon-button · hover | figma · primary-button | figma · secondary-button | figma · icon-button · hover |
|---|---|---|---|---|---|---|---|---|
| **shell** size | 97.52 × 36 | 59.99 × 32 | 108.96 × 32 | 71.3 × 27.99 | 27.99 × 27.99 | 54.52 × 32 | 212 × 24 (fills its row) | 24 × 24 |
| **shell** padding | 0 14 0 12 | 0 12 | 0 12 | 0 8 | 0 | 0 12 | 0 (inner 0 8) | 0 |
| **shell** edge | — | 0 | 0.56 solid rgba(28, 19, 1, 0.11) | 0 | 0 | 0 | outline 1px rgba(0, 0, 0, 0.1) | 0 |
| **shell** radius | 9999px | 6px | 6px | 6px | 6px | 5px | 5px | 5px |
| **shell** gap | 6px | — | 8px | 6px | 0 | — | — | — |
| **shell** font | 14/20 | 14px/16.8px 500 | 14px/16.8px 500 | 14px/16.8px 400 | — | 11px/16px 450 Inter | 11px/16px 450 | — |
| **shell** color | — | rgb(243, 249, 253) | rgb(44, 44, 43) | rgb(44, 44, 43) | glyph rgb(142, 139, 134) | rgb(255, 255, 255) | rgba(0, 0, 0, 0.898) | rgb(0, 0, 0) |
| **shell** background | rgba(0, 0, 0, 0.05) | rgb(39, 131, 222) | — | rgba(33, 27, 23, 0.05) | rgba(33, 27, 23, 0.05) | rgb(13, 153, 255) | — | rgba(0, 0, 0, 0.05) |

On white: 5% black ≈ rgb(242); Notion's 5% warm hover ≈ rgb(244, 243, 243), its 11% hairline
≈ rgb(230, 229, 227); Figma's 10% outline ≈ rgb(230). `notion--toolbar-icon`: 28 × 28, 16px glyph
at 6px, ink rgb(125, 122, 117). `figma--product-button`: 32px pill, rgb(245) + inset rgb(230) ring.

## Decisions

| Slot · property | Area value | Basis | Reason when it differs from the basis |
|---|---|---|---|
| shell · height | 28 / **32** / 40 (`--area-control-sm/md/lg`, tokens.css:968-980) | Peer/baseline: control tier (DESIGN_SYSTEM.md); second pass, decision 18: unchanged | ChatGPT 36; Notion 28 ghost / 32 primary; Figma 24 icon / 32 primary. 32 sits inside that range; density belongs to the UI-scale axis |
| shell · radius | 6 / 8 / 10 (`--area-radius-control-sm/md/lg`, tokens.css:996-998), capped at 0.4 × height (`button.css:70-71`) | ChatGPT 8 and Untitled 8 at md; second pass (Primary button row): unchanged | Notion 6 and Figma 5 at 32px; Area's radius comes from the radius axis |
| label · type | 14/20 500 (sm 12/16) | Target-product agreement on filled buttons: ChatGPT 500, Notion 500 (primary, outline); weight policy | Figma 450 at 11px; Untitled 600. Notion's ghost text button is 400; kept at 500, one label weight (third pass) |
| icon | 16px square at every tier (`--area-icon-*`, tokens.css:970-982) | Fluent 16 cut, inset contract | ChatGPT 20px in a 36px button |
| gap | 4 (sm) / 8 (md, lg) | Area gap tier | ChatGPT 6, Untitled 4 (6 at lg) |
| padding | inset equation above | `inset.css:7-19, 80-109` | — |
| neutral ghost · hover fill | **`bg-component-hover`** light-dark(#f3f3f3, #333333) (`button.css:363-366`) | Target-product agreement: ChatGPT 5% black (`chatgpt--model-picker--hover`), Figma 5% black (`figma--icon-button--hover`), Notion 5% warm (`notion--{icon,text}-button--hover`), all about rgb(242–244) | Was `bg-component` #f7, lighter than the products and than row hover |
| neutral ghost · pressed fill | **`bg-component-active`** light-dark(#eeeeee, #3f3f3f) | Peer rows: pressed/selected = `-active` (audit rule) | Was `bg-component-hover` |
| neutral ghost / outline · ink | `fg-default` rgb(40) (`button.css:351-354`) | Area two-ink rule | ChatGPT icon buttons rgb(93) and Notion icon glyphs rgb(142, 139, 134) are secondary; Figma's are 90% black. Kept (third pass): Figma, the inspector reference, uses 90% ink |
| solid neutral | `neutral-solid` #282828 / `fg-on-neutral` #fafafa | Owner: neutral default | — |
| shadow (solid, soft, outline) | `shadow-1` 0 0.5px 1px −0.5px `shadow-color` | Untitled `shadow-xs` on secondary | Softer than Untitled's 0 1px 2px 5% |
| outline edge | `edge-control` (#e2e2e2), hover `edge-control-hover` (#d4d4d4) (`button.css:42-43, 201-202`) | Notion outline 11% warm (about rgb 230) and Figma secondary 10% black (about rgb 230) | Area is one step lighter than both; within the divider band of the second pass |
| nested Kbd radius | button shape − (height − keycap) / 2: 2px in a 32px button (`button.css:70-74`, `kbd.css:132-134`) | Second pass: keycaps concentric inside Buttons (DESIGN_SYSTEM.md, Keycaps) | Was the keycap's own 6px |

## States

| State | Slot · property changes | Evidence |
|---|---|---|
| hover | fill → variant's `--_bg-hover`; border → `--_border-hover`; ink fixed (`button.css:128-131`) | Area hover not captured; product hovers change the plate only (`notion--text-button--hover`, `notion--icon-button--hover`, `figma--icon-button--hover`) |
| pressed (`:active`) | fill → `--_bg-active` (`button.css:133-135`) | not captured |
| focus-visible | 2px `focus-color` (#412dd0) outline, 2px offset (`button.css:137-141`) | not captured |
| selected | fill `--_surface-active`; solid uses `--_solid-hover` rgb(29) (`button.css:384-392`); `aria-pressed` | `area--selected` |
| loading | spinner replaces the leading icon; native `disabled` + `aria-busy`; hover suppressed (`Button.tsx:69-84`) | `area--loading` (opacity 0.5, as disabled) |
| disabled | whole button 50% (`button.css:143-147`) | `area--disabled` opacity 0.5; Untitled 50% |

## Behavior and accessibility

Native `<button>`, `type="button"` by default (`Button.tsx:64`); ref and native props
forwarded. `selected` sets `aria-pressed`; `loading` sets `aria-busy` and disables. Icon-only
requires `aria-label`; icons are `aria-hidden`. Forced colours: focus and a selected Button
paint Highlight (`forced-colors.css:14-26`; not inspected in forced colours).

## Peers and consistency

| Peer | Shared role | Area value in peer | Button | Match / reason |
|---|---|---|---|---|
| Menu, Nav, Tree view, Table rows | hover plate / pressed-selected plate | `bg-component-hover` / `-active` | neutral ghost same pair | match (audit row rule) |
| Toolbar overflow trigger | transparent command hover | `bg-component-hover` (`toolbar.css:46`) | same | match |
| Segmented item | label on a fill | 14/20 500 | 14/20 500 | match |
| Kbd | nested keycap | concentric radius, filled, muted 500 | publishes `--_button-shape` / `--_button-height` | match (second pass) |
| Chip | control height and inset | 32px, 10.03 text inset | 32px, 10.03 | match; Chip label 400 (a choice, not a label on a fill) |
| Alert / Dialog dismiss | small dismiss radius | 28px Button's 6px | sm radius 6 | match |
| All controls | disabled | 50% | 50% | match (audit rule) |

## Visual pass

The gallery shows the tiles in named groups (Default, Variants, Sizes, Layout, Content,
States, Variant × tone); the pill shape moved from Layout to Variants in the third pass. From
the captures: Area's ghost hover (#f3) sits between Figma's and Notion's; the md button is as
tall as both products' primary and rounder (8 against 6 and 5). Not inspected by this spec's
author: real pointer hover, pressed, dark theme, the other tones' ghost hovers.

## Settled questions

Both kept in the third pass ([cohesion audit](../research/cohesion-audit.md#third-pass-the-questions-the-evidence-left-open)):

1. **Ghost text-button weight: 500.** Notion's transparent text button is 400
   (`notion--text-button--rest`), its filled and outline buttons 500. Area keeps one label
   weight for every variant.
2. **Ghost icon ink: `fg-default`.** ChatGPT (rgb 93) and Notion (glyph rgb 142, 139, 134;
   `notion--icon-button--rest`, `notion--toolbar-icon--rest`) paint transparent icon
   buttons in secondary ink; Figma, the inspector reference, uses 90% black
   (`figma--icon-button--rest`).

## Verification

Compared `button/area--{default,size-small,size-large,tone-neutral-variant-ghost,selected,with-icon,with-shortcut}`
with `baseline/chatgpt--icon-button-ghost--rest`, `chatgpt--model-picker--hover`, the seven
`button/notion--*` and five `button/figma--*` captures, `calendar/notion--nav-button--hover`
and `color-picker/figma--eyedropper--hover`. Build and test results are in
[the audit](../research/cohesion-audit.md#verification). Unverified: Area hover and pressed
captures, dark theme (Area and products), forced colours for a selected Button.

## Feedback log

- 2026-09-26 · cohesion audit → neutral ghost hover `bg-component` → `bg-component-hover`,
  pressed `bg-component-hover` → `bg-component-active` → ChatGPT, Notion, Figma hover
  captures above; 43 Area captures.
- 2026-09-26 · second pass (Notion, Figma; owner: decide all open items) → nested Kbd
  concentric with the button (`--_button-shape`); height, radius and weight unchanged; ghost
  text weight and ghost icon ink recorded as open → `button/notion--*` (7),
  `button/figma--*` (5), `button/area--with-shortcut`.
- 2026-09-27 · third pass → open questions settled, values kept (ghost label 500, ghost
  icon ink `fg-default`); pill tile moved to Variants → [cohesion audit](../research/cohesion-audit.md#third-pass-the-questions-the-evidence-left-open).
