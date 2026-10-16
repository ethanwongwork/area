# Unverified inventory

**Question:** What does every `Unverified:` item in the specs ask us to check, which environment does it require, and how can it be checked?

**Answer:**
- Found **68 marker paragraphs** across **63 specs**, preserving every wrapped continuation and historical note. These are recorded obligations, not 68 confirmed defects.
- Grouped into the seven requested kinds, with an extra section for focus, IME, compact layout, source pinning and owner decisions so nothing falls out of scope.
- Area paint/RTL/engine checks are local; product parity needs the corresponding reference state, spoken-output checks need assistive technology, and physical touch claims need a device.
- No checks were executed and no spec or approval status was changed. Generic dark-theme wording is split into local paint versus product parity rather than silently treated as one or the other.

**Snapshot:** `origin/main` `4c1854202a8e109479d5b83ef24a8325231da056`, checked 2026-10-07 (America/Los_Angeles). All `docs/specs/*.md` files were scanned case-insensitively. Each item links its exact source lines.

## Reading this inventory

Each U-ID represents one literal marker paragraph. It may appear in several categories because a paragraph often contains several checks. Counts overlap and must not be added. Text before the marker is retained for provenance but does not create new obligations: e.g. Tag picker already says dark/compact checked before its remaining screen-reader/RTL note. Historical notes remain quoted, even where later captures or feedback appear to supersede them.

Exact check steps below are proposed procedures inferred from each note and its family contract, not measured results. The item-specific action plus the numbered category steps form the complete procedure. Family actions always run on the local Area specimen; in products, inspect only the corresponding existing reference state. Completed evidence sentences retained in quotes do not create new obligations.

## Local setup and evidence

1. Use the pinned Area checkout and its documented dependency/build setup. Run `npm run dev`; use the printed local URL (default http://localhost:4321). Build failures block execution and should be recorded, not bypassed as a pass. [docs/DEVELOPMENT.md:23](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/DEVELOPMENT.md#L23-L43)
2. Open the family in the gallery; use `lab.html` for interactive overlays. Inspector and resizable-panel use Panel specimens. For a missing named state, create a disposable local harness outside product data from the documented component props; record its source with the result. [docs/DEVELOPMENT.md:68](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/DEVELOPMENT.md#L68-L73)
3. Set local theme/density/dir before rendering. Theme changes can retain stale painted colors; measure actual painted properties after a reload/restyle, not only unresolved custom-property strings. [docs/THEMING.md:75](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/THEMING.md#L75-L99)
4. Save snapshot, browser/version, viewport/zoom, theme/density/radius, steps, expected/actual result and redacted screenshots/captures. A source read proves declared behavior; a test proves only the exercised behavior. [docs/DEVELOPMENT.md:104](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/DEVELOPMENT.md#L104-L114)

## Dark theme

61 source paragraphs include this kind. **Access:** Split scope: Area paint is local-browser-checkable; live target-product dark parity needs the referenced signed-in session. Generic “dark theme” notes do not identify which half was omitted.

For each item in this section:

1. Set the local theme to dark before loading the specimen; also use compact and default density. Reload after theme changes so stale light paint is not mistaken for dark verification.
2. Perform the item’s family action below on the local Area specimen; compare only existing product states for product-capture checks.
3. Capture painted color/background/border/shadow and a screenshot for every exercised state. For product-dark wording, compare a matching product state at the same zoom; use an already-dark session or ask the owner before changing its theme. Do not close the product part on an Area-only screenshot.
4. Attach the result to the U-ID and source clause; leave other clauses unresolved until separately checked.

### U001 — alert

[docs/specs/alert.md:179](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/alert.md#L179)

> - Unverified: dismiss hover and focus on screen, dark theme.

**Steps for this family:** Use single-line and multiline alerts with dismiss; hover and Tab to dismiss, then activate it.

### U004 — avatar

[docs/specs/avatar.md:184](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/avatar.md#L184-L185)

> did not inspect screenshots. Unverified: dark theme, an active ring next to a focused
> avatar-bearing control, a side-by-side with Figma's initials avatar.

**Steps for this family:** Use initials and image avatars, active and inactive, beside a focusable control carrying an avatar; focus that control.

### U005 — badge-group

[docs/specs/badge-group.md:134](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/badge-group.md#L134-L135)

> owner's workspace (Notion's tasks board has single tags per group header). Unverified: a Notion multi-select cell's tag gap
> (no multi-select was reachable in the owner's workspace), dark theme.

**Steps for this family:** Open the overflow trigger by keyboard, inspect its focus ring, then compare wrapping and overlay tag gaps.

### U006 — badge-group

[docs/specs/badge-group.md:147](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/badge-group.md#L147-L148)

> - Unverified: keyboard focus ring on the trigger (not reached with the real Tab key in
>   this pass), dark theme, Primer source at a pinned commit.

**Steps for this family:** Open the overflow trigger by keyboard, inspect its focus ring, then compare wrapping and overlay tag gaps.

### U007 — badge

[docs/specs/badge.md:555](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/badge.md#L555-L558)

> - Unverified: dark theme in every product (needs the owner's go-ahead to switch), Figma
>   editor badges, hover/focus captures (no product badge is interactive), sm with icons
>   (no composition uses it), browsers without `text-box` (they keep the previous centring
>   and its baseline behaviour).

**Steps for this family:** Use labeled, icon-bearing and dismissible badges at every size; focus/hover dismiss and compare baseline alignment in surrounding text.

### U008 — box-field

[docs/specs/box-field.md:124](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/box-field.md#L124-L125)

> - Unverified: dark theme; screen reader output; RTL (left/right are physical here, as padding
>   values are); Figma's split layouts (needs opening the panels in the owner's file).

**Steps for this family:** Toggle linked and per-side/per-corner editing, change each field locally and verify physical left/right labels remain attached to the intended side.

### U009 — breadcrumb

[docs/specs/breadcrumb.md:124](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/breadcrumb.md#L124)

> - Unverified: hover plate on screen (the browser pane was hidden), dark theme, Figma.

**Steps for this family:** Hover/focus each link and overflow control; inspect current-page treatment and separators.

### U010 — button-group

[docs/specs/button-group.md:69](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/button-group.md#L69)

> - Unverified: dark theme, focus ring over the divider in every size.

**Steps for this family:** Focus every joined button at each size; inspect the focused outline where it meets the divider, including a selected neighbor.

### U011 — button

[docs/specs/button.md:292](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/button.md#L292-L293)

> - Unverified: dark theme (products not switched), Figma hover, disabled/loading/selected against references, compact density
>   (the gap follows density since audit S14; compact sm is 4).

**Steps for this family:** Inspect solid/soft/outline/ghost at sm/md/lg, then disabled/loading/selected specimens with real pointer hover and keyboard focus.

### U012 — calendar

[docs/specs/calendar.md:216](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/calendar.md#L216-L217)

> - Unverified: screen readers, dark theme, RTL, Firefox/Safari, touch; hover preview was
>   exercised only with synthetic events.

**Steps for this family:** Use single, range and multiple modes; navigate days by arrows, week by Home/End, month by PageUp/PageDown, year by Shift+Page; select with Enter/Space and inspect disabled/outside/today states.

### U014 — checkbox

[docs/specs/checkbox.md:153](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/checkbox.md#L153)

> Unverified: dark theme, hover and focus in a product.

**Steps for this family:** Toggle checked/mixed/unchecked; focus normal and card/tile variants, including disabled and invalid.

### U015 — code-block

[docs/specs/code-block.md:165](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/code-block.md#L165-L166)

> (Area tokens over ChatGPT's pill scale; 14 mono throughout). No change. Unverified: hover and
> `:target` paint on screen, dark theme, RTL.

**Steps for this family:** Hover header actions and line links; navigate to a line fragment to activate :target and inspect the linked-line rail.

### U016 — code

[docs/specs/code.md:131](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/code.md#L131)

> Unverified: dark theme, forced colours.

**Steps for this family:** Render inline code in small and body text on ordinary and colored surfaces; inspect border/fill and text floor.

### U017 — color-field

[docs/specs/color-field.md:134](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/color-field.md#L134)

> Unverified: Figma side by side at the same zoom, dark theme.

**Steps for this family:** Edit hex and opacity, reach the swatch and any nested action with Tab, and compare field/swatch corners at the same zoom.

### U018 — color-picker

[docs/specs/color-picker.md:230](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/color-picker.md#L230)

> - Unverified: dark theme, screen readers, Firefox and Safari (no EyeDropper there), touch.

**Steps for this family:** Drag and keyboard-adjust the area, hue and opacity tracks; change value model; select/add a swatch and inspect the EyeDropper availability path.

### U019 — color-swatch-picker

[docs/specs/color-swatch-picker.md:141](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/color-swatch-picker.md#L141-L142)

> the sizes each have a tile. Unverified: Figma side by side, dark theme, a selected
> Figma chit.

**Steps for this family:** Choose swatches with arrows and Space, including a light swatch; inspect the selected ring and palette/grid/row layouts.

### U020 — color-swatch

[docs/specs/color-swatch.md:104](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/color-swatch.md#L104-L105)

> The gallery shows ColorSwatch's tiles in named groups. Unverified: Figma side by side, dark
> theme, forced colours.

**Steps for this family:** Render white, transparent, saturated and selected swatches; inspect edge visibility and checker/colour separation.

### U021 — combobox

[docs/specs/combobox.md:79](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/combobox.md#L79)

> field), matched to Notion's menu when Menu was approved. No change. Unverified: dark theme.

**Steps for this family:** Type to filter, arrow through results, choose/create an item, clear, and Escape; use a real IME to confirm composition does not select early.

### U022 — combobox

[docs/specs/combobox.md:89](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/combobox.md#L89)

> - Unverified: dark theme, screen reader announcements, IME composition, RTL.

**Steps for this family:** Type to filter, arrow through results, choose/create an item, clear, and Escape; use a real IME to confirm composition does not select early.

### U023 — command-palette

[docs/specs/command-palette.md:104](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/command-palette.md#L104)

> - Unverified: dark theme, screen reader output, IME.

**Steps for this family:** Open, type/filter, arrow through groups, activate a harmless action, and Escape; repeat with a real IME composition.

### U024 — command-palette

[docs/specs/command-palette.md:131](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/command-palette.md#L131)

> "Move" ink to the Open keycap 16. Unverified: hover paint by eye, dark theme.

**Steps for this family:** Open, type/filter, arrow through groups, activate a harmless action, and Escape; repeat with a real IME composition.

### U025 — composer

[docs/specs/composer.md:98](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/composer.md#L98-L99)

> `npm test` (tokens and contrast), capture checksums: all pass. Unverified: dark theme, focus ring on screen, ChatGPT's
> multi-line radius (would require typing), hover states.

**Steps for this family:** Type a multiline local draft, inspect auto-growth, hover/focus tool/send controls and verify the text remains readable.

### U026 — confirm-dialog

[docs/specs/confirm-dialog.md:59](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/confirm-dialog.md#L59)

> surface is 420 wide. Unverified: dark, compact, screen reader.

**Steps for this family:** Open the harmless local confirm demo, verify initial Cancel focus, test Cancel/Escape, and inspect its neutral/danger/compact specimens.

### U027 — context-menu

[docs/specs/context-menu.md:66](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/context-menu.md#L66)

> - Unverified: touch long-press (not handled), screen reader output, dark theme.

**Steps for this family:** Right-click and use Shift+F10/Menu key on the local target; navigate and dismiss; separately try a genuine touch long-press.

### U028 — count

[docs/specs/count.md:144](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/count.md#L144)

> - Unverified: dark theme, forced colours, screen-reader reading of `label`.

**Steps for this family:** Render zero, an ordinary count and a capped count; repeat with the label override and inspect the owner’s accessible name.

### U031 — dialog

[docs/specs/dialog.md:179](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/dialog.md#L179-L180)

> - Unverified: dark theme and the dark scrim, screen reader announcement, the modal on a
>   phone-width viewport.

**Steps for this family:** Open by trigger, Tab and Shift+Tab through the modal, Escape and inspect return focus; repeat at a narrow phone-like viewport.

### U032 — disclosure

[docs/specs/disclosure.md:231](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/disclosure.md#L231-L232)

> - Unverified: Notion collapsed and dark, ChatGPT dark, a rendered shadcn accordion, dark paint on
>   screen, find-in-page with the real browser find bar.

**Steps for this family:** Collapse a section containing a unique text string, use the browser’s real Find command for that string, then verify the section opens; also toggle plain/divided and grouped sections.

### U033 — drawer

[docs/specs/drawer.md:77](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/drawer.md#L77-L78)

> Unverified: dark, compact, RTL, screen reader, the exit slide on browsers without
> `transition-behavior`.

**Steps for this family:** Open start/end/bottom, modal and non-modal drawers; Tab, Escape and inspect return focus; repeat stacked actions and close-transition fallback.

### U034 — field

[docs/specs/field.md:135](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/field.md#L135)

> Unverified: dark theme.

**Steps for this family:** Use stacked and horizontal labeled controls with help/error text; focus the input and inspect label/description associations.

### U035 — hover-card

[docs/specs/hover-card.md:76](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/hover-card.md#L76)

> - Unverified: dark theme, screen readers (by design the card is not announced).

**Steps for this family:** Hover and keyboard-focus the trigger; move into/out of the card, dismiss and confirm expected non-announcement rather than inventing a live region.

### U036 — indicator

[docs/specs/indicator.md:351](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/indicator.md#L351-L353)

> - Unverified: product dark themes; Notion's inbox count and presence (not present);
>   Figma multiplayer avatars; counts on rectangular owners in any product; cross-engine,
>   screen-reader and forced-colors execution.

**Steps for this family:** Use dot, count and presence specimens on round and rectangular owners; exercise processing and capped counts, then inspect owner labels.

### U037 — input-group

[docs/specs/input-group.md:145](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/input-group.md#L145-L146)

> second pass. Unverified: Figma side by side at one zoom, dark theme, a
> disabled group, a group with one of two children disabled (the whole group paints disabled).

**Steps for this family:** Compare all-enabled, all-disabled and mixed enabled/disabled child groups; focus each enabled child and inspect shared disabled paint.

### U038 — input

[docs/specs/input.md:156](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/input.md#L156-L157)

> resting shadow. Unverified: hover and focus in the products (Chrome was a background window),
> dark theme.

**Steps for this family:** Focus empty/filled/invalid/disabled fields, hover optional actions, type locally and inspect the label, affixes and focus edge.

### U039 — inspector

[docs/specs/inspector.md:85](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/inspector.md#L85)

> - Unverified: dark theme; keyboard order across the groups (each button is its own stop).

**Steps for this family:** Open the Figma inspector recipe and Tab through each group and trailing action; record actual order against visual order.

### U040 — kbd

[docs/specs/kbd.md:162](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/kbd.md#L162)

> [the audit](../research/cohesion-audit.md#verification). Unverified: dark theme, screen readers.

**Steps for this family:** Inspect standalone keys, chords, sequences, menu shortcuts and on-color keys; listen to the enclosing control’s label.

### U041 — menu

[docs/specs/menu.md:153](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/menu.md#L153)

> - Unverified: dark theme, screen-reader announcement of menu items and submenus.

**Steps for this family:** Open a menu and submenu fixture; use arrows, Home/End, typeahead, Enter and Escape; inspect the focused item and return focus.

### U042 — message

[docs/specs/message.md:85](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/message.md#L85)

> - Unverified: dark theme, screen readers, RTL (the bubble moves to the start).

**Steps for this family:** Show user/assistant turns and streaming; reach message actions and inspect bubble anchoring and reading order.

### U043 — nav

[docs/specs/nav.md:194](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/nav.md#L194)

> - Unverified: dark products, an accent Selection theme beside a product.

**Steps for this family:** Open a navigation list with current, disabled, icon and trailing-action rows; hover each enabled row and Tab through its interactive parts.

### U044 — number-field

[docs/specs/number-field.md:152](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/number-field.md#L152)

> - Unverified: dark theme; Safari and Firefox without `field-sizing`.

**Steps for this family:** Type and commit a value, clear it, show mixed state, scrub the handle and use steppers; repeat with a unit and a long number.

### U046 — panel

[docs/specs/panel.md:193](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/panel.md#L193)

> Unverified: dark theme and a side-by-side with Figma's inspector at the same zoom.

**Steps for this family:** Open the Figma inspector recipe; expand/collapse sections, Tab through controls and inspect label columns and separators.

### U047 — popover

[docs/specs/popover.md:139](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/popover.md#L139-L140)

> - Unverified: dark theme, screen reader announcement of the dialog, arrow alignment when the
>   anchored popover shifts to stay in view.

**Steps for this family:** Open a triggered popover near every viewport edge, resize until it flips or shifts, inspect the arrow, Escape and verify return focus.

### U048 — prompt-suggestions

[docs/specs/prompt-suggestions.md:72](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/prompt-suggestions.md#L72)

> - Unverified: dark theme. ChatGPT's hover state was captured 2026-09-28.

**Steps for this family:** Hover each row and dismiss action, Tab through suggestions and dismiss one in the local demo.

### U049 — property-list

[docs/specs/property-list.md:60](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/property-list.md#L60)

> Unverified: touch drag on a device; screen reader output of the live region; dark theme.

**Steps for this family:** Reorder first/middle/last rows by pointer and by ArrowUp/Down/Home/End; verify focus follows the moved row and an announcement describes its position.

### U050 — radio

[docs/specs/radio.md:126](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/radio.md#L126)

> Unverified: dark theme, hover and focus in a product.

**Steps for this family:** Arrow among radios and focus row/tile cards; verify one selected option and the group’s label.

### U051 — resizable-panel

[docs/specs/resizable-panel.md:102](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/resizable-panel.md#L102)

> - Unverified: dark theme, RTL drag, touch, screen reader output.

**Steps for this family:** Drag each resizable edge, then focus the splitter and use arrows/Home/End to its limits; inspect focus and value announcements.

### U052 — segmented

[docs/specs/segmented.md:163](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/segmented.md#L163-L164)

> [the audit](../research/cohesion-audit.md#verification). Unverified: hover and focus
> captures, dark theme.

**Steps for this family:** Tab into the group, use each arrow direction and Home/End, select a different item, then Tab out.

### U053 — select

[docs/specs/select.md:159](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/select.md#L159-L160)

> and checked fill appear only with the picker open in a supporting browser. Unverified: the
> open picker on screen, a Notion or Figma picker side by side, dark theme.

**Steps for this family:** Open the real native/customized picker, navigate options and select one, then Escape; inspect checked/disabled/hover states on screen.

### U054 — separator

[docs/specs/separator.md:129](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/separator.md#L129)

> Unverified: dark theme (#333 on the dark surface), forced colours.

**Steps for this family:** Inspect horizontal and vertical rules inside surfaces and on the page background.

### U055 — skeleton

[docs/specs/skeleton.md:148](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/skeleton.md#L148)

> Unverified: dark theme, the card tile's media corners at the new Card radius on screen.

**Steps for this family:** Show text, circle and Card media skeleton specimens; compare media corners against the card at radius 0, 8 and pill.

### U056 — spinner

[docs/specs/spinner.md:116](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/spinner.md#L116)

> Nothing in Notion or Figma to compare. Unverified: dark theme, forced colours.

**Steps for this family:** Show standalone spinners and loading Buttons at every size and on contrasting backgrounds; confirm motion-none stops animation.

### U057 — split-button

[docs/specs/split-button.md:217](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/split-button.md#L217)

> - Unverified: dark theme, screen reader announcement, forced colors, RTL divider position.

**Steps for this family:** Tab to both halves, open the arrow menu with the keyboard, move through items, Escape, and verify focus returns to the opener.

### U058 — switch

[docs/specs/switch.md:163](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/switch.md#L163)

> #c5), edge equal to the fill so none shows. Unverified: dark theme.

**Steps for this family:** Toggle short/long tracks at every size, focus by keyboard and inspect off/on/disabled/read-only/loading states.

### U059 — table

[docs/specs/table.md:168](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/table.md#L168)

> paint, not with a real pointer (the preview pane was hidden). Unverified: dark theme.

**Steps for this family:** Hover rows with a real pointer; select a row and hover it again; inspect header/rules and nested interactive cells.

### U060 — tabs

[docs/specs/tabs.md:166](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/tabs.md#L166-L167)

> Type size matches (14); weight stays 400 by the type ramp (Notion 500). No change. Unverified:
> dark theme.

**Steps for this family:** Arrow through tabs, activate and Tab into the panel; inspect selected/hover/focus contrast.

### U062 — tag

[docs/specs/tag.md:78](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/tag.md#L78)

> Build, parity, typecheck pass; captures pass the checksum. Unverified: dark against Notion, screen reader.

**Steps for this family:** Focus and activate the remove button on each tone; repeat disabled and both sizes, inspecting the concentric remove plate.

### U063 — textarea

[docs/specs/textarea.md:131](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/textarea.md#L131)

> 82 at three rows). Unverified: dark theme.

**Steps for this family:** Type enough lines to wrap and grow, focus/blur, resize where enabled and inspect placeholder/invalid/disabled variants.

### U064 — toast

[docs/specs/toast.md:114](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/toast.md#L114-L115)

> owner's lighter-fill direction; an inverse toast remains an open option. Unverified: dark theme,
> the action and dismiss hover on screen.

**Steps for this family:** Trigger a toast with an action and dismiss control; Tab to each and activate dismiss; repeat with a second live announcement.

### U065 — toast

[docs/specs/toast.md:123](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/toast.md#L123)

> - Unverified: dark theme, screen reader announcement timing.

**Steps for this family:** Trigger a toast with an action and dismiss control; Tab to each and activate dismiss; repeat with a second live announcement.

### U066 — toolbar

[docs/specs/toolbar.md:220](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/toolbar.md#L220-L222)

> parity, token references and the React tests pass. Unverified: Figma's dark theme (switching it
> needs the owner), keyboard focus ring in the new track, a screen reader on toggle and track
> semantics (toggles are `aria-pressed`; a track is not a radio group).

**Steps for this family:** Tab into the toolbar, arrow across enabled controls, toggle a command, then move into its Segmented control and back out.

### U067 — tooltip

[docs/specs/tooltip.md:145](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/tooltip.md#L145)

> - Unverified: Figma capture file, dark theme. Hover/focus behaviour is implemented (2026-09-27, [overlay.md](overlay.md)); its timing has not been owner-reviewed (the batch 17 pass compared static paint).

**Steps for this family:** Focus and hover the trigger, move between two tooltip triggers and Escape; measure opening/closing delays separately from owner timing approval.

### U068 — tree-view

[docs/specs/tree-view.md:143](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/tree-view.md#L143-L146)

> - Unverified: dark theme, Notion indent and hover, Figma layers geometry (row height, 11px
>   type, icon and control sizes: needs a capture in the editor), screen-reader behaviour of
>   row actions. Layer-type glyphs (frame, rectangle, component, lock) are stand-ins until
>   drawn under the icon construction rules.

**Steps for this family:** Expand and collapse a parent with arrow keys, navigate children, reach each row action, and compare child indents and labels.

## Forced colours

9 source paragraphs include this kind. **Access:** Local browser emulation can check CSS fallback paint; actual Windows forced-colour rendering additionally needs that OS/browser. No signed-in product or screen reader is required for paint alone.

For each item in this section:

1. In Chromium DevTools Rendering, emulate forced-colors: active; repeat the same specimen with the native system high-contrast setting when available.
2. Perform the item’s family action below on the local Area specimen; compare only existing product states for product-capture checks.
3. Check that text, boundaries, selected/focused states and icons remain distinguishable using painted system colors. Record emulated and native execution separately; contrast unit tests alone do not finish this item.
4. Attach the result to the U-ID and source clause; leave other clauses unresolved until separately checked.

### U013 — card

[docs/specs/card.md:202](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/card.md#L202-L203)

> background). Unverified: Firefox and Safari (`text-box`, `cap`, container queries, `:has()`),
> forced colours, screen readers.

**Steps for this family:** Use linked, horizontal, immersive and carousel cards; Tab through links/actions and resize across container breakpoints.

### U016 — code

[docs/specs/code.md:131](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/code.md#L131)

> Unverified: dark theme, forced colours.

**Steps for this family:** Render inline code in small and body text on ordinary and colored surfaces; inspect border/fill and text floor.

### U020 — color-swatch

[docs/specs/color-swatch.md:104](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/color-swatch.md#L104-L105)

> The gallery shows ColorSwatch's tiles in named groups. Unverified: Figma side by side, dark
> theme, forced colours.

**Steps for this family:** Render white, transparent, saturated and selected swatches; inspect edge visibility and checker/colour separation.

### U028 — count

[docs/specs/count.md:144](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/count.md#L144)

> - Unverified: dark theme, forced colours, screen-reader reading of `label`.

**Steps for this family:** Render zero, an ordinary count and a capped count; repeat with the label override and inspect the owner’s accessible name.

### U029 — custom-select

[docs/specs/custom-select.md:209](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/custom-select.md#L209-L210)

> moves, Escape closes and keeps focus), groups, ghost open in dark. Unverified: screen reader
> announcement, RTL, forced colours, Figma side by side.

**Steps for this family:** Open by Enter/Space/ArrowDown, use arrows/Home/End/typeahead, choose with Enter, and Escape; repeat descriptions, groups and ghost trigger.

### U036 — indicator

[docs/specs/indicator.md:351](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/indicator.md#L351-L353)

> - Unverified: product dark themes; Notion's inbox count and presence (not present);
>   Figma multiplayer avatars; counts on rectangular owners in any product; cross-engine,
>   screen-reader and forced-colors execution.

**Steps for this family:** Use dot, count and presence specimens on round and rectangular owners; exercise processing and capped counts, then inspect owner labels.

### U054 — separator

[docs/specs/separator.md:129](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/separator.md#L129)

> Unverified: dark theme (#333 on the dark surface), forced colours.

**Steps for this family:** Inspect horizontal and vertical rules inside surfaces and on the page background.

### U056 — spinner

[docs/specs/spinner.md:116](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/spinner.md#L116)

> Nothing in Notion or Figma to compare. Unverified: dark theme, forced colours.

**Steps for this family:** Show standalone spinners and loading Buttons at every size and on contrasting backgrounds; confirm motion-none stops animation.

### U057 — split-button

[docs/specs/split-button.md:217](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/split-button.md#L217)

> - Unverified: dark theme, screen reader announcement, forced colors, RTL divider position.

**Steps for this family:** Tab to both halves, open the arrow menu with the keyboard, move through items, Escape, and verify focus returns to the opener.

## RTL

12 source paragraphs include this kind. **Access:** Repository plus a local browser is sufficient for visual/keyboard RTL; assistive-technology reading order is a separate screen-reader check.

For each item in this section:

1. Set dir="rtl" on the local specimen’s enclosing theme scope before mount, reload, and repeat its LTR interactions without editing its data.
2. Perform the item’s family action below on the local Area specimen; compare only existing product states for product-capture checks.
3. Inspect start/end anchoring, clipped text, arrows, divider and resize/drag direction. Keep BoxField physical left/right labels physical. For overlays, repeat near both viewport edges. Save LTR/RTL screenshots and key outcomes.
4. Attach the result to the U-ID and source clause; leave other clauses unresolved until separately checked.

### U008 — box-field

[docs/specs/box-field.md:124](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/box-field.md#L124-L125)

> - Unverified: dark theme; screen reader output; RTL (left/right are physical here, as padding
>   values are); Figma's split layouts (needs opening the panels in the owner's file).

**Steps for this family:** Toggle linked and per-side/per-corner editing, change each field locally and verify physical left/right labels remain attached to the intended side.

### U012 — calendar

[docs/specs/calendar.md:216](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/calendar.md#L216-L217)

> - Unverified: screen readers, dark theme, RTL, Firefox/Safari, touch; hover preview was
>   exercised only with synthetic events.

**Steps for this family:** Use single, range and multiple modes; navigate days by arrows, week by Home/End, month by PageUp/PageDown, year by Shift+Page; select with Enter/Space and inspect disabled/outside/today states.

### U015 — code-block

[docs/specs/code-block.md:165](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/code-block.md#L165-L166)

> (Area tokens over ChatGPT's pill scale; 14 mono throughout). No change. Unverified: hover and
> `:target` paint on screen, dark theme, RTL.

**Steps for this family:** Hover header actions and line links; navigate to a line fragment to activate :target and inspect the linked-line rail.

### U022 — combobox

[docs/specs/combobox.md:89](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/combobox.md#L89)

> - Unverified: dark theme, screen reader announcements, IME composition, RTL.

**Steps for this family:** Type to filter, arrow through results, choose/create an item, clear, and Escape; use a real IME to confirm composition does not select early.

### U029 — custom-select

[docs/specs/custom-select.md:209](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/custom-select.md#L209-L210)

> moves, Escape closes and keeps focus), groups, ghost open in dark. Unverified: screen reader
> announcement, RTL, forced colours, Figma side by side.

**Steps for this family:** Open by Enter/Space/ArrowDown, use arrows/Home/End/typeahead, choose with Enter, and Escape; repeat descriptions, groups and ghost trigger.

### U030 — date-picker

[docs/specs/date-picker.md:107](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/date-picker.md#L107)

> invalid edge. Dark (panel and calendar) and compact (field 28) checked 2026-10-06. Unverified: screen reader, RTL, Figma comparison.

**Steps for this family:** Tab to the date trigger and open it with Enter/Space; type 2026-10-20 then Enter, reopen and type invalid text, Tab to Calendar, navigate with arrows, select a day, reopen, clear with the clear action and Escape; verify focus returns to the trigger and compare formatted date/week order in LTR and RTL.

### U033 — drawer

[docs/specs/drawer.md:77](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/drawer.md#L77-L78)

> Unverified: dark, compact, RTL, screen reader, the exit slide on browsers without
> `transition-behavior`.

**Steps for this family:** Open start/end/bottom, modal and non-modal drawers; Tab, Escape and inspect return focus; repeat stacked actions and close-transition fallback.

### U042 — message

[docs/specs/message.md:85](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/message.md#L85)

> - Unverified: dark theme, screen readers, RTL (the bubble moves to the start).

**Steps for this family:** Show user/assistant turns and streaming; reach message actions and inspect bubble anchoring and reading order.

### U045 — overlay

[docs/specs/overlay.md:110](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/overlay.md#L110-L111)

> driven by real pointer and key events over the DevTools protocol. Unverified: Firefox and
> Safari, touch, screen readers, RTL alignment on screen, nested popovers.

**Steps for this family:** Open nested popovers in the interaction lab, resize near edges, Escape one level at a time and check return focus and dismissal boundaries.

### U051 — resizable-panel

[docs/specs/resizable-panel.md:102](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/resizable-panel.md#L102)

> - Unverified: dark theme, RTL drag, touch, screen reader output.

**Steps for this family:** Drag each resizable edge, then focus the splitter and use arrows/Home/End to its limits; inspect focus and value announcements.

### U057 — split-button

[docs/specs/split-button.md:217](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/split-button.md#L217)

> - Unverified: dark theme, screen reader announcement, forced colors, RTL divider position.

**Steps for this family:** Tab to both halves, open the arrow menu with the keyboard, move through items, Escape, and verify focus returns to the opener.

### U061 — tag-picker

[docs/specs/tag-picker.md:117](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/tag-picker.md#L117)

> removed"; chosen rows show the check. Dark and compact checked on the Review page 2026-10-06 (compact field 28). Unverified: screen reader, RTL.

**Steps for this family:** Filter and add a tag, create a new one in the local demo, remove by Backspace and by its remove button, then inspect the checked list row.

## Screen reader

28 source paragraphs include this kind. **Access:** Requires assistive technology: use VoiceOver+Safari or NVDA+Firefox/Chrome. DOM roles or the browser accessibility tree alone cannot verify announcements.

For each item in this section:

1. For VoiceOver+Safari, enable VoiceOver with Command-F5, move with VO+Right/Left (VO is Control+Option), and interact with VO+Shift+Down; use Tab and the component keys for controls. For NVDA+Firefox/Chrome, start NVDA, Tab into the control and use focus mode for its keys. Execute the family action below. Record browser/AT versions and spoken output.
2. Perform the item’s family action below on the local Area specimen; compare only existing product states for product-capture checks.
3. Verify accessible name, role, value, state, description, focus return and relevant live-region timing. For HoverCard verify the documented non-announcement; for Count record its label; for reorder/tag changes record each live message. Do not infer this pass from ARIA attributes.
4. Attach the result to the U-ID and source clause; leave other clauses unresolved until separately checked.

### U008 — box-field

[docs/specs/box-field.md:124](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/box-field.md#L124-L125)

> - Unverified: dark theme; screen reader output; RTL (left/right are physical here, as padding
>   values are); Figma's split layouts (needs opening the panels in the owner's file).

**Steps for this family:** Toggle linked and per-side/per-corner editing, change each field locally and verify physical left/right labels remain attached to the intended side.

### U012 — calendar

[docs/specs/calendar.md:216](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/calendar.md#L216-L217)

> - Unverified: screen readers, dark theme, RTL, Firefox/Safari, touch; hover preview was
>   exercised only with synthetic events.

**Steps for this family:** Use single, range and multiple modes; navigate days by arrows, week by Home/End, month by PageUp/PageDown, year by Shift+Page; select with Enter/Space and inspect disabled/outside/today states.

### U013 — card

[docs/specs/card.md:202](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/card.md#L202-L203)

> background). Unverified: Firefox and Safari (`text-box`, `cap`, container queries, `:has()`),
> forced colours, screen readers.

**Steps for this family:** Use linked, horizontal, immersive and carousel cards; Tab through links/actions and resize across container breakpoints.

### U018 — color-picker

[docs/specs/color-picker.md:230](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/color-picker.md#L230)

> - Unverified: dark theme, screen readers, Firefox and Safari (no EyeDropper there), touch.

**Steps for this family:** Drag and keyboard-adjust the area, hue and opacity tracks; change value model; select/add a swatch and inspect the EyeDropper availability path.

### U022 — combobox

[docs/specs/combobox.md:89](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/combobox.md#L89)

> - Unverified: dark theme, screen reader announcements, IME composition, RTL.

**Steps for this family:** Type to filter, arrow through results, choose/create an item, clear, and Escape; use a real IME to confirm composition does not select early.

### U023 — command-palette

[docs/specs/command-palette.md:104](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/command-palette.md#L104)

> - Unverified: dark theme, screen reader output, IME.

**Steps for this family:** Open, type/filter, arrow through groups, activate a harmless action, and Escape; repeat with a real IME composition.

### U026 — confirm-dialog

[docs/specs/confirm-dialog.md:59](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/confirm-dialog.md#L59)

> surface is 420 wide. Unverified: dark, compact, screen reader.

**Steps for this family:** Open the harmless local confirm demo, verify initial Cancel focus, test Cancel/Escape, and inspect its neutral/danger/compact specimens.

### U027 — context-menu

[docs/specs/context-menu.md:66](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/context-menu.md#L66)

> - Unverified: touch long-press (not handled), screen reader output, dark theme.

**Steps for this family:** Right-click and use Shift+F10/Menu key on the local target; navigate and dismiss; separately try a genuine touch long-press.

### U028 — count

[docs/specs/count.md:144](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/count.md#L144)

> - Unverified: dark theme, forced colours, screen-reader reading of `label`.

**Steps for this family:** Render zero, an ordinary count and a capped count; repeat with the label override and inspect the owner’s accessible name.

### U029 — custom-select

[docs/specs/custom-select.md:209](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/custom-select.md#L209-L210)

> moves, Escape closes and keeps focus), groups, ghost open in dark. Unverified: screen reader
> announcement, RTL, forced colours, Figma side by side.

**Steps for this family:** Open by Enter/Space/ArrowDown, use arrows/Home/End/typeahead, choose with Enter, and Escape; repeat descriptions, groups and ghost trigger.

### U030 — date-picker

[docs/specs/date-picker.md:107](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/date-picker.md#L107)

> invalid edge. Dark (panel and calendar) and compact (field 28) checked 2026-10-06. Unverified: screen reader, RTL, Figma comparison.

**Steps for this family:** Tab to the date trigger and open it with Enter/Space; type 2026-10-20 then Enter, reopen and type invalid text, Tab to Calendar, navigate with arrows, select a day, reopen, clear with the clear action and Escape; verify focus returns to the trigger and compare formatted date/week order in LTR and RTL.

### U031 — dialog

[docs/specs/dialog.md:179](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/dialog.md#L179-L180)

> - Unverified: dark theme and the dark scrim, screen reader announcement, the modal on a
>   phone-width viewport.

**Steps for this family:** Open by trigger, Tab and Shift+Tab through the modal, Escape and inspect return focus; repeat at a narrow phone-like viewport.

### U033 — drawer

[docs/specs/drawer.md:77](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/drawer.md#L77-L78)

> Unverified: dark, compact, RTL, screen reader, the exit slide on browsers without
> `transition-behavior`.

**Steps for this family:** Open start/end/bottom, modal and non-modal drawers; Tab, Escape and inspect return focus; repeat stacked actions and close-transition fallback.

### U035 — hover-card

[docs/specs/hover-card.md:76](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/hover-card.md#L76)

> - Unverified: dark theme, screen readers (by design the card is not announced).

**Steps for this family:** Hover and keyboard-focus the trigger; move into/out of the card, dismiss and confirm expected non-announcement rather than inventing a live region.

### U036 — indicator

[docs/specs/indicator.md:351](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/indicator.md#L351-L353)

> - Unverified: product dark themes; Notion's inbox count and presence (not present);
>   Figma multiplayer avatars; counts on rectangular owners in any product; cross-engine,
>   screen-reader and forced-colors execution.

**Steps for this family:** Use dot, count and presence specimens on round and rectangular owners; exercise processing and capped counts, then inspect owner labels.

### U040 — kbd

[docs/specs/kbd.md:162](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/kbd.md#L162)

> [the audit](../research/cohesion-audit.md#verification). Unverified: dark theme, screen readers.

**Steps for this family:** Inspect standalone keys, chords, sequences, menu shortcuts and on-color keys; listen to the enclosing control’s label.

### U041 — menu

[docs/specs/menu.md:153](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/menu.md#L153)

> - Unverified: dark theme, screen-reader announcement of menu items and submenus.

**Steps for this family:** Open a menu and submenu fixture; use arrows, Home/End, typeahead, Enter and Escape; inspect the focused item and return focus.

### U042 — message

[docs/specs/message.md:85](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/message.md#L85)

> - Unverified: dark theme, screen readers, RTL (the bubble moves to the start).

**Steps for this family:** Show user/assistant turns and streaming; reach message actions and inspect bubble anchoring and reading order.

### U045 — overlay

[docs/specs/overlay.md:110](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/overlay.md#L110-L111)

> driven by real pointer and key events over the DevTools protocol. Unverified: Firefox and
> Safari, touch, screen readers, RTL alignment on screen, nested popovers.

**Steps for this family:** Open nested popovers in the interaction lab, resize near edges, Escape one level at a time and check return focus and dismissal boundaries.

### U047 — popover

[docs/specs/popover.md:139](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/popover.md#L139-L140)

> - Unverified: dark theme, screen reader announcement of the dialog, arrow alignment when the
>   anchored popover shifts to stay in view.

**Steps for this family:** Open a triggered popover near every viewport edge, resize until it flips or shifts, inspect the arrow, Escape and verify return focus.

### U049 — property-list

[docs/specs/property-list.md:60](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/property-list.md#L60)

> Unverified: touch drag on a device; screen reader output of the live region; dark theme.

**Steps for this family:** Reorder first/middle/last rows by pointer and by ArrowUp/Down/Home/End; verify focus follows the moved row and an announcement describes its position.

### U051 — resizable-panel

[docs/specs/resizable-panel.md:102](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/resizable-panel.md#L102)

> - Unverified: dark theme, RTL drag, touch, screen reader output.

**Steps for this family:** Drag each resizable edge, then focus the splitter and use arrows/Home/End to its limits; inspect focus and value announcements.

### U057 — split-button

[docs/specs/split-button.md:217](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/split-button.md#L217)

> - Unverified: dark theme, screen reader announcement, forced colors, RTL divider position.

**Steps for this family:** Tab to both halves, open the arrow menu with the keyboard, move through items, Escape, and verify focus returns to the opener.

### U061 — tag-picker

[docs/specs/tag-picker.md:117](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/tag-picker.md#L117)

> removed"; chosen rows show the check. Dark and compact checked on the Review page 2026-10-06 (compact field 28). Unverified: screen reader, RTL.

**Steps for this family:** Filter and add a tag, create a new one in the local demo, remove by Backspace and by its remove button, then inspect the checked list row.

### U062 — tag

[docs/specs/tag.md:78](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/tag.md#L78)

> Build, parity, typecheck pass; captures pass the checksum. Unverified: dark against Notion, screen reader.

**Steps for this family:** Focus and activate the remove button on each tone; repeat disabled and both sizes, inspecting the concentric remove plate.

### U065 — toast

[docs/specs/toast.md:123](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/toast.md#L123)

> - Unverified: dark theme, screen reader announcement timing.

**Steps for this family:** Trigger a toast with an action and dismiss control; Tab to each and activate dismiss; repeat with a second live announcement.

### U066 — toolbar

[docs/specs/toolbar.md:220](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/toolbar.md#L220-L222)

> parity, token references and the React tests pass. Unverified: Figma's dark theme (switching it
> needs the owner), keyboard focus ring in the new track, a screen reader on toggle and track
> semantics (toggles are `aria-pressed`; a track is not a radio group).

**Steps for this family:** Tab into the toolbar, arrow across enabled controls, toggle a command, then move into its Segmented control and back out.

### U068 — tree-view

[docs/specs/tree-view.md:143](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/tree-view.md#L143-L146)

> - Unverified: dark theme, Notion indent and hover, Figma layers geometry (row height, 11px
>   type, icon and control sizes: needs a capture in the editor), screen-reader behaviour of
>   row actions. Layer-type glyphs (frame, rectangle, component, lock) are stand-ins until
>   drawn under the icon construction rules.

**Steps for this family:** Expand and collapse a parent with arrow keys, navigate children, reach each row action, and compare child indents and labels.

## Firefox/Safari

8 source paragraphs include this kind. **Access:** Repository and installed local Firefox/Safari are sufficient; behavior on a physical phone requires a separate device check. No sign-in or AT is needed for this engine-only pass.

For each item in this section:

1. Open the same built snapshot in current Firefox and Safari, recording versions and CSS.supports results for text-box, field-sizing, cap units, container queries, :has() and transition-behavior as applicable.
2. Perform the item’s family action below on the local Area specimen; compare only existing product states for product-capture checks.
3. Execute the action below; compare alignment, fallback sizing, clipping, focus and dismissal against Chromium. For ColorPicker, confirm EyeDropper hides cleanly when unsupported. For Drawer test exit with and without transition-behavior support; record absent features as fallback paths, not successful feature tests.
4. Attach the result to the U-ID and source clause; leave other clauses unresolved until separately checked.

### U007 — badge

[docs/specs/badge.md:555](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/badge.md#L555-L558)

> - Unverified: dark theme in every product (needs the owner's go-ahead to switch), Figma
>   editor badges, hover/focus captures (no product badge is interactive), sm with icons
>   (no composition uses it), browsers without `text-box` (they keep the previous centring
>   and its baseline behaviour).

**Steps for this family:** Use labeled, icon-bearing and dismissible badges at every size; focus/hover dismiss and compare baseline alignment in surrounding text.

### U012 — calendar

[docs/specs/calendar.md:216](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/calendar.md#L216-L217)

> - Unverified: screen readers, dark theme, RTL, Firefox/Safari, touch; hover preview was
>   exercised only with synthetic events.

**Steps for this family:** Use single, range and multiple modes; navigate days by arrows, week by Home/End, month by PageUp/PageDown, year by Shift+Page; select with Enter/Space and inspect disabled/outside/today states.

### U013 — card

[docs/specs/card.md:202](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/card.md#L202-L203)

> background). Unverified: Firefox and Safari (`text-box`, `cap`, container queries, `:has()`),
> forced colours, screen readers.

**Steps for this family:** Use linked, horizontal, immersive and carousel cards; Tab through links/actions and resize across container breakpoints.

### U018 — color-picker

[docs/specs/color-picker.md:230](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/color-picker.md#L230)

> - Unverified: dark theme, screen readers, Firefox and Safari (no EyeDropper there), touch.

**Steps for this family:** Drag and keyboard-adjust the area, hue and opacity tracks; change value model; select/add a swatch and inspect the EyeDropper availability path.

### U033 — drawer

[docs/specs/drawer.md:77](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/drawer.md#L77-L78)

> Unverified: dark, compact, RTL, screen reader, the exit slide on browsers without
> `transition-behavior`.

**Steps for this family:** Open start/end/bottom, modal and non-modal drawers; Tab, Escape and inspect return focus; repeat stacked actions and close-transition fallback.

### U036 — indicator

[docs/specs/indicator.md:351](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/indicator.md#L351-L353)

> - Unverified: product dark themes; Notion's inbox count and presence (not present);
>   Figma multiplayer avatars; counts on rectangular owners in any product; cross-engine,
>   screen-reader and forced-colors execution.

**Steps for this family:** Use dot, count and presence specimens on round and rectangular owners; exercise processing and capped counts, then inspect owner labels.

### U044 — number-field

[docs/specs/number-field.md:152](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/number-field.md#L152)

> - Unverified: dark theme; Safari and Firefox without `field-sizing`.

**Steps for this family:** Type and commit a value, clear it, show mixed state, scrub the handle and use steppers; repeat with a unit and a long number.

### U045 — overlay

[docs/specs/overlay.md:110](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/overlay.md#L110-L111)

> driven by real pointer and key events over the DevTools protocol. Unverified: Firefox and
> Safari, touch, screen readers, RTL alignment on screen, nested popovers.

**Steps for this family:** Open nested popovers in the interaction lab, resize near edges, Escape one level at a time and check return focus and dismissal boundaries.

## Touch

6 source paragraphs include this kind. **Access:** A real touch device is needed for device drag/long-press/gesture claims; desktop pointer emulation is preliminary only. No product account is needed for Area checks.

For each item in this section:

1. Serve the same local build on a device-reachable preview and open it on an actual touch device. Record OS/browser; tap, drag and long-press with a finger while watching scroll conflicts.
2. Perform the item’s family action below on the local Area specimen; compare only existing product states for product-capture checks.
3. Exercise hit targets, cancellation, scrolling and focus. For ContextMenu record that long-press is explicitly not implemented; verifying that limitation does not justify marking the feature supported. For PropertyList and resizable Panel, compare finger drag with the keyboard path.
4. Attach the result to the U-ID and source clause; leave other clauses unresolved until separately checked.

### U012 — calendar

[docs/specs/calendar.md:216](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/calendar.md#L216-L217)

> - Unverified: screen readers, dark theme, RTL, Firefox/Safari, touch; hover preview was
>   exercised only with synthetic events.

**Steps for this family:** Use single, range and multiple modes; navigate days by arrows, week by Home/End, month by PageUp/PageDown, year by Shift+Page; select with Enter/Space and inspect disabled/outside/today states.

### U018 — color-picker

[docs/specs/color-picker.md:230](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/color-picker.md#L230)

> - Unverified: dark theme, screen readers, Firefox and Safari (no EyeDropper there), touch.

**Steps for this family:** Drag and keyboard-adjust the area, hue and opacity tracks; change value model; select/add a swatch and inspect the EyeDropper availability path.

### U027 — context-menu

[docs/specs/context-menu.md:66](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/context-menu.md#L66)

> - Unverified: touch long-press (not handled), screen reader output, dark theme.

**Steps for this family:** Right-click and use Shift+F10/Menu key on the local target; navigate and dismiss; separately try a genuine touch long-press.

### U045 — overlay

[docs/specs/overlay.md:110](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/overlay.md#L110-L111)

> driven by real pointer and key events over the DevTools protocol. Unverified: Firefox and
> Safari, touch, screen readers, RTL alignment on screen, nested popovers.

**Steps for this family:** Open nested popovers in the interaction lab, resize near edges, Escape one level at a time and check return focus and dismissal boundaries.

### U049 — property-list

[docs/specs/property-list.md:60](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/property-list.md#L60)

> Unverified: touch drag on a device; screen reader output of the live region; dark theme.

**Steps for this family:** Reorder first/middle/last rows by pointer and by ArrowUp/Down/Home/End; verify focus follows the moved row and an announcement describes its position.

### U051 — resizable-panel

[docs/specs/resizable-panel.md:102](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/resizable-panel.md#L102)

> - Unverified: dark theme, RTL drag, touch, screen reader output.

**Steps for this family:** Drag each resizable edge, then focus the splitter and use arrows/Home/End to its limits; inspect focus and value announcements.

## Product capture

28 source paragraphs include this kind. **Access:** Usually needs a signed-in Figma/Notion/ChatGPT state; a public shadcn rendering or Primer source lookup needs only public network access. Existing committed captures permit offline comparison but cannot prove missing live states.

For each item in this section:

1. Read the family Sources/Visual pass and inspect existing captures first. Open only the named reference state in an already-authorized session, at the same zoom as Area; execute only read-only UI navigation.
2. Perform the item’s family action below on the local Area specimen; compare only existing product states for product-capture checks.
3. Use apps/docs/public/area-capture.js on the named shell/slots and save a redacted state capture plus side-by-side evidence. Do not create multi-select data, summon multiplayer collaborators, type a product draft, change product theme/settings or perform deletion to manufacture a reference; if the needed state is absent, record the missing state for the owner.
4. Attach the result to the U-ID and source clause; leave other clauses unresolved until separately checked.

### U002 — alignment-picker

[docs/specs/alignment-picker.md:170](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/alignment-picker.md#L170)

> Unverified: Figma's focus state (rest and hover captured 2026-10-04).

**Steps for this family:** Move through all nine physical positions with arrows, hover every cell, focus a cell and compare selected versus preview marks.

### U003 — alignment-picker

[docs/specs/alignment-picker.md:194](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/alignment-picker.md#L194-L195)

>   for review (`component-status.mjs`). Unverified: Figma's grid size, padding, hover ink and plate,
>   pending a live capture in Claude in Chrome.

**Steps for this family:** Move through all nine physical positions with arrows, hover every cell, focus a cell and compare selected versus preview marks.

### U004 — avatar

[docs/specs/avatar.md:184](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/avatar.md#L184-L185)

> did not inspect screenshots. Unverified: dark theme, an active ring next to a focused
> avatar-bearing control, a side-by-side with Figma's initials avatar.

**Steps for this family:** Use initials and image avatars, active and inactive, beside a focusable control carrying an avatar; focus that control.

### U005 — badge-group

[docs/specs/badge-group.md:134](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/badge-group.md#L134-L135)

> owner's workspace (Notion's tasks board has single tags per group header). Unverified: a Notion multi-select cell's tag gap
> (no multi-select was reachable in the owner's workspace), dark theme.

**Steps for this family:** Open the overflow trigger by keyboard, inspect its focus ring, then compare wrapping and overlay tag gaps.

Use an existing multi-select cell; do not convert a property or add values just to obtain a capture.

### U007 — badge

[docs/specs/badge.md:555](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/badge.md#L555-L558)

> - Unverified: dark theme in every product (needs the owner's go-ahead to switch), Figma
>   editor badges, hover/focus captures (no product badge is interactive), sm with icons
>   (no composition uses it), browsers without `text-box` (they keep the previous centring
>   and its baseline behaviour).

**Steps for this family:** Use labeled, icon-bearing and dismissible badges at every size; focus/hover dismiss and compare baseline alignment in surrounding text.

### U008 — box-field

[docs/specs/box-field.md:124](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/box-field.md#L124-L125)

> - Unverified: dark theme; screen reader output; RTL (left/right are physical here, as padding
>   values are); Figma's split layouts (needs opening the panels in the owner's file).

**Steps for this family:** Toggle linked and per-side/per-corner editing, change each field locally and verify physical left/right labels remain attached to the intended side.

Locate an existing selected object with independent padding/corner controls; expanding an already-authorized inspector is navigation, editing its values is outside this research task.

### U009 — breadcrumb

[docs/specs/breadcrumb.md:124](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/breadcrumb.md#L124)

> - Unverified: hover plate on screen (the browser pane was hidden), dark theme, Figma.

**Steps for this family:** Hover/focus each link and overflow control; inspect current-page treatment and separators.

### U011 — button

[docs/specs/button.md:292](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/button.md#L292-L293)

> - Unverified: dark theme (products not switched), Figma hover, disabled/loading/selected against references, compact density
>   (the gap follows density since audit S14; compact sm is 4).

**Steps for this family:** Inspect solid/soft/outline/ghost at sm/md/lg, then disabled/loading/selected specimens with real pointer hover and keyboard focus.

### U014 — checkbox

[docs/specs/checkbox.md:153](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/checkbox.md#L153)

> Unverified: dark theme, hover and focus in a product.

**Steps for this family:** Toggle checked/mixed/unchecked; focus normal and card/tile variants, including disabled and invalid.

### U017 — color-field

[docs/specs/color-field.md:134](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/color-field.md#L134)

> Unverified: Figma side by side at the same zoom, dark theme.

**Steps for this family:** Edit hex and opacity, reach the swatch and any nested action with Tab, and compare field/swatch corners at the same zoom.

### U019 — color-swatch-picker

[docs/specs/color-swatch-picker.md:141](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/color-swatch-picker.md#L141-L142)

> the sizes each have a tile. Unverified: Figma side by side, dark theme, a selected
> Figma chit.

**Steps for this family:** Choose swatches with arrows and Space, including a light swatch; inspect the selected ring and palette/grid/row layouts.

### U020 — color-swatch

[docs/specs/color-swatch.md:104](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/color-swatch.md#L104-L105)

> The gallery shows ColorSwatch's tiles in named groups. Unverified: Figma side by side, dark
> theme, forced colours.

**Steps for this family:** Render white, transparent, saturated and selected swatches; inspect edge visibility and checker/colour separation.

### U025 — composer

[docs/specs/composer.md:98](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/composer.md#L98-L99)

> `npm test` (tokens and contrast), capture checksums: all pass. Unverified: dark theme, focus ring on screen, ChatGPT's
> multi-line radius (would require typing), hover states.

**Steps for this family:** Type a multiline local draft, inspect auto-growth, hover/focus tool/send controls and verify the text remains readable.

The requested ChatGPT multiline reference requires an existing multiline draft or explicit owner permission to type; do not send a message.

### U029 — custom-select

[docs/specs/custom-select.md:209](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/custom-select.md#L209-L210)

> moves, Escape closes and keeps focus), groups, ghost open in dark. Unverified: screen reader
> announcement, RTL, forced colours, Figma side by side.

**Steps for this family:** Open by Enter/Space/ArrowDown, use arrows/Home/End/typeahead, choose with Enter, and Escape; repeat descriptions, groups and ghost trigger.

### U030 — date-picker

[docs/specs/date-picker.md:107](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/date-picker.md#L107)

> invalid edge. Dark (panel and calendar) and compact (field 28) checked 2026-10-06. Unverified: screen reader, RTL, Figma comparison.

**Steps for this family:** Tab to the date trigger and open it with Enter/Space; type 2026-10-20 then Enter, reopen and type invalid text, Tab to Calendar, navigate with arrows, select a day, reopen, clear with the clear action and Escape; verify focus returns to the trigger and compare formatted date/week order in LTR and RTL.

### U032 — disclosure

[docs/specs/disclosure.md:231](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/disclosure.md#L231-L232)

> - Unverified: Notion collapsed and dark, ChatGPT dark, a rendered shadcn accordion, dark paint on
>   screen, find-in-page with the real browser find bar.

**Steps for this family:** Collapse a section containing a unique text string, use the browser’s real Find command for that string, then verify the section opens; also toggle plain/divided and grouped sections.

Check the collapsed Notion toggle and ChatGPT dark separately from the public rendered shadcn accordion; the latter does not require sign-in.

### U036 — indicator

[docs/specs/indicator.md:351](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/indicator.md#L351-L353)

> - Unverified: product dark themes; Notion's inbox count and presence (not present);
>   Figma multiplayer avatars; counts on rectangular owners in any product; cross-engine,
>   screen-reader and forced-colors execution.

**Steps for this family:** Use dot, count and presence specimens on round and rectangular owners; exercise processing and capped counts, then inspect owner labels.

Use existing inbox/presence/multiplayer/rectangular-owner states only; if none is present, record the unavailable reference rather than creating activity.

### U037 — input-group

[docs/specs/input-group.md:145](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/input-group.md#L145-L146)

> second pass. Unverified: Figma side by side at one zoom, dark theme, a
> disabled group, a group with one of two children disabled (the whole group paints disabled).

**Steps for this family:** Compare all-enabled, all-disabled and mixed enabled/disabled child groups; focus each enabled child and inspect shared disabled paint.

### U038 — input

[docs/specs/input.md:156](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/input.md#L156-L157)

> resting shadow. Unverified: hover and focus in the products (Chrome was a background window),
> dark theme.

**Steps for this family:** Focus empty/filled/invalid/disabled fields, hover optional actions, type locally and inspect the label, affixes and focus edge.

### U043 — nav

[docs/specs/nav.md:194](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/nav.md#L194)

> - Unverified: dark products, an accent Selection theme beside a product.

**Steps for this family:** Open a navigation list with current, disabled, icon and trailing-action rows; hover each enabled row and Tab through its interactive parts.

### U046 — panel

[docs/specs/panel.md:193](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/panel.md#L193)

> Unverified: dark theme and a side-by-side with Figma's inspector at the same zoom.

**Steps for this family:** Open the Figma inspector recipe; expand/collapse sections, Tab through controls and inspect label columns and separators.

### U050 — radio

[docs/specs/radio.md:126](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/radio.md#L126)

> Unverified: dark theme, hover and focus in a product.

**Steps for this family:** Arrow among radios and focus row/tile cards; verify one selected option and the group’s label.

### U052 — segmented

[docs/specs/segmented.md:163](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/segmented.md#L163-L164)

> [the audit](../research/cohesion-audit.md#verification). Unverified: hover and focus
> captures, dark theme.

**Steps for this family:** Tab into the group, use each arrow direction and Home/End, select a different item, then Tab out.

### U053 — select

[docs/specs/select.md:159](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/select.md#L159-L160)

> and checked fill appear only with the picker open in a supporting browser. Unverified: the
> open picker on screen, a Notion or Figma picker side by side, dark theme.

**Steps for this family:** Open the real native/customized picker, navigate options and select one, then Escape; inspect checked/disabled/hover states on screen.

### U062 — tag

[docs/specs/tag.md:78](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/tag.md#L78)

> Build, parity, typecheck pass; captures pass the checksum. Unverified: dark against Notion, screen reader.

**Steps for this family:** Focus and activate the remove button on each tone; repeat disabled and both sizes, inspecting the concentric remove plate.

### U066 — toolbar

[docs/specs/toolbar.md:220](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/toolbar.md#L220-L222)

> parity, token references and the React tests pass. Unverified: Figma's dark theme (switching it
> needs the owner), keyboard focus ring in the new track, a screen reader on toggle and track
> semantics (toggles are `aria-pressed`; a track is not a radio group).

**Steps for this family:** Tab into the toolbar, arrow across enabled controls, toggle a command, then move into its Segmented control and back out.

### U067 — tooltip

[docs/specs/tooltip.md:145](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/tooltip.md#L145)

> - Unverified: Figma capture file, dark theme. Hover/focus behaviour is implemented (2026-09-27, [overlay.md](overlay.md)); its timing has not been owner-reviewed (the batch 17 pass compared static paint).

**Steps for this family:** Focus and hover the trigger, move between two tooltip triggers and Escape; measure opening/closing delays separately from owner timing approval.

### U068 — tree-view

[docs/specs/tree-view.md:143](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/tree-view.md#L143-L146)

> - Unverified: dark theme, Notion indent and hover, Figma layers geometry (row height, 11px
>   type, icon and control sizes: needs a capture in the editor), screen-reader behaviour of
>   row actions. Layer-type glyphs (frame, rectangle, component, lock) are stand-ins until
>   drawn under the icon construction rules.

**Steps for this family:** Expand and collapse a parent with arrow keys, navigate children, reach each row action, and compare child indents and labels.

## Other local/source/owner checks

32 source paragraphs include this kind. **Access:** Local interaction/layout checks use the repository and a local browser. Public source pinning needs network; owner timing approval and missing icon design decisions require the owner. Real IME checks need an installed input method.

For each item in this section:

1. Keep the local browser foreground; perform the family action below with real pointer/Tab/keyboard events. For compact wording, set data-area-ui="compact" before mount; for IME use an actual composition session.
2. Perform the item’s family action below on the local Area specimen; compare only existing product states for product-capture checks.
3. Record the specific remaining assertion in the source quote: hover/focus paint, mixed-disabled group, viewport fit, nested dismissal, media corners or Find reveal. For a pinned-source request, record an upstream SHA and lines. For owner-reviewed timing or undrawn stand-ins, preserve the decision gap after measuring; no local test grants approval.
4. Attach the result to the U-ID and source clause; leave other clauses unresolved until separately checked.

### U001 — alert

[docs/specs/alert.md:179](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/alert.md#L179)

> - Unverified: dismiss hover and focus on screen, dark theme.

**Steps for this family:** Use single-line and multiline alerts with dismiss; hover and Tab to dismiss, then activate it.

### U002 — alignment-picker

[docs/specs/alignment-picker.md:170](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/alignment-picker.md#L170)

> Unverified: Figma's focus state (rest and hover captured 2026-10-04).

**Steps for this family:** Move through all nine physical positions with arrows, hover every cell, focus a cell and compare selected versus preview marks.

### U003 — alignment-picker

[docs/specs/alignment-picker.md:194](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/alignment-picker.md#L194-L195)

>   for review (`component-status.mjs`). Unverified: Figma's grid size, padding, hover ink and plate,
>   pending a live capture in Claude in Chrome.

**Steps for this family:** Move through all nine physical positions with arrows, hover every cell, focus a cell and compare selected versus preview marks.

### U004 — avatar

[docs/specs/avatar.md:184](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/avatar.md#L184-L185)

> did not inspect screenshots. Unverified: dark theme, an active ring next to a focused
> avatar-bearing control, a side-by-side with Figma's initials avatar.

**Steps for this family:** Use initials and image avatars, active and inactive, beside a focusable control carrying an avatar; focus that control.

### U006 — badge-group

[docs/specs/badge-group.md:147](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/badge-group.md#L147-L148)

> - Unverified: keyboard focus ring on the trigger (not reached with the real Tab key in
>   this pass), dark theme, Primer source at a pinned commit.

**Steps for this family:** Open the overflow trigger by keyboard, inspect its focus ring, then compare wrapping and overlay tag gaps.

### U007 — badge

[docs/specs/badge.md:555](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/badge.md#L555-L558)

> - Unverified: dark theme in every product (needs the owner's go-ahead to switch), Figma
>   editor badges, hover/focus captures (no product badge is interactive), sm with icons
>   (no composition uses it), browsers without `text-box` (they keep the previous centring
>   and its baseline behaviour).

**Steps for this family:** Use labeled, icon-bearing and dismissible badges at every size; focus/hover dismiss and compare baseline alignment in surrounding text.

### U009 — breadcrumb

[docs/specs/breadcrumb.md:124](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/breadcrumb.md#L124)

> - Unverified: hover plate on screen (the browser pane was hidden), dark theme, Figma.

**Steps for this family:** Hover/focus each link and overflow control; inspect current-page treatment and separators.

### U010 — button-group

[docs/specs/button-group.md:69](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/button-group.md#L69)

> - Unverified: dark theme, focus ring over the divider in every size.

**Steps for this family:** Focus every joined button at each size; inspect the focused outline where it meets the divider, including a selected neighbor.

### U011 — button

[docs/specs/button.md:292](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/button.md#L292-L293)

> - Unverified: dark theme (products not switched), Figma hover, disabled/loading/selected against references, compact density
>   (the gap follows density since audit S14; compact sm is 4).

**Steps for this family:** Inspect solid/soft/outline/ghost at sm/md/lg, then disabled/loading/selected specimens with real pointer hover and keyboard focus.

### U012 — calendar

[docs/specs/calendar.md:216](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/calendar.md#L216-L217)

> - Unverified: screen readers, dark theme, RTL, Firefox/Safari, touch; hover preview was
>   exercised only with synthetic events.

**Steps for this family:** Use single, range and multiple modes; navigate days by arrows, week by Home/End, month by PageUp/PageDown, year by Shift+Page; select with Enter/Space and inspect disabled/outside/today states.

### U014 — checkbox

[docs/specs/checkbox.md:153](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/checkbox.md#L153)

> Unverified: dark theme, hover and focus in a product.

**Steps for this family:** Toggle checked/mixed/unchecked; focus normal and card/tile variants, including disabled and invalid.

### U015 — code-block

[docs/specs/code-block.md:165](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/code-block.md#L165-L166)

> (Area tokens over ChatGPT's pill scale; 14 mono throughout). No change. Unverified: hover and
> `:target` paint on screen, dark theme, RTL.

**Steps for this family:** Hover header actions and line links; navigate to a line fragment to activate :target and inspect the linked-line rail.

### U022 — combobox

[docs/specs/combobox.md:89](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/combobox.md#L89)

> - Unverified: dark theme, screen reader announcements, IME composition, RTL.

**Steps for this family:** Type to filter, arrow through results, choose/create an item, clear, and Escape; use a real IME to confirm composition does not select early.

### U023 — command-palette

[docs/specs/command-palette.md:104](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/command-palette.md#L104)

> - Unverified: dark theme, screen reader output, IME.

**Steps for this family:** Open, type/filter, arrow through groups, activate a harmless action, and Escape; repeat with a real IME composition.

### U024 — command-palette

[docs/specs/command-palette.md:131](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/command-palette.md#L131)

> "Move" ink to the Open keycap 16. Unverified: hover paint by eye, dark theme.

**Steps for this family:** Open, type/filter, arrow through groups, activate a harmless action, and Escape; repeat with a real IME composition.

### U025 — composer

[docs/specs/composer.md:98](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/composer.md#L98-L99)

> `npm test` (tokens and contrast), capture checksums: all pass. Unverified: dark theme, focus ring on screen, ChatGPT's
> multi-line radius (would require typing), hover states.

**Steps for this family:** Type a multiline local draft, inspect auto-growth, hover/focus tool/send controls and verify the text remains readable.

### U026 — confirm-dialog

[docs/specs/confirm-dialog.md:59](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/confirm-dialog.md#L59)

> surface is 420 wide. Unverified: dark, compact, screen reader.

**Steps for this family:** Open the harmless local confirm demo, verify initial Cancel focus, test Cancel/Escape, and inspect its neutral/danger/compact specimens.

### U031 — dialog

[docs/specs/dialog.md:179](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/dialog.md#L179-L180)

> - Unverified: dark theme and the dark scrim, screen reader announcement, the modal on a
>   phone-width viewport.

**Steps for this family:** Open by trigger, Tab and Shift+Tab through the modal, Escape and inspect return focus; repeat at a narrow phone-like viewport.

### U032 — disclosure

[docs/specs/disclosure.md:231](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/disclosure.md#L231-L232)

> - Unverified: Notion collapsed and dark, ChatGPT dark, a rendered shadcn accordion, dark paint on
>   screen, find-in-page with the real browser find bar.

**Steps for this family:** Collapse a section containing a unique text string, use the browser’s real Find command for that string, then verify the section opens; also toggle plain/divided and grouped sections.

### U033 — drawer

[docs/specs/drawer.md:77](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/drawer.md#L77-L78)

> Unverified: dark, compact, RTL, screen reader, the exit slide on browsers without
> `transition-behavior`.

**Steps for this family:** Open start/end/bottom, modal and non-modal drawers; Tab, Escape and inspect return focus; repeat stacked actions and close-transition fallback.

### U037 — input-group

[docs/specs/input-group.md:145](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/input-group.md#L145-L146)

> second pass. Unverified: Figma side by side at one zoom, dark theme, a
> disabled group, a group with one of two children disabled (the whole group paints disabled).

**Steps for this family:** Compare all-enabled, all-disabled and mixed enabled/disabled child groups; focus each enabled child and inspect shared disabled paint.

### U038 — input

[docs/specs/input.md:156](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/input.md#L156-L157)

> resting shadow. Unverified: hover and focus in the products (Chrome was a background window),
> dark theme.

**Steps for this family:** Focus empty/filled/invalid/disabled fields, hover optional actions, type locally and inspect the label, affixes and focus edge.

### U045 — overlay

[docs/specs/overlay.md:110](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/overlay.md#L110-L111)

> driven by real pointer and key events over the DevTools protocol. Unverified: Firefox and
> Safari, touch, screen readers, RTL alignment on screen, nested popovers.

**Steps for this family:** Open nested popovers in the interaction lab, resize near edges, Escape one level at a time and check return focus and dismissal boundaries.

### U047 — popover

[docs/specs/popover.md:139](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/popover.md#L139-L140)

> - Unverified: dark theme, screen reader announcement of the dialog, arrow alignment when the
>   anchored popover shifts to stay in view.

**Steps for this family:** Open a triggered popover near every viewport edge, resize until it flips or shifts, inspect the arrow, Escape and verify return focus.

### U050 — radio

[docs/specs/radio.md:126](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/radio.md#L126)

> Unverified: dark theme, hover and focus in a product.

**Steps for this family:** Arrow among radios and focus row/tile cards; verify one selected option and the group’s label.

### U052 — segmented

[docs/specs/segmented.md:163](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/segmented.md#L163-L164)

> [the audit](../research/cohesion-audit.md#verification). Unverified: hover and focus
> captures, dark theme.

**Steps for this family:** Tab into the group, use each arrow direction and Home/End, select a different item, then Tab out.

### U055 — skeleton

[docs/specs/skeleton.md:148](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/skeleton.md#L148)

> Unverified: dark theme, the card tile's media corners at the new Card radius on screen.

**Steps for this family:** Show text, circle and Card media skeleton specimens; compare media corners against the card at radius 0, 8 and pill.

### U064 — toast

[docs/specs/toast.md:114](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/toast.md#L114-L115)

> owner's lighter-fill direction; an inverse toast remains an open option. Unverified: dark theme,
> the action and dismiss hover on screen.

**Steps for this family:** Trigger a toast with an action and dismiss control; Tab to each and activate dismiss; repeat with a second live announcement.

### U065 — toast

[docs/specs/toast.md:123](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/toast.md#L123)

> - Unverified: dark theme, screen reader announcement timing.

**Steps for this family:** Trigger a toast with an action and dismiss control; Tab to each and activate dismiss; repeat with a second live announcement.

### U066 — toolbar

[docs/specs/toolbar.md:220](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/toolbar.md#L220-L222)

> parity, token references and the React tests pass. Unverified: Figma's dark theme (switching it
> needs the owner), keyboard focus ring in the new track, a screen reader on toggle and track
> semantics (toggles are `aria-pressed`; a track is not a radio group).

**Steps for this family:** Tab into the toolbar, arrow across enabled controls, toggle a command, then move into its Segmented control and back out.

### U067 — tooltip

[docs/specs/tooltip.md:145](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/tooltip.md#L145)

> - Unverified: Figma capture file, dark theme. Hover/focus behaviour is implemented (2026-09-27, [overlay.md](overlay.md)); its timing has not been owner-reviewed (the batch 17 pass compared static paint).

**Steps for this family:** Focus and hover the trigger, move between two tooltip triggers and Escape; measure opening/closing delays separately from owner timing approval.

### U068 — tree-view

[docs/specs/tree-view.md:143](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/tree-view.md#L143-L146)

> - Unverified: dark theme, Notion indent and hover, Figma layers geometry (row height, 11px
>   type, icon and control sizes: needs a capture in the editor), screen-reader behaviour of
>   row actions. Layer-type glyphs (frame, rectangle, component, lock) are stand-ins until
>   drawn under the icon construction rules.

**Steps for this family:** Expand and collapse a parent with arrow keys, navigate children, reach each row action, and compare child indents and labels.

## Proposals

Recommended order: local paint/RTL/engine checks first, then assistive-technology and touch sessions, then reference captures grouped by product. Retain the exact U-ID and clause in each result so a local dark screenshot does not accidentally clear a product-dark gap.

## Open questions

- Generic “dark theme” markers often do not distinguish Area paint from reference parity. Which scope did the original author intend? Both are kept distinct here.
- Which older markers have already been resolved by later evidence? Reconcile dates before scheduling duplicate work; this collection does not delete historical notes.
- Missing product states, owner timing approval and undrawn glyph choices cannot be resolved by a browser test alone.

## Reproduce

Run `python3 docs/research/astra/unverified-inventory/generate.py`. The script resolves the repository relative to itself, reads the pinned Git snapshot, and writes only this topic. `items.json` retains exact paragraphs, source ranges, categories and the per-family procedure. It asserts the full 68-marker coverage and protects against misclassifying already-verified context.
