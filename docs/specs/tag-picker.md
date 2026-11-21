# Tag picker spec

**Captures:** `docs/research/captures/tag-picker/` (Notion select property editor, open and hover) and Area (`area--*`, 2026-10-06: every tile at rest plus the open list / panel)
**Peers:** Combobox (typing filters a listbox; create row), Custom select (rows with a check),
Tag (the tag: Notion's palette, remove ×), Chip (`kind="input"`, a removable value), Input (field chrome),
Menu (rows, label, lift)

## Owner decisions

- 2026-10-04: batch 1 (owner pick). Tag picker reference: "Notion's select and multi-select
  properties: coloured tags, create on type"; reuses Combobox, Chip, Field (`REVIEW_BATCHES`).
- 2026-10-08 (component review): "the backplate for hover around the colored tags is a bit hard to
  read" → that was Tag's × hover plate (a 12% plate of the tag's ink under the ×). Fixed in Tag: the
  light inks are deeper (OKLCH L ≤ 0.49) and dark green/yellow calmer (`tag.md`, Settled 3-4). In
  this field (browser, light): × on its plate 4.72-5.13, label on tint 5.62-6.20. "go with your
  recs for open questions" → keep the check on chosen rows; keep the opacity-only fade for a new
  tag (Settled questions below). No Tag picker CSS or React change.
- Inherited: the chosen value shows a check (audit S13 C); Badge is a pill unless the theme's Pills
  setting drops it (`data-area-pills`, owner 2026-10-04); Menu's rows. — superseded 2026-10-06: the
  tags are Tag (radius 4, not a pill), not Badge (Feedback log; `tag.md`).

## Job and boundaries

Choose several values from a list that can grow: the chosen ones sit in the field as coloured
tags, typing filters the list, and text that matches nothing can become a new tag. Not Combobox
(one value), not Custom select (one value, fixed list), not a Chip group (filters shown all at
once, toggled in place).

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| variant | outline (default), soft | Input's field chrome | Notion's editor field is soft (rgba(242,241,238,.6)) |
| size | sm, md (default), lg | Control tiers; tags are Tag sm (20) up to md, Tag md (24) at lg (`TagPicker.tsx:183`; `tag-picker.css:24, 42`) | Notion tags 20 |
| content | Tag tone per option (neutral when unset) | Notion's tag colours | `notion--select-property-editor--open--light` nodes 36, 53, 70, 87 |
| behavior | create (`onCreate`) | Notion "Select an option or create one" | same capture, node 22 |
| state | open, placeholder, disabled, invalid; read-only (React prop; not a manifest state) | Input's states | — |
| boolean | fullWidth | Layout | — |

Excluded: Notion's drag handles and per-option "…" menu (reorder and edit the option set, a
property-settings job, not choosing); the editor replacing the cell in place (Area anchors the list
below its field, as Combobox).

## Sources

| Id | Type | What | Where | Captures |
|---|---|---|---|---|
| notion | target product (primary: lists, properties) | Status (select) property editor on a task's side peek: field with the chosen tag and its ×, hint, four tag rows with drag handle and "…"; hovered row | app.notion.com, owner's "tasks" database, a task opened in side peek; opened only, Escape to close, nothing changed (Status still "personal") | `notion--select-property-editor--{open,hover}--light` |
| area | peers | Badge's Notion tag measurements; Combobox's create row | `badge.md`, `combobox.md` | — |

## Anatomy

```
notion (node numbers from the open capture)
popup    div (2)  539 wide (the property cell), radius 6, white, Notion's float shadow
  field  div (8)  38 tall, soft rgba(242,241,238,.6), 4 padding, inset bottom rule 1px rgba(28,19,1,.11)
    wrap div (9)  padding 5.25 8, gap 6
      tag   div (11) 20 tall, radius 4, padding 0 0 0 6, 14px, toned fill and ink; × 16 in a 20 box
      input (18)  20 tall, 14px
  list   div (21) padding 4, gap 1
    hint div (22) 12/14.4 500 muted, 6 above, 8 below
    row  div (29) 28, padding 0 8, radius 6, gap 8: drag handle 16, tag 20 (radius 4, padding 0 6), "…" 24 at the end
```

Area:

```
root    div.area-tag-picker[data-open]            owns: variant/size locals
  field div.__field[aria-invalid][data-disabled]   owns: edge, fill, radius, focus ring, wrap, insets
    Tag (sm, or md at lg; tone; remove ×) × n       the tags
    input.__input[role=combobox]                    the text
  input[type=hidden] × n                            form values (with `name`)
  span.area-sr-only[role=status]                    announcements
  listbox ScrollArea.area-menu.__listbox[popover=manual][role=listbox][aria-multiselectable]
    hint  div.area-menu__label.__hint
    empty div.area-menu__empty                      "No tags" (`emptyText`) when nothing matches: Menu's empty line
    option div.area-menu__item.__option[role=option]: Tag + check
    create div.area-menu__item.__create[role=option]: "Create" + Tag
```

Inset equation (md 32, tag 20, border 1): tag inset = (32 − 20) / 2 − 1 = 5 on every side, so the
first tag sits as far from the start as from the top; rows of tags are 20 apart by 5 (the same
inset), tags 6 apart (Notion). With no tags the input starts on Input's text column: 10 − 5 = 5
more.

## Decisions

| Slot · property | Area value | Basis | Reason when it differs |
|---|---|---|---|
| field chrome | Input's: outline (white, `input-edge`) or soft; per-tier radius; field focus ring | Peer: Input | Notion's field is soft and square-cornered inside its popup |
| field height | control tier (32 md), grows by a row of tags | Input tiers | Notion 38 |
| tag | Tag sm (20; Tag md 24 in the lg field), tone per option, Tag's remove × (`TagPicker.tsx:183, 193-196`) | Notion tags 20 (owner 2026-10-06: Tag replaced Badge) | Radius 4, as Notion's (Settled 1; `tag.md`) |
| tag gap | 6 | Notion (node 9: gap 6) | — |
| tag inset | (height − tag) / 2 − border | Equal insets (owner 2026-10-01) | Notion 4 + 5.25 / 8 |
| list | Menu surface and rows in a Scroll area (owner 2026-10-09); Combobox placement, 4 below, at least the field's width, at most 324 tall (`tag-picker.css:135-140`) | Peer: Combobox | Notion opens the editor over the cell |
| hint | Menu label: "Select a tag or create one" with `onCreate`, else "Select tags"; `hint={null}` hides it (`TagPicker.tsx:185`) | Notion (node 22) | Notion 500 weight; Menu labels are regular |
| option row | Tag + check at the end, check hidden on unchosen rows (`tag-picker.css:146`) | Peer: Custom select (S13 C) | Notion has no check (the chosen tags are in the field); drag and "…" excluded |
| create row | "Create" + the neutral Tag it would make, 6 apart | Notion; Combobox's create row | — |
| removal | Backspace in an empty field; the Tag's × | Notion; Tag remove | — |

- The Create row's gap is `gap-md` (6, Compact 4, Comfortable 8 at type 13).

## States

| State | Change | Evidence |
|---|---|---|
| hover | field edge `input-edge-hover`, not while focused or disabled | Input |
| focus / open | field focus edge, halo and outline; `data-open` keeps the focus edge | Input |
| highlighted row | `bg-component-hover` | Menu; Notion hover capture (row plate) |
| chosen row | check | Custom select |
| disabled | Input's disabled fill and `border-faint` edge (none on soft); Tags disabled, no ×; list never opens | Input, Tag |
| read-only | rest paint; Tags without ×; list never opens; Backspace removes nothing | Input |
| invalid | `input-invalid-color` edge and ring | Input |
| success / warning | `input-success-color` / `input-warning-color` edge and ring, from `validationStatus` or a Field's status (2026-11-07) | Input |

## Behavior and accessibility

`input role=combobox aria-autocomplete=list aria-expanded aria-controls aria-activedescendant`;
the listbox is `aria-multiselectable`, options carry `aria-selected`. Typing filters (case-insensitive
contains) and highlights the first row; ↑/↓ move (wrapping, disabled rows skipped); Enter adds or
removes the highlighted tag and keeps the list open, clearing a search; Backspace in an empty
field removes the last tag; Escape closes; blur closes and clears the text. The tags' × buttons are out of the Tab
order (one stop with the field, plan C2.3): ← at the start of the field focuses the last tag's ×, ← and → move
between tags, → past the last returns to the field, and Backspace or Delete removes the focused tag and moves focus to
its neighbour. Each change is
announced through the shared announcer ("work added", "Ideas removed"). Each tag's × is a button named
"Remove <tag>". A pointer press on the field's empty space focuses the input and opens the list.
The input's `aria-label` also names the listbox. Choosing the create row calls `onCreate(text)`; the
new tag is chosen once the host adds it to `items` (`TagPicker.tsx:101-116`). `name` submits one
hidden input per value; form reset restores `defaultValue`.

## Visual pass

### Claude in Chrome audit, 2026-10-07

Sources, light (no theme changed): app.notion.com owner's "tasks" db, a task page's Status editor opened
and closed with Escape (value unchanged); storybooks.fluentui.dev `components-tagpicker--size` (field,
tags, open list); mantine.dev/core/tags-input; ant.design/components/select (computed style only: the
hidden tab drew the demos 0×0); Area `/tag-picker.html`. Measured with computed styles and a baseline probe
(see `tag.md`, same date); no new capture files (the Notion editor capture from 2026-10-06 still matches:
field tag 85.56 × 20, × 20 box with a 9.4 ink 7.3 from the end, wrap padding 5.25 8, gap 6).

| Field | height | radius | first tag inset (top / start, from the outer edge) | tag | gaps (row / tag) |
|---|---|---|---|---|---|
| **Area md** | 32 | 8 | 6 / 6 | 20 | 5 / 6 |
| Notion editor | 38.5 (soft, inside its popup) | 6 | 9.25 / 12 | 20 | — / 6 |
| Fluent md | 34 | 4 | 7 / 13 | 20 (12/16 text) | 4 / 4 |
| Fluent lg / xl | 42 / 50 | 4 | 9 / 13 | 24 / 32 | 6 / 6 |
| Mantine TagsInput sm | 36 | 8 | 6.7 / 13 | 22 pill | — / 8 |
| Ant Select tags | not drawn | 6 | — / 4 (padding 1 11 1 3) | 24 (line 22 + clear 1 edges) | — |

| List | rows | chosen option | create |
|---|---|---|---|
| **Area** | Menu rows (31) with the Tag, check at the end on chosen; hint "Select a tag or create one" | stays, checked | "Create" + the tag |
| Notion | 28, padding 0 8, radius 6; drag handle, tag, "…" | stays, no check (the field shows it) | "Create" + the tag (2026-10-06 capture) |
| Fluent | 48 persona rows (avatar 32, name, secondary), radius 4, list padding 4, gap 2 | removed from the list | not in these stories |

Findings:

1. **Field and tag sizes agree with the references.** Every picker puts a 20 tag in a 32–34 field at md
   and a 24 tag at the next tier up (Fluent lg 24, Area lg 24). Area's start inset (6) is tighter than
   Fluent's and Mantine's 13; that follows the owner's equal-inset rule (2026-10-01) and is kept.
2. **Chosen rows:** three answers in three products (Area checks, Notion keeps unmarked, Fluent removes).
   Open question 2 now has its evidence; recommendation below.
3. **Tags inside the field read the same as on their own** (Tag audit: cap-centred like Notion's).

Changed: nothing; the evidence supports the build.

## Motion and interaction, 2026-10-07

Contract: `docs/MOTION.md`. The list is Menu's surface and rows (enter `opacity` + `scale` 0.97 at
the field origin, exit faster; surface.css); the tags are Tag's.

| Interaction | Before | After |
|---|---|---|
| Field hover edge | in and out: `--area-transition`, fast 100, ease-out | in: instant (`:hover` 0s, under `hover: hover`); out: fast, ease-out |
| Focus (edge, halo, outline) | edge and halo (`box-shadow`) faded in and out over fast | instant: `:focus-within` 0s and `box-shadow` left out of the field's `transition-property` |
| Open (focus edge) | eased | instant (`[data-open]` 0s) |
| A tag chosen (pointer, Enter, Create) | popped in | fades in: `opacity` 0 → 1 on fast (100), ease-out, by `@starting-style`, only while focus is in the field, so tags present on load never animate |
| A tag removed (×, Backspace) | removed at once | unchanged (Notion's are instant; an exit would need React to keep the node) |
| Field growing onto a new row | jumps | unchanged (a height animation is layout motion; MOTION.md animates transforms and opacity only) |
| List content during the exit | closing cleared the search, which re-listed every option while the list faded | the list keeps the rows it last showed until hidden (`TagPicker.tsx`, `shownRows`) |

Crispness: the new tag fades without `scale` (scaling would soften its text, MOTION.md rule 6) and
ends at opacity 1 with no transform. Checked in the browser: a chosen tag runs one 100ms opacity
transition and the tags already there run none; Escape after typing "wo" keeps the 2 filtered rows
in the closing list, and reopening shows all 4.

## Verification

Builds, manifest parity, typecheck pass. Browser (Review page): "wo" + Enter adds work; typing
"Ideas" offers Create, Enter creates and adds it; Backspace removes it and announces "Ideas
removed"; chosen rows show the check. Dark and compact checked on the Review page 2026-10-06 (compact field 28). Unverified: screen reader, RTL.

## Settled questions

1. **Tags at radius 4, not pills** (2026-10-06, by Tag): Notion, Chakra, Fluent, Atlassian all 4; only
   GitHub and Mantine are pills. Owner 2026-10-08 asked whether the corner is right: yes, 20 × 0.25 =
   5 → even 4 (`tag.md`, Owner decisions).
2. **Chosen rows keep the check** (owner 2026-10-08, "go with your recs"). Notion keeps chosen rows
   unmarked and Fluent removes them; Area keeps the row and its check because Enter toggles a row, so
   the row has to show its state, and keeping it (unlike Fluent) is what lets Enter remove it.
   Unchanged (`tag-picker.css`, `[aria-selected="false"] > .area-menu__check` hidden).
3. **A chosen tag fades in, opacity only** (owner 2026-10-08, "go with your recs"). 100ms on fast
   ease-out, no scale (a scale softens 14px text mid-flight and reads as play at this size), not
   instant like Notion's. Unchanged.

## Open questions

None.

## Review note, 2026-10-16 (round 30)

- **What changed:** in dark, the coloured tags inside the field lighten their labels a little more than tags on a
  card do, on the lightest dark grounds only. Nothing changes at the defaults or in light.
- **Why:** the field's fill is lighter than a card, and a tag's plate is see-through, so caution fell to 4.14:1 in a
  soft field at dark ground 24 + layers 8. Look at **Lightest dark**.

## Feedback log

- 2026-10-05 · batch 1, second component → built from Notion's select property editor on Input's
  chrome, Badge tags and Menu rows; on the Review page, in review.
- 2026-10-06 · owner: the tags look wrong → the field and list now hold Tag (new component, `tag.md`)
  instead of Badge: 20 tall, 14 regular, Notion's palette, radius 4 (no longer a pill), muted × with a
  concentric hover plate. Open question 1 (pill or radius 4) is settled by Tag: radius 4.
- 2026-10-06 · owner: colours washed and pixelated, lighter background for a more vibrant foreground →
  Tag's tones redone (pale even tints, tone inks; `tag.md` second round) and the × drawn at its 12px
  line; the field and list take them unchanged.
- 2026-10-07 · lead: Claude in Chrome audit (Notion Status editor, Fluent TagPicker, Mantine TagsInput, Ant
  Select tags) → field height, tag size per tier and tag gap confirmed; chosen-row treatment differs across
  products (open question 2, recommendation: keep the check). No code change.
- 2026-10-07 · owner: make interactions professional, intentional, subtle; components look pixelated → motion pass: field hover, focus and open land at once and fade out on fast ease-out; the focus halo no longer fades; a chosen tag fades in over 100ms; the closing list keeps its rows. "Motion and interaction, 2026-10-07".
- 2026-10-08 · owner component review: hard-to-read × hover plate → fixed in Tag (deeper light inks,
  calmer dark green/yellow; lead); × on plate verified ≥ 4.5 in this field (light 4.72-5.13); recs
  taken: check on chosen rows kept, opacity-only fade kept. Stays in review.
- 2026-10-08 · owner: approved on the component review page (re-review after the requested changes).
- 2026-10-09 · owner went with Scroll area's recommendation to adopt it in the scrolling families (docs/specs/scroll-area.md, "Adoption") → the scroll container is a Scroll area: Figma's overlay bar instead of the platform's, its inset moved into the scroller so rows keep their place → back in review.
- 2026-10-15 · owner: "merge it, then continue working" → boundary sweep under increased contrast (CONTRAST.md: required boundaries target 3:1): the soft variant's resting edge is `input-edge-soft`, as Input's (now 3.79:1 light, 5.49:1 dark).
- 2026-10-16 · owner: "go with your recs, fix them in that order" (after the Layers sweep, docs/research/layers-2026-10-16/sweep/README.md) → tags in the field take Tag's field lift (`--_lift: var(--area-layer-dark-tint-lift-fill)`, tag.css): in dark their labels sit on the field's fill, lighter than a card, so caution fell to 4.14:1 in a soft field at ground 24 + layers 8. Defaults unchanged.
- 2026-10-23 · owner, 2026-10-23: "is it supposed to be much rounder than the actual input? im okay with it being a bit rounder but it seems drastic" → a list opened from a field takes the field's corner (surface.css, "A list opened from a field"; navigation.css for Select's picker): rows at the field's corner, the list 4 rounder (or, below a 4 corner, the rows' own corner more), rows short of a pill before Pill. Default: sm 6 → list 10 / rows 6 (Notion's field 6, menu 10, rows 6; was 12 / 8, twice the field), md 8 → 12 / 8 (unchanged), lg 10 → 14 / 10. Menus and Context menus keep 12 / 8. Swept every size × Radius 0–14 and Pill × density 28/32/36 × pill fields: Select, Custom select, Combobox and Tag picker agree at every combination.
- 2026-10-23 · owner: "make sure all inset corner radius pairings are not broken" → corner audit (every family, default settings): tags in the field nest in its corner (see Spacing audit); swept Radius 0–14 and Pill.
- 2026-11-14 · plan B7.8, B7.10 → disabled and read-only are the field shell's disabled and read-only recipe (input.css): this family's own copies are removed. Read-only now rests one fill step deeper than editable (outline on the soft fill, soft on its hover step). A tag in a disabled field dims by opacity, as marks do. Why: docs/research/system-evaluation-2026-11-11 (README §5, phase2/disabled.md); the owner took every recommendation on 2026-11-11.

## Spacing audit (2026-10-17)

Fixed 2026-10-23 (owner: "make sure all inset corner radius pairings are not broken"): tags in the field take the nested-corner rule, the field's corner less their inset, floored at min(radius-floor, their own) and rounded to even (`--_field-corner`, `--_tag-inset` on the picker; Tag's `--_corner`, tag-picker.css): 4 at every size by default (lg was 6 in the field's 10 at 7 in), 8 at Radius 14, pills in a pill field; the remove button follows the tag's corner. Was open: at lg the md Tags kept their own radius 6. Measured in `docs/research/spacing-2026-10-17/` (Before / After: https://claude.ai/artifact/JtDZ9LNfutFyfdkGUvQzL2).

## Review note, 2026-10-26 (interaction pass)

- **What changed:** A chosen row's check fades and grows in as Menu's does.
- **Why:** One rule for a check in a list. You asked for the Slider's motion and detail pass on every component; measured across all 118 families ([the pass](../research/interaction-pass-2026-10-26/README.md)).

### 2026-11-07 · Success and warning; read-only paint; the open state (components audit O1, O3)

- **What changed:** `validationStatus` and a Field's status paint the field as Input's; read-only now carries `data-read-only` (no hover edge, default cursor); `open` / `defaultOpen` / `onOpenChange` control the list.
- **Why:** TagPicker.tsx:40 (invalid only), :24-42 (no open-state API). From the components audit's internal peer comparison (`docs/research/components-audit-2026-11-07/internal.md`); the owner took every recommendation ("Take all recs", 2026-11-07).
- **Verdict:** awaiting the owner.

### 2026-11-07 · One announcer (components audit D1)

The hidden status span is replaced by `announce` (`announce` / `useAnnouncement` (packages/react/src/components/announce.ts; DESIGN_SYSTEM.md, "Announcements")). No visible change.
- 2026-11-11 · system evaluation B2.3 and A11.1 · the list floor is 160 (was 224); the empty line's side rounds to a whole pixel, 10 (was 10.38).

## Review note, 2026-11-11 (focus and targets, plan A6, A11.2)

- **What changed:** The field's ring takes `focus-offset` as every field (A6.2, S12); forced colours restore Highlight focus (A6.4).
- **Why:** the system evaluation's focus, forced colours and hit target items (docs/research/system-evaluation-2026-11-11, section 5), owner-approved 2026-11-11; the rules are in DESIGN_SYSTEM.md ("The focus ring", "Targets") and CONTRAST.md (Focus).
- 2026-11-14 · system evaluation B2.6 (hand-over) and B6.3 · the empty line is Menu's shared `.area-menu__empty` (a row tall, its text on the 8 glyph edge; was its own line 10 in) and the part `empty` leaves the manifest; the list's corner follows its rows by the one overlay corner equation (popup.css), unchanged at every setting.

### 2026-11-14 · One field shell (system plan, Phase 2, B3)

- The field is the one field shell; the tag's nested corner reads the shell's `--_field-shape` (computed on the root too, so a tag in the list nests the same). No visible change. The list's own empty line is the popups worker's.
- Why: docs/research/system-evaluation-2026-11-11 (B3.1, B3.2, B3.3, B2.2 in fields; README §5); the owner took every recommendation on 2026-11-11 and the 24 targets on 2026-11-13. B3.2: field text stays on Button's inset (Keep 10, the pick), so nothing moved.
- Verdict: awaiting the owner.

### 2026-11-14 · Shared parts, leftovers (system plan, Phase 2, wave 3)

- Listed, not moved: the Create row's gap 6 (the row role is 8 at the default).
- Why: docs/research/system-evaluation-2026-11-11 (plan B6.1, B6.5, B8.2, B2.2; README §5, phase2/leftovers.md); the owner took every recommendation on 2026-11-11. Fix the rule, not the instance.
- Verdict: awaiting the owner.

## Behaviour engine (plan C2.3), 2026-11-15
- Tags reached with ← from the empty field, not Tab; Backspace / Delete on a focused tag removes it; Tag's `onDismiss` / `dismissLabel` replace the deprecated `onRemove` / `removeLabel`.

## System status step C, 2026-11-18 (shared sources)

Its density holdout took `gap-md`; off the waiting list. Nothing moved at the defaults.
