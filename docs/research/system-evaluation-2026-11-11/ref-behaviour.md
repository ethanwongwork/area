# Reference behaviour and motion: the bar Area is audited against (2026-11-11)

Prefix **RB**. Worker: behaviour and motion reference. Read-only; this file is the only edit.

## 1. Scope and method

**Primary sources read at pinned commits** (shallow clones in the session scratchpad; paths below are repo-relative):

| Repo | Commit | Read |
|---|---|---|
| radix-ui/primitives | `eb3a2b70` | `packages/react/{menu,select,tooltip,hover-card,toast,tabs,dropdown-menu,dismissable-layer,dialog,alert-dialog,roving-focus,scroll-area,navigation-menu,popper}/src` |
| mui/base-ui | `5aacdbb7` | `packages/react/src/**/constants.ts`, `internals/`, `drawer/`, `toast/`, `select/`, `menu/`, `tooltip/`, `context-menu/`, `slider/`, `number-field/`, `utils/useSwipeDismiss.ts`, `packages/utils/src/useScrollLock.ts` |
| adobe/react-spectrum | `d354aa2a` | `packages/react-aria/src/{interactions,menu,tooltip,dnd,selection,toast,live-announcer,utils}`, `packages/react-stately/src/{tooltip,toast,layout,slider}` |
| floating-ui/floating-ui | `e1e9f889` | `packages/react/src/safePolygon.ts`, `hooks/{useHover,useTypeahead,useTransition}.ts`, `components/FloatingDelayGroup.tsx` |
| ariakit/ariakit | `79eb29bf` | `packages/ariakit-components/src/{tooltip,hovercard,menu}/*-store.ts` |
| tailwindlabs/headlessui | `eea57cf4` | `packages/@headlessui-react/src/{components/menu/menu.tsx,hooks/use-quick-release.ts}` |
| pacocoursey/cmdk | `dd2250ed` | `cmdk/src/index.tsx`, `cmdk/src/command-score.ts` |
| emilkowalski/sonner | `8e4662b3` | `src/index.tsx`, `src/styles.css` |
| emilkowalski/vaul | `3e97aac6` | `src/constants.ts`, `src/index.tsx` |
| material-components/material-web | `37aa14b8` | `tokens/versions/latest/sass/_md-sys-motion.scss` (M3 motion tokens) |

**Web sources:** Vercel Web Interface Guidelines (github.com/vercel-labs/web-interface-guidelines README), Emil Kowalski
"Great animations" and "7 practical animation tips" (emilkowal.ski/ui/…), Rauno Freiberg "Invisible details of
interaction design" (rauno.me/craft/interaction-design), WAI-ARIA APG pattern pages (w3.org/WAI/ARIA/apg/patterns/<name>/),
Electron 44 release notes (electronjs.org/blog/electron-44-0: Chromium 152.0.7977.x), Chrome 142 release notes
(developer.chrome.com/release-notes/142: `interestfor`).

**Area read:** `docs/MOTION.md`, `packages/tokens/src/axes/{motion,easing}.ts`, `packages/tokens/src/emit/base.ts:430-438`,
`packages/react/src/components/{overlay.ts,Overlays.tsx,primitives.tsx (Menu, MenuSub, Tabs, Dialog, Slider, loading delay),
CustomSelect,Combobox,CommandPalette,Toaster,HoverCard,ContextMenu,Drawer,ConfirmDialog,Splitter,TreeView,NumberField,OTPField}.tsx`,
`packages/styles/src/components/surface.css` (overlay, menu row, dialog, toast motion). Area runs in Electron **44.7.0**
(`node_modules/electron/package.json`), i.e. **Chromium 152**, so every platform feature listed in section 6 that shipped in
Chrome ≤ 152 is available to the app today.

**Not verified:** APG pages, Apple HIG, Material 3 site prose, Linear/Raycast writing and MDN were drawn from the pattern
pages' published keyboard tables and my reading of them, not re-fetched line by line this session (the M3 site is
script-rendered; its token values were read from material-web source instead). Chrome "first shipped" versions in section 6
are from Chrome release notes as I know them, except Electron 44 = Chromium 152 and `interestfor` = 142, which were checked.
Area findings are from source reading only; nothing was run in the app (another session owns Electron). Another worker
audits Area's interaction source in full; section 7 is a spot-check of the listed families.

## 2. Reference behaviour per pattern (the checklist)

Notation: **[R]** Radix, **[B]** Base UI, **[RA]** React Aria, **[F]** Floating UI, **[AK]** Ariakit, **[H]** Headless UI,
**[APG]** WAI-ARIA Authoring Practices, **[V]** Vercel guidelines, **[EK]** Emil Kowalski, **[RF]** Rauno Freiberg.

### 2.1 Button / press
- Press fires on pointer **up inside** the target; moving out cancels, moving back re-arms (RA `usePress` `isOverTarget`,
  `react-aria/src/interactions/usePress.ts:84,319,498`). Keyboard: Enter fires on keydown, Space on keyup (native button).
- `:active`/pressed paint is instant; a give of **0.97** scale on press (EK "7 practical tips"; Area already 0.96–0.985).
- Never animate keyboard-initiated presses (EK "Great animations").
- Hover only for real hover devices: `@media (hover: hover)`; RA ignores emulated mouse events after touch
  (`useHover.ts:38-45`).
- Touch: `touch-action: manipulation` (no double-tap zoom delay), tap highlight matched to design (V).
- Hit target ≥ 24px on desktop, ≥ 44px on touch (V).
- Loading: keep the label, add the indicator; show-delay **150–300ms**, minimum visible **300–500ms** (V).
- Submit stays enabled until the request starts; never pre-disable (V).
- Long press (when present): **500ms** (RA `useLongPress.ts:57`; B context menu `ContextMenuTrigger.tsx:17`), cancelled by
  **10px** movement (B `ContextMenuTrigger.tsx:155`).

### 2.2 Toggle button / toggle group
- `aria-pressed` for a toggle; a group of exclusive toggles is a radio group or a toolbar with roving focus (APG Toolbar).
- Roving tabindex: one Tab stop, arrows move, Home/End jump; wrap optional (R `roving-focus-group.tsx:119` `loop=false`).
- Pointer activation on **pointerdown** for tab-like selectors (R Tabs activates on `onMouseDown`, `tabs.tsx:187`).

### 2.3 Checkbox / radio / switch
- Label and control share one hit target (V). Space toggles checkbox/switch; radio group: arrows move **and select**,
  Tab enters on the checked radio (APG Radio Group).
- Indeterminate is a third visual, `aria-checked="mixed"`; clicking it goes to checked (APG Checkbox mixed).
- Switch thumb travels on ease-in-out ≈ 150–250ms; check marks scale from ≥ 0.6, never from 0 (EK: never `scale(0)`).
- Drag-across to set many checkboxes is a known nicety (Apple), not consensus.

### 2.4 Text field, number field
- Never block paste; never lose value or focus after hydration (V). `autocomplete`, `name`, `inputmode`, `spellcheck=false`
  for codes/emails (V). Placeholders end with an ellipsis (V).
- Errors next to the field; on submit focus the first error (V). Don't block keystrokes; validate after (V).
- Enter submits a single-field form; textarea: ⌘/Ctrl+Enter submits (V).
- IME: never act on Enter while `isComposing` or `keyCode === 229` (every chat/palette library; Area already does this in
  Composer, Combobox, TagPicker).
- Number field: ↑/↓ step, Shift ×10 (Carbon, MUI), PageUp/PageDown large step, Home/End to min/max (APG Spinbutton).
  Press-and-hold repeats after **400ms**, then every **60ms** (B `number-field/utils/constants.ts:1-2`,
  `internals/usePressAndHold.ts:10-13`, touch intent check 50ms). Scrub-to-change on the label (Figma). Wheel changes
  only while focused (B `allowWheelScrub` opt-in). Locale parsing via `Intl.NumberFormat`.

### 2.5 OTP / one-time code
- Single real input underneath (autofill and `autocomplete="one-time-code"` only work on one field) (V; input-otp).
- Paste anywhere fills from the start, strips spaces/dashes; Backspace on an empty slot moves back; arrows move;
  select-all and undo work. Auto-submit on the last character is optional and must not fire twice.

### 2.6 Date / time fields (segmented)
- Each segment is a `spinbutton`; ←/→ move between segments, ↑/↓ change with wrap, typing digits fills and auto-advances
  when the segment cannot take another digit ("3" in month advances, "1" waits) (RA DateField; APG Spinbutton).
- Backspace clears the segment then moves back; placeholders are locale-ordered (`Intl.DateTimeFormat#formatToParts`);
  12/24h follows locale; the whole field has one label and a group role.
- Paste of a full date parses into segments (RA).

### 2.7 Select / listbox
- Trigger: Enter/Space/↑/↓ open; open on **pointerdown** (R `select.tsx:403`, R DropdownMenu `dropdown-menu.tsx:125`), so
  press-drag-release picks in one gesture.
- Press-drag-release guards: R ignores the pointerup if the pointer moved **≤ 10px** since the down (`select.tsx:775`);
  B blocks mouseup selection for **400ms** after open (`SelectTrigger.tsx:28,110`); H "quick release" after **200ms**
  hold and **5px** movement (`use-quick-release.ts:29,33`).
- Focus lands on the **selected** option (R `select.tsx:748`); macOS-style alignment of the selected item over the
  trigger is optional (R `item-aligned`, `CONTENT_MARGIN = 10`, `select.tsx:613`).
- Typeahead: printable keys build a string; reset after the window (R 1000ms `select.tsx:1973`, B 500 `internals/constants.ts:3`,
  F 750 `useTypeahead.ts:83`, H 350 `menu.tsx:525`, RA 1000 `useTypeSelect.ts:21`); **a repeated single letter cycles**
  through matches (R `menu.tsx:1348-1352`); Space inside a typeahead run is part of the text.
- Home/End, PageUp/PageDown (≈ one viewport), Escape closes without change, Tab commits nothing and moves on.
- Long lists: scroll arrows/edges, `overscroll-behavior: contain`, keep the active row in view without scrolling the page.

### 2.8 Combobox / autocomplete
- Focus stays in the input; `aria-activedescendant` moves the highlight (APG Combobox).
- ↓ opens (Alt+↓ opens without moving), ↑ opens on last, Alt+↑ closes keeping the highlight, Enter commits, Escape
  closes then clears on second press, Tab commits the highlight only when autoselect is on.
- IME-safe Enter; announce result count politely (RA LiveAnnouncer, 7000ms clear `LiveAnnouncer.tsx:16`).
- Filtering: debounce is unnecessary for local lists; for remote, show stale results until the new ones arrive (no flash).
- Highlight follows pointer **movement**, not pointer **presence** (a list that scrolls under a still pointer must not
  steal the highlight) — R/B/cmdk check `pointermove`, not `pointerenter`.

### 2.9 Menu, submenu, context menu
- Trigger: Enter/Space/↓ open on first item, ↑ on last (APG Menu Button). Open on **pointerdown** (R `dropdown-menu.tsx:125`).
- Items: ↑/↓ move, Home/End, typeahead (as 2.7, cycling), Enter/Space activate; checkbox rows stay open.
- Hover moves the highlight on `pointermove`; leaving the menu clears the highlight back to the content (R).
- **Submenu open delay:** R **100ms** (`menu.tsx:1134-1137`), B **100ms** (`MenuSubmenuTrigger.tsx:43`), RA **200ms**
  (`useSubmenuTrigger.ts:98`), AK **150ms** (`menu-store.ts:98-101`, 0 inside a menubar).
- **Submenu safe area:** R builds a polygon from the pointer (with a **5px** bleed) to the submenu's near and far corners
  and keeps the submenu open while the pointer moves towards it; the grace expires after **300ms**
  (`menu.tsx:1146-1171`). F `safePolygon` (`buffer 0.5`, `requireIntent` true, closes if cursor speed < **0.1px/ms**
  after **40ms**, `safePolygon.ts:49-51,385-394`). RA `useSafelyMouseToSubmenu` (2 invalid movements allowed, 50ms throttle,
  1000ms timeout, `useSafelyMouseToSubmenu.ts:20-22`).
- →/Enter/Space open a submenu on its first item; ← / Escape close only the submenu and return focus to its row.
- Context menu: opens at the pointer on `contextmenu`, Shift+F10 / ContextMenu key from the keyboard, **long-press 500ms**
  with **10px** move tolerance on touch (B `ContextMenuTrigger.tsx:17,155`). Origin at the pointer. No animation or a
  very short one (RF: high-frequency surfaces skip animation).
- Menus that open from the keyboard should not animate, or animate ≤ 100ms (EK, RF).
- Escape closes the innermost layer only; outside pointerdown closes; a modal menu blocks outside pointer events
  (R `disableOutsidePointerEvents`, `dismissable-layer.tsx:37,197`); a press on another trigger does not "click through"
  into the page under a modal menu.
- Touch: R defers outside-dismiss registration a tick so the opening pointerdown doesn't close it
  (`dismissable-layer.tsx:499-511`) and notes the ~350ms touch click delay (`:431`).

### 2.10 Command palette
- Opens on ⌘K (platform-aware: ⌘ on Apple, Ctrl elsewhere), focus in the input, **no or near-zero enter animation**:
  it is the most frequently opened surface (RF; EK criticises a 500ms palette enter).
- ↑/↓ move; cmdk adds **Ctrl+N/P and Ctrl+J/K** (`vimBindings` default true, `index.tsx:200,596-608`); Home/End;
  optional loop (`index.tsx:112,512`).
- Fuzzy ranking: continuous match 1, word jump 0.9, character jump 0.17, transposition 0.1, penalties for skips/case
  (`command-score.ts:6-47`). Keywords/aliases matched but not shown.
- Escape steps back (clear query → back a page → close). Backspace on empty goes back a page.
- IME-safe Enter. Result count announced. Recently used first. Results update without layout jumps (fixed height or
  animated height via `--cmdk-list-height`).

### 2.11 Tabs
- Automatic activation by default (arrow selects), manual when panels are expensive (APG Tabs).
- One Tab stop on the selected tab, Tab then moves **into the panel** (panel focusable if it has no focusable content).
- Pointer: activate on **mousedown** (R `tabs.tsx:187`, ignoring Ctrl-click and non-left buttons).
- Indicator slides on ease-in-out; never animate when a tab is chosen by keyboard repeat (EK).
- Overflowing tab lists scroll the selected tab into view without scrolling the page.

### 2.12 Segmented control
- Radio-group semantics (exclusive) or tabs if it switches panels; arrows move **and** select; one plate slides.
- Pointer activation on pointerdown is the native macOS feel (NSSegmentedControl); press-drag across segments optional.

### 2.13 Accordion / disclosure
- Enter/Space toggle; optional ↑/↓/Home/End between headers (APG Accordion). `hidden="until-found"` so find-in-page opens
  sections (Chromium 102+).
- Height animates with `interpolate-size: allow-keywords` (Chromium 129+) or measured height; closes faster than it
  opens; content never reflows the page during the animation beyond its own box.

### 2.14 Tooltip, toggletip, hover card
- Tooltip open delay: R **700** (`tooltip.tsx:31`), B **600** (`tooltip/utils/constants.ts:1`), AK **500**
  (hovercard timeout `hovercard-store.ts:28`), RA **1500** (`useTooltipTriggerState.ts:53`).
- Skip/warm window after one closes: R **300** (`tooltip.tsx:72`), AK **300** (`tooltip-store.ts:42`), B provider
  **400** (`TooltipProvider.tsx:13`), RA cooldown **500** (`useTooltipTriggerState.ts:54`); F `FloatingDelayGroup`
  `timeoutMs` default 0 (`FloatingDelayGroup.tsx:71`).
- Close delay: 0 (AK `tooltip-store.ts:36`, B `TooltipTrigger.tsx:300`); instant in the skip window and **no animation**
  for the instant ones (EK; B `data-instant`).
- Opens on keyboard focus at once; never on touch; closes on pointerdown on the trigger, Escape (consumed so the parent
  layer stays), blur, scroll of the anchor out of view.
- WCAG 1.4.13: hoverable (the pointer can cross the gap), dismissable (Escape), persistent.
- Hover card: R **700 / 300** (`hover-card.tsx:59-60`), B **600 / 300** (`preview-card/utils/constants.ts`), AK 500;
  needs a safe path into the card (F `safePolygon`), opens on focus, not on touch.
- Toggletip: a button; click pins; content is announced via a live region, not `aria-describedby` alone (APG/Inclusive
  Components).
- `interestfor` (Chromium 142) gives native hover/focus "interest" with built-in delays; usable in Electron 44.

### 2.15 Popover (non-modal)
- Positioning: offset (menus 4, popovers 8), **flip** to the opposite side, **shift** along the edge with padding 8–12,
  **size** (max-height = available height), arrow offset clamped to the corner radius, and **hide** when the anchor is
  clipped (F middleware; B `DROPDOWN_COLLISION_AVOIDANCE` keeps dropdowns top/bottom, `internals/constants.ts:17`).
- Transform-origin at the anchor (R `--radix-*-transform-origin`, B `--transform-origin`; EK).
- Focus: into the popover on open (first tabbable or the surface), back to the trigger on close; Tab out of a non-modal
  popover closes it or continues to the next element after the trigger (B, RA).
- "Patient click": a hover-opened popover that is then clicked within **500ms** stays open instead of toggling shut
  (B `PATIENT_CLICK_THRESHOLD`, `internals/constants.ts:4`, `PopoverStore.ts:118`).
- Dismiss: outside pointerdown, Escape (innermost only), focus outside; never on scroll unless the anchor leaves view.

### 2.16 Dialog / alert dialog
- Native `<dialog>.showModal()` gives top layer, inertness and Escape (cancel). `closedby="any"` (Chromium 134) gives
  light dismiss natively; `requestClose()` (134) runs `cancel` handlers.
- Initial focus: first focusable, or a heading/body for long content; **alert dialog → least destructive action**
  (R `alert-dialog.tsx:115`). Focus returns to the trigger.
- **Alert dialog does not close on outside press** (R `onPointerDownOutside={e => e.preventDefault()}`, `alert-dialog.tsx:117`;
  APG Alert Dialog).
- Backdrop press closes only if the press **started** on the backdrop (drag-out guard).
- Scroll lock: lock the root, keep the scrollbar's room (`scrollbar-gutter: stable`, B `useScrollLock.ts:35-52`), avoid
  iOS bounce (`overscroll-behavior: contain` inside, V). R uses `react-remove-scroll` (`dialog.tsx:18`).
- Nested dialogs: the parent stays visible, slightly scaled/dimmed (vaul `NESTED_DISPLACEMENT 16`, `constants.ts:14`);
  Escape closes the top one only.
- Enter ≈ 200–300ms ease-out with opacity + scale 0.95–0.97 from centre; exit faster; no translate for centred dialogs.

### 2.17 Drawer / sheet
- Slide from the edge on vaul's curve **(0.32, 0.72, 0, 1)**, **500ms** (`vaul/src/constants.ts:1-4`).
- Drag to dismiss: velocity threshold **0.4 px/ms** (`VELOCITY_THRESHOLD`), or distance **25%** of height
  (`CLOSE_THRESHOLD`), with rubber-band damping beyond the open position; scrolling content inside blocks drag for
  **100ms** after a scroll (`SCROLL_LOCK_TIMEOUT`); handle long-press 250ms, double-tap 120ms (`index.tsx:993-994`).
- B drawer: swipe start ≥ **10px** (`DrawerViewport.tsx:45`), release animation clamped **80–360ms** from velocity
  (`:51-55`), swipe-open area threshold 40px (`DrawerSwipeArea.tsx:31`), virtual keyboard resize threshold 60px.
- Background scales down (iOS sheet look) only for full-height mobile sheets; desktop side panels just slide.
- Every swipe has a click/keyboard alternative (V); Escape closes; focus trapped while modal.

### 2.18 Toast
- Duration: Sonner **4000** (`index.tsx:31`), R **5000** (`toast.tsx:116`), B **5000**, limit **3** (`ToastProvider.tsx:16`);
  Spectrum guidance ≥ 5000. Toasts with actions don't auto-dismiss (R, Area).
- Pause timers on hover/focus of the region, **on window blur / page hidden** (Sonner `pauseWhenPageIsHidden`, R pauses on
  window blur), resume with the remaining time (Sonner `remainingTime`, `index.tsx:101,213`).
- Stacking: Sonner shows **3** (`VISIBLE_TOASTS_AMOUNT`), collapsed stack scaled by `0.05` per toast behind
  (`styles.css:298-299`), expands on hover, gap **14px**, width **356px**, viewport offset **24px** (16 on mobile).
- Swipe to dismiss: Sonner **45px** or velocity > **0.11 px/ms** (`index.tsx:40,348`); R **50px** (`toast.tsx:118`);
  B **40px**, reverse-cancel 10px (`ToastRoot.tsx:35-36`, `useSwipeDismiss.ts:32-38`). Exit after **200ms** unmount
  (`TIME_BEFORE_UNMOUNT`).
- Motion: Sonner enter/reflow **400ms** `ease` (`styles.css:89`), deliberately slower "to feel elegant" (EK).
- A11y: region landmark with a hotkey (R F8), polite live announcement, danger assertive; focus is never stolen.

### 2.19 Slider
- ←/↓ decrease, →/↑ increase, PageUp/PageDown large step (10%), Home/End min/max, Shift+arrow ×10 (APG Slider; Carbon).
- Pointer: press on the track jumps (eased), drag follows exactly; a drag counts as intentional after **2** move events
  (B `SliderControl.tsx:29`); pointer capture; `touch-action: none` on the thumb/track only.
- `onValueCommit` on release and on key steps, not per move (R, B).
- Thumbs never cross in a range slider; the thumb under the pointer when both overlap is the one in the drag direction.

### 2.20 Splitter (window splitter)
- `role="separator"`, focusable, `aria-valuenow/min/max`, `aria-controls` (APG Window Splitter).
- ←/→ (or ↑/↓) resize, Home/End to min/max, **Enter collapses / restores** (APG), F6 cycles panes (optional).
- Hover reveal after a rest (Area 300ms matches VS Code's `workbench.sash.hoverDelay` 300); drag with pointer capture and
  `user-select: none` + `inert` on the rest during drag (V).

### 2.21 Tree
- ↑/↓ move, → expands / moves to first child, ← collapses / moves to parent, Home/End, typeahead, `*` expands all
  siblings, Enter activates (APG Tree View). Roving tabindex or activedescendant; multi-select with Shift/⌘.
- Expanding instantly is acceptable (Finder, Figma layers); virtualise past a few hundred rows.

### 2.22 Table / data grid
- Static table: native semantics, no roving. Grid: arrow keys between cells, Enter/F2 to edit, Escape to cancel,
  Home/End row edges, Ctrl+Home/End grid edges, PageUp/PageDown (APG Grid).
- Sort on header press; `aria-sort` on the sorted column only. Column resize handles are separators (2.20).
- Selection: click, Shift-range, ⌘-toggle; selection checkbox column. Virtualise rows beyond ~100–200 (RA layouts assume
  48px rows, `TableLayout.ts:64`).

### 2.23 Calendar / date picker
- Grid: arrows by day/week, PageUp/PageDown month (Shift: year), Home/End week start/end, Enter selects (APG Date Picker
  Dialog). Focus the selected or today's date on open; disabled dates remain focusable (`aria-disabled`).
- Range: first press sets start, hover previews the range, second press sets end; Escape cancels.
- The input remains typeable (segmented field 2.6); the picker is a popover or a modal on touch.

### 2.24 Tag input
- Enter/comma/paste-with-delimiters create tags; Backspace on empty input selects the last tag, second Backspace removes;
  ←/→ move between tags; Delete removes the focused tag; duplicates prevented with a visible reason; IME-safe.

### 2.25 File upload / dropzone
- Whole zone clickable, a real button as keyboard handle; drag-over highlights only when the drag carries files; dragleave
  flicker guarded by a counter or `relatedTarget`; reject reasons per file; announce state changes.

### 2.26 Drag and drop lists / boards
- Pointer drag starts after **≥ 3–5px** movement (dnd-kit default distance; H 5px quick-release); touch drag after a
  **long press** (RA `useDrag` long-press; vaul 250ms on handles). RA drop target activates on hover after **800ms**
  (`useDrop.ts:98`) and autoscrolls within **20px** of an edge (`useAutoScroll.ts:20`).
- Keyboard DnD: Enter/Space to pick up, arrows to move, Enter to drop, Escape to cancel, with live announcements (RA dnd;
  dnd-kit). Every drag has a non-drag alternative ("Move to…") (V).
- During drag: `user-select: none`, other content `inert`, drop indicator line not a full ghost reflow; items reflow with
  ≈ 150–250ms ease-out; dropping animates to the final slot.

### 2.27 Breadcrumbs
- `nav` + ordered list, `aria-current="page"` on the last; collapse middle items into a menu on overflow; links (not
  buttons) so ⌘-click and middle-click work (V).

### 2.28 Pagination
- Links with `aria-current`; state in the URL (V); keep layout stable (fixed-width number slots) so the next button does
  not move under the pointer.

### 2.29 Carousel / scroll area
- Carousel: buttons for prev/next, `scroll-snap`, keyboard reachable slides, no autoplay unless paused on hover/focus and a
  pause control exists past 5s (V, WCAG 2.2.2). Chromium 135 `::scroll-button()` / `::scroll-marker` give native controls.
- Scroll area: R hides scrollbars after **600ms** (`scroll-area.tsx:95`), B **500ms** (`scroll-area/constants.ts:1`),
  thumb min **16px** (`MIN_THUMB_SIZE`); edge fades from scroll position (`animation-timeline: scroll()` Chromium 115).

### 2.30 Composer / chat input
- Enter sends, Shift+Enter newline, IME-safe; auto-grow with `field-sizing: content` (Chromium 123) up to a max height then
  scroll; paste of files becomes attachments; ↑ in an empty composer edits the last message (Slack/ChatGPT convention);
  Escape stops generation when focus is in the thread; the send button becomes Stop while running; never drop the draft.
- New messages: stick to bottom only when the user is already at the bottom; otherwise show "scroll to latest".

### 2.31 Virtual lists
- Virtualise when rows × complexity exceed ~1000 nodes or lists exceed ~100–200 complex rows; `content-visibility: auto`
  with `contain-intrinsic-size: auto <h>` is the zero-JS step before that (V).
- Keep focus and `aria-activedescendant` targets mounted (RA keeps the focused item rendered), `aria-setsize`/`posinset`,
  overscan 1 viewport, stable keys, scroll anchoring on prepend.

## 3. Timing constants across libraries (ms / px unless noted)

| Constant | Radix | Base UI | React Aria | Floating UI | Ariakit | Headless UI | Sonner / vaul / cmdk | **Area today** |
|---|---|---|---|---|---|---|---|---|
| Tooltip open delay | 700 `tooltip.tsx:31` | 600 `tooltip/utils/constants.ts:1` | 1500 `useTooltipTriggerState.ts:53` | — (`useHover` delay prop) | 500 (hovercard timeout) | — | — | **500** `Overlays.tsx:26` |
| Tooltip close delay | 0 | 0 `TooltipTrigger.tsx:300` | 500 cooldown | — | 0 `tooltip-store.ts:36` | — | — | **0** `Overlays.tsx:28` |
| Tooltip skip window | 300 `tooltip.tsx:72` | 400 `TooltipProvider.tsx:13` | 500 (warm-up global) | 0 `FloatingDelayGroup.tsx:71` | 300 `tooltip-store.ts:42` | — | — | **300** `Overlays.tsx:27` |
| Hover card open / close | 700 / 300 `hover-card.tsx:59-60` | 600 / 300 `preview-card/utils/constants.ts` | — | — | 500 / 500 | — | — | **700 / 300** `HoverCard.tsx:41,47` |
| Popover hover open | — | 300 `popover/utils/constants.ts:1` | — | — | — | — | — | — |
| Patient click (hover-opened, then clicked) | — | 500 `internals/constants.ts:4` | — | — | — | — | — | none |
| Submenu open delay | 100 `menu.tsx:1134-1137` | 100 `MenuSubmenuTrigger.tsx:43` | 200 `useSubmenuTrigger.ts:98` | — | 150 (0 in menubar) `menu-store.ts:98-101` | — | — | **0** `primitives.tsx:1859` |
| Submenu grace / safe area | polygon, 5px bleed, 300 `menu.tsx:1146-1171` | safePolygon fork | 2 bad moves, 50 throttle, 1000 `useSafelyMouseToSubmenu.ts:20-22` | buffer 0.5, <0.1px/ms for 40ms closes `safePolygon.ts:49,385-394` | — | — | — | **none**: focus moving to a sibling row closes it `primitives.tsx:1841-1851` |
| Nav menu open / close | 200 / skip 300 `navigation-menu.tsx:137-138` | 50 / 50 | — | — | — | — | — | n/a |
| Typeahead reset | 1000 `menu.tsx:463`, `select.tsx:1973` | 500 `internals/constants.ts:3` | 1000 `useTypeSelect.ts:21` | 750 `useTypeahead.ts:83` | — | 350 `menu.tsx:525` | — | **1000** menu/listbox/tree `Overlays.tsx:30`; **500** CustomSelect `CustomSelect.tsx:16` |
| Select press-drag-release guard | ≤10px no pick `select.tsx:775` | 400ms after open `SelectTrigger.tsx:28` | — | — | — | 200ms hold + 5px `use-quick-release.ts:29,33` | — | not implemented (opens on click) |
| Long press | — | 500, 10px move `ContextMenuTrigger.tsx:17,155` | 500 `useLongPress.ts:57` | — | — | — | vaul handle 250 `index.tsx:993` | none |
| Double tap / click | — | — | — | — | — | — | vaul 120 `index.tsx:994` | native `dblclick` (Splitter) |
| Press-and-hold repeat | — | 400 then 60, touch 50 `usePressAndHold.ts:10-13` | — | — | — | — | — | **400 then 60** `NumberField.tsx:183-194` |
| Slider drag intent | — | 2 moves `SliderControl.tsx:29` | — | — | — | — | — | 2px `primitives.tsx:~999` |
| Toast duration | 5000 `toast.tsx:116` | 5000, limit 3 `ToastProvider.tsx:16` | caller's `timeout` | — | — | — | Sonner 4000 `index.tsx:31`, 3 visible | **5000**, no limit `Toaster.tsx:63` |
| Toast swipe threshold | 50 `toast.tsx:118` | 40, reverse 10 `ToastRoot.tsx:35-36` | — | — | — | — | Sonner 45 or 0.11px/ms `index.tsx:40,348` | none |
| Drawer dismiss | — | swipe ≥10, release 80–360 `DrawerViewport.tsx:45-53` | — | — | — | — | vaul 0.4px/ms or 25%, scroll lock 100 `constants.ts:6-10` | none (button/Escape only) |
| Scrollbar hide | 600 `scroll-area.tsx:95` | 500 `scroll-area/constants.ts:1` | — | — | — | — | — | (see scroll-area spec) |
| Drop-target hover activate | — | — | 800 `useDrop.ts:98` | — | — | — | — | n/a |
| Autoscroll edge | — | — | 20px `useAutoScroll.ts:20` | — | — | — | — | n/a |
| Live region clear | 1000 announce `toast.tsx:758` | 200 `useInitialLiveRegionTextMutation.ts:9` | 7000 `LiveAnnouncer.tsx:16` | — | — | — | — | (announce.ts) |
| Transition default | — | — | — | `useTransition` 250 `useTransition.ts:69` | — | — | vaul 500 (0.32,0.72,0,1); Sonner 400 `ease` | menu 210 / exit 140 (base/fast at 210) |
| Loading indicator show / min | — | — | — | — | — | — | Vercel 150–300 show, 300–500 min | 300/1000 show `primitives.tsx:399`; **no min** |

Consensus picks (the value at least two primary sources share): tooltip **500–700 open, 0 close, 300 skip**; hover card
**600–700 / 300**; submenu **100 open + polygon grace 300**; typeahead **500–1000** (one value system-wide);
long-press **500 / 10px**; toast **4000–5000, 3 visible, swipe 40–50px or ~0.1–0.4px/ms**; press-and-hold **400 / 60**.

## 4. Motion: consensus values and principles

### 4.1 Durations and curves by pattern

| Pattern | Consensus enter | Exit | Curve | Sources |
|---|---|---|---|---|
| Hover / colour | 0–100 | 100–150 | ease-out | ChatGPT 0, Linear 0 in / 150 out (Area research); EK "remove hover effects seen hundreds of times" |
| Press give | instant down, ~100 up | — | ease-out | EK 0.97 |
| Tooltip | 100–150 (none when skipping) | 0 | ease-out | EK 125ms ease-out, scale 0.97; B `data-instant` |
| Menu / select / popover | 150–200 | 100–150 | ease-out, scale 0.95–0.97 from trigger | EK (180 beats 400 for a select; < 300 always); F 250 default |
| Context menu / command palette | 0–100 | 0–100 | ease-out | RF (skip on high-frequency surfaces), EK (Raycast 500 is a bad example) |
| Dialog | 200–300 | 150–200 | ease-out (M3 emphasized-decelerate `(0.05,0.7,0.1,1)` in, emphasized-accelerate `(0.3,0,0.8,0.15)` out) | M3 `_md-sys-motion.scss`; EK |
| Drawer / sheet | 300–500 | 200–350 | `(0.32, 0.72, 0, 1)` | vaul 500; B release 80–360 from velocity |
| Toast | 300–400 | 200 | `ease` / ease-out | Sonner 400 / 200 |
| Accordion height | 200–300 | 150–250 | ease-in-out or ease-out | M3 medium1–2 (250–300) |
| Indicator slide (tabs, segmented, switch) | 150–250 | same | ease-in-out | M3 short4–medium1 |
| Skeleton shimmer | 1500–2000 loop | — | linear | (Area 3s) |

M3 tokens for reference (`material-web/tokens/versions/latest/sass/_md-sys-motion.scss`): short 50/100/150/200, medium
250/300/350/400, long 450–600, extra-long 700–1000; standard `(0.2, 0, 0, 1)`, standard-decelerate `(0, 0, 0, 1)`,
standard-accelerate `(0.3, 0, 1, 1)`; springs (damping, stiffness): spatial fast 0.9/1400, default 0.9/700, slow 0.9/300;
effects fast 1/3800, default 1/1600, slow 1/800 (effects = no overshoot; spatial = slight overshoot for position only).

### 4.2 Principles (with the source that states each)

1. **Don't animate what is repeated or keyboard-driven**: keyboard-initiated actions, command menus, context menus, app
   switchers, list highlight (EK "Great animations"; RF "Frequency & novelty").
2. **Exit faster than enter**, and exits never overshoot (M3 accelerate/decelerate pairs; Sonner 400/200; Area rule).
3. **Interruptible**: a reversed gesture or toggle takes effect immediately from the current value; prefer CSS
   transitions over keyframes for reversible state (EK; RF; V).
4. **Origin-aware**: scale from the trigger (R/B transform-origin variables), context menus from the pointer, never from
   `scale(0)`; start ≥ 0.9 (EK uses 0.93–0.97).
5. **Only `transform` and `opacity`** where possible; never `transition: all` (V; EK).
6. **ease-out for UI enters/exits**, ease-in-out for things moving while visible; avoid ease-in for UI except a final
   leave (EK; M3).
7. **Under 300ms** for UI (EK); slower only for big, rare surfaces (drawer, sheet).
8. **Gesture-driven motion follows the finger exactly**, then hands off velocity to the release animation (vaul,
   B drawer release clamped 80–360 by velocity; RF momentum).
9. **Destructive gestures commit on release**, lightweight ones may commit mid-gesture (RF).
10. **Stagger**: only for first reveal of a small set (≤ 5–8 items), 20–50ms apart, total ≤ 300ms; never on re-render or
    filter (consensus of Framer/Motion examples; no primitive library staggers by default).
11. **Reduced motion keeps opacity, drops movement** (EK; Motion `useReducedMotion`; Area already does this).
12. **Blur ≤ 2px** to hide crossfade imperfections (EK).
13. **Theme switches are instant** (Area already; V implies via "animate only to clarify cause and effect").

## 5. Perceived performance techniques

| Technique | Reference rule | Numbers |
|---|---|---|
| Pointer-down activation | Menus, selects, tabs act on pointerdown (R `dropdown-menu.tsx:125`, `select.tsx:403`, `tabs.tsx:187`; macOS) | saves ~60–120ms (the press duration) per interaction |
| Delay before spinners | Show-delay so fast work shows nothing (V; Primer Spinner) | 150–300ms show-delay |
| Minimum visible time | Once shown, keep the indicator long enough not to flicker (V) | 300–500ms |
| Skeletons | Same box as the content (no layout shift), only for > ~300ms loads, no shimmer under reduced motion | shimmer 1.5–2s linear |
| Optimistic UI | Apply at once, roll back with an error or offer Undo (V) | mutations should finish < 500ms (V) |
| Prefetch on intent | Prefetch on hover/focus of a link after a short rest (Next.js Link, Linear) | 50–100ms hover rest |
| Stale-while-revalidate | Show the last results while fetching new ones (cmdk, combobox remote) | no empty flash |
| Keep previous view mounted | Tabs/pages stay mounted or are restored with scroll position (V Back/Forward) | — |
| `content-visibility: auto` | Skip rendering off-screen sections; pair with `contain-intrinsic-size: auto <px>` (V) | Chromium 85; `auto` keyword 95 |
| Virtualisation | Lists of complex rows beyond ~100–200, or > ~1000 DOM nodes; overscan ~1 viewport | RA rows 48px default |
| Batch reads/writes | No layout thrash; position overlays in one rAF (V) | — |
| Uncontrolled inputs | Avoid per-keystroke re-render loops (V) | — |
| Instant feedback for keyboard | Highlight moves with zero transition; palettes open without animation (EK, RF) | 0ms |
| Native positioning | CSS anchor positioning moves overlays with the compositor on scroll (no one-frame lag of rAF JS) | Chromium 125 |

## 6. Platform features (Electron 44 = Chromium 152, so all below are available in the app)

| Feature | Chromium since | What it replaces | Area uses it? |
|---|---|---|---|
| Popover API (`popover=auto/manual`) | 114 | JS top layer + light dismiss | yes (Overlays.tsx) |
| `popover="hint"` | 133 | tooltips not closing auto popovers | **no** (tooltips are `manual`) |
| Invoker commands (`commandfor`/`command`) | 135 | JS click handlers for show/close/toggle | no (uses `popovertarget`) |
| `interestfor` (hover/focus interest with delays) | 142 | tooltip/hover-card JS intent | no |
| `<dialog closedby="any">`, `requestClose()` | 134 | backdrop-click JS | no (JS backdrop guard) |
| CSS anchor positioning (`anchor-name`, `position-anchor`, `position-area`, `position-try-fallbacks`, `anchor-size()`) | 125 (`position-area` 129) | JS `computePosition` on scroll/resize | badge only (`badge.css:316`) |
| `@starting-style`, `transition-behavior: allow-discrete` | 117 | mount-then-animate JS | yes |
| `interpolate-size: allow-keywords`, `calc-size()` | 129 | measured height animation | yes (accordion) |
| View Transitions (same-document) | 111; types 125 | FLIP libraries | **no** |
| Scroll-driven animations (`animation-timeline: scroll()/view()`) | 115 | scroll listeners | code.css only |
| Scroll-state container queries (`scroll-state(stuck/scrollable)`) | 133 | JS `data-scrolled` | no (Dialog sets `data-scrolled` from JS) |
| `text-box-trim` / `text-box` | 133 | negative margins | yes (26 files) |
| `content-visibility`, `contain-intrinsic-size: auto` | 85 / 95 | manual virtualisation (small lists) | accordion only |
| `field-sizing: content` | 123 | auto-grow JS | yes (4 files) |
| `linear()` easing (spring approximations) | 113 | JS springs | **no** |
| `scrollbar-gutter: stable` | 94 | padding compensation on scroll lock | **no** |
| Customizable select (`appearance: base-select`) | 135 | custom listbox | no (Custom select is JS; fine) |
| `::scroll-button()`, `::scroll-marker` | 135 | carousel buttons/dots JS | no |
| `hidden="until-found"` | 102 | — | yes (accordion) |
| `Element.moveBefore()` (state-preserving moves) | 133 | remount on reorder | no |

## 7. Area against the bar (spot-check of the listed families)

### 7.1 Gap table

| # | Reference behaviour | Area today (file:line) | Gap |
|---|---|---|---|
| G1 | Submenu opens after 100–200ms and stays open while the pointer travels diagonally towards it (polygon + 300ms grace) | `MenuSub` opens on `pointerenter` at once (`primitives.tsx:1859`); any focus moving to a sibling row closes it (`:1841-1851`), and the parent menu moves focus on every `pointermove` (`Overlays.tsx:168-172`) | **Missing safe area**: a diagonal move from the row to its submenu crosses a neighbour row, focuses it, and closes the submenu. Also no open delay, so sweeping down a menu flashes every submenu |
| G2 | Menus, selects, tabs act on pointerdown; press-drag-release picks (guards: 10px / 200–400ms) | Menu toggles on `click` via `popovertarget` (`Overlays.tsx:67-71,182-183`); Custom select opens on `click` (`CustomSelect.tsx:453`); Tabs select on `click` (`primitives.tsx:2127`) | One press slower than R/macOS; no drag-to-pick |
| G3 | Keyboard-opened and high-frequency surfaces don't animate (EK, RF) | Menu, select list, popover enter on `base` (210ms) and scale 0.97 regardless of input (`surface.css:1806-1828`); MOTION.md asks for "the same short clock" (`MOTION.md:133-135`) but no mechanism distinguishes keyboard | Keyboard opens pay 210ms; no `data-instant` for them (tooltips already have it, `surface.css:1834`) |
| G4 | Command palette: no or ≤ 100ms enter (RF; EK on Raycast 500ms) | Shares Dialog's modal rule: **`moderate` = 280ms enter, 210 exit**, scale 0.97 (`surface.css:924-936`) | Slowest-feeling surface is the most frequently opened one |
| G5 | List highlight is instant in and out on menus/listboxes (macOS; Radix Themes rows have no transition) | Menu rows fade in on `hover-in` (≈91ms) and out on `fast` (140ms) for pointer hover (`surface.css:1299,1327`); the comment at `:1320-1322` says "the plate lands at once" | Moving the pointer down a menu leaves a trailing ghost plate on 1–2 rows; code contradicts its own comment |
| G6 | Typeahead: one reset window per system; a repeated letter cycles through matches | 1000ms in Menu/ListBox/Tree (`Overlays.tsx:30`, `ListBox.tsx:198`, `TreeView.tsx:178` "one window for every list"), **500ms in Custom select** (`CustomSelect.tsx:16`); Menu builds "aa" and finds nothing (`Overlays.tsx:151-158`) | Inconsistent window; no repeat-letter cycling in Menu/ListBox/Tree (R `menu.tsx:1348-1352`) |
| G7 | IME-safe Enter everywhere text is typed | Composer, Combobox, TagPicker, SearchField guard `isComposing`/229 (`Composer.tsx:173`, `Combobox.tsx:204`, `TagPicker.tsx:172`, `SearchField.tsx:68`); **Command palette does not** (`CommandPalette.tsx:193-198`) | Confirming a CJK composition runs the highlighted command |
| G8 | Alert dialog never closes on outside press (R `alert-dialog.tsx:117`, APG) | Confirm dialog closes on backdrop (`ConfirmDialog.tsx:34-35`; Dialog's backdrop close `primitives.tsx:2288-2289`) | A stray click cancels a destructive confirmation silently; also differs from R/APG |
| G9 | Toast timers pause on hover/focus **and** on window blur / page hidden; ≤ 3 visible, stack collapses; swipe to dismiss | Pauses on region hover/focus (`Toaster.tsx:132-147,165-168`); no `visibilitychange`/`blur` pause, no limit, no swipe (grep: none in `Toaster.tsx`) | Toasts expire while the app is in the background (Electron window unfocused); unbounded column |
| G10 | Drawer/sheet: drag to dismiss with velocity (0.4px/ms) or 25% distance; scroll-then-drag guard | `Drawer.tsx` has no pointer/drag handling (grep) | Desktop side panels are fine without it; bottom sheets on touch are not |
| G11 | Context menu long-press on touch: 500ms, 10px tolerance | `ContextMenu.tsx` handles `contextmenu`, Shift+F10, ContextMenu key (`:151-156`); no long-press | Touch (iPad Electron/web) users can't open it |
| G12 | Loading indicator: show-delay 150–300 **and** minimum visible 300–500 | `useLoadingDelay` waits 300/1000 (`primitives.tsx:399-420`); no minimum once shown | A load finishing at 320ms flashes the spinner for 20ms |
| G13 | Positioning: flip, shift, **size**, **hide when the anchor is clipped**, cross-axis fallbacks; native anchor positioning where available | `computePosition` flips main axis and clamps (`overlay.ts:51-95`); writes available height only; repositions on scroll via rAF (`overlay.ts:215-217`); no hide | A tooltip or menu whose trigger scrolls out of a panel keeps floating at the viewport padding; one-frame lag on scroll |
| G14 | Scroll lock keeps the scrollbar's room (`scrollbar-gutter: stable`, B `useScrollLock.ts:35-52`) | `html:has(.area-dialog__modal:modal) { overflow: hidden; }` (`surface.css:956`) | Page shifts by the scrollbar width when classic scrollbars are on (Windows, macOS "Always show") |
| G15 | Tooltips are `popover="hint"` (Chromium 133) so they never close or fight auto popovers | `popover: "manual"` with JS dismissal (`Overlays.tsx:290`) | Works, but re-implements what the platform gives; fine to keep, low priority |
| G16 | Hover card: safe path into the card; patient click (B 500ms) | `HoverCard.tsx:41,47` uses `useHoverIntent` 700/300; the 300ms close delay is the only bridge | Fast diagonal moves into a wide card near the edge can close it; acceptable but below F `safePolygon` |
| G17 | Menu outside press under a menu does not activate what is underneath (R modal menus; macOS swallows the click) | `popover="auto"` light dismiss lets the press through to the page (`Overlays.tsx:195`) | Dismissing a menu by clicking a button underneath also presses that button. A choice, not a defect; state it |
| G18 | Splitter Enter collapses/restores (APG Window Splitter) | Enter evens the panes (`Splitter.tsx:126`) | Different meaning from APG; double-click already evens |
| G19 | Tree `*` expands all siblings (APG Tree) | No `*` handling (`TreeView.tsx:157-180`) | Minor |
| G20 | Command palette Ctrl+N/P, Ctrl+J/K (cmdk default) | ↑/↓, Ctrl+Home/End only (`CommandPalette.tsx:194-197`) | Minor keyboard-first nicety |
| G21 | Timing constants live in one place | Scattered literals: `Overlays.tsx:26-30`, `HoverCard.tsx:41,47` (700/300 inline), `CustomSelect.tsx:16`, `NumberField.tsx:183-194`, `primitives.tsx:399`, splitter.css `--_sash-delay` | No single "interaction timing" table in MOTION.md or code |
| G22 | Spring curves approximate a real spring (`linear()` or M3 spring tokens) | Spring preset uses overshooting cubic-beziers (`easing.ts:38`) | A bezier overshoot has one bounce shape at any duration; `linear()` springs match M3's damping 0.9 |
| G23 | Drag and drop lists/boards with keyboard alternative and announcements | `Board.tsx` has no drag code (grep) | Not built; spec in 2.26 when the owner asks |
| G24 | Dialog's scrolled header from CSS (`scroll-state`) | JS `onScroll` → `data-scrolled` (`primitives.tsx:2262`) | Works; a CSS path removes a re-render per scroll edge. Low |
| G25 | Tabs indicator and theme changes never animate on first paint | `useTabIndicator` places on layout (`primitives.tsx:2035-2058`) without a "first placement is instant" guard | Unverified whether the bar slides in from 0 on mount; check in app |

### 7.2 Findings (most severe first)

**RB1 — defect — submenus have no pointer safe area or open delay.** `primitives.tsx:1841-1851,1859`; `Overlays.tsx:168-172`.
Families: Menu, Context menu, Split button menus, every MenuSub. Rule: *a pointer travelling from a row towards the surface
it opened keeps it open* (R polygon 300ms grace, F safePolygon, RA useSafelyMouseToSubmenu). Fix: one shared
`usePointerIntent(row, surface)` in overlay.ts that (a) delays submenu open by 100ms, (b) while the pointer is inside the
triangle from the exit point (±5px bleed) to the surface's near corners, suppresses the parent's pointermove focus, (c)
expires after 300ms of no progress. Reuse for Hover card (RB16). Visible: diagonal moves into submenus stop collapsing;
sweeping down a menu stops flashing submenus. Size M. Confidence high (read the code paths; not reproduced in app).

**RB2 — defect — Command palette Enter ignores IME composition.** `CommandPalette.tsx:193-198`. Families: Command palette
(and any future text-driven list). Rule: *every Enter handler on a text input checks `isComposing || keyCode === 229`*.
Fix: export one `isComposingEnter(event)` from `forms.tsx` and use it in CommandPalette, Combobox, TagPicker, Composer,
SearchField, CustomSelect's search, OTP. Visible: Japanese/Chinese users can confirm text without running a command.
Size S. Confidence high.

**RB3 — inconsistency — the most frequent surfaces animate the longest.** `surface.css:924-936` (palette at `moderate`,
280ms), `:1806-1828` (menus/select at `base` 210ms for keyboard opens too). Rule: *animation length falls with frequency
and with keyboard origin* (EK, RF). Fix: `useNativePopover` records how the surface was opened (`data-opened-by="keyboard"`
from the trigger's keydown, as `entry.current` already does in `Overlays.tsx:123,184-187`) and the overlay rule maps it to
`--area-duration-instant` for scale and `fade-fast` for opacity; the palette's modal takes the anchored rule's clocks
(`base`/`fast`) or that instant path when opened by shortcut. Update MOTION.md Recipes (palette row, `:117`). Visible: ⌘K
and keyboard menus appear at once; pointer opens unchanged. Size S. Confidence high on reference, owner decision on value.

**RB4 — inconsistency — menu row hover plate fades in and trails out.** `surface.css:1299,1327` against its own comment
`:1320-1322`. Families: Menu, and every list row sharing the plate rule (check ListBox, Custom select, Command palette, Nav
rows). Rule: *a highlight that moves through a list lands and leaves at once; only standalone controls ease their hover*.
Fix: list rows set `transition-duration: 0s` for background in and out (keep `:active` scale none). Visible: crisp
highlight like macOS menus; no 140ms ghost on the row just left. Size S. Confidence high.

**RB5 — defect — Confirm dialog closes on a backdrop press.** `ConfirmDialog.tsx:34-35`, `primitives.tsx:2288-2289`. Rule:
*an alert dialog is dismissed only by its buttons or Escape* (R `alert-dialog.tsx:117`, APG). Fix: Dialog gets
`dismissOnBackdrop` (default true; ConfirmDialog passes false); later map to native `closedby="closerequest"` (Chromium 134).
Visible: a stray click no longer cancels. Size S. Confidence high.

**RB6 — defect — toasts expire while the window is in the background.** `Toaster.tsx:132-147` pause only on region
hover/focus. Rule: *a timed message pauses whenever the person can't see it* (Sonner pause on hidden, R on window blur;
WCAG 2.2.1). Fix: add `visibilitychange` + window `blur`/`focus` to pause/resume with remaining time. Size S. Confidence high.

**RB7 — refinement — pointer-down activation for menus, selects, tabs, segmented.** `Overlays.tsx:67-71,182-183`,
`CustomSelect.tsx:453`, `primitives.tsx:2127`. Rule: *choosers act on pointerdown (left button, no modifier) and support
press-drag-release*. Fix: one `usePressToOpen(trigger, open)` that opens on pointerdown for mouse, ignores the next click,
and arms release-to-pick after 200ms or 5px (H) / blocks it for 10px (R); Tabs/Segmented select on mousedown as R.
Keep click for touch and keyboard. Visible: menus feel ~one press faster; drag-to-pick works. Size M. Confidence high on
reference; check that `popovertarget` toggling doesn't double-fire (it fires on click).

**RB8 — inconsistency — two typeahead windows and no repeat-letter cycling.** `CustomSelect.tsx:16` (500) vs
`Overlays.tsx:30` (1000); `Overlays.tsx:151-158`, `ListBox.tsx:198`, `TreeView.tsx:176-180`. Rule: *one typeahead window
and one matcher system-wide*. Fix: `matchTypeahead(items, text, from)` in overlay.ts with R's repeated-letter
normalisation and Space-inside-a-run; one constant (pick 1000 R/RA or 500 B; Area's own audit D-11 already chose one
window). Size S. Confidence high.

**RB9 — refinement — loading indicators have no minimum visible time.** `primitives.tsx:399-420`. Rule: *once shown, an
indicator stays ≥ 400ms* (V 300–500). Fix: `useLoadingDelay(delay, { min: 400 })` returning `shown` that stays true for
`min` after `loading` turns false; Button `loading`, Spinner, Skeleton, Table skeleton read it. Size S. Confidence medium-high.

**RB10 — refinement — anchored surfaces don't hide when their anchor is clipped; scroll lag.** `overlay.ts:51-95,193-229`.
Rule: *an anchored surface follows its anchor exactly and leaves with it*. Fix: in `place()`, test the anchor rect against
its nearest scroll container's clip rect; tooltips/hover cards close, menus/popovers set `data-anchor-hidden`
(visibility hidden). Progressive: when `CSS.supports("anchor-name: --a")` (Chromium 125, i.e. always in Electron 44), set
`anchor-name` on the trigger and `position-anchor` + `position-try-fallbacks: flip-block, flip-inline` on the surface and
keep `computePosition` only for side detection (`anchor()` queries or a `ResizeObserver` read). Size M–L. Confidence medium
(design choice; JS path is correct today).

**RB11 — refinement — scroll lock shifts the page with classic scrollbars.** `surface.css:956`. Fix: add
`scrollbar-gutter: stable` to the same rule (B `useScrollLock.ts:50`). Size S. Confidence high.

**RB12 — opportunity — shared swipe-dismiss.** Toaster (G9), Drawer (G10). Fix: one `useSwipeDismiss(axis, {distance: 40,
velocity: 0.4, reverseCancel: 10})` adapted from B `utils/useSwipeDismiss.ts:32-38` and vaul's rubber band; drag follows
exactly, release animates on `ease-drawer` with duration from velocity (80–360ms, B). Size M. Confidence high on values.

**RB13 — opportunity — toast stack limit.** `Toaster.tsx` (no limit). Fix: `limit` prop default 3 (B, Sonner), older ones
collapse behind with 0.05 scale step per depth and expand on hover/focus (Sonner `styles.css:298-299`), or queue. Size M.
Confidence medium (owner taste on stacking look).

**RB14 — opportunity — touch long-press for Context menu.** `ContextMenu.tsx`. Fix: 500ms, 10px tolerance, cancel on scroll,
`-webkit-touch-callout: none` on the target (B `ContextMenuTrigger.tsx:17,155`). Size S. Confidence high.

**RB15 — opportunity — one interaction timing module.** G21. Fix: `packages/react/src/components/timing.ts` exporting
TOOLTIP {open 500, skip 300, close 0}, HOVER_CARD {700, 300}, SUBMENU {open 100, grace 300}, TYPEAHEAD, LONG_PRESS {500,
10}, PRESS_REPEAT {400, 60}, DRAG_THRESHOLD {2–5px}, TOAST {5000, limit 3, swipe 40}, LOADING {show 300/1000, min 400},
SASH_REST 300; MOTION.md gains a "Timing" table that cites section 3 here; a cohesion test asserts components import
from it rather than writing literals. Size S. Confidence high.

**RB16 — refinement — hover card uses the shared pointer intent.** `HoverCard.tsx:41-54`. After RB1, pass the card as the
target surface so a diagonal move reaches it, and add B's patient click (a press within 500ms of a hover open keeps it
open, `PopoverStore.ts:118`). Size S after RB1.

**RB17 — opportunity — `linear()` spring for the Spring easing preset.** `easing.ts:38`. Generate `linear()` stops from M3
spatial default (damping 0.9, stiffness 700) for `ease-out`/`ease-drawer` under Spring; exits keep no overshoot. Size S.
Confidence medium (owner chooses the feel).

**RB18 — decision — outside press under an open menu.** `Overlays.tsx:195` (`popover="auto"`). Today the press both closes
the menu and activates what is under it. R's modal menus and macOS swallow it. State the rule in docs/specs/overlay.md
either way; if swallowing, intercept the first outside `pointerdown` while a menu is open. Size S. Confidence medium.

**RB19 — refinement — Splitter Enter.** `Splitter.tsx:126` evens; APG uses Enter to collapse/restore. Keep double-click to
even, map Enter to collapse/restore when the pane is collapsible. Size S. Confidence medium.

**RB20 — refinement — Tree `*` expands siblings.** `TreeView.tsx:157-180`. Size S. Confidence high (APG).

**RB21 — refinement — Command palette Ctrl+N/P and Ctrl+J/K.** `CommandPalette.tsx:194-197` (cmdk `index.tsx:596-608`).
Size S. Confidence medium (power-user nicety).

**RB22 — opportunity — `popover="hint"` for tooltips.** `Overlays.tsx:290`. Lets the platform close one hint when another
opens and never closes auto popovers; keep the JS dismissal hardening (`Overlays.tsx:243-268`). Size S. Confidence medium.

**RB23 — opportunity — `scroll-state()` for Dialog's scrolled header and sticky headers.** `primitives.tsx:2262`. Chromium
133. Size S. Low priority.

**RB24 — check — first placement of the Tabs/Segmented indicator should not animate.** `primitives.tsx:2035-2058`. Verify
in app that the bar doesn't slide from 0 on mount or when the list first measures; if it does, set the first placement with
transitions suppressed for one frame. Size S. Confidence low (unverified).

**RB25 — opportunity — View Transitions for reorder and toast reflow.** `Toaster.tsx` does manual FLIP (`surface.css:1715`);
`document.startViewTransition` (Chromium 111) with `view-transition-name` per toast removes that code and handles stacking.
Size M. Confidence medium (needs care with reduced motion and nested scopes).

### 7.3 The 25 highest-value improvements, ordered (shared mechanisms first)

1. `usePointerIntent` (safe triangle + 100ms open + 300ms grace) in overlay.ts → MenuSub, Context menu subs, Hover card (RB1, RB16).
2. `isComposingEnter()` shared guard → Command palette and every typed-Enter handler (RB2).
3. Keyboard-opened surfaces skip scale and use `fade-fast` (`data-opened-by`) in useNativePopover + overlay CSS (RB3).
4. Command palette on the anchored clocks or instant by shortcut, not `moderate` (RB3).
5. List-row highlight instant in and out across Menu, ListBox, Custom select, Command palette, Nav (RB4).
6. `dismissOnBackdrop={false}` for Confirm dialog / alert dialogs (RB5).
7. Toaster pauses on window blur and `visibilitychange` (RB6).
8. `usePressToOpen` pointer-down activation + press-drag-release for Menu and Custom select (RB7).
9. Tabs and Segmented select on mousedown (left, unmodified) (RB7).
10. One `matchTypeahead` + one window, with repeat-letter cycling (RB8).
11. `useLoadingDelay` minimum visible 400ms, used by Button loading, Spinner, Skeleton (RB9).
12. Anchored surfaces hide/close when the anchor is clipped (RB10).
13. `scrollbar-gutter: stable` while a modal locks the page (RB11).
14. `timing.ts` single source of interaction constants + MOTION.md Timing table + cohesion test (RB15).
15. Shared `useSwipeDismiss` (40px / 0.4px·ms⁻¹ / reverse-cancel 10) → Toast, Drawer (RB12).
16. Toast `limit` 3 with collapsed stack, expand on hover/focus (RB13).
17. Touch long-press 500ms / 10px for Context menu (RB14).
18. CSS anchor positioning as the positioning engine in Chromium (keep JS for side detection and non-Chromium) (RB10).
19. Decide and document outside-press behaviour under open menus (RB18).
20. Patient click for hover-opened popovers and hover cards (RB16).
21. `popover="hint"` for tooltips (RB22).
22. `linear()` spring stops for the Spring easing preset (RB17).
23. Splitter Enter collapse/restore; Tree `*` (RB19, RB20).
24. Command palette Ctrl+N/P, Ctrl+J/K (RB21).
25. Verify indicator first placement; View Transitions for toast reflow and list reorder (RB24, RB25).

## 8. Already excellent, do not disturb

- **Tooltip hardening** (`Overlays.tsx:210-299`): skip window with `data-instant` and no fade, close on pointer-away,
  window blur, page hidden, Electron drag regions, `returning` focus after ⌘Tab; name-only tooltips pass the pointer
  through. Beyond what Radix does.
- **Escape consumed in capture phase** for hover surfaces so the parent layer stays (`overlay.ts:127-137`, WCAG 1.4.13).
- **Combobox keyboard model** (`Combobox.tsx:200-230`): Alt+↓/Alt+↑, Escape-then-clear, Tab commits, IME guard, announced
  empty state — matches APG exactly.
- **Number field press-and-hold 400/60** equals Base UI; scrub, locale parsing (`NumberField.tsx:89-110,183-226`).
- **Slider**: commit on release, drag follows exactly, click eases, Shift ×10 (`primitives.tsx:984-1127`).
- **Dialog backdrop drag-out guard** (`primitives.tsx:2286-2289`) and the shared overlay motion with `@starting-style` +
  `allow-discrete` and exits one step faster (`surface.css:924-947,1806-1834`).
- **Origin-aware scale** written by `computePosition` (`overlay.ts:92-94,212`), rest at `scale: none` for whole pixels.
- **Reduced motion contract** (`MOTION.md:165-182`): movement goes, short fades stay, loops stop. Matches EK and Motion.
- **Pointer-move (not enter) highlight** in Combobox, Custom select and Command palette (`Combobox.tsx:241,251`,
  `CustomSelect.tsx:390`, `CommandPalette.tsx:210`), so a list scrolling under a still pointer doesn't steal it.
- **Splitter** Escape cancels a drag and restores (`Splitter.tsx:116`); 300ms rest before the sash shows.
- **Menu entry focus on the checked radio row** when opened by keyboard (`Overlays.tsx:120-134`).

