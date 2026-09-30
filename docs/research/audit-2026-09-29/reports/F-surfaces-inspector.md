# F: surfaces and inspector (Card, Table, Panel, Property list, Color field, Color swatch, Color swatch picker, Color picker, Alignment picker, Calendar)

Read-only audit, 2026-09-29, worktree `component-audit-visual-guide-ac7bc4`. Every value below was read from source. Nothing was rendered in a browser. Items marked "code reading" are conclusions drawn from the CSS and JS alone.

## Summary

- **Two high-severity defects.**
  - Card's new corner formula (`radius-control-md + inset + step`) sits outside the radius presets' guards. Under Sharp every card keeps a 14/16/20 corner. Under Pill the corner is about 1015px, so cards and their media become stadiums. Dialog's formula already has the cap that would fix this.
  - Calendar's roving focus gets stuck in front of any unavailable date, because disabled days are native `disabled` buttons.
- **The system rules and the code disagree in three places, and the docs contradict each other.**
  - Surface titles: `DESIGN_SYSTEM.md` says every title and heading is weight 400. Card, Panel and Calendar titles are 500, and several specs still say 400.
  - Card edge: `DESIGN_SYSTEM.md` names both "neutral 100" and "the divider role" for it.
  - ColorPicker's internal rules (#e2) are darker than its own edge (#f3), which breaks the owner's rule for dividers inside a container.
- **The disabled, focus and hover paint has gaps.**
  - Disabled Calendar and ColorPicker dim twice: nested Buttons end at 25%, and fields get both field paint and 50% opacity.
  - AlignmentPicker leaves its frame at full strength when disabled.
  - Hover is invisible on Calendar's circle days.
  - ColorPicker's 2D area draws a focus ring after a mouse drag.
  - ColorPicker's area arrows and range sliders reverse in RTL, which Alignment picker avoids by forcing `dir="ltr"`.
- **The API is inconsistent across the pickers.** They name themselves with `label` versus `aria-label` under four different precedence rules. `variant="surface"` means a floating plate in Calendar and Toolbar but a soft fill in AlignmentPicker. ColorPicker has no `plain` treatment, so it can't sit inside a Popover without a second frame. Calendar alone ignores form reset.
- **Documentation drift is heavy.** At least 9 of the 11 specs carry stale values, a stale status or stale peer claims. The handoff's open owner questions are still open: ColorField's divider, Figma's split chits, sizing the Alignment grid to the layout, and Popover versus Card media fill.

## Findings

### F-1  Card corner ignores the radius presets (Sharp stays round, Pill turns cards into stadiums)
- Families: card (compared with dialog, popover, panel, table)
- Category: system-rule
- Severity: high
- Type: DECISION
- What: The Card corner is now `radius-control-md + inset + step`. At Sharp that is 0 + 8 + 8 = 16, not 0. At Pill it is 999 + 16 = 1015px, which the browser clamps to half the card's height, so the whole card and its media (1007) become pill-shaped. Dialog uses the same "button radius + distance" idea but caps it with `min(container × 2, …)`. Card has no cap. A second issue: a small card's header action is a small control (radius 6), but the small card's corner still derives from the medium control's radius, so a header action is not concentric: 22 − 14 = 8, where the control's radius is 6.
- Evidence: `surface.css:44` `--_card-radius: calc(var(--area-radius-control-md) + var(--_card-inset) + var(--_card-step))`; `:97-109` sizes; `:99` sm `--_card-action: control-sm`; `surface.css:767` Dialog `min(calc(var(--area-radius-container) * 2), …)`; `radius.ts` sharp `control.md 0, container 0`, pill `control.md 999, container 24`; `radius.ts` Pill note: "a pill field or card obscures its role".

  | Preset | Card md (code) | Dialog (capped) | Popover / Panel / Table (container) |
  |---|---|---|---|
  | Sharp | 16 | 0 | 0 |
  | Standard | 24 | 16 | 12 |
  | Pill | 1015 (renders as a stadium) | 48 | 24 |
- Options:
  - A: Keep the owner's Button-derived corner and add Dialog's cap, `min(radius-container × 2, …)`. Sharp → 0, Standard 22/24/28 unchanged, Pill → 48.
  - B: Go back to a pure container-role derivation (`container × 2`) and give up concentricity with the Button.
  - C: Keep as is.
  - Recommended: A. It keeps the owner's 22/24/28 at the default preset, uses the pattern Dialog already ships, and satisfies "A radius that is not a role is derived from one" (DESIGN_SYSTEM:171) with a cap that respects Sharp and Pill. For sm, derive from `radius-control-sm` when the header action is small, or accept the 2px mismatch.
- Visual: three rows (Sharp, Standard, Pill), each showing Card md, Dialog and Popover side by side, with the current Card beside the capped Card.

### F-2  Card radius docs still describe "container × 2" and 12/16/24
- Families: card, panel, table
- Category: docs-drift
- Severity: medium
- Type: FIX
- What: The owner's rule of 2026-09-28 (Button radius + column distance; 22/24/28) is recorded only in `card.md`'s owner decisions, feedback log and CSS comments. The system docs, the cohesion audit and the peer tables still state the retired rule, so the next component would inherit the wrong derivation.
- Evidence:
  - `DESIGN_SYSTEM.md:171-173` says "(Card is twice the container radius) … Every surface, Card included, uses the container role".
  - `cohesion-audit.md:53` says "Now `radius-container × 2`", and `:68` says "24px at Standard, 0 at Sharp".
  - `card.md:144` has "radius / inset 12·16·24 … Corners derive from the container role", and `card.md:192` "Panel, Dialog, Popover radius 12 | 12 / 16 / 24 | sm matches".
  - `panel.md:160` says "Card / Alert / Code block radius 12 / 12 / 12 … (Card moved to the container radius)".
  - Stale comments in `surface.css:22-30` ("half a medium control's space around the title's cap") and `:301-303` ("radius 8 + 12 = 20"). `primitives.tsx:215` CardProps: "size: Shape and type: corner, inset and title role" (type no longer changes with size).

### F-3  Card edge versus Table frame: DESIGN_SYSTEM says both "neutral 100" and "divider role"
- Families: card, table
- Category: docs-drift / consistency
- Severity: medium
- Type: DECISION
- What: The Card edge is neutral 100 (#ee), lighter than the divider role (#e2) that the Table frame uses. DESIGN_SYSTEM states both. `table.md` claims the two match, and a comment in the Card CSS still says "it takes the divider role".
- Evidence: `DESIGN_SYSTEM.md:88` "over a lighter edge (neutral 100)" against `:100-101` "A Card's edge and a Table's frame take the divider role too"; `surface.css:56` `--_card-edge: light-dark(var(--area-neutral-100), var(--area-neutral-750))`, `:82-84` comment "so it takes the divider role"; `navigation.css:126` wrapper `border-divider`; `table.md:148` "Card | 1px border-divider #e2 | same | match".

  | | Light | Dark |
  |---|---|---|
  | Card edge | #eeeeee (neutral-100) | #333333 (neutral-750) |
  | Table frame | #e2e2e2 (border-divider) | #333333 |
- Options:
  - A: Table frame takes Card's lighter edge.
  - B: Card goes back to the divider role.
  - C: Keep both and document the split: Card's edge is lighter because its halo carries it; Table's frame has no shadow and must not be lighter than its own row rules.
  - Recommended: C. A would put #ee over #e2 row rules, which breaks the owner's rule that a frame is never lighter than the rules inside it (`table.md:182`). B undoes the owner's 2026-09-27 choice. Fix DESIGN_SYSTEM:100-101, `table.md:148` and `surface.css:82-84`.
- Visual: Card md and the Table default side by side on white, with zoomed edges at #ee and #e2, in light and dark.

### F-4  Elevation that bypasses the Surface axis: Card halo and floating lift are literals, and the Elevated preset erases Table's frame
- Families: card, table, panel, calendar, color-picker
- Category: system-rule
- Severity: medium
- Type: DECISION
- What:
  - Panel uses `shadow-2`, which follows the Surface axis.
  - Card's halo is a literal ("ignores the Surface axis until shadows are tokenised").
  - The shared floating lift is a literal pasted in 9 places, Calendar and ColorPicker included, so the Flat preset ("No elevation anywhere") leaves all of them lifted.
  - The Elevated preset sets `border-width: 0px`. That removes the Table frame entirely, since Table has no shadow, and leaves Card with only a 3% halo.
  - Code reading; not rendered.
- Evidence: `surface.ts:17-27` (flat: shadows none), `:54-58` (elevated: border-width 0px); `surface.css:60-61` Card halo literal; lift literal at `calendar.css:45`, `color.css:213`, `surface.css:782/871/1182/1277`, `navigation.css:330`, `toolbar.css:76`, `command-palette.css:42`; `panel.css:63` `shadow-2`; `navigation.css:126` Table `border: var(--area-border-width) …` with no shadow.
- Options:
  - A: Add two Surface-axis tokens, `shadow-card` (the halo) and `shadow-float` (the lift), with per-preset values, and give Table a minimal lift or a required edge under Elevated.
  - B: Keep the literals and document that Card and floating surfaces are exempt from Surface.
  - Recommended: A. The lift is already one shared value that a test guards by paint (`cohesion.test.mjs:47`), so tokenising it is mechanical, and Table's disappearing frame is a real defect of B.
- Visual: the default Card, Table, Panel and Calendar surface in a 4 × 3 grid under Flat, Outlined and Elevated.

### F-5  ColorSwatch edge is drawn with the decorative `border-width`, so it disappears under Elevated
- Families: color-swatch (and every picker and field that embeds it)
- Category: system-rule
- Severity: medium
- Type: FIX
- What: The swatch's 1px edge exists so a white or near-surface colour stays visible. That makes it a required edge, but it reads `--area-border-width`, which Elevated sets to 0. AlignmentPicker, Calendar's today ring and the palette use `stroke-width` for their required edges. Code reading.
- Evidence: `color.css:33` `--_edge: var(--area-border-width)`; `DESIGN_SYSTEM.md:103` "Required control/state edges use `stroke-width` independently of Surface"; `alignment-picker.css:11` `--area-stroke-width`; `calendar.css:86` `stroke-width`.
- Visual: a white swatch and a #F7F7F7 swatch on white, under Outlined and Elevated.

### F-6  ColorPicker's internal rules are darker than its container edge
- Families: color-picker (compared with panel, calendar Schedule, menu)
- Category: system-rule
- Severity: medium
- Type: FIX
- What: The header rule and the swatches rule use `border-faint`, which resolves to the same #e2e2e2 as `border-divider`, inside a surface whose edge is `border-decorative` #f3f3f3. That breaks the owner's 2026-09-27 rule that a rule inside a container is never darker than the container's edge. Panel, the Calendar Schedule composition and Menu follow the rule. The spec chose faint as "the role nearest Figma rgb(230)", which predates the owner rule. In the same file, `.area-color-picker__heading` is declared twice (`color.css:359` and `:366`).
- Evidence: `color.css:210` edge `border-decorative`; `:221` header and `:357` swatches `border-faint`; tokens `--area-border-faint: light-dark(#e2e2e2, #333333)` (= divider), `--area-border-decorative: light-dark(#f3f3f3, #282828)`; `DESIGN_SYSTEM.md:95-97`; `panel.css:93,153,294` decorative; `gallery.tsx` Schedule `rule = … border-decorative`; `color-picker.md:147,157`.

  | Container | Edge | Inner rule |
  |---|---|---|
  | Panel | #f3 | #f3 |
  | Calendar Schedule | #f3 | #f3 |
  | ColorPicker | #f3 | **#e2** |
- Visual: the ColorPicker header seam next to the Panel bar seam, zoomed, current versus decorative.

### F-7  ColorField and ColorPicker draw different seams in the same hex-and-opacity row (open owner question)
- Families: color-field, color-picker
- Category: consistency
- Severity: low
- Type: DECISION
- What: ColorField separates hex and opacity with a 1px `border-decorative` rule. ColorPicker's value row separates the same two fields with a 1px surface-coloured gap, as Figma does. The handoff lists this as an owner question.
- Evidence: `color.css:172` (`border-inline-start: … border-decorative`) against `color.css:337` (`border-inline-start-color: var(--area-bg-surface)`); `HANDOFF.md:351-352`; `color-field.md:97,120`.
- Options:
  - A: ColorField adopts the surface gap.
  - B: ColorPicker adopts the decorative rule.
  - C: Keep both.
  - Recommended: A. Both rows are the same Figma colour row (`input-group/figma--color-row`). On the soft #f7 fill, the #f3 rule is nearly invisible anyway, and a white gap reads as the intended split.
- Visual: an alpha ColorField above the ColorPicker value row, both at 3× zoom.

### F-8  Surface titles are 500 in code, while DESIGN_SYSTEM and several specs say 400
- Families: card, panel, calendar (also alert, toast, popover, outside this scope)
- Category: system-rule / docs-drift
- Severity: high
- Type: DECISION
- What: The system rule reads "400 for text and every title or heading", and the owner direction reads "Lighter UI: regular-weight titles". The code sets Card titles, Panel bar titles, Panel section headings and Calendar month labels to `weight-strong` (500), citing a "type pass" rule that every surface title is strong. The Panel spec still says the title and headings are 400 and that headings "outrank by ink, not weight". The code uses both weight and ink, which is two variables for one distinction. The Calendar spec says 400 in its Decisions table and 500 in its Visual pass.
- Evidence: `DESIGN_SYSTEM.md:41-43`; `HANDOFF.md:16`; `surface.css:233` (Card title), `panel.css:110` (bar title), `:176` (heading), `calendar.css:58` (month) all `weight-strong`; `panel.md:119-120` ("UI 14/20 400"), `:138-141`; `calendar.md:119` ("14/20 **400** … regular weight") against the `calendar.md` Visual pass ("was 400, now 500"); `inspector.md:47` ("every title strong").
- Options:
  - A: Amend DESIGN_SYSTEM: surface titles (Card, Panel, Popover, Dialog, Alert, Toast, Calendar) are 500, and body text and headings inside prose stay 400. Then fix the Panel and Calendar specs.
  - B: Return every surface title to 400 and let size and ink carry hierarchy.
  - Recommended: A. The owner has approved batches 7, 8 and 16 with 500 titles in place, and Notion's calendar, Figma's panel titles (550) and shadcn's caption (500) support it. For Panel headings, drop either the weight or the ink split so one variable carries the distinction.
- Visual: Card, Panel (bar title plus a section heading over a muted label) and Calendar month at 400 and at 500.

### F-9  Calendar keyboard focus gets stuck in front of an unavailable date
- Families: calendar
- Category: interaction / a11y
- Severity: high
- Type: FIX
- What: Unavailable and out-of-bounds days render as `<button disabled>`, which cannot take focus. An arrow key onto one (for example Right from a Friday in the Circle tile, where weekends are unavailable) sets the roving `focused` date to that day and calls `.focus()`, which does nothing. The old button keeps focus but has already lost `tabIndex=0`, and the next arrow is computed from the old button's own date, so it lands on the same disabled day again. The user can't arrow past it. When the roving stop itself is a disabled date, the grid also has no Tab stop at all. The WAI date grid keeps these days focusable and marks them with `aria-disabled`. Code reading; the spec's keyboard check did not cross an unavailable date.
- Evidence: `Calendar.tsx:105` `unavailable()`; `:164-167` (the move only clamps min and max, then `setFocused(next)`); `:121-124` (`.focus()` on `[data-date]`); `:186` (`tabbable = … focusDate === iso`); `:190` (`disabled={isOff}`); gallery `GalleryCalendarCircle` (`isDateUnavailable={weekend}`) and `GalleryCalendarUnavailable` (12 and 13 September in a row). `calendar.md` Verification: "keyboard sequence from Sep 15 …" with no unavailable day on its path.
- Visual: a Circle-tile month with a focus ring on Friday, then an arrow press that goes nowhere, beside the expected result (focus on a dimmed Saturday, announced as unavailable).

### F-10  Calendar outside days are clickable but painted with disabled ink, and clicking one selects a date the user can't see
- Families: calendar
- Category: interaction / system-rule
- Severity: medium
- Type: DECISION
- What: Outside days (the neighbouring month's dates) are real buttons that call `choose()`. Selection paint is suppressed on outside days, and choosing one doesn't change the month, so a click commits a value with no visible result. They also use `fg-disabled`, which DESIGN_SYSTEM reserves for disabled and placeholder text.
- Evidence: `calendar.css:83` (`[data-outside] { color: var(--area-fg-disabled) }`); `Calendar.tsx:183` (`isSelected = !outside && …`), `:195` (`onClick={() => choose(d)}` for outside days too), `:136-150` (`choose` never calls `showMonth`); `DESIGN_SYSTEM.md:43-44`.
- Options:
  - A: Clicking an outside day selects it and moves to its month, as react-day-picker and React Aria do.
  - B: Make outside days inert (text, not buttons).
  - C: Keep them clickable and paint their selection.
  - Recommended: A, with outside days in `fg-muted`. The date stays reachable and the user sees the result.
- Visual: September with 1 October clicked: the current state (nothing visibly selected) against option A (the view moves to October with 1 October selected).

### F-11  Hover is invisible on Calendar's circle days
- Families: calendar
- Category: visual / interaction
- Severity: medium
- Type: FIX
- What: Circle days rest on `bg-component-hover` (#f3). The hover rule replaces the background with translucent `bg-hover`, which composites to #f3 on white (dark: solved to the same step). Hover therefore produces no change. Square and tile days work because they rest transparent.
- Evidence: `calendar.css:121` (circle `--_day-fill: var(--area-bg-component-hover)`); `:84` (`.area-calendar__day:hover:not(:disabled, [data-selected]) { background: var(--area-bg-hover) }`, specificity 0-3-0, which beats the `var(--_day-fill)` base); tokens `bg-hover #1414140d` (≈ #f3 on #fff) and `bg-component-hover #f3f3f3`; `DESIGN_SYSTEM.md:66-68` ("composites to the same step as the opaque fill").
- Visual: a circle day at rest and under hover (identical today), next to the fix (`bg-component-active` for a filled day).

### F-12  Calendar's 32px day plates use the small-control radius, beside 32px Buttons at radius 8
- Families: calendar (compared with button and the Schedule composition)
- Category: consistency
- Severity: low
- Type: DECISION
- What: Days grew from 28 to 32 on 2026-09-27, but their radius stayed `radius-control-sm` (6), which was chosen for Notion's 28px day. The radius axis states that controls at the same painted height read the same token. The Schedule composition puts 32px `md` Buttons (radius 8) directly beside 32px day plates (6).
- Evidence: `calendar.css:8` (`--_day: 32px`), `:10` (`--_day-radius: var(--area-radius-control-sm)`); `calendar.md:116` ("day · radius | radius-control-sm (6) | Notion 6", measured on 28px days); `radius.ts:22-24` ("controls at the same painted height always read the same token"); `gallery.tsx` `GalleryCalendarSchedule` (`Button size="md"` time list).
- Options:
  - A: Days take `radius-control-md` (8), with range ends following.
  - B: Keep 6 and record the exception.
  - Recommended: A. It is the axis's own rule, and the Schedule tile shows the mismatch in one glance.
- Visual: the Schedule tile, with the selected day and the selected time plate, at 6 versus 8.

### F-13  Calendar ignores form reset; its sibling pickers handle it
- Families: calendar (compared with color-field, color-swatch-picker, alignment-picker, color-picker)
- Category: interaction / api
- Severity: medium
- Type: FIX
- What: An uncontrolled Calendar with `name` submits hidden inputs, but a `<form>` reset leaves the selection and the hidden values unchanged. Every other stateful family in this group listens for `reset`. DESIGN_SYSTEM requires uncontrolled state to stay in sync with form reset.
- Evidence: `Calendar.tsx:83` (local state), `:253-255` (hidden inputs), with no `reset` listener; compare `ColorSwatchPicker.tsx:43-50`, `AlignmentPicker.tsx:38-45`, `ColorField.tsx:42-49`, `ColorPicker.tsx:160-166`; `DESIGN_SYSTEM.md:134-135`.

### F-14  Disabled paint: double dimming in Calendar and ColorPicker, and an undimmed frame in AlignmentPicker
- Families: calendar, color-picker, alignment-picker, color-swatch-picker
- Category: system-rule
- Severity: medium
- Type: FIX
- What: "Controls, rows and pickers dim to 50% as a whole … Never both." A disabled Calendar and ColorPicker set 50% opacity on the root and also pass `disabled` to nested Buttons, Segmented options and ColorSwatchPicker cells, each of which dims itself to 50%. Nested icon buttons end at 25%, and nested soft fields get disabled field paint inside a 50% group. Calendar corrected this for day ink but not for its nav Buttons. AlignmentPicker dims only its cells, so the soft fill and the edge stay at full strength around 50% cells.
- Evidence: `calendar.css:140` and `color.css:367` (root opacity 0.5); `button.css:151-154` and `segmented.css:106-108` (0.5); `Calendar.tsx:233-236` (nav `disabled={disabled || …}`); `ColorPicker.tsx:317-318, 343-344, 353, 270-271, 340, 370` (disabled passed down); `color.css:119` (cell 0.5); `alignment-picker.css:11-13` (frame) against `:89` (cells only); `DESIGN_SYSTEM.md:71-72`.

  | Part | Current | Rule |
  |---|---|---|
  | Calendar nav Button | 25% | 50% |
  | ColorPicker eyedropper, save and swatch cells | 25% | 50% |
  | ColorPicker NumberField and Select | field paint × 50% | one of the two |
  | AlignmentPicker frame | 100% | 50% |
- Visual: the disabled Calendar, ColorPicker and AlignmentPicker tiles, current versus corrected.

### F-15  ColorPicker's area shows a focus ring on pointer use and doubles it on keyboard
- Families: color-picker
- Category: a11y / visual
- Severity: low
- Type: FIX
- What: The area outlines itself on `:focus-within`. Every pointer-down programmatically focuses the hidden range input, so the whole area keeps a focus ring after any mouse drag. On keyboard focus the thumb also gets its own ring (`:has(:focus-visible)`), so two rings show.
- Evidence: `color.css:365` (`.area-color-picker__area:focus-within { outline … }`); `:251` (thumb outline on `:has(:focus-visible)`); `ColorPicker.tsx:327` (`querySelector("input")?.focus()` on pointer-down).
- Visual: the area after a mouse drag (ring) and on Tab (two rings), against the thumb ring alone.

### F-16  ColorPicker controls reverse in RTL while their gradients stay physical
- Families: color-picker (compared with alignment-picker)
- Category: interaction / a11y
- Severity: medium
- Type: FIX
- What: The saturation and brightness area is physical: white is at the left, and the thumb uses `left:`. In RTL, `areaKey` flips ArrowLeft and ArrowRight, so ArrowRight lowers saturation and moves the thumb left. The hue, alpha and channel tracks are native range inputs, which browsers mirror in RTL, but their gradients are physical `90deg`, so the thumb no longer sits on the colour it shows. AlignmentPicker solved the same problem by forcing `dir="ltr"`. Code reading; not run in RTL.
- Evidence: `ColorPicker.tsx:191-192` (RTL factor applied to arrows); `color.css:228` (`linear-gradient(to right, #fff, …)`), `:249` (`left: var(--_saturation)`), `:270` and `:274` (`90deg` gradients); `AlignmentPicker.tsx:73` (`dir="ltr"`); `color-picker.md:227` lists what is unverified, and RTL is not on that list.
- Visual: the hue slider at hue 60 in LTR (thumb on yellow) against RTL (thumb on magenta).

### F-17  Panel's Sections tile mixes an outline Select into an all-soft panel
- Families: panel
- Category: gallery / system-rule
- Severity: low
- Type: FIX
- What: "One surface uses one field style: a Panel's rows are all soft." The Sections tile's Easing `Select` has no `variant="soft"`, so it renders outline with `shadow-1` above soft NumberFields. The spec claims every field in the gallery is soft.
- Evidence: `gallery.tsx:1633` (`<Select fullWidth aria-label="Easing" …>`) against `:1638-1639` (`NumberField variant="soft"`); `DESIGN_SYSTEM.md:78-80`; `panel.md:114`.

### F-18  ColorPicker's model Select is outline among soft value fields
- Families: color-picker
- Category: consistency
- Severity: low
- Type: DECISION
- What: The value row pairs an outline `Select` with a soft `InputGroup`. That copies Figma (a white select with an edge beside #f5 fields) but breaks Area's "one surface, one field style", which Panel applied over the same Figma evidence (Figma's size select is outline too, `panel.md:74,114`).
- Evidence: `ColorPicker.tsx:353` (`<Select … size="sm">`, with no variant, so the outline default of `manifest.ts:216-220`) against `:357` (`InputGroup … variant="soft"`); `color-picker.md:81`.
- Options:
  - A: Make the select soft.
  - B: Keep outline and write an exception into the rule.
  - Recommended: A, for parity with Panel's all-soft decision on the same evidence.
- Visual: the value row with an outline select against a soft select.

### F-19  The pickers name themselves differently, and ColorPicker overrides a consumer's `aria-label`
- Families: color-swatch-picker, alignment-picker, color-picker, calendar, property-list
- Category: api / a11y
- Severity: medium
- Type: FIX
- What: Five families have four naming contracts. ColorPicker spreads `rest` first and then sets `aria-label={label}` with a default of "Color", so a consumer's `aria-label` is silently replaced. The group's `disabled` state is announced (`aria-disabled`) only by Calendar and ColorPicker. `onValueChange` passes `(value, event)` in two families and `(value)` in three. ColorSwatchPicker always preselects the first enabled option, so `required` can never fail and "no selection" can't be represented.
- Evidence:

  | Family | Name prop | Precedence | Group disabled |
  |---|---|---|---|
  | ColorSwatchPicker | `label` required | `rest["aria-label"] ?? label` (`ColorSwatchPicker.tsx:100`) | none |
  | AlignmentPicker | `label` optional | `label ?? rest["aria-label"]` (`AlignmentPicker.tsx:73`) | none |
  | ColorPicker | `label = "Color"` | label always wins (`ColorPicker.tsx:313-314`) | `aria-disabled` |
  | Calendar | `aria-label = "Calendar"` | aria-label (`Calendar.tsx:75, 251`) | `aria-disabled` |
  | PropertyList | `label` required | `aria-label={label}` before `{...rest}` (`PropertyList.tsx:131-132`) | n/a |

  Also: `ColorSwatchPicker.tsx:21` and `AlignmentPicker.tsx:18` take `(value, event)`, while `ColorField.tsx:24`, `ColorPicker.tsx:101` and `Calendar.tsx:30-32` take `(value)`. `ColorSwatchPicker.tsx:38` has `initial = defaultValue ?? first enabled`.

### F-20  `variant="surface"` has two meanings, and ColorPicker has no plain treatment
- Families: calendar, alignment-picker, color-picker (plus toolbar)
- Category: api / consistency
- Severity: medium
- Type: DECISION
- What:
  - `surface` means different things by family.
    - Calendar and Toolbar: a bordered, lifted floating plate (default `plain`).
    - AlignmentPicker: the soft field fill (default `surface`, with `plain` removing fill and edge).
  - ColorPicker always paints the floating surface (border, radius, lift) and has no `plain`, so inside a Popover or a Panel it draws a second frame and a second shadow.
  - Calendar can embed; the owner approved "a Popover holding only a Calendar hugs it".
- Evidence: `manifest.ts:88,91` (alignment `variant: ["surface","plain"]`, default surface); `:104,106` (calendar `["plain","surface"]`, default plain); `:79,82` (toolbar, same as Calendar); `:95-96` (colorPicker `variants: {}`); `color.css:210-213` (always framed and lifted); `alignment-picker.css:18-21`; `HANDOFF.md:128-129`.
- Options:
  - A: Keep `surface` for the floating plate everywhere. Rename AlignmentPicker's values to `soft` / `plain`, matching the field treatment it borrows (`input-bg-soft`). Add `variant: plain | surface` to ColorPicker, default surface.
  - B: Keep the names and document per family.
  - Recommended: A. A value name should mean one thing (DESIGN_SYSTEM:123-127), and ColorPicker needs the embed case that Calendar already has.
- Visual: ColorPicker inside a Popover (double frame) against a plain ColorPicker inside a Popover; AlignmentPicker "surface" next to Calendar "surface".

### F-21  Calendar's gallery default is not the manifest default
- Families: calendar
- Category: gallery
- Severity: low
- Type: DECISION
- What: The manifest and the spec say `plain` is the default, but every tile except "Plain" passes `variant="surface"`, including the Default ("Date") tile. The rule "Pages begin with a standalone default" and "the base rule renders the manifest's default" then shows a non-default treatment first.
- Evidence: `manifest.ts:106`; `calendar.md` Variants ("`plain` (default), `surface`"); `gallery.tsx` `GalleryCalendar` (`variant="surface"`), with `GalleryCalendarPlain` the only plain tile.
- Options:
  - A: Make `surface` the default, the way it is used.
  - B: Show plain in the Default tile.
  - Recommended: A, if F-20's A is taken, since a standalone calendar is the common case. Otherwise B.
- Visual: the Default tile, plain against surface.

### F-22  Heading semantics are inconsistent: CardTitle is a div, the Panel title is a span, and Calendar months are always h2
- Families: card, panel, calendar (compared with popover)
- Category: a11y
- Severity: medium
- Type: FIX
- What:
  - CardTitle renders a `div`, so card titles aren't navigable as headings.
  - Panel's title renders a `span`, yet PanelSection defaults to `h3`, commented as "a panel titled by an h2 region". That puts a gap in the page outline.
  - Calendar hard-codes `h2` month titles, with `aria-live` on every month, so a two-month range announces both.
  - PopoverTitle is `h2`.
  - Only PanelSection has a `headingLevel` prop.
- Evidence: `primitives.tsx:244-246` (CardTitle `<div>`); `:558` (Panel title `<span className="area-panel__title">`); `:581` (comment "Defaults to 3 (a panel titled by an h2 region)"); `:1048` (PopoverTitle `<h2>`); `Calendar.tsx:231` (`<h2 … aria-live="polite">` per month).
- Visual: n/a (a headings-outline listing for a page holding a Card, a Panel and a Calendar).

### F-23  Table: the scroll wrapper can't be reached by keyboard, and interactive rows promise a click only one cell keeps
- Families: table (compared with card)
- Category: a11y / interaction
- Severity: medium
- Type: DECISION
- What:
  - `.area-table-wrapper` scrolls horizontally but is not focusable or named. Keyboard users can't scroll a wide table, which is axe's "scrollable-region-focusable".
  - React forwards the ref and props only to `<table>`, so consumers can't add `tabIndex` or a label to the wrapper.
  - `interactive` paints a whole-row hover plate, but the demo's only click target is a link in the first cell.
  - Card solved the same whole-object problem with a stretched link.
  - Selected and hovered rows have no forced-colours treatment. Calendar, the swatch picker and the alignment picker have one.
- Evidence: `navigation.css:121-129` (wrapper `overflow-x: auto`); `primitives.tsx:972-984` (wrapper `div` without props or ref); `gallery-variants.tsx:55` (`<a href>` in the first cell only); `surface.css:405-424` (Card block-link pattern); `table.md:37` ("Hover plate only when a row is clickable"); no `forced-colors` block in the Table section of `navigation.css`.
- Options:
  - A: Add `.area-table__link` with Card's stretched `::after` over the row (`tr { position: relative }`), make the wrapper focusable and labelled when it overflows, and add a forced-colours row rule.
  - B: Keep as a composition and document that consumers must make rows clickable.
  - Recommended: A. It reuses a pattern the owner already approved, and the scroll issue is a WCAG failure.
- Visual: the interactive Table with the pointer on the Status cell: the plate shows but the click does nothing (current), against a clickable row (A).

### F-24  Table's sort header: a padded Button in a padded cell misaligns the label and makes the header taller
- Families: table
- Category: visual
- Severity: low
- Type: FIX
- What: The sorting tile nests a ghost `sm` Button inside a `th` that already has 8/12 padding. The header row grows to about 28 + 16 = 44, against 36 in every other tile, and the label moves in by the Button's own inset, off the column's text edge. The arrow is a text character (↑↓), not a glyph. `inset.css` already provides `.area-button--align-start` and `--align-end` to pull a ghost button onto the text edge. Heights computed from CSS; not measured in a browser.
- Evidence: `gallery.tsx:1953`; `navigation.css:150-151` (`th` padding `--_cell-inset` / `gutter-md`); `inset.css:229-230` (align-start and align-end margins).
- Visual: the default header against the sorting header, with the column's text edge drawn.

### F-25  Stale specs, statuses and system text in these families
- Families: all ten
- Category: docs-drift
- Severity: medium
- Type: FIX
- What: Specs contradict the code or owner decisions. Readers such as the next session or the visual guide will take wrong values from them.
- Evidence:
  - `table.md:3` "in review" (the family is Complete); `:86` shell border rgb(243) (now #e2); `:77` "37" against `:156` "36"; `:129-130` cite `navigation.css:169-176, 194`, which are now 176 and 196.
  - `panel.md:76-79` anatomy (bar 37, title 400, heading 400); `:113` rows `control-md`; `:118` bar 37; `:130` gaps 8/6; `:132` inset tiers `gutter-xs/sm/md/lg`; `:136` "Heading row height stays 32"; `:159` Card `shadow-1`; `:162` rules `border-divider` (now decorative).
  - `calendar.md` Anatomy: cells 32, day 28, 14/20, title 400; `:174` Peers "Menu / Nav row hover bg-hover" (they now use `bg-component-hover`).
  - `color-swatch.md:48,62,72,92,107` (22% ink hairline, 8px tiles, radius 4, "Settled: ink at 22%"); now a solid neutral-50 edge, a 5-cell pixel mask and a 20% corner.
  - `color-swatch-picker.md:3` "in review"; `:77,90` cell radius 8/9/10. Computed: `swatch × 0.2 + 4`, so 7.2 / 8 / 8.8 (`color.css:96`).
  - `color-picker.md:3` "in review"; `:164` eyedropper hover "bg-hover" (ghost Buttons now use `bg-component-hover`).
  - `alignment-picker.md:3` "in review"; the sm cell "22 (min 20)" now computes to `max(20, (28 + 12)/2) = 20`.
  - `inspector.md:46` (captions 12/16, 6 above), `:49` and `:100` (xs and lg tiers, removed).
  - `property-list.md:33` ("value ends 8 before the first button", now `--_panel-gap` 12 at md); `:60-62` open question on the 8px small inset (the sm inset is now 12).
  - `DESIGN_SYSTEM.md:53-55` (Checkbox, Radio, Chip and AlignmentPicker "await owner review"; all are Complete).
  - `HANDOFF.md:344-352` ("Next": "review the 20 In-review families").

### F-26  Panel insets don't follow density, although the code comment says they do
- Families: panel (also property-list and box-field through `--_panel-*`)
- Category: system-rule / docs-drift
- Severity: low
- Type: DECISION
- What: The size comment says a panel's tier "steps on the *gutter* ramp … so a panel tightens with the system". The rules use the flat spacing ramp: 12 and 16 insets, 8 and 12 gaps. Under compact density the controls shrink but the insets stay, the opposite of the comment and of the planned compact inspector. The chevron and handle comments still say "8 in a small panel, 12 at md".
- Evidence: `panel.css:339-344` (comment) against `:24, 30-32, 349-355` (`space-12` and `space-16`); `panel.css:219`; `property-list.css:54-55`; `HANDOFF.md:19-20` (compact density planned for Figma and Notion).
- Options:
  - A: Move the insets and gaps to the gutter and gap ramps now, so compact density tightens panels.
  - B: Keep fixed insets, fix the comment, and let compact density override `--_inset` explicitly.
  - Recommended: B for now. The owner tuned 12/16 by eye in batch 8, so record the compact values when that density pass happens.
- Visual: Panel sm and md at default and compact density.

### F-27  PropertyList and the Panel chevron read Panel's generic private `--_inset`
- Families: property-list, panel (color-picker and popover use the same name)
- Category: system-rule
- Severity: low
- Type: FIX
- What: The PropertyList handle sizes and places itself from `var(--_inset, 12px)`. That property is Panel's, but ColorPicker (`16px − border`) and Popover (`12 − border`) also define `--_inset`, so a PropertyList placed in either inherits their value. `--_panel-gap` and `--_panel-row-gap` were published under a `--_panel-` prefix for exactly this reason; the inset was not.
- Evidence: `property-list.css:37,42`; `panel.css:24,214`; `color.css:196`; `surface.css:878`; `inset.css:3-4` ("Component-local inputs are reset on every backplate to prevent nested leakage").

### F-28  Property list tiles mix tiers: md panels with sm controls
- Families: property-list, panel
- Category: gallery / consistency
- Severity: low
- Type: DECISION
- What: The Panel audit rebuilt every tile with "controls at the panel's tier (sm panel, sm controls)". The Fills and Effects tiles use `Panel size="md"` (32px rows and action column) holding `size="sm"` (28px) ColorFields, Selects and icon Buttons. The One item tile uses an sm panel, so the family's three tiles show two tiers. Panel has no size context, so every control must repeat the tier by hand.
- Evidence: `gallery.tsx:842-848` (`Panel size="md"` / `"sm"`); FillsSection (`ColorField size="sm"`, `inspectorButton` `size="sm"`); `gallery.tsx:1595-1598` (tier comment); `inspector.md:101`; `panel.css:37,270` (`--_row` = `control-md` at md).
- Options:
  - A: Panel provides its tier through context, and panel-aware controls default to it.
  - B: Fix the three demos to one tier.
  - Recommended: B now. Raise A with the compact density plan, since it changes every control's default.
- Visual: the Fills tile as is (28 fields in a 32 grid) against an sm panel.

### F-29  A linked Card covers controls outside four named slots
- Families: card
- Category: interaction
- Severity: low
- Type: FIX
- What: Only controls inside the header action, footer, list and description (plus overlays) are lifted above the stretched link. A control in a well (the Feature template's row buttons), a carousel, or a Slider placed directly in the content (the Music template) sits under the link's `::after` and can't be clicked once the card is linked. No current tile combines the two; this is a latent trap for consumers. Code reading.
- Evidence: `surface.css:425` (lift list), `:417-423` (`::after` with `z-index: 1`); `card.tsx` `CardTemplateFeature` (well Buttons) and `CardTemplateMusic` (a Slider as a direct child of `CardContent`).

### F-30  Four swatch shapes across the system; ColorSwatch's corner is not a radius role
- Families: color-swatch, color-swatch-picker, color-field (compared with chip and token)
- Category: consistency / system-rule
- Severity: low
- Type: DECISION
- What: ColorSwatch's corner is 20% of its side. The owner approved it, but it isn't a role, so Sharp still rounds swatches while every other shape squares. Chip swatches are circles with a translucent 20% ink ring. Token and Code swatches are `radius-small − 2` with their own ring. The palette's checked cell switches to `radius-control-xs`. Figma's split translucent chit (opaque half and checker half) is still an open owner question.
- Evidence:
  - `color.css:32-34` (`--_shape: 0.2`) and `:146-148` (palette checked `radius-control-xs`).
  - `chip.css:135-140` (radius full, `inset … fg-default 20%`); `token.css:36-41` (`radius-small − space-2`, `token-swatch-ring`).
  - `color-swatch-picker.md:129` and `color-picker.md:208` ("Figma splits a translucent colour's chit"); `HANDOFF.md:236`.
- Options:
  - A: Keep 20% and record swatches as an identity shape like circles, exempt from the preset. Chip and Token adopt ColorSwatch's solid edge recipe while keeping their outlines.
  - B: Derive the swatch corner from `radius-small` scaled by size, so it follows presets.
  - Recommended: A. The owner tuned 20% over six rounds, and unifying the edge recipe gives visible consistency at little cost. Leave split chits unbuilt unless the owner asks.
- Visual: ColorSwatch, Chip swatch, Token swatch and a palette cell in a row at Standard and at Sharp; a split chit mock beside the current 50% swatch.

### F-31  Picker cells: two size ladders and two selection models, and the Alignment grid question is still open
- Families: color-swatch-picker, alignment-picker
- Category: consistency
- Severity: low
- Type: DECISION
- What: Both are 3 × n radio grids with the same `bg-hover` plate and the same neutral selection ink, but they use different cell ladders. They also select differently: the swatch picker uses a surface plate with a 2px ring, the alignment picker bars with no plate, by an earlier owner decision. The batch 10 owner question about sizing the alignment grid to the layout (Figma 88 × 56, one field column by two rows) is unanswered.
- Evidence: `color.css:82-84` (cells `control-xs` / `-sm` / `-md` = 24/28/32); `alignment-picker.css:15-17` (`(control + icon)/2` = 20/24/32); `color.css:110-113` against `alignment-picker.css:52-54`; `alignment-picker.md` Visual pass ("the grid-to-layout sizing is raised with the owner").

  | Tier | Swatch cell | Alignment cell |
  |---|---|---|
  | sm | 24 | 20 |
  | md | 28 | 24 |
  | lg | 32 | 32 |
- Options:
  - A: Keep both and answer the 88 × 56 question separately, as a `layout` option on AlignmentPicker (Figma's non-square cells).
  - B: Align the md cells on one ladder.
  - Recommended: A. The jobs differ (a colour needs a larger chit), and Figma's grid proves the non-square case.
- Visual: both pickers at md side by side; the Alignment picker at 80 × 80 against Figma's 88 × 56.

### F-32  ColorPicker tracks and thumbs differ from Slider's
- Families: color-picker (compared with slider)
- Category: consistency
- Severity: low
- Type: DECISION
- What: The picker's tracks are 16px pills that carry colour data, with 16px thumbs drawn as a 4px white ring, 20% edges and their own lift. Slider has a 4px rail and a 16px thumb with a 1px border and `shadow-1`. The difference is deliberate (Figma's picker), but the guide should show it.
- Evidence: `color.css:199-203, 234-240` against `slider.css:20-21, 217-223`.
- Options:
  - A: Keep: a colour track displays data, and a rail doesn't.
  - B: Share one thumb.
  - Recommended: A.
- Visual: a Slider above the hue slider, both at 3× zoom.

### F-33  Surface geometry map (corners and insets) for the guide
- Families: card, panel, table, calendar, color-picker (compared with dialog, popover)
- Category: consistency
- Severity: low
- Type: DECISION
- What: Each surface's corner and inset is documented on its own, but together they form a set with no stated rule.
- Evidence (standard preset, md):

  | Surface | Corner | Content inset | Source |
  |---|---|---|---|
  | Card | 24 (22 / 28) | media 8, text 16 | `surface.css:40-44` |
  | Dialog | 16 | 16 | `surface.css:761-767` |
  | Popover | 12 | 12 | `surface.css:878` |
  | Panel | 12 | 16 (sm 12) | `panel.css:24,60` |
  | Calendar surface | 12 | 12 (8 top) | `calendar.css:39-42` |
  | ColorPicker | 12 | 16 | `color.css:196,211` |
  | Table | 12 | cells 12 inline | `navigation.css:127,151` |
- Options:
  - A: Document the rule in DESIGN_SYSTEM: floating and in-flow containers use the container role with any inset; surfaces whose corner holds a control (Card, Dialog) derive their corner from that control plus its distance, capped as in F-1.
  - B: Harmonise the insets.
  - Recommended: A. Every inset above is owner-approved or measured.
- Visual: all seven surfaces outlined at the same scale, with corner and inset callouts.

### F-34  RTL chevrons point the physical way in Calendar and Panel
- Families: calendar, panel
- Category: a11y
- Severity: low
- Type: FIX
- What: Calendar's previous and next Buttons and Panel's collapsed-section chevron rotate a glyph by a fixed SVG angle, so in RTL "Previous month" points left, toward the next month. Calendar's arrow keys, by contrast, are mirrored.
- Evidence: `Glyph.tsx:13` (`rotate(${rotate} 8 8)` applied in the SVG); `Calendar.tsx:206,218,233,235` (`rotate={90}` / `{270}`); `Calendar.tsx:154-155` (keys mirrored); `primitives.tsx:600` PanelSection (`rotate={open ? undefined : 270}`); no `:dir(rtl)` rule in `calendar.css` or `panel.css` for icons.

### F-35  Test and guard gaps for these families
- Families: calendar, card, table, color-picker
- Category: interaction
- Severity: low
- Type: FIX
- What:
  - Calendar's keyboard model (the source of F-9) has no test; tests are server-render only.
  - CardLink, the Table's selected and hovered paint, and the Panel resize have only class-name checks, or none.
  - The cohesion lift guard lists `.area-calendar--surface` but not `.area-color-picker`, although DESIGN_SYSTEM names it as a floating surface.
  - No test checks "a rule inside a container is not darker than its edge" (F-6 passed unnoticed).
- Evidence: `calendar.test.mjs` (render tests only); `gallery-primitives.test.mjs:85-90`; `cohesion.test.mjs:47`; `DESIGN_SYSTEM.md:90-93`.

### F-36  Palette rungs used directly where a semantic role exists or is needed
- Families: card, color-swatch
- Category: system-rule
- Severity: low
- Type: FIX
- What: "Component CSS consumes semantic colors, not numbered palette rungs." The Card edge and media fill and the ColorSwatch edge read neutral rungs inside `light-dark()`. The swatch edge `light-dark(neutral-50, neutral-800)` equals `bg-component` (#f7f7f7 / #282828) exactly, and the Card media fill equals `bg-stripe` exactly. The Card spec explains why it didn't reuse the stripe role. Rungs don't respond to the contrast preference.
- Evidence: `surface.css:56,63`; `color.css:41`; tokens `bg-component light-dark(#f7f7f7, #282828)`, `neutral-50 #f7f7f7`, `neutral-800 #282828`; `DESIGN_SYSTEM.md:37-38`; `card.md:143`.

### F-37  Gallery hygiene in these families
- Families: all ten
- Category: gallery
- Severity: low
- Type: FIX
- What:
  - Size tiles label their content "Fill" rather than the tier name.
  - Tile titles use three vocabularies:
    - "Size / sm" here against "Size / small" elsewhere.
    - "Accent" (Calendar) against "Tone / accent" (AlignmentPicker).
    - Default tiles titled "Date", "Fill", "Palette" and "Alignment".
    - The swatch picker has both "Palette" and "Palette grid".
  - Manifest booleans without a tile of their own: ColorField `full-width`, and Panel `action-column` (shown only inside the Figma recipe and the Resizable tile).
  - Card content demos use tinted Badges (info and accent) where neutral is the system default.
  - Card's carousel paging uses Fluent chevrons, while Calendar's paging uses the Area chevron glyph for the same job.
  - No person names appear, so the Irene Yamaguchi rule is not triggered.
- Evidence: `gallery.tsx:280,304,328` (`Field label="Fill"`); `build.mjs:305-379, 494-506, 839-862, 951-962`; `DESIGN_SYSTEM.md:236-237`; `card.tsx:124,194` (`tone="info"`, `tone="accent"`); `card.tsx:218-219` (FluentChevronLeft and Right) against `Calendar.tsx:233-236` (Glyph chevron).

### F-38  Reveal-on-hover affordances fade at different speeds
- Families: card, panel, property-list
- Category: consistency
- Severity: low
- Type: DECISION
- What: Three affordances follow the same pattern: hidden, shown on hover or focus, always shown on touch. Card's overlay fades over 200ms; Panel's chevron and PropertyList's handle appear instantly.
- Evidence: `surface.css:437-443` (`transition: opacity 200ms`); `panel.css:216-223` (no transition); `property-list.css:50-60` (no transition).
- Options:
  - A: One reveal timing, the motion token, for all three.
  - B: Keep: chevrons and handles are small, and instant reads as responsive.
  - Recommended: A, using `--area-transition`, so the motion axis governs all three.
- Visual: n/a (a timing strip).

## Confirmed consistent

- Neutral by default, accent by override. Table selection (`bg-component-active`), Calendar selection (`neutral-solid`), the swatch picker's checked ring (`fg-default`) and the alignment bars (`fg-default`) are all neutral; accent appears only through `tone="accent"` (`calendar.css:21-35`, `alignment-picker.css:23-25`).
- Foreground stays fixed on hover in all ten families; only plates or edges change (Card: `edge-control-hover`, `surface.css:411`).
- Table row plates use the shared hover and active pair, and hover excludes selected rows (`navigation.css:176,196`), matching Menu and Nav.
- The Calendar surface and ColorPicker carry the exact shared lift, with `border-decorative` and `radius-container`, matching Popover (`calendar.css:41-45`, `color.css:210-213`).
- Panel's bar, section and footer rules take the panel's own `border-decorative` edge (`panel.css:93,153,294`).
- ColorSwatch sm/md/lg (16/20/24) equal the swatch picker's swatches (cell − 8), and the picker cells are concentric with the swatch corner (`color.css:68-74, 96`).
- Every React wrapper here forwards its ref and spreads native props (Table's ref goes to `<table>`; see F-23 for the wrapper).
- ColorField, ColorSwatchPicker, AlignmentPicker and ColorPicker restore `defaultValue` on form reset.
- Forced-colour rules exist for Calendar, the swatch picker, the alignment picker and ColorPicker thumbs.
- Revealed affordances (Card overlay, Panel chevron, PropertyList handle) also show on `:focus-within` / `:focus-visible` and stay on under `hover: none`.
- Logical properties are used for the range band, overlays, the chevron column, the handle and the resize edge; physical placement is used only where the geometry is physical (AlignmentPicker `dir="ltr"`).
- Calendar has an APG grid structure: `role=grid`, roving tabindex, Home/End, PageUp/PageDown and Shift+Page, `aria-selected`, `aria-current="date"`, `aria-multiselectable`, and `abbr` on weekday headers. The exception is F-9.
- PanelSection collapsible is `h# > button[aria-expanded][aria-controls]` with `hidden` rows; the Panel resize handle is a `role=separator` with value, text and keyboard support.
- PropertyList has keyboard reorder (Arrow keys and Home/End), keeps focus on the moved handle, announces through a separate live region, and draws its drop line in neutral ink.
- Gallery tiles show one size per tile; multi-size containers appear only on the hidden docs pages (`pages.mjs:77,90,100,132`).
- No example people appear in these families' demos.
