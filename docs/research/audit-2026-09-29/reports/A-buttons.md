# Audit A: Button, Button group, Split button, Toolbar, Segmented, Kbd

Read-only audit, 2026-09-29. All paths are relative to the worktree root. Token values are the default
(Standard radius, default density, light) values from `packages/tokens/dist/css/tokens.css` / `axes.css`.
Nothing was rendered in a browser. Findings marked "from CSS" follow directly from the cascade; where
rendering could change the outcome, that is noted.

## Summary

- **Button itself is solid.** Button, Segmented and Kbd follow the core rules: fixed ink on hover, 50% whole-control disabled, one label weight per control, logical properties, native `button`, and refs forwarded. Most problems sit where Buttons are **hosted** (Button group, Toolbar, Split button). The hosts restyle a child Button's fill, tier and gap without its hover, ink or border. That produces two real bugs: an outline group loses its border under the pointer, and a default (solid) Button in a group has a white label on a light grey fill.
- **The system has three ways to pass size down and three ways to paint "selected".** ButtonGroup re-tiers children in CSS, SplitButton passes a prop, and Toolbar only re-tiers *direct* Buttons, so its SplitButtons, Segmented and Selects ignore `Toolbar size`. Selection shows as a #ee fill in Button, SplitButton and Toolbar toggles, and as a raised white plate with an edge and a shadow in Segmented. The two sit side by side in the gallery's main Toolbar tile, and the plate sinks in dark mode.
- **Radius, gap and divider values drift between peers.** Button radius steps 6/8/10 by tier, while Segmented, Input and Select stay 8 at every tier. The icon gap is 6 in a standalone Button, 8 in the same Button inside a group or toolbar, 8 in Segmented and Chip, and 4 in a small Button. Divider paint is #f3 in Toolbar and #e2 in Button group and Split button, although the owner's 09-27 rule says a divider is never heavier than its container.
- **Docs have drifted most in Toolbar.** Its spec still describes the removed track variant, the raised-plate toggle and a `border-divider` separator, and the hidden docs page API still lists `ToolbarGroup variant="track"`. DESIGN_SYSTEM.md still says keycaps are radius 4 and concentric in Buttons, and that toolbar separators use `border-divider`.
- **Interaction gaps:** a loading Button becomes natively disabled (drops focus and dims to 50%). An icon-only Button silently discards its children as a name. The Toolbar overflow is the one floating list that is neither a Menu nor in the top layer, and its dots and separator have no forced-colours paint.

## Findings

### A-1  Outline Button group: the hovered button loses its border
- Families: Button group (with Button)
- Category: visual
- Severity: high
- Type: FIX
- What: The group gives its children the group edge through `--_border` but never sets `--_border-hover`. Every child is a ghost Button (the demos require that; see A-2), and ghost leaves `--_border-hover` at Button's base value, `transparent`. Button's hover rule then paints `border-color: var(--_border-hover)`, so in an outline group the hovered segment's top, bottom and outer edges vanish. The shared seam survives only because the neighbour overlaps it by 1px. This is from CSS; it was not seen rendered. The batch 11 visual pass compared rest states only.
- Evidence:
  - `packages/styles/src/components/button-group.css:33`: `--_border: var(--_group-edge);`. There is no `--_border-hover` in the file (grep: the only `--_border-hover` definitions in `src/` are in chip.css and textarea.css).
  - `button.css:56`: `--_border-hover: transparent;` (base).
  - `button.css:363-368`: ghost does not set `--_border-hover`.
  - `button.css:134-138`: `.area-button:hover:not(:disabled):not([data-loading]) { … border-color: var(--_border-hover); }`.
  - `button-group.css:22`: outline `--_group-edge: var(--area-edge-control)` (#e2).
  - The demos use outline groups with ghost children: `apps/docs/src/demos/gallery.tsx:151, 159-160, 165-167, 170`.

  | State | Outline group child border |
  |---|---|
  | rest | #e2 (edge-control) |
  | hover | transparent (from CSS) |
  | expected | #e2, or edge-control-hover as outline Buttons do |
- Visual: Outline group "Left | Center | Right" at rest vs with the pointer on "Center": the top and bottom lines break over Center.

### A-2  Button group repaints a child's fill but not its ink, so a default Button in a group reads white on grey
- Families: Button group, Button
- Category: api
- Severity: high
- Type: FIX
- What: ButtonGroup forces `--_bg` to the group fill on every unselected child, but leaves the child's variant, ink and hover alone. Button's default variant is `solid`. So `<ButtonGroup><Button>Left</Button>…` renders `fg-on-neutral` (#fafafa) on `bg-component` (#f7), and hovers to the near-black `solid-hover`. Every demo avoids this only by passing `variant="ghost"` to each child. Neither the spec nor the API documents that requirement: button-group.md says "children: Button unchanged".
- Evidence:
  - `button-group.css:39`: `.area-button-group > .area-button:not([data-selected]) { --_bg: var(--_group-bg); }`. Its specificity (0,3,0) beats `.area-button--solid` (0,1,0), which sets `--_fg: var(--_on-solid)` at `button.css:309-315`.
  - `packages/styles/src/manifest.ts:55`: Button defaults `variant: "solid"`.
  - `packages/react/src/components/ButtonGroup.tsx:13-17` passes nothing to its children.
  - `docs/specs/button-group.md:55`: "children | Button unchanged".
  - Every demo passes `variant="ghost"`: `gallery.tsx:136, 147, 151, 159-160, 877`.
  - Contrast with SplitButton, which sets its parts' variant itself (`SplitButton.tsx:110-117`).
- Visual: `<ButtonGroup>` holding three default Buttons (white text on #f7, near-black on hover) vs the same group with `variant="ghost"` children.

### A-3  "Soft" joined buttons look different in Button group and Split button
- Families: Button group, Split button, Button
- Category: consistency
- Severity: medium
- Type: DECISION
- What: Both families call their quiet joined treatment `soft`, but they paint it differently. A soft ButtonGroup is ghost children on a group fill: lighter ink, no edge, and an opaque #f3 hover. A soft SplitButton is two real soft Buttons: body ink, a #f3 hairline, and a translucent wash on hover. Placed side by side (for example in one header), they read as two treatments.
- Evidence: `button-group.css:21`; `button.css:330-351, 386-389, 397-400`; `split-button.css:62-63`.

  | Property | ButtonGroup `soft` (ghost children) | SplitButton `soft` |
  |---|---|---|
  | fill | #f7 (`bg-component`) | #f7 |
  | edge | transparent | #f3 hairline (`--_surface-hover`) |
  | label ink | #56 (fg-default mixed 75% to muted) | #28 (`fg-default`) |
  | hover | #f3 opaque (`bg-component-hover`) | #f7 + 5% wash ≈ #eb, border `bg-hover` |
  | divider | #e2 (`edge-control`) | #e2 (`--_line`) |
- Options:
  - A: SplitButton soft adopts ButtonGroup's recipe: muted-mix ink, no hairline, row hover.
  - B: ButtonGroup soft adopts Button soft: children render as soft Buttons with the hairline, body ink and wash.
  - C: Keep both and document why.
  - Recommended: A. The owner's 09-28 decision made quiet Buttons lighter ("i just want consistency overall"), and ButtonGroup soft already matches the shared row plate (DESIGN_SYSTEM "Row and item plates"). SplitButton soft is then the one quiet joined control still at body ink.
- Visual: Soft ButtonGroup "Left | Right" beside a soft SplitButton "Save ▾", at rest and on hover.

### A-4  The icon-to-label gap changes with the host, and small Button keeps a stale 4
- Families: Button, Button group, Toolbar, Segmented, Split button (peer: Chip)
- Category: consistency
- Severity: medium
- Type: FIX (hosts) + DECISION (sm and peers)
- What: Button measured 6 at md and lg (Notion). Button group and Toolbar re-tier their children with the `gap-md`/`gap-lg` token (8), so the same Button changes its gap when grouped. Small Button keeps 4. The spec's reason for that ("sm keeps 4 with its 12px text") no longer holds, because sm text is now 14/20 by owner decision, and Notion's evidence in the same spec is 6 at 28px.
- Evidence:
  - `button.css:27, 459, 469` set 6 (spec). `button.css:449` sets sm to `gap-sm` (4).
  - `button-group.css:7, 24-25, 31` set `--_gap: var(--_group-gap)` = `gap-md` / `gap-lg` = 8.
  - `toolbar.css:6, 52` set `--_gap: var(--_toolbar-gap)` = 8.
  - `segmented.css:36` = 8. `chip.css:22, 252` = 8.
  - `docs/specs/button.md:226`. `tokens.css`: `--area-control-sm-text: var(--area-size-14)`.

  | Control, md unless noted | Icon to label |
  |---|---|
  | Button (standalone), SplitButton action | 6 |
  | Button inside ButtonGroup | 8 |
  | Button inside Toolbar | 8 |
  | Segmented option | 8 |
  | Chip | 8 |
  | Button sm (28, 14px text) | 4 |
- Options (sm and peers):
  - A: Button 6 everywhere, sm included, and hosts stop overriding `--_gap`.
  - B: Move Button back to the 8 token and drop the literal.
  - Recommended: A. Notion measures 6 at both 28 and 32 (`button.md` Anatomy, `notion--*` captures); the host override is a plain bug either way. Segmented and Chip can follow later as their own decision.
- Visual: A Button with a leading icon, alone (6) vs inside a ButtonGroup (8) vs in a Toolbar (8), plus Button sm (4) vs md (6).

### A-5  Radius steps by tier only in Button and its hosts
- Families: Button, Button group, Split button, Toolbar, Segmented (peers: Input, Select)
- Category: consistency
- Severity: medium
- Type: DECISION
- What: Button, and everything built from it, uses `radius-control-sm/md/lg` (6/8/10). Segmented, Input and Select use the unsized `radius-control` (8) at every tier. A small toolbar therefore shows 6px buttons next to a Segmented with an 8px item in a 10px track, and a small form row shows a 6px Button next to an 8px Input. The narrow ghost split trigger also lands on a fractional 6.4.
- Evidence:
  - `button.css:30, 446, 456, 466`. `segmented.css:49-52, 67`. `packages/styles/src/components/input.css:38`. `navigation.css:230` (Select). `split-button.css:82-84`.
  - The radius-control tokens are sm 6, md 8, lg 10, and `radius-control` 8 (`packages/tokens/src/axes/radius.ts:102`).

  | Tier | Button | Segmented track / item | Input / Select | Split ghost trigger |
  |---|---|---|---|---|
  | sm (28) | 6 | 10 / 8 (item 24) | 8 | 5.6 |
  | md (32) | 8 | 10 / 8 (item 28) | 8 | 6.4 |
  | lg (40) | 10 | 10 / 8 (item 36) | 8 | 8 |
- Options:
  - A: Every control reads the per-tier `radius-control-{sm,md,lg}`, with Segmented concentric on top.
  - B: Every control uses the one `radius-control`, so Button sm and lg change to 8.
  - C: Keep as is.
  - Recommended: A. `axes/radius.ts:102` documents the per-tier family ("6px small, 8px medium, and 10px large Buttons"), and Segmented's own comment says it follows control height. Consider rounding the split trigger to a whole pixel.
- Visual: Toolbar sm with Button 28 r6, Segmented track 28 r10 / item 24 r8, and Select 28 r8 in one row.

### A-6  Two selection paints inside one Toolbar, and Segmented's reads sunken in dark
- Families: Toolbar, Segmented, Button, Split button
- Category: visual
- Severity: medium
- Type: DECISION
- What: In the gallery's default Toolbar tile, the chosen tool is Button's selected fill (#ee, no edge, no shadow), while the Segmented mode switch beside it raises a white plate with a #e2 edge and `shadow-1`. In dark mode the Segmented "raised" plate is `bg-surface` #1d on a `bg-subtle` #28 track, so it sits darker than its groove, while a selected Button rises to #3f. Both specs record this as open. `shadow-1` is also the last resting shadow on a control after the owner removed them from Button and the fields.
- Evidence:
  - `segmented.css:53-54, 93-99`. `button.css:422-428`.
  - `gallery.tsx:190-206` (GalleryToolbar: selected SplitButtons plus Segmented).
  - `docs/specs/toolbar.md:177` ("open: align Segmented's shadow") and `:196`. `.Codex/HANDOFF.md:599`.
  - `docs/specs/segmented.md` Visual pass: "dark theme (selected #1d1d1d on a #282828 track)".

  | | Light | Dark |
  |---|---|---|
  | Toolbar / SplitButton / Button selected | #ee fill | #3f fill (lighter than the #1d bar) |
  | Segmented selected | #fff + #e2 edge + shadow-1 on #f7 | #1d on #28 (darker than the track) |
- Options:
  - A: Keep Segmented's raised thumb but, in dark, paint it `bg-component-active` on the track (lift by fill, as the Toolbar spec says Figma's dark reference does).
  - B: Paint Segmented selection as Button's selected fill (#ee) with no shadow, so there is one selection paint.
  - C: Keep as is.
  - Recommended: A. ChatGPT and Figma both raise a white thumb in light (`baseline/chatgpt--segmented--rest`, `toolbar/figma--bottom-toolbar`), so light stays evidence-backed; dark is the defect.
- Visual: Toolbar Tools tile in light and dark: the selected Move tool vs the selected Design mode.

### A-7  `Toolbar size` does not reach Split button, Segmented or Select
- Families: Toolbar, Split button, Segmented, Button group
- Category: api
- Severity: medium
- Type: FIX
- What: Toolbar re-tiers only Buttons that are direct children of the toolbar or a group. SplitButton's Buttons sit inside `.area-split-button`, so they keep their own size, and Segmented and Select need their own `size`. Every Toolbar size tile passes `size` to Segmented by hand, and none contains a SplitButton, so the gap never shows. Each host propagates size a different way: ButtonGroup re-tiers in CSS, SplitButton passes a React prop, Toolbar re-tiers direct Buttons in CSS.
- Evidence:
  - `toolbar.css:47-56` (`.area-toolbar__group > .area-button, .area-toolbar > .area-button`).
  - `gallery.tsx:245, 285, 309`: `<Segmented size={size}>`, `size="sm"`, `size="md"`.
  - `SplitButton.tsx:110-117` passes its own `size` prop. `button-group.css:26-33`.
- Visual: Toolbar size="sm": Bold / Italic at 28 next to a SplitButton tool at 32 and a Segmented at 32.

### A-8  Toolbar overflow is a hand-built second ghost button and the one non-Menu floating list
- Families: Toolbar (peers: Split button menu, Menu, ghost icon Button)
- Category: consistency / interaction
- Severity: medium
- Type: DECISION
- What: The overflow trigger is a `summary` with its own paint. Next to its ghost siblings it has default ink (#28 vs #56), no pressed plate, no transition, and CSS-drawn dots instead of the `MoreIcon` used by every other "More" button. Its content is sm ghost Buttons (28px, radius 6, 2px apart) in an absolutely positioned box, not a Menu of 32px rows (radius 8, 12 icon gap) in the top layer. There are no arrow keys, and ancestors with `overflow: hidden` can clip it. The spec chose "a disclosure of Buttons, not a Menu", but it predates SplitButton's Menu popover, which now sits in the same toolbar.
- Evidence:
  - `toolbar.css:70-78` (`color: var(--area-fg-default)`, hover only, `position: absolute; z-index: 10`).
  - `Toolbar.tsx:94-121` (`details` / `summary`, Escape only).
  - `gallery.tsx:266-269` (overflow children: `Button variant="ghost" size="sm"`).
  - "More" elsewhere: `gallery.tsx:1129, 1210, 1543` (ghost icon-only Button with `MoreIcon`).
  - `button.css:386-389` (ghost ink mix). `SplitButton.tsx:118` (Menu in `popover="auto"`).
- Options:
  - A: The trigger becomes a ghost icon-only Button with `MoreIcon`, and the content becomes a Menu in a native popover placed by `useAnchoredPosition` (SplitButton's model).
  - B: Keep the disclosure but paint the trigger as a ghost Button (ink mix, `:active` plate, `--area-transition`, icon glyph) and move the content into the top layer.
  - Recommended: A. It gives one floating-list model (the handoff's "One list model for Menu, Combobox, Command palette, Context menu") and reuses Menu's keyboard support.
- Visual: A Toolbar with the ghost icon buttons, the overflow "…" trigger (darker ink) and its open list (28px buttons), beside a SplitButton's open Menu (32px rows).

### A-9  Forced colours: the toolbar separator and overflow dots have no system paint
- Families: Toolbar (peers: Button group, Split button)
- Category: a11y
- Severity: medium
- Type: FIX
- What: Button group and Split button dividers are painted boxes, so forced-colors.css repaints them in `ButtonText`. The Toolbar separator is built the same way (a 1px span with a `background`) but has no rule. The overflow dots are one background dot plus two `box-shadow` copies, and forced colours drop box-shadows, so at most one dot can remain. Behaviour follows the forced-colours spec; it was not executed (the handoff lists forced colours as unverified).
- Evidence:
  - `packages/styles/src/forced-colors.css:12-16` (dividers only).
  - `toolbar.css:67` (separator: `background: var(--area-border-decorative)`).
  - `toolbar.css:75` (dots: `box-shadow: … currentColor, … currentColor`).
- Visual: Toolbar in forced-colours emulation: dividers missing and the "…" reduced to a single dot or nothing.

### A-10  Divider paint disagrees across joined controls, separators and the 09-27 owner rule
- Families: Toolbar, Button group, Split button (peers: Separator, Menu)
- Category: system-rule
- Severity: medium
- Type: DECISION
- What: The owner's 09-27 rule says a rule inside a container is never darker than the container, and moved Toolbar separators to `border-decorative` (#f3). Button group and Split button still draw #e2 (`edge-control`) inside a soft fill that has no edge at all, so their dividers are heavier than the container. DESIGN_SYSTEM.md still lists toolbar separators under `border-divider`.
- Evidence:
  - `toolbar.css:65-67`. `button-group.css:10, 21`. `split-button.css:62-63`.
  - `docs/DESIGN_SYSTEM.md:96-98` ("Use `border-divider` for … nav and toolbar separators"). `.Codex/HANDOFF.md:303`.

  | Divider | Paint | Container |
  |---|---|---|
  | Toolbar separator | #f3 (`border-decorative`) | #fff bar |
  | ButtonGroup soft seam | #e2 (`edge-control`) | #f7 fill, no edge |
  | SplitButton soft / outline seam | #e2 (`--_line`) | #f7 + #f3 hairline / #fff + #e2 edge |
  | SplitButton solid seam | white 24% | #28 fill |
  | Separator (standalone) | #e2 (`border-divider`) | page |
- Options:
  - A: Joined-control seams are control edges, not container rules. Keep #e2 and write that exception into DESIGN_SYSTEM.
  - B: Soft group and soft split seams drop to `border-decorative`.
  - Recommended: A. The Button group spec measured the #f3 seam "barely visible" on #f7 (`button-group.md:51`, capture `before/area--group-soft-divider--before`), and Notion and shadcn draw control-line seams. Fix the DESIGN_SYSTEM toolbar sentence either way (A-19).
- Visual: A Toolbar separator (#f3), a soft ButtonGroup seam (#e2) and a soft SplitButton seam (#e2) in one row.

### A-11  Loading is implemented as disabled
- Families: Button (Split button inherits)
- Category: interaction
- Severity: medium
- Type: DECISION
- What: `loading` sets native `disabled`, so a focused button that starts loading drops focus to `body` and leaves the Tab order, and it renders at 50% opacity like disabled. The spinner is fixed at `area-spinner--md` (16) whatever the tier, which is fine at default density but overflows a 12px icon box in compact sm. The spec lists loading as "not captured".
- Evidence:
  - `packages/react/src/components/Button.tsx:69` (`area-spinner--md`) and `:79` (`disabled={disabled || loading}`).
  - `button.css:151-159` (`:disabled` opacity .5; `[data-loading]` only changes the cursor).
  - `display.css:255` (md = 16). `docs/specs/button.md` States: "disabled, loading, selected | unchanged | not captured".
- Options:
  - A: Loading keeps focus: `aria-disabled="true"` plus `data-loading`, clicks suppressed in the handler, full opacity, spinner in the label ink.
  - B: Keep native disabled but paint loading at full opacity.
  - C: Keep as is.
  - Recommended: A. Focus loss on submit is the larger defect, and Input's `loading` already stays editable with a busy status (`packages/react/tests/input-field.test.mjs:29`).
- Visual: Button rest, loading and disabled side by side (loading and disabled currently look alike apart from the spinner).

### A-12  Icon-only Button silently drops its children (no accessible name)
- Families: Button (peer: Split button)
- Category: a11y
- Severity: medium
- Type: FIX
- What: With `iconOnly`, Button renders no label and ignores `children`, so `<Button iconOnly icon={…}>Add</Button>` has no accessible name, and nothing warns. SplitButton `iconOnly` turns string children into the name. The same prop means different things in the two components.
- Evidence:
  - `Button.tsx:22` ("Requires `aria-label`") and `:93` (`children != null && !iconOnly ? … : null`).
  - `SplitButton.tsx:112` (`aria-label={iconOnly && typeof children === "string" ? children : …}`).
- Visual: n/a (behaviour). Illustrate as a screen-reader name table: Button iconOnly with children → "" vs SplitButton iconOnly → "Move".

### A-13  Selected Button paints: solid is the same as hover; soft's edge inverts
- Families: Button (Split button, Button group, Toolbar inherit)
- Category: visual
- Severity: low
- Type: DECISION
- What: A selected solid Button is `solid-hover`, the same colour as hover and press, so a pressed-on solid toggle cannot be told from a hovered one. The gallery's "Selected" tile is exactly that solid case. A selected neutral soft Button keeps its #f3 hairline over the #ee selected fill, so the edge is lighter than the fill. Pressing a selected soft Button still adds the 7% wash, because `--_wash-active` is not reset.
- Evidence:
  - `button.css:430-435` (solid selected = `--_solid-hover`), `:309-313` (hover = `--_solid-hover`), `:422-428` (selected resets `--_wash-hover` only), `:335` (soft border = `--_surface-hover`).
  - `gallery.tsx:104` (`<Button selected>Selected</Button>`, default solid).
- Options:
  - A: Show the Selected tile on ghost (the real toggle use: Toolbar, Button group) and document solid selected as unsupported.
  - B: Give solid selected its own rung.
  - Recommended: A, plus soft selected takes `--_border: var(--_surface-active)` and resets `--_wash-active`. Every toggle in the system is ghost (`gallery.tsx:151, 199, 217, 225`).
- Visual: Solid rest / hover / selected (the last two identical), and a soft selected button with its lighter ring.

### A-14  The Kbd keycap disappears in pressed or selected Buttons and inverts on soft hover
- Families: Kbd, Button
- Category: visual
- Severity: medium
- Type: DECISION
- What: A default keycap is `bg-component-active` (#ee), the same token as Button's pressed and selected fill for neutral ghost and outline. Inside a pressed or selected ghost or outline Button the keycap has no boundary. Inside a soft Button the hover wash (≈#eb) and pressed wash (≈#e7) end up darker than the keycap, so the keycap flips from darker-than-fill to lighter-than-fill. Solid Buttons already get a translucent keycap; quiet Buttons do not. The values are derived from tokens and were not checked on screen.
- Evidence:
  - `kbd.css:32, 79-83` (`bg-component-active`). `button.css:397-400` (ghost pressed = `bg-component-active`), `:422-428` (selected = `--_surface-active` = #ee), `:345-351` (soft wash).
  - `kbd.css:119-129` (solid-only translucent rule).
  - Tiles: `gallery.tsx:1380-1382` (outline, ghost and soft Buttons with Kbd).
- Options:
  - A: In any Button, the keycap is `currentColor` at 10-14% (as in neutral solid), so it tracks every plate.
  - B: Keep #ee and accept the pressed/selected collapse.
  - Recommended: A. `kbd.css:125-129` already uses this recipe for neutral solid, and it reads on #fff, #f3, #ee and the washes alike.
- Visual: Ghost "New page ⌘N" at rest, hover, pressed and selected; soft "Undo ⌘Z" at rest and hover.

### A-15  Kbd's API vocabulary diverges from the rest of the system
- Families: Kbd (peers: Code, every sized family)
- Category: api
- Severity: low
- Type: DECISION
- What:
  - Size values are `small` / `normal` where every other family uses `sm` / `md`. The specimen names keep `size-small` because specimen-names.mjs exempts Kbd.
  - The treatment axis is `appearance`, while Code calls the same on-colour job `ground`.
  - `on-emphasis` has the same CSS as `on-color`.
  - A deprecated `quiet` boolean remains.
  - Kbd adapts automatically in Menu rows and solid Buttons but not in Tooltip, where the consumer must pass `on-emphasis`.

  DESIGN_SYSTEM allows Kbd its own size vocabulary, so the size names are a choice; the duplicate appearance is not.
- Evidence:
  - `manifest.ts:670-678`. `kbd.css:95-100` (`.area-kbd--on-color, .area-kbd--on-emphasis` share one rule) and `:86-92, 119-129` (automatic contexts).
  - `primitives.tsx:1801` (`quiet` deprecated). `manifest.ts` code `ground: ["on-color", "subtle"]`.
  - `apps/docs/scripts/specimen-names.mjs:21`. `gallery.tsx:1354-1357` (Tooltip needs the explicit appearance).
- Options:
  - A: Merge `on-emphasis` into `on-color`, add an automatic `.area-tooltip .area-kbd` rule, and remove `quiet`.
  - B: Also rename the sizes to `sm` / `md`.
  - Recommended: A. It removes a duplicate variant and a gallery tile without an API rename.
- Visual: "Appearance / on color" and "Appearance / on emphasis" tiles side by side (identical plates).

### A-16  Kbd's spoken chord becomes part of the host's accessible name
- Families: Kbd, Button, Menu (host)
- Category: a11y
- Severity: low
- Type: DECISION
- What: Kbd announces its chord through visually hidden text. That text sits inside the Button or menu item, so the control's name becomes, for example, "Button Command plus Enter". The spec also asks consumers to set `aria-keyshortcuts`, so the shortcut is announced twice. Screen readers are not verified (kbd.md).
- Evidence: `primitives.tsx:1827` (sr-only span); `gallery.tsx:105, 1380-1388`; `docs/specs/kbd.md` Behavior ("Consumers expose the binding with `aria-keyshortcuts`").
- Options:
  - A: Inside an interactive host, hide the chord (`aria-hidden`) and rely on `aria-keyshortcuts`.
  - B: Keep it in the name and drop the `aria-keyshortcuts` advice.
  - Recommended: A. The name stays the action, which is how Menu rows in Radix and Primer work.
- Visual: n/a (name table: current "Button Command plus Enter" vs proposed "Button" + keyshortcuts).

### A-17  API naming across value, toggle and label props
- Families: Segmented, Button, Split button, Toolbar, Button group (peers: Tabs, Chip, AlignmentPicker, ColorSwatchPicker)
- Category: api
- Severity: medium
- Type: FIX
- What:
  - Segmented alone uses `onSelect`, a native DOM event name it has to `Omit`. Its closest sibling Tabs, and the pickers, use `onValueChange`.
  - Segmented has no `name`, `required` or group-level `disabled`, so unlike AlignmentPicker and ColorSwatchPicker it cannot submit a value or be disabled as a whole. The Toolbar spec even says "a form value that must submit is a Segmented".
  - Button's toggle is controlled only (`selected`), while Chip offers `selected` / `defaultSelected` / `onSelectedChange`.
  - Accessible-name props vary: `label` (Segmented), `menuLabel` (SplitButton), `label` (ToolbarOverflow), raw `aria-label` (Toolbar, ButtonGroup).
  - Segmented still reads a `--_selected-weight` hook that would break the one-weight rule.
- Evidence:
  - `primitives.tsx:1367, 1378, 1401` (Segmented), `:1209` (Tabs `onValueChange`), `:836, 857` (Chip).
  - `AlignmentPicker.tsx:15-18, 24`. `ColorSwatchPicker.tsx:11, 18`.
  - `docs/specs/toolbar.md:165-166`. `apps/docs/src/pages.mjs:220` (docs API also omits `defaultValue`).
  - `segmented.css:94`. `SplitButton.tsx:30`.
- Visual: n/a (API table).

### A-18  Dead or contradicting CSS in Button and Button group
- Families: Button, Button group
- Category: system-rule
- Severity: low
- Type: FIX
- What:
  - **Neutral ghost hover is declared twice.** The first rule, with a comment citing the translucent `bg-hover` wash, is overridden eight lines later by the opaque `bg-component-hover` pair that DESIGN_SYSTEM requires, so the first rule and its comment are dead and misleading.
  - **`--align-start` / `--align-end` are declared in both button.css and inset.css.** inset.css loads later and wins.
  - **`[data-disabled]` dims a Button but hover and press still paint.** The state rules exclude only `:disabled`.
  - **The bare `.area-button-group` edge does not match React's default soft group.** The base rule sets `border-decorative`, React's default sets `transparent`, so framework-free markup renders differently (DESIGN_SYSTEM: "The base rule renders the manifest's default").
- Evidence:
  - `button.css:370-377` vs `:391-400`. `button.css:414-415` vs `inset.css:192-193`, with the import order in `packages/styles/src/index.css` (button.css first, inset.css after the components).
  - `button.css:134, 140, 151-152`. `button-group.css:9, 21`.
- Visual: n/a.

### A-19  Stale docs: specs, DESIGN_SYSTEM and the docs page against the code and owner decisions
- Families: all six
- Category: docs-drift
- Severity: medium
- Type: FIX
- What: Several documents contradict decisions the owner made later.
- Evidence:

  | Where | Says | Current (code / owner) |
  |---|---|---|
  | `docs/DESIGN_SYSTEM.md:81-83` | Keycaps "radius 4 … Inside a Button the keycap's corner is concentric" | 6px (`radius-control-sm`) at every size and host, not concentric (owner 09-28; `kbd.css:16-18`, `:131-132`) |
  | `docs/DESIGN_SYSTEM.md:96-98` | Toolbar separators take `border-divider` | `border-decorative` (owner 09-27; `toolbar.css:65-67`) |
  | `docs/DESIGN_SYSTEM.md:149` | "compact medium is … 13/18px type" alongside "six sizes" | 13/18 is off the six-size ramp; either the ramp or the sentence needs a note |
  | `docs/specs/toolbar.md:3` | Status "in review" | Complete (`component-status.mjs:8`) |
  | `toolbar.md:55-56, 137, 139, 164-166, 176` | `ToolbarGroup variant="track"`; pressed toggle = raised plate; separator `border-divider`; "Separator, Button group … border-divider … match" | Track removed; pressed = Button selected fill; separator decorative; ButtonGroup seam is `edge-control` |
  | `toolbar.md:152-163` | Line refs `toolbar.css:46/47/51`, `Toolbar.tsx:43-61, 21-42, 90-118` | Lines moved (70-77; 44-63, 22-43, 94-121) |
  | `apps/docs/src/pages.mjs:140` | API rows `ToolbarGroup variant "track"`, "Button selected: a pressed toggle rises as a plate" | Neither exists |
  | `docs/specs/button.md:226, 231` | Ghost hover `bg-hover`; "sm keeps 4 with its 12px text" | `bg-component-hover` (`button.css:397-400`); sm text 14/20 |
  | `docs/specs/split-button.md:60, 142` | "Excluded: ghost"; "Area's sm is 12px text" | Ghost exists (owner 09-27); sm 14px |
  | `docs/specs/segmented.md:3, 118, 128` | "in review"; `primitives.tsx:980-1030`; "Button · label on a fill · 500 · match" | Complete; lines 1388-1440; Button is 400 except solid |
  | `docs/specs/kbd.md` Behavior | `primitives.tsx:1399-1421` | 1811-1834 |
  | `docs/COMPONENTS.md:75-80` | "ButtonGroup and Toolbar — built, in review"; SplitButton "in review" | Complete |
  | `.Codex/HANDOFF.md:42` | "small controls 12/16" | 14/20 (handoff line 383; tokens) |
  | `docs/research/cohesion-audit.md:241` | Toolbar third pass: 4 inset, `shadow-1`, icon-height separator | Superseded by the 09-27 redesign; the row has no pointer to it |
- Visual: n/a.

### A-20  Toolbar surface adds a fifth elevation recipe outside the documented set
- Families: Toolbar
- Category: system-rule
- Severity: low
- Type: DECISION
- What: The surface Toolbar floats on Figma's three-layer literal black shadow, plus a decorative ring in dark only. DESIGN_SYSTEM's Elevation section lists `shadow-1`, `shadow-2`, Card's halo, the floating lift and Tooltip's lift, but not this. It uses `rgb(0 0 0 / …)`, not `--area-shadow-color`, so it ignores the Surface axis. Card has the same limitation, but Card's is documented.
- Evidence: `toolbar.css:30-34`; `docs/DESIGN_SYSTEM.md:88-94`.
- Options:
  - A: Keep Figma's bar shadow, document it under Elevation as "floating bar", and move it onto `shadow-color`.
  - B: Use the floating lift.
  - C: Use `shadow-2`.
  - Recommended: A. It was validated side by side with Figma (`toolbar/figma--bottom-toolbar`) and the owner approved it in batch 1; only the documentation and the token are missing.
- Visual: A surface Toolbar next to a Menu (floating lift) and a Panel (`shadow-2`) on the same canvas.

### A-21  "Labels on fills are 500" applies unevenly
- Families: Button, Segmented (peers: Chip, Tabs, Badge)
- Category: system-rule
- Severity: low
- Type: DECISION
- What: The weight rule names buttons and segmented options as labels on fills (500). In practice:
  - A soft Button (#f7 fill plus hairline) is 400, and only solid is 500.
  - An unselected Segmented option is transparent over the track but 500.
  - Chip and Tabs are 400.

  Either the rule means "solid fills only", in which case Segmented is the exception, or it means "any plate", in which case soft Button is.
- Evidence:
  - `button.css:31-32, 314`. `segmented.css:76-78`. `navigation.css:48` (Tabs 400). chip.css has no weight (inherits 400).
  - `docs/DESIGN_SYSTEM.md:37-40`.
- Options:
  - A: Keep as is and reword the rule: "solid and track controls (Segmented) are 500".
  - B: Segmented goes to 400, like Tabs.
  - Recommended: A. ChatGPT's segmented control is 500 for both options (`baseline/chatgpt--segmented--rest`), and ChatGPT and Notion quiet buttons are 400 (`button.md` Decisions).
- Visual: Soft Button "Button" (400), Segmented "One | Two" (500) and Chip (400) in one row.

### A-22  Gallery hygiene
- Families: all six
- Category: gallery
- Severity: low
- Type: FIX
- What:
  - **Missing tiles:**
    - ButtonGroup has no Default tile; its first tile is "Soft / text".
    - SplitButton and ButtonGroup have no md size tile.
    - There are no tiles for Button `align` start and end or `fullWidth`, ButtonGroup `fullWidth`, Toolbar `fullWidth`, or a ghost SplitButton with text. The handoff claims every non-default manifest value has a tile.
  - **Toolbar tiles do not match the manifest.** The Toolbar "Default" tile renders `variant="surface"` while the manifest default is `plain`, which instead appears as "Variant / plain".
  - **Size tile titles are inconsistent:** "Size / small" (Button, SplitButton, ButtonGroup, Segmented) vs "Size / sm" and "Size / md (default)" (Toolbar).
  - **Two unused demos remain.** `GalleryButtonGroupSizes` puts three sizes in one container, against the one-size rule, and `GalleryButtonGroupOutline` duplicates another tile. The hidden docs page's `GalleryToolbarSizes` also stacks three sizes.
  - **Copy departs from the Example-copy vocabulary:**
    - "Save", "Save as…", "Save a copy", "Export", "New from template", "Import", "Add section", "Add page" (SplitButton)
    - "Left", "Center", "Right", "Bold", "Reset", "Copy", "Link" (ButtonGroup, no icons)
    - "Duplicate" / "Delete" in the overflow
    - "Dev Mode" and "Prototype" (product nouns)

    Segmented and Button tiles follow the vocabulary.
- Evidence:
  - `apps/docs/scripts/build.mjs:378-385, 589-631, 865-883, 942-949`.
  - `gallery.tsx:106-121, 164-170, 176-189, 266-269`.
  - `apps/docs/src/demos/gallery-variants.tsx:51-52` (no references elsewhere).
  - `docs/DESIGN_SYSTEM.md:227-245` (Example copy).
- Visual: n/a.

### A-23  Owner questions still open for these families
- Families: Button group, Split button, Button, Toolbar, Segmented
- Category: docs-drift (open decisions)
- Severity: medium
- Type: DECISION
- What: These are recorded as open and not settled anywhere later:
  1. **Disabled seam** (`cohesion-audit.md:319`). One disabled Button dims on its own, so the 1px overlapped seam and border show at about 75%. Options: dim per button (current) or dim the group as a whole. Recommended: dim per button, but draw the seam from the enabled neighbour. The gallery's "Disabled button" tile keeps one command usable, which a whole-group dim cannot show.
  2. **Button lg height** (`button.md:228`, "Open question"). 40 vs ChatGPT's 36. Recommended: keep 40, since compact density covers dense products (handoff owner direction).
  3. **Toolbar "tools" size** (`toolbar.md:132`). Figma draws 24px icons in 32px tools. Recommended: route it to compact density or a Toolbar-only icon slot, not a new Button size.
  4. **Segmented shadow vs toolbar plate** (`toolbar.md:177, 196`). See A-6.
  5. **"Complete families changed here: re-review, or accept as bug fixes"** (`cohesion-audit.md:320`), covering Button's selected hover and Split button. Recommended: accept as bug fixes; both were re-approved in batch 11.
- Visual: For item 1, a ButtonGroup with its middle button disabled, showing the seam at 50% and the border at 50%.

### A-24  Test coverage is thin for Button and keyboard models
- Families: Button, Kbd, Toolbar, Segmented
- Category: interaction
- Severity: low
- Type: FIX
- What:
  - There is no Button test file covering the `type="button"` default, `aria-pressed`, `aria-busy`, `iconOnly` with children, or ref forwarding.
  - Kbd is only asserted in passing in dialog.test.
  - Toolbar and Segmented tests are server renders. The arrow, Home and End roving, the handoff into a toolbar, and RTL are "verified in headless Edge" per the specs, but no test protects them.
- Evidence: the `packages/react/tests/` listing (no button or kbd test); `toolbar.test.mjs:7-29`; `segmented-tabs.test.mjs:7-17`; `dialog.test.mjs:148`.
- Visual: n/a.

## Confirmed consistent

- Foreground stays fixed on hover in Button (every variant), Segmented, the Toolbar overflow trigger and SplitButton. The only ink change is the deliberate selected → body ink (`button.css:427`).
- Disabled uses 50% whole-control opacity in Button, Segmented options and SplitButton (both parts). None of these families dims and repaints at once.
- Focus ring: all six interactive surfaces use `focus-width 2 / focus-color / focus-offset 2` as an outline. Joined parts raise `z-index: 1` on focus so the ring is not clipped (`button-group.css:62`, `split-button.css:21`). Forced colours map Button, Segmented and selected states to Highlight.
- Neutral by default: no family here paints accent unless `tone="accent"` is passed. Selected paint is neutral.
- One label weight per state: Segmented is 500 selected and unselected (`segmented.css:78, 94`), and Button labels do not change weight on selection.
- Logical properties throughout: seams use `inset-inline-start` and `margin-inline-start`, the overflow uses `inset-inline-end`, and Toolbar and Segmented arrow keys flip in RTL.
- The floating lift on the Toolbar overflow matches the documented `0 20px 24px` / `0 5px 8px` at 50% over a 1px decorative border (`toolbar.css:76`).
- Toolbar and Segmented hovers follow the plate rule: the overflow trigger uses the opaque `bg-component-hover`, and Segmented uses the translucent `bg-hover` on its track.
- Square icon boxes: Button, Segmented and the split chevron use `inline-size = block-size = --_icon`. inset.css reserves nested keycap boxes (20 / 16) in Button, Input, Menu and Nav.
- Kbd matches its approved spec: 6px corner at every size, filled, no stroke, muted 500, quiet in Menu rows, 20 / 16 heights.
- SplitButton keyboard and ARIA: `aria-haspopup="menu"`, `aria-expanded`, `aria-controls`, native `popovertarget`, ArrowUp/ArrowDown open on the last/first item, Tab closes, and both parts join Toolbar roving.
- Refs and native props are forwarded by Button, ButtonGroup, SplitButton (to the group; `actionProps` for the action), Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarOverflow, Segmented and Kbd. Button defaults to `type="button"`.
- Motion: every transition reads the motion tokens (`--area-transition`, `--area-duration-base`). The split chevron also has a `prefers-reduced-motion` rule.
- Gallery people: no people appear in these families' tiles. Segmented and Button tiles use the Example-copy vocabulary.
