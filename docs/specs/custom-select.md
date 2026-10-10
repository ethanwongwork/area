# Custom select spec

**Status:** complete · 2026-10-08 (owner approved on the component review page; recommendations accepted)
**Captures:** `docs/research/captures/custom-select/` (13 Notion, 10 ChatGPT, 14 Area)
**Peers:** Select (native single choice; same field chrome), Combobox (same listbox rows), Menu
(rows, labels, separators, lift), ModelPicker (a trigger over rich rows), Button ghost (the ghost
trigger's paint), Popover (anchoring)

## Owner decisions

- 2026-10-04: batch 1 of new components (owner pick): Custom Select, Tag picker, Date picker,
  Drawer and confirm dialog. Custom Select reference: "Notion's and Figma's dropdowns: rows with
  icons, checks and descriptions"; reuses the Combobox listbox, Menu rows and the overlay
  (`REVIEW_BATCHES`, `component-status.mjs`).
- Inherited: Neutral by default (2026-09-26); Menu's row, surface and separator values
  (menu.md, owner-approved). *A value picker showing its value with the active plate and the
  check (audit S13 C, owner 2026-09-30) is superseded by the 2026-10-08 decision below.*
- owner 2026-10-08: approved, recommendations accepted ("go with your recs for open
  questions"). Q3: the chosen row shows the trailing check alone, in Select, Combobox and Custom
  select (the plate means highlight only). Q4: a field's chevron ends at the row inset, 8 (inset
  contract). Q5: field chevrons take `input-chevron` (`stroke-control`). Q6: list stays
  start-aligned. Q7: chevrons stay still. Q1–Q2 carried no recommendation and stay open.

## Job and boundaries

Pick one value from a short, fixed list whose options need more than text: a leading icon, a
line of description under the label, a check on the chosen row, groups. The trigger is a button
showing the current value; the popup is a listbox. Not Select (a native `<select>`: plain text
options, platform picker where `base-select` is missing), not Combobox (typing filters the
list), not Menu (commands, no value), not ModelPicker (a composer recipe that could sit on this).

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| variant | outline (default), soft | Field chrome shared with Select, Input and NumberField | Select's variants; Figma's soft inspector fields |
| variant | ghost | An inline value with no chrome until hovered | Notion Share popover access selects (`notion--*-trigger--rest--light`) |
| size | sm, md (default), lg | Control tiers, as Select | Notion 28 (sm), Area fields 32 |
| content | option icon (also shown in the trigger), description | The reason this exists beside Select | Notion general access (icons), member access (descriptions) |
| composition | groups (label, ruled apart) | Notion's access menu: "Current access" / "User access", 1px rules | `notion--member-access-menu--open--light` |
| state | open, placeholder, disabled, disabled option, invalid | WAI; Select's states | — |
| boolean | fullWidth | Layout | — |

Excluded: an open-on-load tile (the list lives in the top layer and would float over the
gallery; the Review page opens it on click); multiple selection (Tag picker, next in the batch).

## Sources

| Id | Type | What | Link / path | Captures |
|---|---|---|---|---|
| notion | target product (primary: lists) | Share popover: member access menu (group labels, title + description rows, trailing check, separator, danger row), general access menu (icon rows, check), both triggers | app.notion.com, owner's page, Share popover, read-only (opened only, nothing chosen), 2026-10-04 | `notion--member-access-menu--{open,hover}--light`, `notion--share-general-access--{open,hover}--light`, `notion--{member,general}-access-trigger--rest--light` |
| notion-settings | target product | Settings > Preferences > Theme select (bordered 28 trigger, check-only menu) and database view settings > Layout > Card size menu | app.notion.com, opened and Escaped only, 2026-10-07, browser zoom 90% (dpr 1.8) | `notion--settings-theme-trigger--{rest,hover,open,focus-visible}--light`, `notion--settings-theme-menu--open--light`, `notion--card-size-{trigger--rest,menu--open}--light` |
| chatgpt | target product | Settings > General > Language (soft pill 36, searchable list), Settings > Appearance theme (icon trigger, radio menu) and accent (28 pill) selects, composer model picker (ghost 36, title + description rows) | chatgpt.com/settings, chatgpt.com, opened and Escaped only, 2026-10-07, dpr 1.8 | `chatgpt--settings-language-{trigger--rest,trigger--hover,trigger--open,menu--open}--light`, `chatgpt--settings-{theme,accent}-trigger--rest--light`, `chatgpt--settings-theme-menu--open--light`, `chatgpt--model-picker-{trigger--rest,trigger--open,menu--open}--light` |
| figma | target product (primary: inspector) | Colour-model select menu: 24 rows, 16 check before the label | earlier ColorPicker pass | `color-picker/figma--format-menu--open--light` |
| uui | design system (source) | Select popover: 4 offset, trigger width, rows inset 4–6, check at end | `untitled-ui-reference.md`, pinned `4702dc0` | source only |
| wai | pattern | Select-only combobox | w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-select-only/ | — |
| area | peers | Select trigger, Menu rows, Combobox listbox | `select/area--*`, menu.md, combobox.md | `area--*` (this folder) |

ChatGPT's settings selects were not opened this pass (a choice would change a setting). Notion's
hover capture records no row fill: the hover paint transitions and was read before it landed;
Menu's measured Notion hover (menu.md) stands for it. Notion dark not captured (needs a theme
change on the owner's account).

## Anatomy

```
notion (member access menu)
shell      div  radius 10, white, 3-layer shadow incl. 1px ring; no padding
  section  div  padding 4 (6 4 4 4 after a rule), gap 1
    label  div  12/14.4 500 rgb(125,122,117), 8 sides, 6 above
    rule   div  1px rgba(42,28,0,.07), 12 in from each side
    row    div  radius 6; padding 4 8 (two lines, 45) or 0 8 (one line, 28); gap 8
      lines  title 14/16.8, description 12 rgb(125,122,117), 2 apart
      check  svg 16, 8 from the end, top-aligned with the title (7 from the row top)
notion (trigger)
shell      div  28, radius 6, padding 0 8 (6 start beside nothing), no fill or edge; gap 4
  value    14/16.8 ink rgb(44,44,43) (general) / rgb(125,122,117) (member)
  chevron  16 viewBox at 14–16, rgb(142,139,134)
```

Area:

```
root      div.area-custom-select[data-open]        owns: variant/size locals, layout
  trigger button.__trigger[role=combobox]          owns: height, edge, radius, fill, focus, sides (inset.css)
    icon     span.__icon      square --_icon (only when the chosen option has one)
    value    span.__value     truncation; [data-placeholder] ink
    chevron  span.__chevron   square --_icon, input-chevron ink
  input[type=hidden]          form value
  listbox  div.area-menu.__listbox[popover]        Menu's surface; overlay engine places it
    group  div.__group[role=group] > div.area-menu__label
    rule   div.area-menu__separator.__separator    between groups
    option div.area-menu__item.__option[role=option]  Menu's row; data-selected plate
      icon / text or lines(text + description) / check
```

Inset equations (md 32, border 1): value start = round((32 − 1cap) / 2 − 1) = 10 (cap 9.94);
with an icon, (32 − 16) / 2 − 1 = 7; chevron end = (32 − 16) / 2 − 1 = 7, so its square sits 8
from the outer edge (`area--default--rest--light` chevron edge 8, `area--icons` icon edge 8).
sm 28: 8 / 5; lg 40: 14 / 11. Rows: Menu's (inset.css).

## Measurements

Triggers (`node scripts/capture-compare.mjs` over the trigger files):

| slot · property | notion · member-access-trigger | notion · general-access-trigger | area · variant-ghost (sm) | area · default (md) | area · size-sm |
|---|---|---|---|---|---|
| **shell** size | 105.43 × 27.99 | 158 × 27.99 | 108.5 × 28 | 240 × 32 | 240 × 28 |
| **shell** padding | 0 8 0 8 | 6 8 6 6 | 0 5 0 8 | 0 7 0 10 | 0 5 0 8 |
| **shell** border | 0 | 0 | 1 transparent | 1 #e2 | 1 #e2 |
| **shell** radius | 6px | 6px | 6px | 8px | 6px |
| **shell** gap | — | 4px | 6px | 6px | 6px |
| **shell** font | 14/16.8 400 | 14/16.8 400 | 14/20 400 Geist | 14/20 400 Geist | 14/20 400 Geist |
| **shell** color | rgb(125, 122, 117) | rgb(44, 44, 43) | rgb(40, 40, 40) | rgb(40, 40, 40) | rgb(40, 40, 40) |
| **text** edge from shell (start) | 8 | 6 | 9 | 11 | 9 |
| **chevron** size · edge from end | 13.99 · 7.99 | 16 · 7.99 | 16 · 6 | 16 · 8 | 16 · 6 |

Area across variants and states:

| slot · property | default | soft | ghost | sm | lg | icons | disabled | invalid |
|---|---|---|---|---|---|---|---|---|
| **shell** size | 240 × 32 | 240 × 32 | 108.5 × 28 | 240 × 28 | 240 × 40 | 240 × 32 | 240 × 32 | 240 × 32 |
| **shell** padding | 0 7 0 10 | 0 7 0 10 | 0 5 0 8 | 0 5 0 8 | 0 11 0 14 | 0 7 0 7 | 0 7 0 10 | 0 7 0 10 |
| **shell** border | 1 #e2 | 1 transparent | 1 transparent | 1 #e2 | 1 #e2 | 1 #e2 | 1 #e2 | 1 rgb(232, 9, 69) |
| **shell** radius | 8px | 8px | 6px | 6px | 10px | 8px | 8px | 8px |
| **shell** background | #fff | #f7 | — | #fff | #fff | #fff | #f7 | #fff |
| **shell** color | #28 | #28 | #28 | #28 | #28 | #28 | rgb(164, 164, 164) | #28 |

Select's own trigger (`select/area--default--rest--light`, 2026-09-28): 8 r8, #e2 edge, text at
10, chevron square 8 from the end; the same today (its 8 text gap is now `gap-md` 6, as here).

Lists:

| slot · property | notion · member-access-menu | area · default-list | notion · general-access | area · icons-list |
|---|---|---|---|---|
| **shell** padding / border | 0 / 0 (ring in the shadow) | 4 / 1 #f3 | 0 / 0 | 4 / 1 #f3 |
| **shell** radius | 10px | 12px | 10px | 12px |
| **shell** gap | 1 | 2 | 1 | 2 |
| **shell** shadow | 0 20 24 .05, 0 5 8 .027, ring 1 .07 | 0 20 24 .06, 0 5 8 .03 | same as left | same as left |
| two-line row | 45–47 tall, padding 4 8, r6 | 46.5 tall, padding 6 8, r8 | — | — |
| one-line row | 28, padding 0 8, r6 | 32 (Menu row) | 30 (28 + 2) | 32 |
| row gap (icon → text) | 8 | 12 (Menu's list column) | 8 | 12 |
| selected row | check only | `bg-component-active` plate + check | check only | plate + check |

Area's list captures were taken mid-entry (Menu's 0.96 → 1 scale), so its sizes carry the
transform; the values above are the CSS values (Menu, menu.md). The Area selected-row plate in
these captures predates the 2026-10-08 decision (check only now; Decisions).

## Decisions

| Slot · property | Area value | Basis | Reason when it differs from the basis |
|---|---|---|---|
| trigger chrome (outline, soft) | Select's: `select-bg`, `select-edge`, control tiers 28 / 32 / 40, per-tier radius, field focus ring (`custom-select.css`, trigger block) | Peer: Select (owner-approved) | — |
| trigger sides | inset contract: cap-centred start (icon square with an icon); the end is the field chevron inset, max(row inset 8, the chevron centred in its square) less the border: the glyph sits 8 from the edge at sm/md (default and compact), 12 at default lg (`inset.css`, field chevron rule) | References: Notion 8–8.55 at 28, ChatGPT 9 at 28, shadcn 9 at 32 (2026-10-07 audit); owner 2026-10-08 (Q4) | Was the centred square: 6 at 28, 8 at 32 (4 at compact 24) |
| ghost trigger | no fill or edge; `bg-component-hover` under the pointer; `bg-component-active` while open; width of its value | Notion inline select (28, r6, no chrome) for shape; Button neutral ghost for paint | Notion's open trigger shows its focus ring (blue halo); Area keeps one open treatment for menu triggers (button.css, audit G-12) |
| text → chevron gap | `gap` tier (6 md) | Peer: Select | Notion 4 |
| value ink | `select-text` (fg-default) | Notion general access (#2c) | Notion's member access value is muted; one ink for a chosen value |
| chevron | 16 `chevron-down` glyph, `input-chevron` ink (= `stroke-control`: rgb(131) light, rgb(147) dark) | Notion rgb(142,139,134), ChatGPT rgb(143); owner 2026-10-08 (Q5) | A step darker than the references: `stroke-control` is the lightest neutral the contrast gate holds to 3:1 on every field fill and plate (white 3.8, #f7 3.6, #f3 3.4, #ee 3.3; dark #1d 5.5 … #3f 3.4). Was `input-icon` #666 |
| open trigger (outline, soft) | holds the hover edge (`--_border-hover`) and fill while the list shows; the focus edge and ring only on `:focus-visible` (keyboard) | Notion settings select (hover paint held open, ring only after keyboard return); ChatGPT settings select (edge unchanged open); peer Select (native: pointer open shows no ring) | Was Combobox's focused edge until 2026-10-07: Combobox's input really has focus; this trigger is a button |
| list surface | Menu: radius-list 12, 4 padding, 1px decorative edge, float shadow | Peer: Menu (owner-approved, measured from Notion) | Notion 10 radius, no padding; menu.md records the step |
| rows | Menu rows: 32, 8 sides, r8, 12 icon gap, 14/20 | Peer: Menu / Combobox | Notion 28, r6, 8 gap |
| description rows | Menu's two-line row: 6 above and below, 12/16 muted | Peer: Menu (ChatGPT model list) | Notion 4 above and below, 2 between lines |
| chosen row | 16 check at the end, no plate; the hover plate when highlighted | Notion (theme, card size, share menus), ChatGPT (theme, language, model picker): check only; owner 2026-10-08 (Q3) | — (was `bg-component-active` plate + check, audit S13 C) |
| check on two-line rows | centred in the row | Peer: Menu's description row | Notion aligns it with the title; see Open questions |
| group label | Menu label: 12/16 muted, row pitch | Peer: Menu (one label pattern) | Notion 12/14.4 500 |
| group rule | Menu separator, between groups only | Notion (rule between sections) | Combobox groups have no rule |
| list placement | overlay engine: 4 below, flips, ≥ trigger width and 224, ≤ 324 tall | Peer: Combobox | — |

## States

| State | Slot · property changes | Evidence |
|---|---|---|
| hover (trigger) | outline/soft: edge `select-edge-hover`; ghost: `bg-component-hover` plate | Select; Button ghost |
| focus-visible | field focus ring (outline + halo) | Select |
| open | `data-open` on the root; field holds the hover edge (focus edge + ring when keyboard-focused), ghost pressed plate | Notion / ChatGPT settings selects (2026-10-07); button.css |
| highlighted row | `bg-component-hover` (pointer or keyboard) | Menu |
| selected row | trailing check (`aria-selected="true"`); no plate (owner 2026-10-08, Q3) | Notion, ChatGPT lists |
| placeholder | `input-placeholder` ink | Select (audit B-19) |
| disabled | Select's disabled paint; ghost: no plate, disabled ink | Select |
| disabled option | Menu's 50% row, skipped by arrows and typeahead | Menu, Combobox |
| invalid | `select-invalid-color` edge and ring | Select |

## Behavior and accessibility

WAI select-only combobox (`CustomSelect.tsx`): `button role=combobox aria-haspopup=listbox
aria-expanded aria-controls aria-activedescendant`; the listbox is named by the consumer's
`aria-label` (else `aria-labelledby`); groups are `role=group` named by their label. Focus stays
on the trigger. Closed: Enter, Space, ↓, ↑ open on the chosen row (↑ on the last when nothing is
chosen); Home / End open on the first / last; a letter opens on the next label starting with it.
Open: ↑/↓ move (clamped, disabled rows skipped), Home / End, Page Up / Down by 10, Enter and Space
choose and close, Tab chooses and moves on, Alt+↑ chooses and closes, Escape closes; typing within
half a second searches as one string, a repeated letter cycles. Clicking a row chooses it and
returns focus to the trigger; blur closes. `name` submits the value through a hidden input; an
uncontrolled select restores `defaultValue` on form reset. Forced colours: Menu's rules.

## Visual pass

2026-10-04, Review page at 1:1, light and dark: the default and soft triggers read as Select
beside it; the list is Menu's (description rows, plate + check on the chosen row, labels and a
rule between groups); the ghost trigger in dark shows the pressed plate while open. Against
Notion's captures (not yet a side-by-side screenshot): same anatomy (label over muted description, trailing check, group
labels, a rule between sections); Area is a step roomier (32 rows, 12 corners), as Menu is.
Compact checked 2026-10-06 (trigger 28, rows 24, dark). Not yet: Figma side by side, forced colours.

### Claude in Chrome audit, 2026-10-07

Sources (all light; dark not captured: both products follow the owner's theme setting, which is
not changed): Notion Settings > Preferences > Theme select and database view settings > Layout >
Card size menu (app.notion.com); ChatGPT Settings > General > Language, Settings > Appearance theme
and accent selects (chatgpt.com/settings), composer model picker (chatgpt.com). Every list was
opened and closed with Escape; nothing chosen, values re-read unchanged. Both products ran at
browser zoom 90% (dpr 1.8): CSS lengths are unaffected, the 0.56 Notion edge is a device hairline.
shadcn Select (ui.shadcn.com/docs/components/base/select) read from computed styles only (no capture:
the page stopped responding to the extension); Base UI's demo would not open (clicks did not reach
the background window); Figma not visited (no file already open).

Triggers (`capture-compare.mjs` over the rest captures; shadcn computed):

| slot · property | notion · settings 28 | notion · share ghost 28 | chatgpt · accent 28 | chatgpt · language 36 | chatgpt · model picker 36 (ghost) | shadcn 32 | area · ghost sm 28 | area · outline md 32 |
|---|---|---|---|---|---|---|---|---|
| shell padding | 0 8 | 0 8 | 0 8 | 0 12 | 0 14 0 12 | 8 8 8 10 | 0 5 0 8 | 0 7 0 10 |
| edge / fill | 0.56 rgba(28,19,1,.11) / none | none | 1 rgba(0,0,0,.1) / #fc | hairline .1 / #f3 | none | 1 lab(90.95 0 0) / none | 1 transparent | 1 #e2 / #fff |
| radius | 6 | 6 | pill | pill | pill | 10 | 6 | 8 |
| text · gap to chevron | 14/16.8 500 · 6 | 14/16.8 400 · 4 | 12/16 · 4 | 14/18 · 4 | 16/26 · 6 | 14/20 · 6 | 14/20 · 6 | 14/20 · 6 |
| chevron size · end inset | 16 tall · 8.55 | 14–16 · 8 | 16 · 9 | 16 · 12.55 | 16 · 14 | 16 · 9 | 16 · 6 | 16 · 8 |
| chevron ink | rgb(142,139,134) | rgb(142,139,134) | rgb(143) | rgb(143) | rgb(143) | lab(48.5 0 0) (muted fg) | #666 (`input-icon`) | #666 |
| hover | plate rgba(33,27,23,.05), edge kept | — | — | no change read (see below) | — | — | plate | edge `select-edge-hover` |
| open | hover plate held, edge kept, no ring | — | — | fill .05, edge kept | plate .05 | — | pressed plate | **was** focus edge #004cb0 |
| keyboard focus | 2 + 2px blue ring (after Escape) | — | — | — | — | — | field ring | field ring |

Lists:

| slot · property | notion · theme / card size | chatgpt · theme / language | chatgpt · model picker | shadcn | area |
|---|---|---|---|---|---|
| surface | 250 wide, r10, 0 padding, rows inset 4, 3-layer shadow incl. 1px ring | 240 wide, r16, 10 padding, 0.5px ring + 8 16 −4 shadow, 90% white | 254, r16, rows inset 4 | r10, 1px ring, min 144 | ≥ trigger and 224, r12, 4 padding, 1px edge, float shadow |
| offset · alignment | 4 below | 2 + 1 below, end-aligned to the trigger | 5 below | — | 4 below, start-aligned |
| row | 28, padding 0 8, r6, gap 8 | 36, padding 6 10, r12 | 36 (46 with description 12/14 muted), r12 | 28 (4 32 4 6), r8 | 32, r8 (46.5 with description) |
| chosen row | trailing 16 check 8 from the row end, **no plate** | trailing check 10 from the row end, **no plate** | trailing 16 check 10 from the end, **no plate** | trailing 16 check 8 from the end | `bg-component-active` plate + trailing 16 check |
| initial highlight | first row (Card size) / none | first row (cmdk) | none | — | the chosen row (WAI) |
| max height | — | 410 popover, 320 scrolling list | — | — | 324 |
| group label | (share menu: 12/14.4 500 muted) | — | — | 12/16 muted, padding 4 6 | Menu label 12/16 |

Findings, by severity:

1. **Open outline/soft trigger painted the focus colour (#004cb0) on pointer open.** Neither product
   recolours a field when its list opens (Notion holds the hover plate, ChatGPT the fill), and
   Select's native trigger shows no ring for a pointer open. Fixed (below).
2. **Chosen row: all six product lists mark it with the check alone; Area adds the active plate.**
   Owner decision S13 C stands; raised again as an open question with this count.
3. **Chevron end inset is tighter than every reference at the same height:** 28 → Notion 8–8.55,
   ChatGPT 9, Area 6; 32 → shadcn 9, Area 8. Area's comes from the inset contract (chevron square
   centred: (h − 16) / 2), shared with Select, Date picker and Combobox. Open question.
4. **Chevron ink is a step darker than the references:** #666 vs Notion rgb(142,139,134) and
   ChatGPT rgb(143). Shared `input-icon` role (Select, Combobox, Input icons). Open question.
5. List geometry (row 32 / r8 / r12 surface, 4 offset, 224 minimum) sits between Notion (28 / r6 /
   r10) and ChatGPT (36 / r12 / r16): consistent with Menu, no change. Keyboard opening on the
   chosen row follows WAI (both products start on the first row); kept.

Changed: `custom-select.css`, open state: outline and soft triggers hold their hover edge
(`--_border-hover`) and fill while open; the focus edge and ring appear only under
`:focus-visible` (a keyboard open keeps them). Ghost unchanged (pressed plate). Verified on
`/custom-select.html` (computed, transitions finished): pointer open edge
`color(srgb .83 .83 .83)` (= `select-edge-hover` #d4), ghost plate rgb(238); keyboard open (↓)
edge and outline rgb(0,76,176) with the 2px halo. No new Area capture saved (the clipboard copy
needs a visible window).

Unverified: ChatGPT's language-trigger hover read equal to rest (rgb(243)); the window was in the
background, where transitions stall, so the hover paint may not have landed. Dark and compact
not compared against products this pass.

## Motion and interaction, 2026-10-07

Contract: `docs/MOTION.md`. The list is Menu's surface and rows, so its enter, exit and row
highlight are surface.css's; this pass changes the trigger only.

| Interaction | Before | After |
|---|---|---|
| Trigger hover (edge, ghost plate) | in and out: `--area-transition`, fast 100, ease-out | in: instant (`:hover` 0s, under `hover: hover`); out: fast, ease-out |
| Press | eased in over fast | instant (`:active` 0s) |
| Focus ring (outline + halo) | outline instant, halo (`box-shadow`) faded in and out over fast | both instant: `box-shadow` left out of the trigger's `transition-property` |
| Open (hover edge, ghost pressed plate) | eased in over fast | instant (`[data-open]` 0s); leaves on fast, ease-out |
| Disabled | no motion | unchanged |
| Chevron | static | static (open question 7) |
| List enter / exit, rows | Menu's (`opacity` + `scale` 0.97 at the trigger origin) | unchanged here (surface.css) |

Crispness: nothing on the trigger is transformed or promoted; the list ends at `scale: 1` with its
position and origin rounded by `overlay.ts`. Checked in the browser: computed transitions on the
trigger at rest and in each state, and whole-pixel trigger rects.

## Open questions

1. Check on two-line rows: Notion aligns it with the title line; Menu centres it in the row.
   Changing it would change Menu too.
2. Group rules: Notion rules sections off; Combobox's groups have none. Keep the rule here only,
   or add it to Combobox?
3. *Settled 2026-10-08 (owner: recommendations accepted).* Chosen-row plate: Notion and ChatGPT
   mark the chosen row with the trailing check only. Applied to Custom select, Select and
   Combobox together; the plate now only means keyboard/pointer highlight.
4. *Settled 2026-10-08.* Chevron end inset: the inset contract's chevron term is now the row's
   side padding (8) or the centred square where that is wider (`inset.css`, shared by Select,
   Custom select and Combobox's toggle; Date picker has no chevron).
5. *Settled 2026-10-08.* Chevron ink: field chevrons use `input-chevron` (a new public alias of
   `stroke-control`, held to 3:1 on every neutral surface and plate by the contrast gate);
   leading field icons stay on `input-icon`.
6. *Settled 2026-10-08.* List alignment: kept start-aligned (one placement rule); revisit if a
   settings-row recipe is built.
7. *Settled 2026-10-08.* Motion: the chevron stays still across Select, Custom select, Combobox
   and Date picker (as MOTION.md's chevron recipe already says for select triggers).

## Verification

`npm run build`, `npm run lint:manifest`, `npm run typecheck`, `npm test` pass. Docs build passes
(`node apps/docs/scripts/build.mjs`); the dogfood check fails on main for unrelated icon-page
inline styles. In the browser: keyboard (typeahead "c c" → Can comment, Enter chooses, End/↑
moves, Escape closes and keeps focus), groups, ghost open in dark. Unverified: screen reader
announcement, RTL, forced colours, Figma side by side.

## Feedback log

- 2026-10-04 · owner: batch 1, Custom Select first → built from Notion's Share popover menus
  (captures in this folder) on Select's chrome and Menu's rows; on the Review page, in review.
- 2026-10-07 · Claude in Chrome audit (Notion settings / card size, ChatGPT settings / model picker):
  open outline and soft triggers now hold the hover edge instead of the focus colour; chosen-row
  plate, chevron inset and chevron ink raised as open questions 3–5.
- 2026-10-07 · owner: make interactions professional, intentional, subtle; components look pixelated → motion pass: trigger hover, press, focus and open paint land at once and fade out on fast ease-out; the focus halo no longer fades. "Motion and interaction, 2026-10-07".
- 2026-10-08 · owner: approved, recommendations accepted → chosen row shows the check alone
  (`data-selected` no longer set on rows, CustomSelect.tsx / Combobox.tsx; Select's
  `option:checked` plate removed, navigation.css); field chevron end inset max(8, centred)
  (inset.css: 8 at sm/md, 12 at lg; compact 8 at every tier, was 4/6/8); chevrons in the new
  `input-chevron` token (tokens emit/base.ts → `stroke-control`, rgb(131) / rgb(147)); list
  alignment and still chevrons kept. Verified on `#component-custom-select` (computed styles and
  rects, light/dark, default/compact); `npm test` passes.
- 2026-10-09 · owner went with Scroll area's recommendation to adopt it in the scrolling families (docs/specs/scroll-area.md, "Adoption") → the scroll container is a Scroll area: Figma's overlay bar instead of the platform's, its inset moved into the scroller so rows keep their place → back in review.
