# Interaction, behaviour, motion, accessibility and performance (prefix I)

System evaluation 2026-11-11. Read-only audit from source. Findings feed the conductor's plan.

## 1. Scope and method

Read: `docs/MOTION.md` (whole), `docs/DESIGN_SYSTEM.md` "CSS, manifest and React" and "Announcements",
`.claude/skills/area-interaction-pass/SKILL.md`, `.claude/skills/area-a11y-audit/SKILL.md`,
`docs/research/interaction-pass-2026-10-26/README.md`, `packages/tokens/src/axes/motion.ts`. Then the React source of
every interactive family in `packages/react/src/components/` (119 files, 18,439 lines; full reads of `overlay.ts`,
`Overlays.tsx`, the overlay, menu, tabs, dialog, segmented, slider, toast sections of `primitives.tsx`, `Combobox`,
`CustomSelect`, `CommandPalette`, `ContextMenu`, `Drawer`, `HoverCard`, `SplitButton`, `TagPicker`, `ListBox`,
`TreeView`, `Toaster`, `Splitter`, `ScrollArea`, `NumberField`, `SliderRange`, `DatePicker`, `Toolbar`, `ToggleGroup`,
`Composer`, `PropertyList`, `FileUpload`, `SelectionBar`; targeted greps of the rest). CSS: `surface.css` overlay,
dialog, menu and toaster sections, `drawer.css`, plus system-wide greps for transitions, literals, `:has()`,
`backdrop-filter`, `will-change`, `touch-action`, `pointer: coarse`, physical properties, `autofill`. Packaging:
`packages/react/package.json`, `packages/styles/package.json`, `packages/styles/scripts/build.mjs`, sizes of the built
`dist` files on disk (built by the conductor at 01:03).

Not verified: nothing was run in a browser (rule: no touching the running Electron; no builds). Behaviour claims are
read from code paths; where the platform decides (Popover API focus restore, `CloseWatcher` respecting a cancelled
Escape keydown) I state the Chromium behaviour I rely on. Touch, VoiceOver, Windows forced colours: not checked. Target
sizes at compact density: not measured.

Already settled and not repeated: the 2026-10-26 interaction pass (hover clocks, small marks, indicator slides,
disclosure heights), components-audit D1 (announcer), V2 (inactive), E-series overlay fixes.

## 2. Census

Legend. Keys: arrows (↕ ↔), H/E = Home/End, Pg = PageUp/Down, TA = typeahead, Esc. Focus model: R = roving tabindex on
items, F = root forwards focus (container is a Tab stop), AD = `aria-activedescendant`, N = native element, M = each row
focused as it is reached (menu). Overlay: TL = top layer via Popover API (`auto` light dismiss / `manual`), MD =
`<dialog>.showModal()`. Engine: `useAnchoredPosition` = `computePosition` (flip to opposite side, shift, align-edge
flip, 8 viewport padding, RTL mirror, CSS-zoom aware, re-run on scroll/resize/ResizeObserver).

### 2.1 Overlays and pickers

| Family | Keys | Focus in / out | Pointer | Placement | Enter / exit (MOTION role) | ARIA | Value / form |
|---|---|---|---|---|---|---|---|
| Popover (`AnchoredPopover`) | Esc (platform) | in: `[autofocus]` or first control, else surface (Overlays.tsx:84-90); out: trigger if focus inside (overlay.ts:177-180) | click toggles (`popovertarget`); outside press (platform) | engine, offset 8 (+17 arrow); arrow fixed at 50% (I4) | base / fast, opacity + 0.97 scale from trigger (surface.css:1813-1830) | trigger `aria-haspopup=dialog`, `aria-expanded`, `aria-controls`; surface `role=dialog`, title auto-labels | open/defaultOpen/onOpenChange |
| Menu (`AnchoredMenu`) | ↕ wrap, H/E, TA 1s, Tab closes, Esc (platform); trigger Enter/Space/↓ first, ↑ last, checked radio row first | M; pointer opens on surface, keys on row (Overlays.tsx:120-134); out: trigger | pointermove focuses row (168-172); checkbox / keepOpen / inactive stay open | engine, offset 4, clears a toolbar (`clearToolbar`) | base / fast | `menu`, `menuitem*`, `aria-labelledby` trigger, `aria-busy` loading | open state only |
| Menu sub (`MenuSub`) | → (← RTL)/Enter/Space open on first row; ←/Esc close to row | row → first sub row (keys only) | opens on pointerenter at once; closes when any sibling row takes focus (primitives.tsx:1849-1874); no safe area (I1) | engine, side right, first row level with the parent row | base / fast | `aria-haspopup=menu`, `aria-expanded`, `aria-controls` | none |
| Hosted Menu (Split button, Context menu, Model picker via trigger, Toolbar overflow, Zoom control, Time field, Breadcrumb) | ↕ wrap, H/E, TA (timer), no pointer→focus sync (I2) | per host (I2) | per host | per host | base / fast; Context menu fast/fast from pointer (context-menu.css) | `menu` | none |
| Context menu | Shift+F10, ContextMenu key; Esc and Tab close and return focus (ContextMenu.tsx:173) | pointer: surface; keyboard: first row | right-click at point, flips across pointer, whole-pixel | own math, 8 margin; doesn't follow or close on scroll (I19) | waits for `getAnimations()` before unmounting rows (95-101) | `menu`, acted-on item `data-context-target` | open/defaultOpen |
| Split button | ↓/↑ on chevron open on first/last | first row on every open, pointer included (SplitButton.tsx:77-88) | `popovertarget` | engine; text split end-aligned to group, icon split clears toolbar | base / fast | trigger `aria-haspopup=menu` | n/a |
| Model picker | Menu's | Menu's; opens on checked radio row | Menu's | Menu's, align end | Menu's | radio rows | value via callbacks |
| Tooltip | Esc capture-phase, consumed (overlay.ts:127-137) | never takes focus; opens at once on `:focus-visible`, not on a returning focus (Overlays.tsx:222-228, 282) | 500 delay, 300 skip window (global), 0 close; closes on any pointer move away, window blur, page hidden, pointer leaving window (250-268); name-only passes the pointer through | engine, offset 4 (+4 arrow) | fast / instant; instant inside skip window | `role=tooltip`, `aria-describedby` unless `describes={false}` | n/a |
| Toggletip | click pins; Esc; hover previews after 500 | returns focus from note to button on close (319-325) | outside press closes when pinned (330-335) | engine, offset 4 | tooltip's | `aria-expanded` = pinned, `aria-controls`, `aria-describedby` | n/a |
| Hover card | none of its own; Esc via hover intent | keyboard focus opens at once; blur closes at once, so the card's links are unreachable (I8) | 700 open / 300 close; pen + mouse only | engine, offset 8, align start | popover's | no relation from trigger (by design) | open state |
| Dialog | Esc (platform `cancel`) | in: first focusable = header close X (I15); trap and return: platform | backdrop closes only when the press began on it (primitives.tsx:2314-2317) | MD centred, even-pixel (surface.css:903-909) | moderate / base, opacity + 0.97; scrim fade | `dialog` / `alertdialog`, labelled/described | open/defaultOpen |
| Confirm dialog | Dialog's | in: Cancel (ConfirmDialog.tsx:49-56) | Dialog's | Dialog's | Dialog's | `alertdialog` | — |
| Drawer | Esc (modal platform; non-modal own) | modal: platform (first = close X); non-modal: first control, return to opener (Drawer.tsx:63-73) | backdrop press guard as Dialog's | MD or `popover=manual` | slow / moderate, translate 100% on `ease-drawer` | labelled | open/defaultOpen |
| Command palette | ↕ wrap, Ctrl+H/E, Enter, Backspace steps back, Esc steps back (query → step → close) | input focused on open (CommandPalette.tsx:150) | rows: pointermove highlights; backdrop: any click closes, no press guard (280; I14) | MD | shares Dialog's rule (surface.css:922-955), waits for `getAnimations()` before unmount | combobox + listbox, AD, results announced | no form |
| Custom select | closed: ↕/Enter/Space open on choice, H/E, TA; open: ↕ clamped, H/E, Pg ±10, Enter/Space choose, Alt+↑ choose-close, Tab chooses, Esc, grid ↔ | AD on trigger; filter field takes focus when filterable; blur closes (I6, I19) | rows pointermove highlight; `pointerdown` preventDefault keeps focus | engine, offset 4; grid anchors to Field | menu's | combobox (button) + listbox, `aria-multiselectable`, groups by index | hidden inputs; `required` aria only (I6); reset yes |
| Combobox | ↓/↑ open (Alt+↓ no highlight), Enter, Alt+↑ choose-close, Esc closes then clears, Tab chooses; IME-safe | AD on input; blur settles | rows pointermove highlight | engine on the field root | menu's; keeps last rows during exit (260-264) | combobox + listbox; group ids from label text (I20) | hidden input; no `required`; reset yes |
| Tag picker | ↓/↑ open/move, Enter toggle, Esc, Backspace removes last; IME-safe | AD on input; each Tag's dismiss is a Tab stop | field press opens | engine | menu's; keeps rows during exit | combobox + multiselect listbox | hidden inputs; no `required`; reset yes |
| Date picker | text field Enter commits (isComposing only, no 229; I7); Calendar keys | Popover's: in to the text field; `finish` returns to trigger (DatePicker.tsx:102) | Popover's | Popover's | popover's | trigger is a button with `aria-haspopup=dialog` | hidden input; no `required`; reset yes |
| Date range picker | Calendar's | Popover's | Popover's | Popover's | popover's | — | hidden inputs; no reset listener (I6) |
| Calendar | ↔ (RTL mirrored) ↕ ±7, H/E week, Pg ±month, Shift+Pg ±year, Esc cancels a pending range | R | hover previews range | inline | none | `grid`, `gridcell`, `aria-selected`, month via `useAnnouncement` | hidden inputs (multiple); reset yes |

### 2.2 Composites, fields and controls

| Family | Keys | Focus model | Pointer / drag | Motion | ARIA | Value / form | Notes |
|---|---|---|---|---|---|---|---|
| Tabs | ←/→ (or ↑/↓ vertical) wrap, RTL mirrored, H/E; automatic or manual | R | click | indicator `translate` + `inline-size` base ease-in-out | tablist/tab/tabpanel, panel `tabIndex=0` | value/defaultValue | indicator measured in a layout effect keyed on the items array (I10) |
| Segmented | all four arrows, H/E, always selects | R; in a Toolbar joins its roving | click | plate slide base ease-in-out | radiogroup/radio | hidden input, reset yes | same effect pattern (I10) |
| Toggle group | all four arrows, H/E | F (root `tabIndex` 0 → last / pressed / first) | click | state paint | group, `aria-pressed` | no form, no reset (I6) | I13 |
| Toolbar | orientation arrows, H/E | F, root mutated imperatively (Toolbar.tsx:54-72) | — | floating reveal fade | toolbar, `aria-orientation` | — | I13 |
| Nav | native links; section toggle button | N | hover actions | hover reveal fade | `aria-current=page`, `aria-expanded` | — | — |
| Breadcrumb | native; overflow Menu with `<a role=menuitem>` | N + Menu | — | — | — | — | — |
| Pagination | native | N | — | — | `nav`, `aria-current=page` | page/defaultPage | — |
| List box | ↕ (grid by geometry), ↔ grid, H/E, Enter/Space, TA 1s, Shift extends, Ctrl/Cmd+A; no Pg | R | Shift/Cmd click | small mark | listbox, `aria-multiselectable` | value / values; no form | `useLayoutEffect` without deps queries DOM every render (ListBox.tsx:129-135); context re-renders every option (I17) |
| Tree view | ↕ clamped, ←/→ (RTL), H/E, Enter/Space, TA with fallback | R | row click selects, chevron toggles | chevron rotate fast; expand instant (by rule) | flat `treeitem` with level/posinset/setsize, `aria-current` | expanded/selected ids | row actions are extra Tab stops inside the tree (I13); every row re-renders on focus (I17) |
| Accordion | native buttons only | N | — | body height slow / moderate ease-in-out, `hidden="until-found"` | `aria-expanded`, `aria-controls` | open state | no header arrow keys (I31) |
| Slider | native range + Shift×10 (RTL aware) | N | press lifts knob, drag after 2px, glide ≤60 steps | ratio eases fast, follows exactly while dragging | native, `aria-valuetext` = readout | value + `onValueCommit`; reset yes | reference implementation |
| Slider range | two native ranges; track picks nearer thumb | N | pointer capture on track, 2px drag threshold | ratios registered and eased | two named sliders | value + commit | `getComputedStyle` per move (SliderRange.tsx:94) |
| Number field | ↕ (Shift×10, Alt×0.1), H/E to bounds, Enter commits, Esc reverts; IME-safe; no Pg | N (`spinbutton`) | press-and-hold steppers 400 / 60ms; scrub handle with capture and Esc cancel | — | `spinbutton` valuenow/text | value + commit; reset yes | scrub modifier jump (I12); commit on every repeat tick |
| Time field | segment ↕/↔, H/E, Pg, Backspace/Delete | segments (`spinbutton`) | preset Menu | — | group of spinbuttons | hidden input; no reset (I6) | — |
| OTP field | one native input; ←/→ | N | paste cleaned, `one-time-code`, autofill painted | caret blink loop | input | internal `code` state, no reset listener (I6) | — |
| Input / Search / Password | native; Search Esc clears, IME-safe | N | — | hover on hover-in | native | Search keeps `query` state, no reset (I6) | autofill painted on Input only |
| Composer | Enter sends (IME + 229 safe), Shift+Enter newline, Esc collapses | N | file drop with depth counter, paste | — | label, `aria-busy` | reset yes | Escape not composition-guarded (minor) |
| Checkbox / Radio / Switch | native | N | — | small mark fast | native, `role=switch` | native; reset yes | — |
| Color picker | 2D area ← → ↑ ↓ Pg | N (range inputs) | capture on area and bars | knob lift | `aria-valuetext` | `onValueChange` per move, no commit of its own (I11) | — |
| Color swatch / Alignment picker | arrows, H/E | native radios | — | — | radios | native `required`, reset yes | the model for I6 |
| Splitter | ←/→ or ↑/↓ ±8 (Shift 32), H/E, Enter evens, Esc cancels drag (unreachable by pointer drag, I11) | separator `tabIndex=0` | capture; commits each pointermove | handle grows after 300ms rest | separator with value/text | size + onSizeChange only | I11 |
| Panel (resizable) | ←/→ | separator | capture; commits each move | width moderate ease-drawer, off while resizing | separator | width + onWidthChange only | measures `getBoundingClientRect` (scaled) where Splitter uses offset sizes (I11) |
| Scroll area | native scroller | viewport always `tabIndex=0` (I23) | bar drag with capture, track press jumps | bar fade | bars `aria-hidden` | — | per-scroll sync reads (I9) |
| Property list | handle ↕, H/E, Esc cancels drag | handle | capture; rects cached at start; no autoscroll | drop line | announces moves | — | context object rebuilt each render (I11, I17) |
| File upload | button | N | drop with depth counter; whole zone clicks | — | state via `useAnnouncement` | files callback | no paste |
| Toaster / Toast | F8 to region | region focus | pause on hover/focus | slow enter, base exit, FLIP reflow base | announcer (danger assertive) | — | not top layer (I3); no hidden-tab pause (I32) |
| Approval | ↕ (grid geometry), 1–9, Esc, Enter in "instead" field | buttons | settle guard | — | — | — | "instead" Enter not IME-guarded (I7) |
| Chart | Esc clears active | — | hover band | none by rule | — | — | — |
| Video player | own key handler; seek/volume raw ranges | N | idle hide 2s | — | named ranges | — | not Area's Slider (I25) |
| Board | buttons only | N | no drag between columns (I27) | — | `section` per column | — | — |
| Selection bar | Esc | rescues focus when its action unmounts (SelectionBar.tsx:66-83) | — | — | — | — | the model for I16 |

### 2.3 Motion tokens

Every transition and animation in `packages/styles/src/components` reads a `--area-duration-*`, `--area-fade-*`,
`--area-hover-in` / `--area-press-in` and `--area-ease-*` token. Literal times found: `--_sash-delay: 300ms`
(splitter.css:94, a documented wait), `transition: background-color 9999s` on OTP autofill (otp-field.css:116, the
standard autofill trick), and the loop periods multiplied by `--area-duration-loop` (display.css:181/274/374/414,
step.css:123, indicator.css:19, message.css:168, otp-field.css:81). No `transition: all`, no `cubic-bezier` or
keyword easing outside tokens, no `will-change`, one `contain` (figure.css:33). Layout properties that transition:
Accordion and disclosure `block-size` (documented Move), Panel `inline-size` (documented), Segmented / Tabs indicator
`inline-size` (documented), Code block `max-block-size` (code.css:568), Progress fill `inline-size`
(display.css:354, not listed in MOTION.md; I26).

## 3. Findings, most felt first

### I1. Submenus close on the way to them and open on a brush · defect · M · high confidence
Where: `MenuSub` (primitives.tsx:1815-1889). The row opens its submenu on `pointerenter` with no delay (1874). The parent
menu focuses every row the pointer crosses (`onMenuPointerMove`, Overlays.tsx:168-172), and the submenu closes on any
`focusin` of another parent row (primitives.tsx:1849-1859). Moving diagonally from "Share ›" toward its submenu crosses
the row below, which takes focus, which closes the submenu; brushing down a menu flashes every submenu. Best in class:
Radix/Base UI pointer grace polygon, Ariakit hover intent, macOS menus.
Families: Menu (any `MenuSub`), Context menu, Model picker, Toolbar overflow, Split button, Composer's menu when it nests.
Fix (rule): `useSubmenuIntent` in overlay.ts. Open after ~100ms of rest (or at once on a click / key); while the pointer
moves inside the triangle from its exit point to the submenu's near edge, suppress the parent's pointer-focus and the
close for up to 300ms; close on leaving the triangle or timeout. MOTION.md gets a "Submenu" row.
Visible change: submenus stay open while you travel to them and no longer flicker as the pointer passes.

### I2. Five menu engines, five behaviours · inconsistency (with defects) · M · high
Where: `AnchoredMenu` (Overlays.tsx:113-203), hosted `Menu` keys (primitives.tsx:1760-1782), `MenuSub`, Split button
(SplitButton.tsx:44-146), Context menu (ContextMenu.tsx:41-185); hosts of the hosted Menu also include Zoom control,
Time field and Toolbar overflow.
- Pointer→focus sync exists only in `AnchoredMenu`. In Split button, Context menu and every submenu the pointer paints
  the `:hover` plate while the keyboard's `:focus-visible` plate stays on another row: two highlighted rows, and the
  next arrow key continues from the stale one.
- Tab: `AnchoredMenu` closes and lets focus move on (150); Context menu cancels Tab and returns focus (173); Split
  button closes and lets it move (121).
- Which rows count: Split button `[role="menuitem"]:not([disabled])` (44-45) skips checkbox and radio rows when it
  focuses the first / last; Context menu `itemsOf` excludes only `[disabled]` (41-42); `enabledItems` excludes
  `data-disabled` and non-inactive `aria-disabled` (Overlays.tsx:111); hosted `menuItemsOf` another selector
  (primitives.tsx:1719-1721).
- Open focus: pointer-opened `AnchoredMenu` focuses the surface; Split button focuses the first row on every open.
- "Choose closes" is restated in three places (Overlays.tsx:160-166, ContextMenu.tsx:174-181, SplitButton.tsx:145).
Fix (rule): one `useMenuNavigation(surfaceRef, { onClose, entry })` (keys, typeahead from I5, pointer-focus sync,
pointer-leave returns focus to the surface, choose/keep-open rule, one item selector) used by every menu surface;
hosts only decide placement and trigger. Cohesion test: every `role="menu"` surface in the gallery uses it.
Visible change: one highlighted row under pointer and keyboard in every menu; identical Tab, Escape and keep-open rules.

### I3. Toasts appear under any open dialog, drawer, palette or popover · defect · S–M · high
Where: `.area-toaster { position: fixed; z-index: var(--area-z-toast) }` (surface.css:1696-1702); Toaster renders a plain
`<section>` (Toaster.tsx:164-176). Dialog, Drawer and Command palette are `showModal()` and menus/popovers are
popovers: all in the top layer, above every z-index. A toast raised during a modal flow ("Copied" from a Code block in
a dialog, "Saved" from a settings dialog, an error while a drawer is open) renders under the backdrop and is inert:
Undo can't be pressed, F8 can't focus it. The announcer already solved this for itself by moving into the modal
(DESIGN_SYSTEM.md, Announcements).
Families: Toaster, Toast; every modal family as context.
Fix: make the region `popover="manual"` and re-show it (hide + show) whenever a toast is added, so it is the newest top
layer entry; when a modal dialog is open, also move it into the dialog (the announcer's rule) so it isn't inert.
Visible change: toasts are visible and actionable over dialogs and drawers.

### I4. Popover and tooltip arrows point at the surface's middle, not at the trigger · defect · S · high
Where: arrow at `left: 50%` / `top: 50%` for every side (surface.css:1199-1202; tooltip arrow 1663). `computePosition`
aligns start/end and shifts inside the viewport (overlay.ts:71-89) and already computes the anchor's centre on the
surface (`originX` / `originY`, 92-93), but writes it only to `transform-origin` (overlay.ts:212).
With `align="start"`, Hover card's default align, or any trigger near a viewport edge, the arrow points at nothing.
Families: Popover (arrow), Tooltip (arrow), any family composing them with `arrow`.
Fix: write `--area-overlay-arrow` (the origin on the cross axis, clamped to corner radius + half the arrow, rounded) and
position the arrow from it. Visible change: the arrow always points at its trigger.

### I5. Five typeahead implementations · inconsistency · S · high
Where: `AnchoredMenu` (Overlays.tsx:151-158: 1s, timestamp, a first letter starts after the current row), hosted Menu
(primitives.tsx:1769-1776: timer, always from the next row, Space never typed), List box (ListBox.tsx:195-201:
`data-text`), Tree view (TreeView.tsx:174-186: falls back to the last letter; `node.label.toLocaleLowerCase()` assumes
a string label), Custom select (CustomSelect.tsx:16 `TYPEAHEAD_MS = 500`, 304-317: repeat-letter cycling, Space inside a
search). Only Custom select cycles "a a a" and types "New f"; its window is half everyone else's.
Families: Menu, Menu sub, Context menu, Split button, Model picker, Toolbar overflow, List box, Tree view, Custom select.
Fix: `createTypeahead({ reset: TYPEAHEAD_RESET })` in overlay.ts with cycling, Space-while-searching and a `textValue`
fallback; used by I2's hook and the list families. Visible change: the same typing works in every list.

### I6. Form contract incomplete: `required` doesn't block submit; seven families ignore form reset · defect · M · high
Where:
- Hidden inputs carry the value for Custom select (CustomSelect.tsx:466-469), Combobox (286), Date picker (139), Tag
  picker (229), Date range picker, Time field, Segmented (primitives.tsx:2436). A hidden input can't be `required` or
  report validity. Custom select's `required` only sets `aria-required` (451); Combobox, Date picker, Date range picker,
  Tag picker, Time field, Segmented, Toggle group have no `required` at all. A form submits empty with no native
  message. (Color swatch picker and Alignment picker use native radios and do it right.)
- Reset: 14 files each copy the same `addEventListener("reset", … queueMicrotask …)` block. OTP field (`value={code}`),
  Search field (`value={query}`), Time field, Date range picker, Slider range, Box field and Toggle group keep internal
  state and have none, so a form reset clears the DOM and leaves the old value painted and announced, against
  DESIGN_SYSTEM.md "Uncontrolled state stays in step with the native input and form reset".
Fix (rule): `useFormField({ name, form, value | values, required, disabled, onReset, focus })`: renders one visually
hidden, `tabIndex=-1`, `aria-hidden` native control that carries `required` and `setCustomValidity`, focuses the
visible control on `invalid`, and owns the reset listener. Every value family uses it; cohesion test for `reset` and
`required` on every family with `name`. Visible change: required pickers stop empty submits and show the browser's
validation at the field; Reset restores every field.

### I7. IME composition guard missing or partial in five Enter handlers · defect · S · high
Where: Command palette `handleKeyDown` (CommandPalette.tsx:194-201) has no guard: Enter that confirms a Japanese or
Chinese candidate runs the highlighted command. Approval's "instead" field (Approval.tsx:204) submits the answer the same
way. Color field (ColorField.tsx:66) commits mid-composition (low impact). Date picker (125), Editable text (84) and Zoom
control (90) test `isComposing` but not `keyCode === 229`, which Safari sends after `compositionend` (the reason
Composer, Combobox, Tag picker, Number field test both, audit G-15).
Fix: one `composing(event)` helper used by every text-field key handler; cohesion test that any `"Enter"` handler on an
`input` / `textarea` calls it. Visible change: none for Latin input; CJK users stop triggering commands while typing.

### I8. Hover card links can't be reached from the keyboard · defect · S · high
Where: Hover card trigger `onBlur` calls `hide(0)` (HoverCard.tsx, cloneElement handlers) and the card has no focus
handling, so Tab from the trigger into the card's first link closes the card. Toggletip already has the rule
(`leaves`, Overlays.tsx:338, 350, 358). Fix: close on blur only when focus leaves both trigger and card; Escape returns
focus to the trigger. Families: Hover card (and Mention / Citation where they compose it).

### I9. Scroll area does synchronous layout work on every scroll event · defect (perf) · S · high
Where: ScrollArea.tsx:51-79. Each `scroll` event runs `update()`: two `getComputedStyle` per axis, `scrollHeight` /
`clientHeight` reads, two attribute toggles and a `setAttribute("data-scrolling")` plus a timer, without a frame
coalesce. Scroll area is inside every anchored Menu, Custom select, Combobox, Tag picker, Command palette list and
Drawer body, so every scroll of every list pays it (trackpads fire 60–120 events a second).
Fix: rAF-coalesce `update`; cache the bar paddings in the ResizeObserver callback; set `data-scrolling` only when
absent. Visible change: smoother scrolling in long menus and drawers.

### I10. Tabs and Segmented re-measure on every parent render · defect (perf) · S · high
Where: `useTabIndicator(list, buttons, value, tabs)` (primitives.tsx:2033-2056) runs a layout effect keyed on `tabs`,
which is `useMemo(..., [source])` (2102); Segmented's effect is keyed on `options` (2393). A consumer writing
`items={[…]}` inline (most demos and products) gets a new array each render, so every render does two
`getBoundingClientRect` calls (forced layout in the commit), `getComputedStyle` (Segmented 2382) and a new
ResizeObserver. Fix: key the effect on the selected value plus a joined signature of the item values; keep one
observer. Families: Tabs, Segmented, Code block's language tabs. Visible change: none, less jank in busy screens.

### I11. Drags commit every pointer move and three of them have no commit callback · inconsistency (perf) · M · high
Where: Splitter calls `onSizeChange` and re-renders both panes on every `pointermove` (Splitter.tsx:107-111); Panel's
resize the same (primitives Panel, `onWidthChange` 622, handlers ~678-686) and measures the scaled
`getBoundingClientRect` width where Splitter deliberately uses layout lengths (Splitter.tsx:49); Color picker's area and
bars emit `onValueChange` per move and expose no `onValueCommit` (ColorPicker.tsx:107, 371-372); Property list sets a
new drop object per move and rebuilds an unmemoised context (PropertyList.tsx:86-104). Slider, Slider range and Number
field already have `onValueCommit` (MOTION.md: "A host whose change is costly applies it in onValueCommit"). Splitter's
Escape-to-cancel (121-123) can't fire on a pointer drag, since its `pointerdown` `preventDefault` stops the handle taking
focus; Number field's scrub installs a window Escape for exactly this (NumberField.tsx:145-152).
Fix (rule): `useDrag({ onMove, onCommit, onCancel, threshold })`: pointer capture, rAF batching of moves, window Escape
cancel, 2px threshold (Slider's); Splitter `onSizeCommit`, Panel `onWidthCommit`, Color picker `onValueCommit`; Panel
measures layout lengths as Splitter. Visible change: panel and splitter drags stay smooth with heavy content; hosts can
persist on release.

### I12. Number field scrub jumps when a modifier changes mid-drag · defect · S · high
Where: `moveScrub` computes `steppedNumber(origin.value, ticks * multiplier, …)` from the drag's origin
(NumberField.tsx:154-165), so pressing Shift halfway multiplies the whole travel by 10 and releasing it jumps back. No
pointer lock, so the scrub stops at the screen edge (the design tool reference locks the pointer). Fix: rebase the origin
(x and value) whenever the multiplier changes; optional `requestPointerLock` while scrubbing. Visible change: Shift and
Alt refine from where the value is.

### I13. Three roving-focus models · inconsistency · M · high
Where: item `tabIndex` (Tabs 2148, Segmented 2412, List box, Tree view 220, Calendar); root forwarding with the
container as a Tab stop (Toolbar.tsx:54-72, mutating `root.tabIndex` behind React's `tabIndex={0}`; ToggleGroup.tsx:
106-125); `aria-activedescendant` (Combobox, Custom select, Tag picker, Command palette; correct for fields). Root
forwarding means Shift+Tab lands on the container first, a screen reader announces the group before the item, and an
empty or all-disabled toolbar is a Tab stop that holds nothing. Arrow semantics differ: Segmented and Toggle group take
both axes, Tabs and Toolbar only their orientation. Tree view rows' `actions` are buttons inside `treeitem`, each its own
Tab stop, so the tree is no longer one stop (TreeView.tsx:225).
Fix (rule): `useRovingFocus(container, { orientation, loop, rtl, remember })` writing item `tabIndex`, used by Toolbar,
Toggle group, Segmented, Tabs, List box, Tree view; row actions inside a tree get `tabIndex=-1` and are reached with →
from the row (as the file-tree reference does) or by a documented key. Visible change: one Tab stop per composite
everywhere, the same arrows per orientation.

### I14. Modal surfaces differ in dismiss guard and scroll lock; the lock shifts layout · inconsistency · S · high
Where: Dialog and Drawer close on the backdrop only when the press began there (primitives.tsx:2314-2317,
Drawer.tsx:106-107); Command palette closes on any click whose target is the dialog (CommandPalette.tsx:280), so a text
selection dragged out of the field closes it. Scroll lock: `html:has(.area-dialog__modal:modal)` (surface.css:956) and
`html:has(.area-drawer__modal:modal)` (drawer.css:44), none for `.area-command-palette__modal`, so the page scrolls
behind the palette. `overflow: hidden` on `html` with no `scrollbar-gutter` (none in the repo) shifts the page by the
scrollbar's width on classic-scrollbar platforms whenever a modal opens.
Fix (rule): one modal rule in surface.css for all three (`:is(.area-dialog__modal, .area-drawer__modal,
.area-command-palette__modal)`) with `scrollbar-gutter: stable` beside the lock, and one `useModalDialog` hook (sync
`showModal`/`close`, press-began-on-backdrop, exit wait via `getAnimations`) for Dialog, Drawer, Command palette.

### I15. Dialog and Drawer open with focus on the close button · refinement · S · high
Where: the header close precedes the body in the DOM (primitives.tsx:2283-2290; Drawer.tsx:87-88), and `showModal()`
focuses the first focusable element, so every keyboard open rings the X and a screen reader starts at "Close dialog".
Confirm dialog focuses Cancel itself (ConfirmDialog.tsx:49-56); Popover focuses `[autofocus]`, else the first control
(Overlays.tsx:84-90). Fix: an `initialFocus` rule shared by Popover, Dialog, Drawer: `[autofocus]`, else the first
control in the body, else the footer's least destructive action, else the surface (`tabIndex=-1`); never the close.

### I16. Focus falls to the page when a focused control removes itself · defect · S–M · medium-high
Where: Toast dismiss (primitives.tsx:2020; Toaster removes the item after its fade, Toaster.tsx:83-93), Chip, Tag,
Attachment, Alert and Prompt suggestions `onDismiss`; nothing moves focus. Selection bar already rescues focus when its
action unmounts (SelectionBar.tsx:66-83) and Tag picker refocuses its input (TagPicker.tsx:212). Fix:
`useFocusRescue(container, fallback)` from Selection bar's logic: a dismissed toast hands focus to the next toast, else
the region's origin; a dismissed chip or tag to its neighbour, else the group. Cohesion test: every `onDismiss` family.

### I17. No row memoisation or windowing anywhere · opportunity (perf) · L · high
Where: no `React.memo` in the package and no virtualisation. Tree view sets `focused` on every row focus and re-renders
every row (TreeView.tsx:221); its sticky-branch measure reads rects for many rows per frame (89-104). List box's context
changes with `chosen` and re-renders every option (ListBox.tsx:136-142), plus a dependency-less layout effect that
queries the DOM every render (129-135). Combobox and Custom select build groups with copy-on-append, O(n²)
(Combobox.tsx:265-269, CustomSelect.tsx:383). Menu, Custom select, Combobox and Command palette render and
`highlightMatch` every row on each keystroke. A layers panel, a file list or a font picker with a few thousand rows will
lag on every arrow key. Fix: memoised row components with a state/actions split context; push-based grouping;
`content-visibility: auto` with `contain-intrinsic-block-size` on list rows as a first step; then an opt-in
`virtualize` on List box, Tree view, Custom select, Combobox and Command palette that keeps `aria-activedescendant` /
roving focus and `aria-setsize` / `posinset` correct.

### I18. 3.4 MB unminified stylesheet, one entry · opportunity (perf, bundle) · M · high
Where: `packages/styles/dist/area.css` is 3,376,156 bytes (518,880 gzipped): tokens 2.04 MB (axes.css 1,632,416 bytes:
every preset of every axis; e.g. 385 `data-area-tint-hue` selectors) and components 1.22 MB including comments.
`build.mjs` parses with esbuild but writes the unminified source (`writeFileSync(..., css)`, lines 40-52). `exports`
offers only `area.css`. React is fine for tree shaking (`sideEffects: false`, `/* @__PURE__ */` on every forwardRef), but
Overlays.tsx installs window listeners at import (223-228), a module side effect under `sideEffects: false`.
Fix: write esbuild's minified output; publish per-component (`@area/styles/components/*.css`) and per-axis entries for
apps that pin a theme; install the Overlays listeners on the first tooltip mount. Visible change: faster first paint and
theme switches; nothing else.

### I19. Anchored surfaces don't hide when their anchor scrolls away; Context menu ignores scroll · refinement · S · medium
Where: `computePosition` clamps into the viewport (overlay.ts:72) and `useAnchoredPosition` re-places on scroll, so a
menu whose trigger scrolled out of its scroll container stays pinned at the viewport edge over unrelated content. Context
menu is placed once (ContextMenu.tsx:68-92) and neither follows nor closes on scroll or resize. Fix: in the engine, when
the anchor is fully clipped by its nearest scroll ancestor, set `data-anchor-hidden` (hidden) for tooltips and hover
cards and close menus; Context menu closes on scroll and resize.

### I20. Combobox group ids are built from label text · defect · S · high
Where: `id={`${id}-group-${group}`}` and `aria-labelledby` (Combobox.tsx:292-293). A group named "Recent files" gives
an id with a space; `aria-labelledby` splits it into two missing ids, so the group is unnamed. Custom select and Command
palette use the index (CustomSelect.tsx:389, CommandPalette.tsx:228). Fix: index, as the peers.

### I21. `useLayoutEffect` used raw in 15 files; two private iso copies · inconsistency (SSR) · S · high
Where: raw in AssetCard, Chart, Composer, Command palette, Context menu, Combobox, Custom select, Design card, List box,
Property list, Tag picker, Toaster, Splitter, Selection bar, primitives; `useIsoLayoutEffect` defined twice
(overlay.ts:147, HoverCard.tsx:7). The peer range includes React 18.3, which warns on every server render of these.
Fix: export one `useIsoLayoutEffect`; cohesion test bans raw `useLayoutEffect`.

### I22. Coarse-pointer target growth in five families only · refinement · M · medium
Where: `@media (pointer: coarse)` targets in badge.css:254/294, splitter.css:69, switch.css:177, tag.css:144,
toggletip.css:70. Not in icon-only Button sm, Chip dismiss, Toast dismiss, Number field steppers, Tree view chevron,
Calendar cells, Slider thumb, Scroll area bars, Menu rows. Fix: one shared invisible-target rule (a `--area-hit` token
and a base `::after` recipe, as Badge's) applied by every control under 24 (44 coarse). Confidence medium: sizes at
compact not measured.

### I23. Scroll area's viewport is always a Tab stop · refinement · S · high
Where: `<div tabIndex={0} {...viewportProps}>` (ScrollArea.tsx:126). Hosts that know pass `tabIndex: undefined` (Menu,
Drawer, Command palette), but any standalone Scroll area whose content fits is an unnamed, empty Tab stop. Fix:
`tabIndex=0` only while `data-overflow-*` is set (the component already computes it).

### I24. Behaviour timings scattered · inconsistency · S · high
Where: Tooltip 500 / 300 / 0 (Overlays.tsx:26-28), Hover card 700 / 300 (HoverCard.tsx, not exported), typeahead 1000 vs
500 (I5), Scroll area hide 600, Video idle 2000, Number field repeat 400 / 60, `LOADING_DELAY` 300 / 1000, Toaster 5000,
Approval settle guard, Splitter sash 300 (CSS). They are waits, not motion, so literals are right, but one `timing.ts`
module would make them one vocabulary (DESIGN_SYSTEM.md: hover timing is `delay` / `closeDelay`).

### I25. Video player's seek and volume aren't Area's Slider · inconsistency · M · high
Where: raw `<input type="range">` (VideoPlayer.tsx:195-204) with their own CSS: no glide, no Shift×10, no commit, no
knob lift. Slider already has `buffered` for media. Fix: compose Slider.

### I26. Progress fill animates `inline-size` · refinement · S · medium
Where: display.css:354, `translate` + `inline-size` on `slow`. A progress that updates often lays out every frame; it is
not among MOTION.md's documented size exceptions. Fix: `scale` on a full-width fill from the start edge (resting at an
exact scale is acceptable for a bar), or add it to Crispness 2 with a reason.

### I27. Board has no drag and drop · opportunity · L · high
Where: Board.tsx has no pointer or drag handlers; Property list has the system's only reorder (keyboard + pointer +
announcement). A general-purpose kanban expects cards to move between columns. Fix: lift Property list's reorder into
`useReorder` (keyboard, pointer, autoscroll, announcement) for Board cards, Tabs and Tree view.

### I28. Tag picker uses deprecated Tag props; one Tab stop per tag · refinement · S · high
Where: `onRemove` / `removeLabel` (TagPicker.tsx:212), the deprecated names (DESIGN_SYSTEM.md: a close is `onDismiss` /
`dismissLabel`). Each Tag's dismiss is a Tab stop, so ten tags are ten stops before the field. Fix: `onDismiss`; tags
reached with ← from the empty field and removed with Backspace/Delete (the field already removes the last).

### I29. Command palette's hotkey listener · refinement · S · high
Where: CommandPalette.tsx:158-167, an effect with no dependency list (re-subscribes each render); fires while typing in
any field, on key repeat, and while another modal is open. Fix: deps, ignore `event.repeat`, skip when another
`dialog:modal` is open.

### I30. Toaster timers run while the page is hidden · refinement · S · high
Where: pause only on pointer / focus in the region (Toaster.tsx:122-137, 170-171). A toast shown while the window is in
the background expires unseen. No swipe to dismiss on touch. Fix: pause on `visibilitychange` and window `blur`.

### I31. Accordion has no header arrow navigation · opportunity · S · medium
APG's optional ↑/↓/Home/End between headers; Area's Accordion is native buttons only (Accordion.tsx:72). Low cost with
I13's hook.

### I32. Small per-placement costs in the engine · refinement · S · medium
`useAnchoredPosition` reads `getComputedStyle(anchor).direction` on every placement (overlay.ts:201) and listens to
capture-phase scroll on window per open overlay; Menu sub's `anchorRect` calls `getComputedStyle` twice more
(primitives.tsx:1836-1838). Read direction and paddings once per open.

## 4. Counts

32 findings. Defects 11 (I1, I3, I4, I6, I7, I8, I9, I10, I12, I16, I20; I2 and I11 also contain defects but are
counted as inconsistencies), inconsistencies 8 (I2, I5, I11, I13, I14, I21, I24, I25), refinements 9 (I15, I19, I22, I23, I26, I28,
I29, I30, I32), opportunities 4 (I17, I18, I27, I31). Shared fixes proposed: `useMenuNavigation`, `useSubmenuIntent`,
`createTypeahead`, `useFormField`, `composing()`, `useRovingFocus`, `useModalDialog`, `useDrag`, `useFocusRescue`,
`useIsoLayoutEffect`, arrow variable in the engine, one modal CSS rule, a hit-target recipe, `timing.ts`.

## 5. Excellent, keep

- The platform does the heavy lifting: Popover API top layer and light dismiss, native `showModal()` trap, Escape and
  focus return, nested `popover="auto"` for Escape order. No portals, no z-index wars (one exception: I3).
- Exits really run: `@starting-style` enters and `allow-discrete` holds on `display` / `overlay`, read on the fade clock
  so reduced motion never cuts an exit; Context menu and Command palette wait on `getAnimations()`; Combobox and Tag
  picker freeze their rows through the fade; Toaster removes after its measured transition.
- Motion is tokens end to end: zero literal durations or curves in transitions, exits one step faster by test,
  reduced motion handled once in `emit/css.ts` with fades kept short, loops through `duration-loop`.
- Tooltip behaviour is best in class: skip window, keyboard-only focus open, no tooltip on a returning focus or over an
  expanded trigger, close on window blur / hidden page / pointer leaving the window, name-only pass-through.
- `computePosition` is a small pure function, zoom-aware, whole-pixel, RTL-mirrored, with edge-align flip before shift.
- `scrollOptionIntoList` never scrolls the page; menus focus with `preventScroll`.
- IME safety in Composer, Combobox, Tag picker, Number field and Search field, including Safari's 229.
- Slider: native input under a drawn thumb, 2px drag threshold, glide, `onValueCommit`, Shift×10, readout as
  `aria-valuetext`. Number field scrub with pointer capture and Escape cancel; press-and-hold repeat.
- Logical properties throughout (one physical `left`, the context menu's viewport coordinate). `:focus-visible` only,
  165 rules; `touch-action: none` on every drag surface.
- One announcer for all families; inactive state for Button and Menu item; Selection bar's focus rescue; OTP paste and
  autofill; `hidden="until-found"` accordion bodies; form reset in 14 families.
