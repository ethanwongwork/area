# Select spec

**Captures:** `docs/research/captures/select/`
**Peers:** Input, Textarea, NumberField (field chrome), Menu (picker rows and lift), Popover
(floating surface), InputGroup (mode picker), ColorPicker (model select)

## Owner decisions

- Before 2026-09-24 (moved from [prior decisions](PRIOR_DECISIONS.md)): Select's enhanced
  native picker opens below with a 4px gap and no above-input fallback; unsupported browsers
  retain their platform-native picker placement. *Superseded 2026-09-30 by audit pick B-5 B
  (owner): the picker follows the Combobox list's rules and flips (see Decisions).*
- Neutral by default, accent by override (2026-09-26): the checked option is marked with the
  neutral selection fill and a `currentColor` check, not accent.
- 2026-09-26, second pass ("decide all open items"), item 10: the chevron stays a
  theme-neutral mid grey (#888) in the data URI a native select requires; intentional.
  *Narrowed 2026-09-30 by audit pick B-3 B (owner): with `appearance: base-select` the chevron
  and check are Area glyphs in `input-icon` ink; #888 remains only for the native picker.*
  Item 18: control height unchanged (32px md; density is the UI-scale axis).
- owner 2026-10-08: approved, recommendations accepted (custom-select.md open questions 3–7,
  shared by this family): the checked option shows the `::checkmark` alone, no plate; the
  chevron ends 8 from the edge at sm/md (row inset; centred square at lg) in `input-chevron`
  ink; the chevron stays still. *Supersedes the plate in "Neutral by default" and the
  `input-icon` chevron ink of B-3 B.*

## Job and boundaries

Select picks one value from a short list with a native `<select>`: one focusable node, native
keyboard, typeahead, form value and reset. Where `appearance: base-select` is supported the
picker is styled; elsewhere it is the platform picker. Multiple selection, search and rich
options are out of scope (Menu, a combobox).

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| variant | outline (default), soft | Soft is the flat filled field shared with Input, Textarea and NumberField, so a Panel holds one field style (third pass) | Figma's soft inspector fields; gallery Variant / soft |
| size | sm, md (default), lg; in a Toolbar with no `size`, the toolbar's (`ToolbarSize` context, `forms.tsx:42`) | Control tiers | UUI sm/md/lg; Notion 28, ChatGPT 36, Figma 24 |
| state | invalid, success, warning, disabled | Validation and native disabled | UUI (disabled) |
| composition | option groups | Native `optgroup` headings | Native |
| boolean | fullWidth | Layout | — |

Excluded: a borderless inline trigger (Notion's permission select, Figma's zoom select); see
Settled questions 1.

## Sources

| Id | Type | What | Link / commit / path | License | Captures |
|---|---|---|---|---|---|
| uui | design system (source) | Select trigger and popover | [Untitled UI reference](../research/untitled-ui-reference.md):47-48, pinned `4702dc0` | MIT | — |
| chatgpt | target product | Settings select trigger, rest and hover | chatgpt.com settings, owner's session, read-only | evidence only | `baseline/chatgpt--select--rest--light`, `--hover--light` |
| notion | target product | Share popover permission select (inline trigger) | app.notion.com Share popover, read-only, 2026-09-26 | evidence only | `select/notion--inline-select--rest--light` |
| figma | target product | File-browser filter select; editor size select; toolbar zoom select; colour model select and its menu | figma.com file browser and editor, read-only | evidence only | `select/figma--filter-select--rest--light`, `figma--size-select--rest--light`, `figma--zoom-select--rest--light`; `color-picker/figma--format-row--rest--light`, `figma--format-menu--open--light` |
| area | this system | Gallery tiles, re-taken after the second pass | localhost gallery | — | `select/area--*` |

No product picker was captured open this pass (ChatGPT's was left closed because a selection
would change a setting). Figma's format menu (earlier pass): 24px rows with 12 / 32px
sides, 11/16 450, a 16px check before the label.

Product triggers (node numbers from the captures):
- Notion (nodes 0–3): 28 tall, radius 6, no fill or border, text 8px in, 14/16.8 400 in
  rgb(125,122,117), 14px chevron in rgb(142,139,134), 4px before it, 8px from the end.
- Figma size select (nodes 0–4): 24 tall, radius 5, white, 1px rgb(230), text 9px in, 11/16
  450, a 24px chevron box flush at the end, chevron 89.8% black.
- Figma filter select (nodes 0–8): 24 tall, radius 5, white, `inset 0 0 0 1px rgb(230)`, text
  8px in, 16px chevron 2px from the end in 50% black.
- Figma zoom select (nodes 0–2): 24 tall, no border, padding 4 4 4 12, 16px chevron.

## Anatomy

```
chatgpt  button  36px pill, padding 0 12, gap 4, fill rgb(243) (hover 5% black), 1px 10% ring
notion   div[role=button]  28px, radius 6, no chrome; text span; 14px chevron svg, margin-start 4
area     select.area-select  owns: height, border, radius, fill, focus (no resting shadow, audit B-2); chevron = ::picker-icon mask (base-select) or #888 background image (native picker)
  picker ::picker(select)   4px below, padding 4, radius 12, bg-surface, floating border (--area-border-float), floating lift (--area-shadow-float)
  option option             32 at every trigger size, inline 11.03 start / 8 end, radius 8, 2px apart, gap-row 12, ::checkmark (Area check mask) at the end
  group  optgroup           label row 32, 12/16 muted; options inside reset to the row type
```

Insets (`inset.css`, field chevron rule): text start (H − 1cap) / 2 − 1 = 10.03 at md; chevron
inset max(row inset 8 − 1, (H − 16) / 2 − 1) = 7 at sm and md (glyph 8 from the edge), 11 at lg;
text end padding 7 + 16 + 6 = 29 (2026-10-08; the chevron inset was the centred square alone,
5 at sm).

## Measurements

`node scripts/capture-compare.mjs --slots shell` (trimmed; the chevron data URI is `url(…)`;
Area widths are the tile's):

| slot · property | area · default | area · size-sm | chatgpt · select | notion · inline-select | figma · size-select | figma · filter-select | figma · zoom-select |
|---|---|---|---|---|---|---|---|
| **shell** size | 256 × 32 | 256 × 28 | 121.44 × 36 | 105.43 × 27.99 | 88 × 24 | 113.45 × 24 | 47.59 × 24 |
| **shell** padding | 0 31 0 10.03 | 0 25 0 8.74 | 0 12 0 12 | 0 8 0 8 | 0 0 0 8 | 0 | 4 4 4 12 |
| **shell** border | 1 solid color(srgb 0.886275 …) | 1 solid color(srgb 0.886275 …) | 1 solid rgba(0, 0, 0, 0.1) | 0 | 1 solid rgb(230, 230, 230) | 0 | 0 |
| **shell** radius | 8px | 8px | 9999px | 6px | 5px | 5px | 5px |
| **shell** font | 14px/20px 400 Geist | 12px/16px 400 Geist | 14px/18px 400 | 14px/16.8px 400 | 11px/16px 450 | 11px/16px 450 | 11px/16px 400 |
| **shell** color | rgb(40, 40, 40) | rgb(40, 40, 40) | rgb(13, 13, 13) | rgb(125, 122, 117) | rgba(0, 0, 0, 0.898) | rgba(0, 0, 0, 0.898) | rgb(0, 0, 0) |
| **shell** background | rgb(255, 255, 255) url(…) | rgb(255, 255, 255) url(…) | rgb(243, 243, 243) | — | rgb(255, 255, 255) | rgb(255, 255, 255) | rgb(255, 255, 255) |
| **shell** shadow | rgba(0, 0, 0, 0.06) 0px 0.5px 1px -0.5px | same | — | — | — | rgb(230, 230, 230) 0 0 0 1px inset | — |

`area--default` node 1 (the checked option): fill rgb(238, 238, 238) (`bg-component-active`),
padding 6 8, radius 8, gap 8. `area--disabled` has no opacity (0.5 before the audit). The
size-sm trigger radius was 8 at capture; since audit S4 it is 6.

## Decisions

| Slot · property | Area value | Basis | Reason when it differs from the basis |
|---|---|---|---|
| trigger · chrome | Input's: 32 / 28 / 40, radius per tier 8 / 6 / 10 (`navigation.css:231`, `:310-312`), `input-edge`, `bg-surface`, no shadow (since 2026-09-29, audit B-2) | Peer: [Input](input.md); Figma's outline selects (1px rgb(230), white) | ChatGPT 36 pill with a fill; Figma 24, radius 5; no product select has a shadow (was `shadow-1`, kept with Input until both dropped it) |
| trigger · soft | **`input-bg-soft` fill, transparent edge, no shadow; hover edge `input-edge`** (`.area-select--soft`, `navigation.css:250-255`); `variant` in the manifest (`manifest.ts:206, 211`) and React (`forms.tsx:12, 43`) | Third pass: the one field without soft, so a Panel mixed two field styles; peer Input soft (`input.css:52-57`) | — |
| trigger · chevron | 16px, 8px from the outer end at sm and md, 12 at lg (owner 2026-10-08). With `appearance: base-select`: the Area `chevron-down` glyph (1.125 line at type 13; it follows the icon weight, "Icon weight" below) as a `::picker-icon` mask in `input-chevron` ink (`stroke-control`, rgb(131) / dark rgb(147); 3:1 on every field fill; was `input-icon` #666), `fg-disabled` when disabled (`navigation.css:326-338`). Native picker only: the #888 1.5-stroke data URI at type 13 (`--_chevron-fallback`) | Notion rgb(142,139,134) 8px from the end; ChatGPT 16px rgb(143); UUI 16px; audit B-3 B (owner) | The #888 literal stays where the browser draws the picker; Figma 50–90% black |
| trigger · text | 14/20 400 `fg-default`, 11.03 from the edge | Notion 14 400, ChatGPT 14/18 400 | Notion's permission select uses muted ink as an inline trigger; Figma 11/16 450 |
| picker · offset | 4 from the field, below; `position-try-fallbacks: flip-block` with `position-try-order: normal`, so it flips only when below doesn't fit (`navigation.css:347-348`) | Audit B-5 B (owner 2026-09-30): Combobox list rules; UUI 4px offset | Was no flip (pre-2026-09-24 owner decision, superseded). Chrome's UA default (`most-block-size`) opened it on the roomier side |
| picker · size | min width max(trigger, 160; plan B2.3, was 224); max height min(324, 100%), then scrolls | Combobox list (Menu's 160; Figma's 324 font list) | Was the trigger's width and at most 288 |
| picker · surface | padding 4, the field's corner + 4 (sm 10, md 12, lg 14; surface.css "A list opened from a field"), `border-float` (was `border-decorative` until the 2026-10-12 consistency pass), `bg-surface` | Peer: Menu (4px inset) | UUI radius 8 |
| picker · lift | `--area-shadow-float`, the Elevation axis's float role: `0 0 2` + `0 8 16` at the Elevation step in % (8% key at the default 8, 3% until 2026-11-05), the ambient half, dark doubled; transparent at step 0 (axes/elevation.ts) | Audit "Floating lift" (Notion popover; Menu, Popover) | Was `shadow-2`. A Surface axis role since audit S10 |
| option · row | Menu's row (audit B-4): 32 at every trigger size; text start on the inset contract round((row − 1cap) / 2), 10 at the default (plan A11.1; was 10.38 unrounded); check edge 8 from the end; gap `--area-ui-cluster` 8 (plan B2.3; was `gap-row`); corner the select's own (sm 6, md 8, lg 10; was Menu's 8 at every size); 2px apart (`navigation.css:356-378`) | Peer: Menu rows 32px | Figma 24px rows; UUI 36, radius 6. Was min 32, padding 6 8, radius `radius-row` |
| optgroup · label | 32 row, 12/16 `fg-muted`, regular weight (`navigation.css:403-412`) | Peer: Menu group label | — |
| option · hover / focus | `bg-component-hover` #f3; keyboard focus is the plate alone, as Menu and Combobox rows | Audit row-plate rule; audit B-5 | Was the plate plus a 2px inset focus ring |
| option · checked | no plate (owner 2026-10-08; was `bg-component-active` #eee); the Area `check` glyph (1.125 line at type 13, following the icon weight) as a `::checkmark` mask at the end in `currentColor` (`navigation.css:391-402`) | Audit: selection one step above hover | Figma's check sits before the label; UUI one fill for both |
| disabled | field paint only (`navigation.css:281-287`) | Audit "Disabled" rule for text fields | Was field paint and 50% opacity |

## States

| State | Slot · property changes | Evidence |
|---|---|---|
| hover | border → `border-subtle` #d4d4d4; ink fixed | `navigation.css:247` |
| focus | keyboard focus only (`:focus-visible`): border `field-focus-color` (focus colour) + 2px `field-focus-halo-color` halo | `navigation.css`; audit S1, as [input.md](input.md) | a pointer choice keeps focus without the ring (2026-11-02): a select opens a picker, as a Button does |
| invalid / success / warning | border and halo in the tone colour; `aria-invalid` or `data-*`; forced colours draw invalid (`aria-invalid` or `data-invalid`) dashed (`forced-colors.css`) | `area--error`, `area--success`, `area--warning` |
| placeholder | a chosen empty-value option (`option:checked[value=""]`) is a placeholder: the trigger takes `input-placeholder` ink, as Input's (`navigation.css:320-321`; audit B-19 B, owner 2026-09-30) | Was default ink, read as a chosen value |
| disabled | the field shell's disabled paint (input.css): fill #f7, `border-faint` (none on soft), ink and chevron `fg-disabled` rgb(164); no opacity | `area--disabled`; plan B7.8 |
| option hover / checked / disabled | #f3 / check only (was #eee) / `opacity-disabled`, no plate (plan B7.8) | `area--default` node 1 |

## Behavior and accessibility

Native `<select>`, ref forwarded (`forms.tsx:21-48`); validation props mirror Input.
Keyboard, typeahead and dismissal are the browser's. Option focus is the hover plate alone
(audit B-5; the 2px inset ring was removed). The browser anchors the native picker; it is the
one anchored surface outside the shared JS engine ([overlay.md](overlay.md)). RTL moves the chevron (`navigation.css:243`). Notion's inline trigger is a
`div role="button" aria-haspopup="dialog"`, not a select; Area keeps the native element.

## Peers and consistency

| Peer | Shared role | Area value in peer | This component | Match / reason |
|---|---|---|---|---|
| Input, Textarea, NumberField | field chrome and disabled | field paint, no opacity | same | match |
| Input, Textarea, NumberField | soft variant | flat fill, transparent edge, no shadow | same (`navigation.css:250-255`) | match (third pass) |
| Menu | row plates | hover #f3, 32px rows, 4px inset, icon gap `--area-gap-row` 12; the #eee `data-selected` plate is the value-picker hook (surface.css:1045-1058) | same | match (audit S11a; option gap was 8) |
| Popover, Menu, Dialog | floating lift | `--area-shadow-float` | same | match |
| Menu | selected mark | check only, no plate (commands and choices: `checked`, `radio checked`) | check only | match (owner 2026-10-08; was the plate plus check, audit S13 C) |
| Combobox | selected option | check only | same | match (owner 2026-10-08) |
| InputGroup | mode picker | first child 3 × height wide (`input-group.css:102`) | chrome stripped inside the group | match |

## Visual pass

2026-09-28 (batch 9, owner: truncation errors): a narrow Select wrapped its option onto a second line
inside the 28px control (Property list Effects, "Drop shadow"). The value is now one line with an
ellipsis, and inside an InputGroup the text runs up to the chevron's 16px box, as Figma's W / H menu
fields do (`number-field/figma--number-field-menu`: value box 17 from the end = chevron 16 + 1); the
chevron's side-bearing keeps about 4.5 of air. A standalone Select keeps its extra 4.

Earlier note:

The gallery shows Select's tiles in named groups, one variant per tile. The picker lift
and checked fill appear only with the picker open in a supporting browser. Unverified: the
open picker on screen, a Notion or Figma picker side by side, dark theme.

2026-09-28 (batch 13, Claude in Chrome): beside ChatGPT's settings dropdown (Personalization: a
36px pill, #f3 fill, 0.56px 10% edge, 0 12, 14/18) and the Figma and Notion selects on file.
Area's outline and soft Selects (32, corner 8, 11 text inset) sit between Figma's 24–32 fields
and ChatGPT's 36 pill; its chevron is 16 wide, 6 / 8 / 12 from the end at sm / md / lg,
exactly where Combobox's chevron and Input's trailing icons sit. ChatGPT's hover is a 5% black
wash (≈ #f2 against its #f3 rest). No change. Captures: `chatgpt--settings-select--{rest,hover}--light`.

## Settled questions

Both kept in the third pass ([cohesion audit](../research/cohesion-audit.md#third-pass-the-questions-the-evidence-left-open)):

1. *Borderless trigger: none.* Notion's permission select (no fill or border, muted ink) and
   Figma's zoom select (no border) are inline triggers. A ghost variant is a candidate, not
   started without the owner.
2. *Outline shadow.* No product select has a shadow. Input, Textarea, NumberField and InputGroup
   dropped `shadow-1` in the outline pass and Select followed on 2026-09-29 (audit B-2): every
   field rests flat.

## Motion and interaction, 2026-10-07

Contract: `docs/MOTION.md`. Verified by computed style and parsed rules on `/select.html`
(closed picker: opacity 0, scale 0.97, origin top left). Opening the picker needs a real user
gesture, so the open transition and keyboard focus were not exercised in a background tab.

| Interaction | Before | After |
|---|---|---|
| Edge hover | `--area-transition` both ways | instant in, fast ease-out out (as Input: `--_t-paint`) |
| Focus edge, halo and outline | halo and edge eased in over 100 | at once; the halo fades out on fast (as Input: `--_t-halo`) |
| Tone, disabled | eased in | at once; clearing fades on fast |
| Picker (customizable select) | no motion | `opacity` + `scale` from 0.97 at the trigger's corner (top left, top right in RTL): `base` ease-out in with `@starting-style`, `fast` out with `overlay`/`display` allow-discrete, as Popover and Menu |
| Option hover plate | snapped | instant in, fast out; checked, focused and pressed rows and any row while the keyboard moves are instant both ways (as Menu rows) |
| Chevron | static | unchanged (no field chevron in Area turns: Custom select, Combobox) |

Open questions:
- When the picker flips above the field, it still scales from its top corner. Recommendation:
  accept (0.97 is barely visible); anchored `transform-origin` has no CSS hook for the flipped case.
- Should field chevrons turn on open? MOTION.md lists "selects" under the chevron rule, but no
  Area field chevron turns today, nor do ChatGPT's, Notion's or the native pickers. Recommendation:
  keep them still and drop "selects" from the rule.

## Verification

Compared the Area captures (`select/area--*`) with ChatGPT's select, Notion's permission
select and Figma's filter, size, zoom and format selects. Build and test results are in the
[cohesion audit](../research/cohesion-audit.md#verification).

## Review note, 2026-10-12 (consistency pass)

- **What changed:** the open list's frame takes the floating-frame colour, as Menu's and Popover's. Only dark mode looks different (#4b, was #28).
- **Why:** the Select list was the one floating surface still on the lighter container seam, so in dark mode its edge sank into the page.

## Feedback log

- 2026-09-26 · cohesion audit → disabled without double dimming; picker takes the floating
  lift; checked option uses `bg-component-active` → `area--disabled` (no opacity),
  `area--default` node 1 rgb(238).
- 2026-09-26 · second pass (Notion, Figma; owner: decide all open items) → no change; the #888
  chevron is kept and documented; two open questions recorded → `select/notion--inline-select`,
  `figma--size-select`, `figma--filter-select`, `figma--zoom-select`.
- 2026-09-27 · third pass → `variant: outline | soft` added, outline default (was outline
  only), so a Panel holds one field style; Variant / soft tile added; borderless trigger and
  outline shadow kept → [cohesion audit](../research/cohesion-audit.md#third-pass-the-questions-the-evidence-left-open).
- 2026-09-28 · owner: truncation errors → nowrap + ellipsis; in-group end padding = gutter + chevron
  → gallery measured, no Select text overflows.
- 2026-09-30 · audit S4 (owner) → trigger radius follows the tier as Button: sm 6, md 8, lg 10 (`--_radius` per size, `navigation.css:231`, `:310-312`); was 8 at every size.
- 2026-09-30 · audit S10, S11a (owner) → the picker reads the Surface axis role `--area-shadow-float` (same recipe; `none` under Flat; `navigation.css:334`); option icon-to-label gap is `--area-gap-row` 12 (was 8), labels at 36 as Menu's (`navigation.css:342`).
- 2026-09-30 · audit S13, S14 (owner) → Select keeps the plate plus the check; Menu rows of commands and choices now show the check only, and Combobox matches Select (peer rows). The density gap moved to 6 at sm/md/lg, but the trigger sets `--_gap` without reading it (navigation.css:216, :311-313), so nothing visible changes.
- 2026-09-30 · audit B-5 B (owner) → the native picker follows the Combobox list: 4 from the field, `flip-block`, min width max(trigger, 224), max height min(324, 100%); option focus is the plate alone (`navigation.css` `::picker(select)`). Replaces the no-flip decision.
- 2026-10-01 · audit A-7 → in a Toolbar a Select with no `size` takes the toolbar's through the `ToolbarSize` context → forms.tsx:42, toolbar-context.ts.
- 2026-10-01 · audit B-3 (owner pick B) → with `appearance: base-select` the `::picker-icon` and option `::checkmark` are the Area chevron-down and check glyphs as masks (1.125 weight) in `input-icon` ink, disabled ink when disabled; the #888 data URI remains for the native picker only. The picker sets `position-try-order: normal`, so it opens below unless it doesn't fit → navigation.css:322-348, :391-402.
- 2026-10-01 · audit B-4 → options are Menu rows: 32 at every trigger size, text start (32 − 1cap) / 2 (11.03 measured live), check edge 8 from the end, 12 gap, corner min(max(0, radius-container − 4), 32 × cap) (8 at Standard, measured); optgroup labels 12/16 muted → navigation.css:353-412.
- 2026-10-01 · audit B-11 → forced colours draw an invalid Select (`data-invalid` too) dashed → forced-colors.css.
- 2026-10-01 · audit B-19 (owner pick B) → a chosen empty-value option renders in placeholder ink → navigation.css:320-321.
- 2026-10-03 · radius audit D1 (owner) → the container role is 12 at compact too (was 8; Figma 13, Cursor 12-14), so this family's surface is 12 at both densities; rows concentric with a floating surface follow (compact 24 rows r8). `docs/research/radius-audit-2026-10-03.md`.
- 2026-10-03 · roundness work → picker options count the picker's border: 12 → 7 (was 8) (`navigation.css`). `docs/research/radius-audit-2026-10-03.md`, "Roundness".
- 2026-10-03 · all even (owner) → picker options back to 8 (border left out).
- 2026-10-03 · two roundness step sizes (owner) → picker options step by 4 with the picker's surface; their cap reads `radius-shift-surface` (`navigation.css`). `docs/research/radius-audit-2026-10-03.md`, "Step size for large shapes".
- 2026-10-03 · one corner setting (owner: one radius setting, Sharp and Pill as ends; "every control is a pill") → picker options are the picker's corner less its padding up to a pill; the picker stops at pill options plus the padding, 20 (`navigation.css`). `docs/research/radius-audit-2026-10-03.md`, "One corner setting".
- 2026-10-04 · pill shapes and list rows (owner) → the picker and its options use `radius-list` / `radius-list-row`, as Menu; the trigger takes `--area-pill-field` (`navigation.css`). `docs/research/radius-audit-2026-10-03.md`, "Pill shapes and list rows".
- 2026-10-07 · owner: make interactions professional, intentional, subtle; components look pixelated → hover, focus and tones land at once and fade out on fast; the customizable picker fades and scales in on base and out on fast; option plates as Menu rows.
- 2026-10-08 · owner: Custom select approved, recommendations accepted (custom-select.md Q3–Q7) → checked option drops the `bg-component-active` plate (check only); the chevron's end inset is max(row inset, centred) (`inset.css`: 28 → 8 from the edge, was 6; 32 → 8; 40 → 12; compact 24 / 28 / 32 → 8, was 4 / 6 / 8); the `::picker-icon` takes `input-chevron` (rgb(131) light, rgb(147) dark; was #666 / rgb(197)); chevron stays still. Checked in the gallery (computed `::picker-icon` inset and colour, light/dark, default/compact); the open picker's plates were read from computed styles (no plate on `option:checked`), not seen open.
- 2026-10-12 · consistency pass (owner: "a consistency and cohesion pass on all the components ... stroke values and how they are used") → the native picker's frame is `border-float` (was `border-decorative`) (navigation.css). (docs/research/consistency-audit-2026-10-12.md)
- 2026-10-12 · owner, review round 21 (components21): approved → Complete in `component-status.mjs`.
- 2026-10-12 · radius at the extremes (owner) → shares Input's rule: the sides clear half the corner (`inset.css`). `docs/research/ui-size-scale-2026-10-12.md`.
- 2026-10-14 · owner: "continue working on the next axis" → Surface is one number, the frame's width: `1` (Default) or `0` (Borderless) (was `outlined` / `borderless`; axes/surface.ts). At 0 the custom picker lists the Surface axis's `shadow-edge` first in its box-shadow, ChatGPT's frameless-menu edge (`0 0 1px` black 62%, and in dark an inset `0 0 1px` white 20%; captured 2026-10-13), so it keeps an edge at Elevation 0 and in dark, where it had none. Owner approved ("go with your recs"), review https://claude.ai/artifact/L4TCF2W5zcjvBK7xZmaDBN (docs/research/surface-2026-10-14.md).
- 2026-10-15 · owner: "merge it, then continue working" → boundary sweep under increased contrast (CONTRAST.md: required boundaries target 3:1): the soft variant's resting edge is `input-edge-soft` (fill alone 1.07:1 under more), as Input's.
- 2026-10-23 · owner, 2026-10-23: "is it supposed to be much rounder than the actual input? im okay with it being a bit rounder but it seems drastic" → a list opened from a field takes the field's corner (surface.css, "A list opened from a field"; navigation.css for Select's picker): rows at the field's corner, the list 4 rounder (or, below a 4 corner, the rows' own corner more), rows short of a pill before Pill. Default: sm 6 → list 10 / rows 6 (Notion's field 6, menu 10, rows 6; was 12 / 8, twice the field), md 8 → 12 / 8 (unchanged), lg 10 → 14 / 10. Menus and Context menus keep 12 / 8. Swept every size × Radius 0–14 and Pill × density 28/32/36 × pill fields: Select, Custom select, Combobox and Tag picker agree at every combination.
- 2026-11-14 · plan B7.8 → the trigger's disabled paint is the field shell's (input.css); a disabled option dims by opacity-disabled and takes no hover plate (was fg-disabled), as every row does; an empty value keeps the disabled ink when disabled. Why: docs/research/system-evaluation-2026-11-11 (README §5, phase2/disabled.md); the owner took every recommendation on 2026-11-11.

## Spacing audit (2026-10-17)

Gap: Select sets `gap: var(--_gap)`, its size's tier (6 at md; 4 at Compact 13). Without it the browser's customizable-select default (0.5em) applied: 7 at type 14, 6.5 at 13. Measured in `docs/research/spacing-2026-10-17/` (Before / After: https://claude.ai/artifact/JtDZ9LNfutFyfdkGUvQzL2).
- 2026-10-18 · owner: "go with your recommendations … finalize the material, surface, stroke, elevation axis theming" → Edge and Depth (axes/depth.ts; docs/research/elevation-stroke-2026-10-18): the outline variant rests on `--_field-lift: var(--area-shadow-field)` and lists it before the focus halo, so the two crossfade; the soft variant's lift is transparent (flat, as Figma's). Field shadow is 0 by default, a transparent role: nothing changes until it is raised (Inspector → Edge and depth → Field shadow; owner, the same day: no named looks, nine individual controls). Under a Material the lift is listed beside the well (material.css).

## Review note, 2026-10-20 (round 62)

- **What changed:** The native picker's option plates now take the plate made for its raised surface. In light at the default settings nothing moves (there the raised plate equals the page's);
  in dark and on a grey page its hover, selected and pressed plates are now the same step from this surface as every
  Card's and Menu's (dark: #272727 on #121212, was #212121).
- **Why:** you asked that hover colours come from rules, not one-off fixes. The rule is now written (DESIGN_SYSTEM.md,
  Layers: a component that paints a ground declares it in layers.css) and enforced by a test; this family painted a
  raised ground without declaring it.

## Review note, 2026-10-26 (interaction pass)

- **What changed:** The hover edge eases in on Feedback's hover clock, as Input's.
- **Why:** One hover clock for every field. You asked for the Slider's motion and detail pass on every component; measured across all 118 families ([the pass](../research/interaction-pass-2026-10-26/README.md)).

## Review note, 2026-11-02 (owner: "fix this visual bug after using the dropdown and changing the selection")

- **What changed:** The field's focus paint (edge, halo, outline) shows on keyboard focus only (`:focus-visible`, was
  `:focus`); hover's edge holds off only while that ring shows.
- **Why:** After a style was chosen with the pointer in the type tester, the select kept focus and drew the 2px field
  ring around itself (clipped by the toolbar). A select opens a picker, as a Button does, so it takes a Button's focus
  rule; Input keeps `:focus`, since its caret is its focus.

- 2026-11-05 · owner: "go with your recs" on the shadow depth page (docs/research/shadow-depth-2026-11-04.md) → the Elevation default is 8, so this surface's float role is an 8% key (was 3%).

### 2026-11-07 · onValueChange (components audit O3)

- **What changed:** `onValueChange(value, event)` beside native `onChange`, as Input's.
- **Why:** forms.tsx:13-24. From the components audit's internal peer comparison (`docs/research/components-audit-2026-11-07/internal.md`); the owner took every recommendation ("Take all recs", 2026-11-07).
- **Verdict:** awaiting the owner.
- 2026-11-11 · system evaluation B2.3 and A11.1 · options' icon-to-label gap `ui-cluster` (8, Compact 6), picker floor 160 (was 224), the option text side rounded to a whole pixel (10, was 10.38).

## Review note, 2026-11-11 (type rules, plan A9)

- **What changed:** the native optgroup label takes Menu's group label, the rows' size (13/18) at 500 in the muted ink, a row tall; it was 11/14 at 400 (plans A9.2, A9.4).
- **Why:** the system evaluation's type rules (docs/research/system-evaluation-2026-11-11, section 5, A9), owner-approved
  2026-11-11; the rules are in DESIGN_SYSTEM.md ("Ink and weight", "Size and shape", "Text pairs") and the type skill.

## Review note, 2026-11-11 (motion, plan A5)

- **What changed:** the native picker enters and leaves on `fast` (140; it entered on `base`), the exit on `ease-exit`, its top-layer hold on the fade (A5.1); options land and leave at once (A5.3); the field's colour leaves on `duration-quick` (70; A5.5).
- **Why:** the system evaluation's motion items (docs/research/system-evaluation-2026-11-11, section 5, A5), owner-approved
  2026-11-11; the rules are in docs/MOTION.md (Tokens, Roles, Recipes) and kept by cohesion.test.mjs and
  tests/behaviour/suites/motion.test.mjs. The motion tables above are history; these values are current.

### 2026-11-11 · Ink, dark and colour (system plan, Phase 1)

- **What changed:** In dark it paints the floating ground (`bg-float`, plan A7.2): a step above the layers under it, #0c0c0c on the near-black page at the defaults (was `bg-surface`, the page's own #020202); light is unchanged. Its dark edge is one line (plan A7.1): the frame takes the dark rim's strength (16% at Shadow 8) and the rim is no longer drawn outside it, where it had made a two-tone 2px edge. (the picker)
- **Why:** docs/research/system-evaluation-2026-11-11 (README §5); the owner took every recommendation on 2026-11-11.
- **Verdict:** awaiting the owner.

## Shared parts (plan B2), 2026-11-13

- **Row table (B2.1).** The picker's options stand 1 apart (`ui-row-gap`; was 2) and start their text on the glyph edge (`ui-row-inset`, 8; was the cap-centred 10).

### 2026-11-14 · One field shell (system plan, Phase 2, B3)

- The one field shell replaces the family's copy; Select reads its select-* seam through the shell's inputs. No visible change.
- Why: docs/research/system-evaluation-2026-11-11 (B3.1, B3.2, B3.3, B2.2 in fields; README §5); the owner took every recommendation on 2026-11-11 and the 24 targets on 2026-11-13. B3.2: field text stays on Button's inset (Keep 10, the pick), so nothing moved.
- Verdict: awaiting the owner.
- 2026-11-14 · system evaluation B6.1, B6.3, B6.6 · the native picker's padding, frame, corner and shadow stack are the one floating surface's, restated on the pseudo-element in popup.css: it now lists a material's layers first and takes the overlays' glass (material.css), where it stayed opaque beside a glass Menu (S13); its bar is the thin shared thumb.

## Selection paint (plan B7.7), 2026-11-14

- The chosen option shows the active plate and the check, the check in `fg-selection` (plan B7.7; was the check alone in currentColor, custom-select.md Q3). Forced colours: the Highlight pair.

## State paint (plan B7.3), 2026-11-14

- Options press to `bg-component-pressed`, one step past their hover.

## Settings pass, 2026-11-21 (step C: icon weight and size tiers)

From docs/research/system-status-2026-11-18 (section 3, step C1–C2). At the shipped defaults (type 13, density 32) nothing moves: every box, mask and stroke measured the same before and after, and 2x screenshots of every part are pixel-identical in light and dark.

### Icon weight

The chevron (base-select and the native picker's #888 one) and the chosen option's check are masks, so their line
can't read `--area-weight-icon`. Each is a private property on `.area-select` (`--_chevron`, `--_chevron-fallback`,
`--_checkmark`) restated under `@container style(--area-type-base: N)` at types 12, 14, 15 and 16 with its line times
Glyph's change in the icon slot: the weight's ratio to type 13's and the slot's line ratio (0.8846 from type 15, where
the slot is 20). The chevron's line: 1.038 / 1.125 / 1.211 / 1.148 / 1.225 drawing units at types 12-16 (1.53 px at type
16 in its 20 box); Glyph's goes 0.964 / 1.045 / 1.125 / 1.066 / 1.138 in the same slot, the same ratios. Stroke width
(the frame setting) moves neither: it isn't the icon weight. A native `<select>` without React keeps its chevron, the
ladder being CSS. `icon-weight.test.mjs` checks each step against the type axis's tokens.

- **Open (owner):** the chevron and check are drawn at 1.125, type 14's weight, where Glyph draws 1.045 at type 13; the
  ladder keeps that offset. Matching Glyph exactly would thin them by 0.08 at the defaults.

## Review note, 2026-11-21

- **What changed:** the chevron and the check now get heavier and lighter with the type size, as every other icon does.
- **Why:** they were drawn with a fixed line, so at type 16 they read lighter than the icons beside them, and at type 12 heavier.
