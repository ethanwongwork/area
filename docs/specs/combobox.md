# Combobox spec

**Status:** accepted · 2026-09-28 (batch 13; was: in review · 2026-09-26)
**Captures:** `docs/research/captures/combobox/`
**Peers:** Input (the field), Menu (the list's surface and rows), Select (no typing),
Popover (anchoring)

## Owner decisions

- 2026-09-26: "do each of them subsequently" — the product-specific inventory in
  COMPONENTS.md, starting with the recommended foundation, Combobox.

## Job and boundaries

An editable field with a list of suggestions that filters as you type: pick one, or (where
allowed) keep your own text, or create a new option. Not Select (no typing, native list),
not CommandPalette (a search surface for actions, built on this next), not Menu (actions,
no field). Font picker, tag picker and people picker are recipes on Combobox.

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| size | sm, md, lg | Input's sizes | Figma 24 (compact), ChatGPT/Notion 32 |
| variant | outline, soft | Input's variants | Figma's fields are soft |
| mode | pick (reverts unmatched text), custom value, create | Figma font size keeps any number; Notion select creates | Figma, Notion |
| composition | icon, description, groups, disabled option | Figma font picker groups; Notion person rows | Figma, Notion |
| state | open, highlighted, selected, empty, disabled, invalid | WAI | — |

## Sources

| Id | Type | What | Link | Captures |
|---|---|---|---|---|
| figma | target product | Typography font size: `input role=combobox aria-haspopup=listbox` 88 × 24 soft #F5F5F5 r5, icon square 24; preset options 24 tall, check column 26 | figma.com, community-file copy, text layer selected, 2026-09-26; nothing changed | `figma--font-size-combobox--rest--light` |
| figma | target product | Font family: `button role=combobox aria-haspopup=dialog` 184 × 32 opening the font picker (240 wide, radius 13, 40 header, search row 33 with a 224 × 24 soft field, `role=listbox` of 28-tall `role=option` rows, padding 12 / 18, check column 26) | same | `figma--font-family-trigger--rest--light`, `figma--font-picker--open--light` |
| wai | pattern | Combobox with listbox popup, list autocomplete: `aria-expanded`, `aria-controls`, `aria-activedescendant`, ↓/↑, Alt+↓, Enter, Escape | w3.org/WAI/ARIA/apg/patterns/combobox/ | — |
| area | peers | Input (menu.md, field specs), Menu surface and rows (menu.md) | — | — |

Opening Figma's font-size list needs the arrow keys, which change the value, so the preset
list itself was measured only from its offscreen measurement nodes (24 rows, 26 check column).

## Decisions

| Slot · property | Area value | Basis | Reason when it differs |
|---|---|---|---|
| field | Input (outline default, sizes 28/32/40), `role="combobox"`, `aria-autocomplete="list"` | Figma input combobox; WAI | Area's field |
| toggle | InputAction chevron at the end, `tabindex=-1`, "Show suggestions"; shows every option | WAI (the button is not a tab stop) | — |
| list surface | Menu: 12 radius, 4 inset, border, floating lift (`--area-shadow-float`) | menu.md | Figma's lists are dark; Area's menus are light (ChatGPT, Notion) |
| rows | Menu rows (32, radius 8, 5% wash on hover and highlight); an icon takes Menu's `--area-gap-row` gap (12), so labels sit at 36 | menu.md | Figma 24/28 rows belong to compact density |
| selected | active plate (`bg-component-active`, via `data-selected` on the chosen option; Combobox.tsx:216, surface.css:1055) plus the trailing check in a reserved column | Select's value rows; Figma's check column | A value picker, so it shows its value as Select does (audit S13 C, family call B-6 settled). Was the check alone. Area puts the check at the end (ChatGPT's model picker) |
| position | top layer (native popover), placed by the shared JS engine (`useAnchoredPosition`: side bottom, align start, offset 4 = `MENU_OFFSET`, viewport padding 8), so it works without CSS anchor positioning; flips and shifts; min width max(field width, 224) | overlay.md (menu gap 4, audit S16 owner 2026-09-30); Figma list ≥ field | Was CSS anchor positioning |
| height | min(324, the room beside the field), then scrolls; 50vh only before the engine reports the room | Figma (324, its font list viewport) | Was min(324, 50vh) |
| empty | "No results", muted, a row tall, not an option | — | — |
| create | "Create “text”" row with the add glyph when nothing matches exactly | Notion select | — |
| groups | Menu labels (muted, row tall) over `role=group` | Figma font picker sections | — |

## Behavior and accessibility

Typing opens and filters (case-insensitive contains; `filter` replaces it) and highlights
the first match; ↓/↑ move the highlight (skipping disabled options, wrapping), Alt+↓ opens
without highlighting, Enter picks, Tab picks the highlighted option and moves on, Escape
closes, and Escape on a closed field clears it. Focus stays in the field
(`aria-activedescendant`). Leaving the field: an exact label match is picked; otherwise the
text reverts to the selection (or is kept with `allowsCustomValue`). A created option is
selected once the host adds it. The toggle's tooltip hides while the list is open. Ref and
native props go to the input; `className` and `style` to the root (`Combobox.tsx:235`).

## Visual pass

2026-09-28 (batch 13): gallery tiles (default, soft, sm, lg, custom value, groups, create, icons
and descriptions, disabled option, disabled, invalid) beside Figma's font-family trigger and
font-size combobox (`figma--font-*`: 32 rows, 11/16 Inter, no edge; the open picker a
floating list). Area's field is Input's (32, corner 8, `input-edge`, 11 text inset) with the
chevron as a 24px action whose 16 glyph lands 6 / 8 / 12 from the end at sm / md / lg, the
same place as Select's chevron and Input's trailing icons, centred vertically. Figma's 11px
text is compact density. Open list: ChatGPT's settings dropdown menu (`chatgpt--settings-select-menu--open`)
is 172 wide, 10 padding, corner 16, 90% white, 2 below its trigger, two-line rows 50 tall with a
12 corner; Area's listbox is Menu's (4 padding, corner 12, 32 rows with an 8 corner, 4 below the
field), matched to Notion's menu when Menu was approved. No change. Unverified: dark theme.

## Verification

- Headless Edge, real keys and pointer (`scratchpad/combo.mjs`): "sa" filters to four
  fonts with the first highlighted; ↓ + Enter picks Source Sans 3; Escape twice clears; the
  toggle shows all with groups; "Brand" offers Create and Enter creates it; "zzz" shows
  No results; blur reverts; the custom field keeps 17; ↑ skips the disabled Guest; the list
  is 4 below the field and as wide as it.
- React test: roles, attributes, listbox, groups, selected option.
- Unverified: dark theme, screen reader announcements, IME composition, RTL.

## Open questions

- Match highlighting (bold the typed part) was left out; none of the products measured
  showed it in these lists.

## Feedback log

- 2026-09-30 · audit S11a (owner) → no Combobox change; options use Menu's rows, so an icon's label sits on the shared 36 column (`--area-gap-row`, surface.css:984).
- 2026-09-30 · audit S13 (owner) → the chosen option shows the active plate plus the check, as Select does; Combobox sets `data-selected` on it (Combobox.tsx:216; combobox.css:35-37). Settles family call B-6. Was the check alone.
- 2026-09-30 · audit S17 (API vocabulary, slice 3/4) → `style` lands on the root with `className` (Combobox.tsx:235; was forwarded through Input to the inner input).
- 2026-10-02 · compact evidence audit → groups stack flush at compact (`ui-row-gap` 2 / 0; R7) docs/research/compact-evidence-2026-10-02/README.md.
- 2026-10-03 · radius audit D1 (owner) → the container role is 12 at compact too (was 8; Figma 13, Cursor 12-14), so this family's surface is 12 at both densities; rows concentric with a floating surface follow (compact 24 rows r8). `docs/research/radius-audit-2026-10-03.md`.
- 2026-10-03 · roundness work → list rows are Menu's rows: border counted, 12 → 7 (was 8). `docs/research/radius-audit-2026-10-03.md`, "Roundness".
- 2026-10-03 · all even (owner) → list rows back to 8 (border left out).
- 2026-10-04 · pill shapes and list rows (owner) → list rows follow Menu's `radius-list-row`; the field takes `--area-pill-field`. `docs/research/radius-audit-2026-10-03.md`, "Pill shapes and list rows".
