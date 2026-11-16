# Rendered review: actions and fields (37 families), 2026-11-11

Finding prefix **VA**. Rest states at the shipped defaults (type 13, density 32, radius 10), light and dark, from the
capture set described in `rendered-method.md` (headless Edge, `apps/desktop/dist` at `e915a483`, 2× PNGs).

## 1. Method and coverage

- **Numbers.** Every length, colour and offset comes from `R/out/<slug>/measure.json` (R = the session scratchpad's
  `rendered/`). I flattened each family's tiles to text (`R/review-VA/<slug>.txt`, script `R/review-VA/dump.js`) and
  ran three checks across the group:
  - `capc.js`: for every single-line text inside a control box, the cap centre's offset from the box's centre. The
    cap centre is the baseline less half the cap height. Geist at 13 measures ascent = 1.00 em (Button: text rect
    top 92.61 to its trimmed baseline 105.61) and cap = 0.71 em (Button's trimmed label content box is 9.23).
  - `choice.js`: for Checkbox, Radio and Switch, the control box against its first line.
  - A sweep for zero-size tracks or fields, truncated text and hidden specimens.
- **Pictures.** Each tile is cropped to its measured extent plus 10 px, at 2× and true scale, into per-family contact
  sheets (`R/review-VA/m/<slug>-<theme>-N.png`, script `mont.cjs`). The pictures were only for looking; I took no
  length from them.
- **Light, every tile of all 37 families viewed.**
  - The 2026-11-11 first pass covered 19 families.
  - A second pass added the other 18: alignment-picker, button-group, copy-button, filter-bar, link, selection-bar,
    zoom-control, editable-text, textarea, segmented, toggle-group, switch, radio (first page, 21 tiles), search-field,
    password-field, color-field, box-field, date-range-picker.
  - Checkbox's and Radio's second pages (media-row onward) were seen only as the tiles' first rows on page 1. Their
    measures were checked for every tile by `choice.js`.
- **Dark, all 37 families.**
  - For each family I viewed the default tile and the largest tile by painted area, the "most complex" one (sheets
    `R/review-VA/m/darkA-0/1.png`, `darkB-0.png`, `darkC-0/1.png`, script `dark2.cjs`).
  - I also viewed full dark sheets for Input and Switch.
  - Dark colours were read from `dark.*` in measure.json for every node quoted.
- **Overlays viewed:** Custom select, Combobox and Date picker open, light. Every open overlay in the group was
  measured (`open[]`).
- **Not verifiable from this set:**
  - Text inside native `<input>` and `<select>` (not in `texts`). Native Select chevron position comes from
    `inset.css:176-192`.
  - Native popups.
  - Hover and focus beyond the forced demo tiles.
  - Real-pointer behaviour.

## 2. Census

### 2a. Field shells at md (measured, light)

| Family | H | Corner | Edge (L / D) | Text start from edge | Leading icon from edge | Trailing glyph from edge | Trailing ink | Value cap vs box centre |
|---|---|---|---|---|---|---|---|---|
| Input | 30 | 8 | 0.9008 / 0.3211 | 10 | 7 | icon 7; action 22 sq. at 4, glyph 7 | 0.510 (muted) | not measurable (native) |
| Search field | 30 | 8 | same | 22 after icon (6 gap) | 7 | clear: sm 18 sq. at 4 | 0.510 | – |
| Password field | 30 | 8 | same | 10 | – | reveal 22 at 4, glyph 7 | 0.510 | – |
| Number field | 30 | 8 | same | 10 | – | steps / unit | unit 0.510 | unit −0.61 / −0.12 |
| Time field | 30 | 8 | same | 10 | – | list trigger 22 | – | −0.61 |
| Color field | 30 | 8 | same | 22 after swatch | 7 (16 swatch, r4) | – | – | – |
| Select (native) | 30 | 8 | same | 10 | – | chevron 8 (`inset.css:180`) | `input-chevron` 0.610 | – |
| Custom select | 30 | 8 | same | 10 | 7 (icon option) | chevron 8 | 0.610 | **−0.61** |
| Combobox | 30 | 8 | same | 10 | – | toggle 22 at 5, glyph 8 | 0.610 | – |
| Date / range picker | 30 | 8 | same | 22 after icon | 7 | – | icon 0.510 | **−0.61** |
| Tag picker | 30 | 8 | same | tag at 6, tag text 11, input 10 | – | – | – | tag +0.39 (mark lift) |
| Button (for comparison) | 30 | 8 | outline 0.9008 | 10 | 7 | 7 | label ink | **0.00** (cap-trimmed) |

Placeholder ink is one role (`input-placeholder` → 0.510) in every field rule (`base.css:31`, `input.css:168`,
`custom-select.css:164`, `date-picker.css:151`, `time-field.css:44`, `tag-picker.css:160`, `number-field.css:78`,
`navigation.css:723`). The render agrees: the Time field's empty segments read oklch 0.510. T19's two outliers
(Approval, Editable text) are outside these shells. The label-to-shell gap is 6 in every vertical Field (label line
74–92, shell from 98). Sizes: sm 26 (text 8 in), lg 38 (text 14 in, corner 10).

**Answer to the group question.** Every field shell agrees on height, corner, edge, inset, placeholder ink and label
gap. Two things differ:
- **Where the trailing glyph sits.** Chevrons sit 8 from the edge in `input-chevron` ink 0.610. Icons and actions sit
  7 from the edge in muted 0.510. Both are recorded owner decisions (Q4, Q5, `inset.css:176-180`,
  `custom-select.css:166`).
- **How the value text is centred.** It is not cap-centred, which is VA1.

### 2b. Choice controls against their first line (measured)

| Family | Control (md / lg) | Label gap | Cap centre vs control centre | Sizes offered |
|---|---|---|---|---|
| Checkbox | 14 / 18, corner 4 | 6 (plain), 10 (soft, media), 14 between horizontal options | 0.00 on every tile | md, lg |
| Radio | 14 / 18, round | same | 0.00 on every tile | md, lg |
| Switch | track 30×18, thumb 14 (sm 26×14, lg 34×22) | 6 | **−0.61 on every tile** | sm, md, lg |

### 2c. Tabs-like controls (md)

| | Track | Track inset / item gap | Item H | Plate | Corner (track / plate) | Label weight (on / off) | Off ink |
|---|---|---|---|---|---|---|---|
| Segmented | 0.982 + 1 px outline 7.5 % | 2 / 2 | 26 | white, edge 0.9008, Rest shadow | 8 / 6 | 500 / 500 | 0.510 |
| Toggle group soft | same | 2 / 2 | 26 | white, edge 0.9008, same shadow | 8 / 6 | icon | 0.510 |
| Toggle group outline / ghost | none (joined / 8 apart) | – / 8 | 30 | wash 0.96175 | 8 outer | icon | **0.452** |
| Tabs plate | none | – / 4 | 30 | wash 0.96175, no edge | – / 8 | **500 / 400** | 0.510 |

At the defaults, Segmented and soft Toggle group draw an identical track, plate, inset and gap. S7's split, stroke
width versus border width, only shows at Stroke 0 or 2, so it is latent. A tracked control's thumb is raised and a
trackless control's selection is a wash: that reads as one rule. What does not agree: Tabs swaps its weight
400→500 where Segmented keeps 500, and the off ink is 0.452 in the ghost and outline Toggle group but 0.510 in its
own soft variant and in Segmented (VA9).

### 2d. Button, Input and Select side by side (md)

| | H | Text x from edge | Corner | Edge | Text cap vs centre | Baseline (tile coords) |
|---|---|---|---|---|---|---|
| Button | 30 | 10 (icon 7) | 8 | outline 0.9008 | 0.00 | 105.61 |
| Input | 30 | 10 (icon 7) | 8 | 0.9008 | not measurable; same line-box layout as below | ≈105.0 (inferred) |
| Select / Custom select | 30 | 10 | 8 | 0.9008 | −0.61 | 105.00 |

They line up edge to edge and their text starts at the same x. Their baselines differ by 0.61 px, the Button lower:
about one device pixel at 2× (VA1).

## 3. Scorecard (1–5; balance, spacing, type, shape, colour, professional feel)

| Family | Bal | Sp | Type | Shape | Col | Feel | Verdict |
|---|---|---|---|---|---|---|---|
| Button | 5 | 5 | 4 | 4 | 4 | 5 | Exact cap centring and insets. Kbd's 11 px glyphs and muted ghost and outline ink are the only weak spots. |
| Button group | 5 | 5 | 4 | 5 | 4 | 4 | Joined seams and outer corners are right. Soft and outline text tiles are hard to tell apart in light; dark seams hold. |
| Split button | 4 | 4 | 5 | 4 | 4 | 4 | Matches Button. The icon-only trigger is 15 wide (G3). |
| Copy button | 5 | 5 | 5 | 5 | 4 | 5 | Plain and correct. Its field layout is the one Input group demo with a width (VA4). |
| Toolbar | 4 | 4 | 4 | 4 | 4 | 3 | Its Floating tile shows no toolbar (VA6). Surface bars at 16 corners read well in dark. |
| Zoom control | 4 | 4 | 4 | – | 4 | 4 | A ghost value-and-chevron. Menu corner 14 (VA8). |
| Alignment picker | 4 | 4 | – | 4 | 3 | 4 | Its 0.982 well nearly vanishes on the 0.98 gallery ground in light; dots are faint in dark (VA22). |
| Chip | 5 | 5 | 5 | 5 | 4 | 4 | Clean pills, cap-trimmed. The checkerboard "Image" tile reads as a placeholder. |
| Filter bar | 4 | 5 | 3 | 5 | 4 | 4 | Applied filters are pressed chips. "Label: Value" is one ink and weight, so the value doesn't lead (VA21). |
| Selection bar | 4 | 4 | 4 | 4 | 3 | 4 | Its count isn't cap-trimmed beside trimmed buttons (VA1). Danger action is pale in dark (VA15). The inline variant has no surface. |
| Kbd | 4 | 4 | 2 | 4 | 4 | 4 | Fixed 11/10 glyphs are visibly small beside 13 text in every template (T8). |
| Link | 5 | 5 | 4 | – | 4 | 4 | Underlines and wraps are clean. Red and pink inks are near twins in light. |
| Segmented | 5 | 5 | 4 | 5 | 4 | 5 | Exact. Weight 500 in muted ink (T5, recorded). |
| Toggle group | 5 | 5 | – | 5 | 3 | 5 | The off ink differs by variant (VA9). |
| Checkbox | 5 | 5 | 5 | 4 | 4 | 4 | Cap-exact on all 28 tiles. No small size (VA10). Card heights are fractional (48.61). |
| Radio | 5 | 5 | 5 | 5 | 4 | 4 | Cap-exact on all 21 tiles. |
| Switch | 3 | 4 | 4 | 5 | 4 | 4 | Label 0.61 above the track centre (VA2); sits 3 high in Setting row (VA3). |
| Slider | 4 | 4 | 4 | 3 | 4 | 3 | Seven track drawings. The vertical tile renders with a 0-tall track (VA5). |
| Input | 4 | 5 | 4 | 5 | 4 | 4 | Affix and value sit on different baselines (VA1). The phone demo reads "+1 1" (VA7). |
| Input group | 4 | 4 | 4 | 4 | 4 | 2 | Sound at its defaults, but 9 of 12 Overview tiles collapse the field (gallery cause, VA4). Seams are lighter than the edge (S16). |
| Field | 4 | 5 | 3 | 5 | 4 | 4 | Error and count at 11 beside a 12 description, about 1 px off its baseline (T1, VA12). |
| Number field | 4 | 4 | 4 | 5 | 4 | 4 | Good inspector pattern. Units are untrimmed but consistent with the value. |
| Password field | 4 | 5 | 4 | 5 | 4 | 4 | Matches Input. The empty "content-new" tile has no placeholder. |
| Search field | 4 | 5 | 4 | 5 | 4 | 4 | Its clear is the error mark `dismiss-circle`, unlike every other clear (VA18). |
| OTP field | 5 | 4 | 4 | 5 | 3 | 4 | Clean slots. Empty slots almost disappear in dark (VA22). The fixed 8 gap does not scale with size. |
| Select | 4 | 5 | 4 | 5 | 4 | 5 | Native shell matches the system. |
| Custom select | 4 | 5 | 4 | 4 | 4 | 4 | Value 0.61 high (VA1). Listbox corner 12 against menus' 14 (VA8). |
| Combobox | 4 | 5 | 4 | 4 | 4 | 4 | Its toggle sits 5 from the edge where Input actions sit 4. Matches Custom select by design. |
| Date picker | 4 | 3 | 3 | 4 | 4 | 4 | The panel has three left edges (VA11). Days are 11 (T1). |
| Date range picker | 4 | 3 | 3 | 4 | 4 | 4 | Same trigger and panel as Date picker (VA11). |
| Time field | 4 | 5 | 3 | 5 | 3 | 4 | Empty-state colon in the default ink between muted dashes (VA13). |
| Tag picker | 4 | 4 | 4 | 4 | 3 | 3 | Every demo tag is a different hue (VA14). |
| Color field | 4 | 5 | 3 | 4 | 4 | 4 | The hex shows with "#" in the single field and without it in split and alpha (VA19). |
| Box field | 4 | 4 | 4 | 5 | 4 | 5 | A convincing inspector control. The link toggle sits off the field grid at lg. |
| Editable text | 4 | 4 | 4 | 4 | 4 | 4 | Tiles change type size between demos (13 to about 20), which reads as inconsistency in the gallery. |
| Textarea | 4 | 5 | 4 | 4 | 4 | 4 | The first line matches Input's inset. The native resize grabber is drawn by the OS over the rounded corner (VA20). |
| Setting row | 3 | 4 | 4 | 5 | 4 | 4 | The Switch sits 3 above the row's centre line beside centred Selects (VA3). |

## 4. Findings, most severe first

### VA1 · inconsistency · Field values and labels are centred on their line box; actions are centred on their cap

- **Where.**
  - The cap-trim list (`inset.css:252-260`) covers Button, Chip, Badge, Tag, Segmented and Tabs labels and
    `.area-input__affix`. It does not cover the field value slots `.area-custom-select__value`,
    `.area-date-picker__value`, `.area-time-field__segments`, `.area-number-field__unit`, `.area-switch__label`,
    `.area-field__label` or `.area-setting-row__label`. A native `<input>`'s value cannot be trimmed.
  - Measured cap centre against box centre: Button, Chip and Segmented 0.00 on every tile. Custom select (19 tiles),
    Date picker (14), Time field (60 texts) and Number field units: −0.61 (cap 0.61 above centre).
  - Button baseline 105.61, Custom select value baseline 105.00, in the same 86–116 box.
  - Inside one Input the trimmed affix and the untrimmed value disagree: the phone tile ("+1" against "1") is visibly
    about 0.75 px apart at 8× (`R/review-VA/zoom-phone.png`). Round 81's own rule says a second text beside a
    trimmed one is trimmed too (`inset.css:248-250`).
- **Second pass, a row case.** Selection bar's count "3 selected" (13/18 500, untrimmed) sits at −0.6 against the
  cap-exact Button labels on the same row (`selection-bar` default: text rect y 193 in the 189–215 row).
- **Families.** Input, Search, Password, Number field, Select, Custom select, Combobox, Date and range picker, Time
  field, Tag picker input, Color field and Selection bar's count, plus Button, Split button and Kbd placed beside
  them.
- **Rule-level fix.** Pick one centring model for single-line text in a control box.
  - Either trim the field value slots and offset the native input's line box by the same amount. That means setting
    the control's `padding-block-start` to (line − cap)/2, rounded, minus the half-leading, which in practice is
    +0.61 at type 13, computed from `1cap`.
  - Or stop trimming the input affix, so prefix and value share the line box. That is the smaller change, but it
    leaves Button 0.6 lower than fields in a row.
  - The first keeps Button exact and lines up every control in a form row. Add a cohesion check that measures cap
    offsets across control boxes, extending this audit's `capc.js`.
- **Visible change.** Field values move down 0.6 px. The prefix/value and Button/field baselines meet.
- **Size** M. **Confidence** high on the measurement. The ascent value is inferred from Button's trimmed box, so
  medium on the exact 0.61.

### VA2 · inconsistency · Switch is the one choice control not centred on its label's cap

- **Where.** `choice.js` on all 22 Switch tiles: label cap 0.61 above the track centre (sm 26×14, md 30×18, lg 34×22).
  Checkbox (28 tiles) and Radio (21) are 0.00 because `.area-choice-label__title` is trimmed (`inset.css:296-307`).
  `.area-switch__label` is not.
- **Fix.** Switch's label takes Choice's first-line rule: trim to the cap and set it down by (track − cap)/2.
- **Visible change.** The label moves 0.6 px down to the track's centre.
- **Size** S. **Confidence** high.

### VA3 · defect · In Setting row the Switch sits 3 px above the line that Select and Segmented centre on

- **Where.** `setting-row` default, content-help and content-group tiles.
  - Text block 184–220, centre 202.
  - The control slot holds the Switch's 24-tall hit box at 190, so the slot is centred (202), but the 18 track draws
    at the top of that box: 190–208, centre 199.
  - A Select (content-select, 189–215) and a Segmented (state-modified, 189–215) centre at 202.
  - In the framed group the rows' controls step 199 / 202 / 202 down the right edge.
- **Fix.** Centre the track within the switch's hit box (`align-items: center`, or let the box take the track's
  height and grow the hit area with the shared `::after` from G3). Stated rule: a control's paint is centred in its
  own target box.
- **Visible change.** Switches in Setting row, Switch's own settingsrow and list tiles, and anywhere a Switch sits
  in a centred row move 3 px down onto the row's centre.
- **Size** S. **Confidence** high.

### VA4 · defect (gallery) + refinement (component) · Input group's field collapses in the Overview

- **What renders.**
  - The inner field's control is 0×18 in the affixes, size-sm, size-md, size-lg, icon, phone and action tiles.
    Number field controls are 0 or 8.61 wide in letter, mode, opacity and rotation.
  - Opacity tile: the "%" unit (213.11–223.55) paints 9 px outside the group's right edge (214.5), and "100" is
    clipped to "1(" (`R/review-VA/m/input-group-light-0.png`).
- **Cause (established).**
  - The component asks for `inline-size: var(--area-input-inline-size)` (`input-group.css:11`), 16rem by default
    (`emit/base.ts:73`), and gives its field `flex: 1 1 0; inline-size: 0; min-inline-size: 0`
    (`input-group.css:65-67`).
  - In a gallery card the Canvas resets the hook to `100%` (`apps/desktop/src/styles/canvas.css:238`). The stage
    centres its specimen, and the specimen's wrapper is a shrink-wrapped block (measured: wrapper `div` 41 wide inside
    a 348 stage). So `100%` resolves against content width, and a field whose basis and minimum are 0 contributes
    nothing. The gallery's fit probe (`gallery/fit.ts:292`) then reads the group as fixed-width at that collapsed
    size.
  - Copy button's demo sets an explicit width (`demos/copy-button.tsx:15`) and renders correctly.
- **Would a consumer hit it?** Not at the defaults: 16rem is a definite width and the field takes the rest. They would
  hit it in two cases:
  - when the width hook is a percentage inside an auto-width parent, which is what Area's own app does
    (`styles/settings.css:57`, `canvas.css:238`);
  - when the group is placed in a content-sized container (a toolbar, an inline-flex row, `fit-content`).
- **Reclassified.** The Overview rendering is a gallery defect. The component keeps a fragility: a field with no
  intrinsic minimum.
- **Fix.**
  - Gallery: give a group demo `fullWidth`, or a width, as Copy button does. Alternatively, a gallery rule that a
    fluid specimen's wrapper takes the stage width before fit.ts measures it.
  - Component: the grouped field's minimum is its content (`min-inline-size: min-content`; for Number field, its
    value's width), so a content-sized group never clips its value.
- **Size** S. **Confidence** high.

### VA5 · defect (gallery) + refinement (component) · The vertical Slider tile renders with a 0-tall track

- **What renders.** `label.area-slider--vertical` is 30×0; track, rail and fill are 0 tall; only the 16 thumb paints.
- **Cause (established).**
  - A vertical slider's length is `block-size: var(--_vertical-length)` (`slider.css:246`), with
    `--_vertical-length: var(--area-input-inline-size)` (`slider.css:60`). That ties a vertical length to the
    fields' width hook.
  - In a gallery card `canvas.css:238` sets that hook to `100%`. As a block size inside the stage's auto-height
    wrapper (measured 348×0), 100% computes to auto. The column flex content is the track with `flex: 1;
    block-size: auto` and no intrinsic height (`slider.css:248-252`), so the slider is 0 tall.
  - The Documentation demo avoids this by setting `--_vertical-length: 100%` inside a sized frame
    (`demos/form.tsx:425`). The gallery demo (`gallery.tsx:2173`) does not.
- **Would a consumer hit it?** Not at the defaults: 16rem gives a 256 px slider. They would hit it whenever the
  fields' width hook is a percentage, which is the documented way to make fields fill a container: the vertical
  slider then collapses unless its container has a definite height. A width setting silently changing a vertical
  length is the component-level problem.
- **Reclassified.** The Overview rendering is a gallery defect. The component should not borrow a width token for a
  length.
- **Fix.**
  - Component: a vertical slider's length has its own hook (`--area-slider-block-size`, default 16rem) and a
    `min-block-size` of thumb + 2 × track inset, never collapsing below a usable travel.
  - Gallery: give the vertical demo a fixed length.
- **Size** S. **Confidence** high.

### VA6 · defect (gallery) · Toolbar's Floating tile shows no toolbar

- **Where.** `toolbar` variant-floating: both `area-toolbar--surface` nodes are at opacity 0 (hover-reveal at rest).
  The tile shows two empty "Item one / Item two" frames.
- **Fix.** The demo forces the revealed state, as other state tiles do. A gallery rule: no tile's specimen is
  invisible at rest.
- **Size** S. **Confidence** high.

### VA7 · defect (demo) · Copy and content that give the demos away

- **Input phone.** `defaultValue="1"` (`gallery.tsx:939`) renders "+1 1". It should be a number such as "555 0100",
  as `GalleryInputGroupPhone` uses.
- **Date picker and Date range picker variant-ghost.** Both drop the calendar icon, so this looks deliberate
  (ghost is the bare value). It is not counted as a defect, but the ghost Date picker's "Placeholder" text should be a
  date prompt ("Pick a date") as in its siblings.
- **Password field content-new.** An empty field with no placeholder.
- **Combobox create, rich and state-disabled-option.** Show the literal "Placeholder".
- **Chip image-filter.** A checkerboard "Image".
- **Tag picker.** Every tag in a different hue (VA14).
- **Fix.** Demo copy uses the placeholder vocabulary with realistic values.
- **Size** S. **Confidence** high.

### VA8 · inconsistency · A list that opens from a control has three corners

- **Where.** Open overlays (`measure.json` `open[]`):
  - Custom select, Combobox and Tag picker listbox: 12.
  - Number field's unit select (sm trigger): 10.
  - Split button menu, Time field list, Zoom control menu, Toolbar overflow: 14.
  - Date pickers and Filter bar popovers: 16.
- So a Split button md and a Custom select md, both 30 tall, open lists with corners of 14 and 12. The listbox
  follows its trigger's size and the Menu does not.
- **Fix.** One corner role for "list under a control" (menus and listboxes are one job: Menu's 14 or the listbox
  rule for both), with popovers on their own role. This extends S14.
- **Visible change.** A 2 px corner change on one set.
- **Size** S. **Confidence** high.

### VA9 · inconsistency · "Off" ink for an unselected option is 0.452 in some controls and 0.510 in others

- **Where.**
  - Segmented off label: oklch 0.510 (light) / 0.823 (dark).
  - Toggle group soft off icon: 0.510.
  - Toggle group outline and ghost off icon, and ghost and outline neutral Button labels: oklab 0.452 / 0.855.
  - Tabs plate off: 0.510.
- Two muted inks in sibling selection controls: the ghost button's own ink leaks into the toggle variants.
- **Fix.** An unselected option in any selection control reads one role, `fg-muted`. The ghost Button keeps its ink
  only as a Button.
- **Visible change.** Toggle group outline and ghost icons get 6 % lighter in light and 3 % darker in dark.
- **Size** S. **Confidence** medium (the 0.452 may be a deliberate ghost-button contrast step; it is applied
  inconsistently either way).

### VA10 · inconsistency · Checkbox and Radio have md and lg; Switch has sm, md and lg

- **Where.** Checkbox and Radio size tiles: medium (14) and large (18) only. Switch: sm 26×14, md 30×18, lg 34×22.
- A small Switch has no matching small Checkbox for the same dense row.
- **Fix.** Either one size set for the three, or the reason written in the specs.
- **Size** S. **Confidence** high on the census, low on the need.

### VA11 · inconsistency · The Date picker panel has three left edges

- **Where.** Open date picker, panel x 74, pad 11 + 1:
  - Inner input text at 94 (20 in).
  - Calendar grid and header at 86 (12 in), nav button at 88.
  - Footer "Clear" is a menu item bleeding to 78, with its text at 88 (14 in), under a separator at 86–324.
- **Fix.** Panel content shares the panel's content column (12). The footer action's text lands on it, as Card's
  plate actions end on the text column.
- **Visible change.** "Clear" moves 2 px right, or the grid 2 px in.
- **Size** S. **Confidence** high.

### VA12 · defect (confirms T1) · Field's count sits about 1 px off the description's baseline

- **Where.** Field count tile: description 12/16 at y 123, baseline ≈135. Count "0 / 32" 11/14 at y 125, baseline
  ≈136. Error message 11/14 under a 12/16 description.
- T1's move of messages and count to 12/16 fixes both.
- **Size** S. **Confidence** medium on the 1 px (baseline inferred from ascent), high on the sizes.

### VA13 · refinement · Time field's empty state mixes inks

- **Where.** Time field default: segments "––" and "AM" at `input-placeholder` 0.510, while the literal ":" is the
  default ink 0.277.
- **Fix.** Literals follow the placeholder ink while every segment is empty.
- **Size** S. **Confidence** high on the values; the visual effect is subtle.

### VA14 · refinement · Tag picker demos and default tone

- Every tile colours its tags differently: blue, yellow, purple, green, red. The disabled tile shows a faded green
  tag.
- Products use neutral tags in a picker unless the tag carries a category colour.
- **Fix.** The default demo is neutral, and the coloured case is its own tile.
- **Size** S. **Confidence** medium (taste).

### VA15 · inconsistency · Dark tone edges and inks are not balanced in chroma

- **Where.** Input state edges in dark: danger oklab(0.832, 0.088, 0.026), chroma 0.092. Success (0.787, −0.187,
  0.108), chroma 0.216. Warning (0.827, 0.060, 0.092), chroma 0.110.
- Tone labels on soft, outline and ghost Buttons show the same pattern (danger 0.071, success 0.215).
- In dark an invalid field reads pale pink while a success field reads vivid green (`R/review-VA/m/input-dark-0.png`).
- In light, danger is the strongest (0.234 against success 0.148).
- **Fix.** Tone inks in dark target one chroma band per role, or at least danger ≥ success. This belongs with the
  colour-system work.
- **Size** M. **Confidence** high on the values.

### VA16 · refinement · Kbd glyphs at a fixed 11/10 inside 13 text (confirms T8)

- **Where.** Kbd inside a Button: 18 tall, keys 11/10.
- In the text, nav, table and footer templates the ⌘ glyph reads visibly smaller than the words beside it
  (`R/review-VA/m/kbd-light-0.png`).
- **Confidence** high.

### VA17 · refinement · Fractional heights in choice cards

- **Where.** Checkbox card rows are 48.61 tall: the cap-trimmed title (14.23) plus a 12 description plus padding.
  Edges land on fractional y (163.39, 212.0). Radio cards likewise.
- The trims are right, but the card should round its block size, for example with
  `min-block-size: round(up, …, 1px)`, so stacked cards land on whole pixels.
- **Size** S. **Confidence** medium (Chromium snaps borders when painting, so the visible effect is small).

### VA18 · inconsistency · Search field's clear is the error mark

- **Where.** `SearchField.tsx:100` clears with `Glyph name="dismiss-circle"`, a filled grey disc with an x
  (search-field size-sm, size-md, state-filled, state-loading tiles).
- Every other clear or dismiss in the group is the plain `dismiss` x: Input's trailing action (`demos/form.tsx:39`,
  input action tile), Selection bar (`SelectionBar.tsx:131`), Chip, Tag, File upload.
- `dismiss-circle` is also the error status mark (`Message.tsx:52`; `ComposerParts.tsx:92`, `:237`).
- So the same field type shows two different clear glyphs, and one of them also means "failed".
- **Fix.** One clear glyph for every field action (`dismiss`); `dismiss-circle` stays a status mark. Record the rule
  in the icon usage table.
- **Size** S. **Confidence** high on the code. The filled disc is a common search affordance elsewhere, so this is
  a call for the owner.

### VA19 · inconsistency · Color field writes the hex two ways

- Default, soft, size and full-width tiles show "#8D4DF3" and "#00A797". The split and alpha tiles show "1E1E1E",
  "D9D9D9" and "8D4DF3" with no "#", beside a "%" column.
- A value's format should not change with layout.
- **Fix.** One format (with "#" or without, following the reference inspector) across the family. If the split
  layout drops it to save width, say so in the spec.
- **Size** S. **Confidence** high.

### VA20 · refinement · Textarea's resize grabber is the OS's

- Every resizable Textarea tile (default, outline, soft, sizes, rows, count, states) shows the native diagonal
  grabber, drawn over the bottom-end rounded corner in the OS's grey. It is the one undrawn part in the field set.
  Visible in light and dark (`R/review-VA/m/darkC-1.png` textarea tiles).
- **Fix.** Style `::-webkit-resizer`, or draw Area's own handle, in `input-chevron` ink, inset by the corner. Or
  default to `resize: none` with the autosize Textarea, as Composer does.
- **Size** S. **Confidence** high.

### VA21 · refinement · Filter bar's "Label: Value" gives the value no lead

- In filter-bar default, "Label", ":" and "Value" are one text run at 13/18 400 in one ink (`#282828`), inside a
  pressed chip.
- A filter chip is read by its value; the label is context.
- **Fix.** Label in the muted ink and the value in the default ink. The pattern is "label beside a value" (T24), so
  it reads like Field's horizontal label.
- **Size** S. **Confidence** medium (taste, but it follows the system's own T24 rule).

### VA22 · inconsistency (dark) · Empty boundaries nearly vanish on near-black

- **Measured dark edges against the 0.0847 field ground:**
  - Checkbox and Radio unchecked: `oklab 0.4128`, about 2.4:1.
  - Input, OTP slot and field shells: `0.3211`, about 1.6:1.
  - Switch off track: `0.3211` fill.
- **Measured light:** Checkbox edge 0.8579 on white, about 1.5:1; field edge 0.9008, about 1.3:1.
- **What is documented.** CONTRAST.md (lines 32–35) says the soft default sits under 3:1 and More restores 3:1, so
  this is recorded.
- **What still reads wrong in the render.**
  - An empty OTP field in dark is six barely-there squares (otp-field default and behavior-complete in
    `R/review-VA/m/darkC-0.png`).
  - Unchecked options in Checkbox and Radio media and card rows read as missing.
  - The Alignment picker's 0.982 well disappears on the 0.98 gallery ground in light, and its dots are faint in dark.
- **Fix (rule).** A box that is the whole affordance when empty (an unchecked box, an empty OTP slot, an empty
  Alignment picker) takes the stronger `edge-control-hover` rung in both modes. Field shells can stay soft because
  their label and placeholder carry them. This keeps "never weaken contrast" and only strengthens.
- **Size** S. **Confidence** high on the values; the rung is the owner's pick.

### Dark pass summary (all 37 families, default + most complex tile)

- **Holds up in dark.**
  - Near-black grounds (0.0847) with raised plates at 0.2 / 0.28: Segmented thumb, Toggle group plate, soft fields,
    the Number field inspector card, Slider bars.
  - Inverted solid Button (#f3 on #121212), Split button, Toolbar surfaces, Select, Custom select, Combobox and Date
    picker shells, Kbd, Link underlines, Box field, Color field.
  - No stroke doubles or disappears at a seam. Button group, Split button and Input group seams all remain visible.
- **Problems, as findings:**
  - Tone inks unbalanced: danger is pale against vivid success (VA15). Seen in Input states, Field error, Selection
    bar's Delete, Button tones and Tag picker tags, where yellow and green are much louder than blue and purple.
  - Empty boundaries faint (VA22).
  - Selected cards in Checkbox and Radio media and card layouts carry a 2 px near-white ring that reads heavier than
    anything else on the page (the selected-stroke setting, recorded; noted, not a finding).
  - The off Switch thumb is darker than its track (0.0847 on 0.3211), the owner's "plain knob" choice for Slider
    applied differently: Slider's knob is 0.28 on its fill, while Switch's off thumb reads as a hole. Owner's eye;
    noted under VA2's family.

## 5. Cross-family notes (confirming or refining wave 1)

| Wave-1 finding | What the render shows |
|---|---|
| S1 (Corner setting ≠ md Button) | **Confirmed.** Radius setting 10 renders md 8, lg 10, sm 8 in Button, Input and Select. |
| S7 (Segmented and Toggle group tracks) | **Latent at defaults.** Both tracks render identically (§2c). |
| S11 (disabled by opacity or by ink) | **Confirmed.** Button disabled is opacity 0.5. Input disabled is ink rgb(164) on a 0.982 fill. The Field label turns muted 0.510, not disabled. |
| S16 (Input group seams) | Seam measured `oklab(0.952)` against the group edge 0.9008: **confirmed** lighter. |
| G3 (targets under 24) | **Confirmed.** Split button ghost-icon trigger 15×30. Input action sm 18×18. Search clear sm 18. |
| T1 (text-xs for words) | **Confirmed** in Field (error, count) and Calendar days (11/14), with a rendered baseline consequence (VA12). |
| T8 (Kbd fixed 11) | **Confirmed** visually (VA16). |
| T14 (label gaps) | Field, Box field and Setting row vertical all render 6. Not seen elsewhere in this group. |
| T19 (placeholder roles) | No visible split in fields (§2a). |
| T24 (beside-label muted) | **Confirmed.** Field horizontal label is 0.510, vertical labels 0.277. |
| S3 (open trigger paint) | **Confirmed.** Combobox shows a 2 px focus ring while open; Custom select shows none. |

## 6. Best-looking five (do not disturb)

1. **Button.**
   - Cap-exact label: text cap centre at 0.00 in all 45 tiles.
   - Insets 10 / 7 / 8 / 14 follow the ladder exactly.
   - Its outline edge is the field edge, so button and field rows meet. Tones are all one geometry.
2. **Segmented and soft Toggle group.**
   - One track (0.982 + 7.5 % outline, 2 / 2, corners 8 / 6), concentric by the numbers, with the same raised
     thumb and shadow.
3. **Checkbox and Radio.**
   - First-line alignment exact on 49 tiles, at both sizes and in card, soft and media layouts.
4. **Chip.**
   - Cap-trimmed pills and consistent icon slots; the best "real" feel in the group.
5. **The field shell set.**
   - One height, corner, edge, inset, placeholder ink and label gap across 12 families. The native Select's chevron
     on the same 8 inset as Custom select and Combobox.

## 7. Weakest five and the fix

1. **Input group.** Size the Overview demos and give the field an intrinsic minimum (VA4); seams on `edge-control`
   (S16).
2. **Setting row.** Centre the Switch in its target (VA3); trim the switch label (VA2).
3. **Slider.** Give the vertical length its own hook (VA5). Then decide whether seven track drawings (rail, track, bar,
   label-inside, range ×3, gradient) are all variants or partly compositions; true scale, no bloat.
4. **Date picker.** One content column in the panel (VA11); 12 or 13 day numbers (T1).
5. **Tag picker.** Neutral default tags (VA14); its value and placeholder under the same centring rule as other
   fields (VA1).

## 8. Counts

22 findings:

Classed by primary kind: defect 6 (VA3, VA4, VA5, VA6, VA7, VA12), inconsistency 10 (VA1, VA2, VA8, VA9, VA10, VA11,
VA15, VA18, VA19, VA22), refinement 6 (VA13, VA14, VA16, VA17, VA20, VA21). VA4 and VA5 are gallery defects with a
component refinement attached.

## 9. Changes in the second pass (2026-11-11)

- Coverage completed: light for all 37 families, tile by tile; dark for every family's default and largest tile.
- VA4 and VA5 traced to the gallery's `--area-input-inline-size: 100%` (`canvas.css:238`) inside a shrink-wrapped
  stage, and reclassified from component defects to gallery defects, each with a component refinement.
- VA7 no longer counts the ghost Date picker's missing icon (both pickers do it, so it is deliberate).
- New: VA18 (search clear glyph), VA19 (hex format), VA20 (resize grabber), VA21 (filter value lead), VA22 (empty
  boundaries in dark), and a dark pass summary. VA1 gains Selection bar's count.
- Scorecard filled for the 18 families that had "–" or measured-only rows.
