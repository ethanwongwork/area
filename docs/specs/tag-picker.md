# Tag picker spec

**Status:** complete · 2026-10-08 (owner approved on the component review page after the requested changes)
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
  setting drops it (`data-area-pills`, owner 2026-10-04); Menu's rows.

## Job and boundaries

Choose several values from a list that can grow: the chosen ones sit in the field as coloured
tags, typing filters the list, and text that matches nothing can become a new tag. Not Combobox
(one value), not Custom select (one value, fixed list), not a Chip group (filters shown all at
once, toggled in place).

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| variant | outline (default), soft | Input's field chrome | Notion's editor field is soft (rgba(242,241,238,.6)) |
| size | sm, md (default), lg | Control tiers; tags Badge sm (20) up to md, Badge md at lg | Notion tags 20 |
| content | tag tone per option | Notion's tag colours | `notion--select-property-editor--open--light` nodes 36, 53, 70, 87 |
| behavior | create (`onCreate`) | Notion "Select an option or create one" | same capture, node 22 |
| state | open, placeholder, disabled, invalid | Input's states | — |
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
    Badge (soft, tone, dismiss) × n                 the tags
    input.__input[role=combobox]                    the text
  input[type=hidden] × n                            form values
  listbox div.area-menu.__listbox[popover][aria-multiselectable]
    hint  div.area-menu__label.__hint
    option div.area-menu__item.__option[role=option]: Badge + check
    create div.area-menu__item.__create: "Create" + Badge
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
| tag | Badge soft, size sm (20), tone per option, dismiss × | Notion tags 20 (Badge spec measured Notion's tags) | Badge is a pill by the theme's Pills setting; Notion's are radius 4 (set `data-area-pills` without badge to get corners) |
| tag gap | 6 | Notion (node 9: gap 6) | — |
| tag inset | (height − tag) / 2 − border | Equal insets (owner 2026-10-01) | Notion 4 + 5.25 / 8 |
| list | Menu surface and rows; Combobox placement | Peer: Combobox | Notion opens the editor over the cell |
| hint | Menu label, "Select a tag or create one" | Notion (node 22) | Notion 500 weight; Menu labels are regular |
| option row | Badge + check at the end | Peer: Custom select (S13 C) | Notion has no check (the chosen tags are in the field); drag and "…" excluded |
| create row | "Create" + the tag it would make | Notion; Combobox's create row | — |
| removal | Backspace in an empty field; the tag's × | Notion; Badge dismiss | — |

## States

| State | Change | Evidence |
|---|---|---|
| focus / open | field focus ring and edge; `data-open` | Input |
| highlighted row | `bg-component-hover` | Menu; Notion hover capture (row plate) |
| chosen row | check | Custom select |
| disabled | Input's disabled fill; tags dimmed, no ×; list never opens | Input, Badge |
| invalid | `input-invalid-color` edge and ring | Input |

## Behavior and accessibility

`input role=combobox aria-autocomplete=list aria-expanded aria-controls aria-activedescendant`;
the listbox is `aria-multiselectable`, options carry `aria-selected`. Typing filters (case-insensitive
contains) and highlights the first row; ↑/↓ move (wrapping, disabled rows skipped); Enter adds or
removes the highlighted tag and keeps the list open, clearing a search; Backspace in an empty
field removes the last tag; Escape closes; blur closes and clears the text. Each change is
announced in a status region ("work added", "Ideas removed"). Each tag's × is a button named
"Remove <tag>". `name` submits one hidden input per value; form reset restores `defaultValue`.

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

## Spacing audit (2026-10-17)

Open: at lg the md Tags keep their own radius 6 inside the field's 10 at a 7 inset; the nested-corner rule gives 4. Fixing it needs the field's corner and inset as properties the Tag can read. Measured in `docs/research/spacing-2026-10-17/` (Before / After: https://claude.ai/artifact/JtDZ9LNfutFyfdkGUvQzL2).
