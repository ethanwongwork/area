# Combobox spec

**Captures:** `docs/research/captures/combobox/`
**Peers:** Input (the field), Menu (the list's surface and rows), Select (no typing),
Popover (anchoring)

## Owner decisions

- 2026-09-26: "do each of them subsequently" — the product-specific inventory in
  COMPONENTS.md, starting with the recommended foundation, Combobox.
- owner 2026-10-08: approved, recommendations accepted (custom-select.md open questions 3–7,
  shared by this family): the chosen option shows the check alone; the toggle's glyph ends at
  the field chevron inset in `input-chevron` ink; the chevron stays still. Supersedes audit S13
  C's plate here.

## Job and boundaries

An editable field with a list of suggestions that filters as you type: pick one, or (where
allowed) keep your own text, or create a new option. Not Select (no typing, native list),
not CommandPalette (a search surface for actions, built on this next), not Menu (actions,
no field). Font picker, tag picker and people picker are recipes on Combobox.

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| size | sm, md (default), lg: Input's axis, a typed `size` prop handed to the Input | Input's sizes | Figma 24 (compact), ChatGPT/Notion 32 |
| variant | outline (default), soft: a typed Combobox prop passed to its Input, which draws the modifier; the Combobox block has none (written exception, DESIGN_SYSTEM; owner, 2026-10-19) | Input's variants | Figma's fields are soft |
| layout | `fullWidth` (the manifest's one boolean; root and Input) | Layout | — |
| mode | pick (reverts unmatched text), custom value (`allowsCustomValue`), create (`onCreate`) | Figma font size keeps any number; Notion select creates | Figma, Notion |
| composition | option icon, description (muted, at the row's end), groups, disabled option | Figma font picker groups; Notion person rows | Figma, Notion |
| state | open (the manifest's one state, `data-open` on the root), highlighted, selected, empty; disabled, read-only and invalid are Input's | WAI | — |

The `combobox` manifest declares no variant axes (`manifest.ts:730-738`): the field's size and
variant classes are Input's (`area-input--*`), set by the Input that Combobox renders
(`Combobox.tsx:24, 250-253`).

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
| field | Input (outline default, sizes 28/32/40; Input's chrome, states and props), `role="combobox"`, `aria-autocomplete="list"`, `autocomplete="off"` | Figma input combobox; WAI | Area's field |
| toggle | InputAction chevron at the end, `tabindex=-1`, "Show suggestions"; shows every option. The field's end padding moves the action in so its glyph ends at the field chevron inset (8 from the edge at sm/md, 12 at lg; compact 8), as Select's; glyph in `input-chevron` ink (`stroke-control`) | WAI (the button is not a tab stop); owner 2026-10-08 (custom-select.md Q4–Q5) | Was 6 / 8 / 12 from the end in `input-icon` ink |
| list surface | Menu: 12 radius, 4 inset, border, floating lift (`--area-shadow-float`) | menu.md | Figma's lists are dark; Area's menus are light (ChatGPT, Notion) |
| rows | Menu rows (32, radius 8, 5% wash on hover and highlight); an icon takes Menu's `--area-gap-row` gap (12), so labels sit at 36 | menu.md | Figma 24/28 rows belong to compact density |
| selected | the trailing check in a reserved column (`aria-selected`), no plate; the hover plate when highlighted | Notion and ChatGPT value lists (custom-select.md, 2026-10-07 audit); owner 2026-10-08 | Was the active plate plus check (audit S13 C, `data-selected`), 2026-09-30 to 2026-10-08. Area puts the check at the end (ChatGPT's model picker) |
| position | top layer (native popover), placed by the shared JS engine (`useAnchoredPosition`: side bottom, align start, offset 4 = `MENU_OFFSET`, viewport padding 8), so it works without CSS anchor positioning; flips and shifts; min width max(field width, 224) | overlay.md (menu gap 4, audit S16 owner 2026-09-30); Figma list ≥ field | Was CSS anchor positioning |
| height | min(324, the room beside the field), then scrolls; 50vh only before the engine reports the room | Figma (324, its font list viewport) | Was min(324, 50vh) |
| empty | "No results" (`emptyText`), muted, a row tall, not an option; announced through a status region outside the listbox | — | — |
| create | "Create “text”" row with the add glyph when typed text matches no label exactly (not while the toggle shows every option) | Notion select | — |
| list scroll | a Scroll area (owner 2026-10-09) | scroll-area.md, "Adoption" | Was the platform's scrollbar |
| groups | Menu labels (muted, row tall) over `role=group` | Figma font picker sections | — |

## Behavior and accessibility

Typing opens and filters (case-insensitive contains; `filter` replaces it) and highlights
the first match; the toggle opens on every option. Closed, ↓ opens on the selected option (Alt+↓
without highlighting) and ↑ on the last. Open, ↓/↑ move the highlight (skipping disabled options,
wrapping), Enter picks (with nothing highlighted it settles the text as on blur), Alt+↑ picks the
highlighted option and closes, Tab picks the highlighted option and moves on, Escape closes, and
Escape on a closed field clears the text and the selection. Enter during IME composition is left
to the composition. Focus stays in the field (`aria-activedescendant`). Leaving the field: an exact
label match is picked; empty text clears the selection; otherwise the text reverts to the
selection (or is kept with `allowsCustomValue`, which clears the selection). A created option is
selected once the host adds it. `name` submits the option's value through a hidden input (the typed
text only with `allowsCustomValue`). The toggle is an InputAction (`tabindex=-1`, named by
`toggleLabel`, "Show suggestions"); its tooltip hides while the list is open (`combobox.css:49`). Ref and Input props
(including `variant`) go to the Input; `className` and `style` to the root (`Combobox.tsx:250-253`).

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

## Motion and interaction, 2026-10-07

Contract: `docs/MOTION.md`. Combobox draws no motion of its own; it is Input (field) plus Menu
(list), so its hover, focus and list motion are theirs.

| Interaction | Before | After |
|---|---|---|
| Field hover, focus | Input's (`--area-transition`, fast, ease-out) | unchanged here; Input's pass owns it |
| List enter | Menu: `opacity` + `scale` 0.97, base, ease-out, `@starting-style` | unchanged (surface.css) |
| List exit | Menu: same as enter | unchanged here (surface.css takes exits to fast) |
| List content during the exit | committing set the text to the option's label, which re-listed every option while the list faded | the list keeps the rows it last showed until it is hidden (`Combobox.tsx`, `shownRows`) |
| Toggle chevron | static | static (open question) |

Crispness: nothing resting is transformed; the list ends at `scale: 1` and its origin and
position are rounded by `overlay.ts`. Verified in the browser: computed transitions and a
commit with a filtered list (rows held while closing).

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
- *Settled 2026-10-08 (owner, recommendation accepted): the chevron stays still.* Motion, 2026-10-07: rotate the toggle's chevron while the list is open? MOTION.md lists selects
  among the chevrons that rotate, but native Select, ChatGPT's and Notion's select chevrons (as
  captured) stay still. Recommendation: keep it still for Select, Combobox, Custom select and
  Date picker alike; if the owner wants a flip, `rotate: 180deg` on fast ease-out, one rule.

## Feedback log

- 2026-09-30 · audit S11a (owner) → no Combobox change; options use Menu's rows, so an icon's label sits on the shared 36 column (`--area-gap-row`, surface.css:984).
- 2026-09-30 · audit S13 (owner) → the chosen option shows the active plate plus the check, as Select does; Combobox sets `data-selected` on it (Combobox.tsx:216; combobox.css:35-37). Settles family call B-6. Was the check alone.
- 2026-09-30 · audit S17 (API vocabulary, slice 3/4) → `style` lands on the root with `className` (Combobox.tsx:235; was forwarded through Input to the inner input).
- 2026-10-02 · compact evidence audit → groups stack flush at compact (`ui-row-gap` 2 / 0; R7) docs/research/compact-evidence-2026-10-02/README.md.
- 2026-10-21 · owner: "make sure the gaps between the nav items is consistent ... in compact, that gap shouldnt go away" → `ui-row-gap` is a constant 1px at every type and density (was 2 − 2 × ui-dense: 0 at Compact 12–13, 2 at Default, up to 5 at Comfortable); supersedes the line above. ChatGPT 35 rows and Notion 30 rows, 1 apart (`nav/chatgpt--sidebar-top-group`, `nav/notion--sidebar-private-section`); headless Edge: 1px in Nav and Menu at all 15 type × density combinations.
- 2026-10-03 · radius audit D1 (owner) → the container role is 12 at compact too (was 8; Figma 13, Cursor 12-14), so this family's surface is 12 at both densities; rows concentric with a floating surface follow (compact 24 rows r8). `docs/research/radius-audit-2026-10-03.md`.
- 2026-10-03 · roundness work → list rows are Menu's rows: border counted, 12 → 7 (was 8). `docs/research/radius-audit-2026-10-03.md`, "Roundness".
- 2026-10-03 · all even (owner) → list rows back to 8 (border left out).
- 2026-10-04 · pill shapes and list rows (owner) → list rows follow Menu's `radius-list-row`; the field takes `--area-pill-field`. `docs/research/radius-audit-2026-10-03.md`, "Pill shapes and list rows".
- 2026-10-07 · owner: make interactions professional, intentional, subtle; components look pixelated → motion pass: the list keeps its rows while it fades out (a commit no longer re-lists every option mid-exit); field and list motion stay Input's and Menu's. "Motion and interaction, 2026-10-07".
- 2026-10-08 · owner: recommendations accepted (custom-select.md Q3–Q7) → `data-selected` no longer set on options (Combobox.tsx), so the chosen row is the check alone and highlight is the only plate; the field's end padding is the chevron inset less half the action's free space (`inset.css`: sm 3 → 5, glyph 6 → 8 from the edge; md and lg unchanged; compact sm 24 → 7, glyph 8); toggle glyph `input-chevron` (combobox.css; rgb(131) / dark rgb(147)). Verified in the gallery (computed rects, light/dark, default/compact; chosen Geist row transparent when not highlighted). Note: in dark, the soft field's pressed toggle plate (`bg-active` over #28) puts the chevron at about 2.6:1 for the press only; rest, hover and every opaque field fill are ≥ 3:1.
- 2026-10-09 · owner went with Scroll area's recommendation to adopt it in the scrolling families (docs/specs/scroll-area.md, "Adoption") → the scroll container is a Scroll area: Figma's overlay bar instead of the platform's, its inset moved into the scroller so rows keep their place → back in review.
