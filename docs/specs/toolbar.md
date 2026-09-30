# Toolbar spec

**Status:** in review · 2026-09-27 (redesign from Figma's toolbelt, validated side by side in Claude in Chrome; was Complete)
**Captures:** `docs/research/captures/toolbar/` (Area tiles light and dark; Figma toolbelt: `figma--bottom-toolbar`, `figma--tool--rest`, `figma--tool-group--{selected,hover,chevron-hover}`, `figma--mode-switch--{rest,hover}`)
**Peers:** Button (the commands), Button group, Segmented (a mode switch inside a toolbar), Menu / Popover / Dialog / Toast (floating lift on the overflow), Separator, Panel (host surface)

## Owner decisions

- 2026-09-27 (second message): "the toolbar segmented control stroke looks wrong, why is the
  stroke so inset? shouldn't that be a segmented control?" → the track group variant is removed;
  one-of-several choices are a Segmented control in the toolbar (its options join the toolbar's
  roving). Figma's tool groups are icon-only ghost SplitButtons (tool + chevron, 1px apart, no
  divider). Separators keep the command height (earlier owner references); Figma's toolbelt
  divider runs the full 48 (`figma--bottom-toolbar`), recorded as the alternative.

- 2026-09-27: "can you use strokes for the selected states? or real segmented controls, the
  drop shadow only visual doesn't really fit in the design system" → a pressed toggle keeps
  Button's selected fill (`bg-component-active`); a track group is painted as Segmented
  (`bg-subtle` groove with a decorative hairline, chosen option `bg-surface` with the
  `edge-selected` stroke and `shadow-1`). The Figma plate shadow is gone.

- Before 2026-09-24 (moved from [prior decisions](PRIOR_DECISIONS.md)):
  [Primer ActionBar CSS](https://github.com/primer/react/blob/main/packages/react/src/ActionBar/ActionBar.module.css):
  command sizing follows the control tier. Area's surface toolbar adds 4px around full-size
  commands; the plain variant adds no surface inset. This does not imply parity with
  Primer's responsive overflow implementation.
- 2026-09-26: **Neutral by default, accent by override** (DESIGN_SYSTEM.md). Toolbar commands
  are neutral ghost Buttons; nothing in Toolbar paints accent.
- 2026-09-26 (second pass): decide every open item with the most calculated option
  consistent with the system. For Toolbar: separators take the new `border-divider` role
  (audit decision 7); command height stays the control tier (decision 18).
- 2026-09-27: **redesign from Figma's toolbar**, with three reference shots (a text-formatting
  bar with soft font and size fields, pressed B / I / U and an alignment track, light and dark;
  a composer with a formatting row; a round tool tray). Supersedes the third pass's kept
  values: the surface bar takes Figma's 8 inset and floating shadow, a pressed toggle rises as a
  plate, one-of-several toggles sit in a track, and separators span the commands. Every
  component gets an enlarged Pass review; this is the first pass validated in Claude in Chrome.

## Job and boundaries

Toolbar groups commands into one tab stop with arrow-key movement, optional groups,
separators and an overflow disclosure for secondary commands. It does not choose a value
(Segmented) or join edges (Button group). Its overflow is a disclosure of Buttons, not a
Menu with menu semantics.

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| variant | plain (default), surface | Inside an existing surface, or on its own over the canvas | Owner (prior decision); Figma's bottom toolbar is a surface bar (`figma--bottom-toolbar`); Notion's view toolbar icons sit plain (`button/notion--toolbar-icon`) |
| size | sm, md (default), lg | Control tiers of the commands | Primer (prior decision); gallery `sizes` |
| orientation | horizontal (default), vertical | Side rails | Gallery `vertical` |
| booleans | `fullWidth` | Span a panel row | — |
| composition | groups, separator, overflow | Gallery `default` | Figma: tool row, divider, mode switch; Primer ActionBar overflow |
| group variant | track | One-of-several toggles in a filled groove, the chosen one raised | Figma's mode switch (`figma--mode-switch--rest`); owner reference (alignment) |
| state | pressed toggle (`Button selected`) | A toggled command reads as raised, not tinted | Figma's selected mode option; owner references (Bold) |
| content | fields (Select soft) | Font and size pickers in a formatting bar | Owner references; Figma's type fields |

## Sources

| Id | Type | What | Link / commit / path | License | Captures |
|---|---|---|---|---|---|
| figma | target product (primary for canvas tools, BASELINE) | Editor bottom toolbar ("toolbelt"): white bar with a lift, tool row, full-height divider, 4-option mode switch | figma.com editor, light, read-only, 2026-09-26 | evidence only | `figma--bottom-toolbar--rest--light` |
| figma | target product | Toolbelt tools and mode switch, by state: plain tool, tool groups (tool + flyout chevron) selected, hovered and chevron-hovered, mode switch at rest and with an option hovered | figma.com editor (a community-file copy in the owner's Drafts, nothing edited), Claude in Chrome, light, 2026-09-27; script fingerprint 091bb143 | evidence only | `figma--tool--rest--light`, `figma--tool-group--{selected,hover,chevron-hover}--light`, `figma--mode-switch--{rest,hover}--light` |
| owner | reference shots | Formatting toolbar (light and dark), composer formatting row, round tool tray | Pasted by the owner, 2026-09-27 | direction only (screenshots are not measured) | none |
| notion | target product | View-toolbar icon button, 28px, 16px glyph, muted ink | app.notion.com, owner's workspace, 2026-09-26 | evidence only | `button/notion--toolbar-icon--rest--light` |
| notion | target product | Date-filter popover (floating lift geometry) | earlier Calendar pass | evidence only | `calendar/notion--search-date-filter-popover--rest--light` |
| chatgpt | target product | Profile menu surface (lift) | owner's session, 2026-09-26 | evidence only | `baseline/chatgpt--menu--rest--light` |
| primer | design system (source) | ActionBar sizing | link above (prior decision) | MIT | none |
| area | this system | Redesigned gallery tiles, light and dark | localhost gallery, 2026-09-27 | — | `toolbar/area--{default,content-formatting,variant-plain,layout-vertical,sizes,behavior-overflow}--rest--light`, `area--{default,content-formatting}--rest--dark` |

The 2026-09-26 capture recorded the bar, divider and mode switch only; the 2026-09-27 captures
add the tools and their states. Figma's selected tool is its blue accent fill (rgb 13 153 255,
`figma--tool-group--selected`); Area's stays neutral (below). Figma's inspector has no
toolbar; its alignment row is a joined group (`button-group/figma--align-group`). Untitled UI
has no toolbar component ([reference](../research/untitled-ui-reference.md)).

## Anatomy

```
figma      div.toolbelt 512 × 48, radius 13, white, three-layer shadow (below)
  row      div, padding 8, gap 8 between tool groups
    group  div (display: contents): tool button 32 × 32 (padding 4, radius 5, 24px icon)
           + flyout chevron 16 × 32 (radius 5), 1 apart; each hovers on its own (#f5)
  divider  div 1 × 48, rgb(230), full height
  mode     fieldset 122 × 32 at 8px, #f5, radius 5, 2px padding and gap; options 28 × 28,
           radius 3; hover #e6; the chosen option is a separate white plate with a shadow
area       div.area-toolbar[role=toolbar]  owns: tier, inset (0 plain / 8 surface), radius, fill, shadow, 8 gap
  group    div.area-toolbar__group[role=group]  gap 8; `--track`: groove, 2 inset and gap
    item   .area-button (ghost)  height/icon/text/radius from --_toolbar-*; pressed: raised plate
    field  .area-select (soft)  as wide as its options
  sep      span.area-toolbar__separator  1px × command height, border-divider
  overflow details.area-toolbar__overflow
    trigger summary  square item, 2px dots ±4px
    content div  floating surface: 1px border-decorative, radius-container, 4px padding, 2px gap
```

Inset equation, surface: outer 48 = 32 command + 2 × 8 inset (Figma 48 = 32 + 2 × 8); radius
= min(8 + 8, 48 × 0.4) = 16, concentric (Figma 13 = 5 + 8). Track: 32 = 28 option + 2 × 2;
option radius 8 − 2 = 6 (Figma 5 − 2 = 3).

## Measurements

`node scripts/capture-compare.mjs --slots shell,selected,mode,divider toolbar/area--default--rest--{light,dark}.json toolbar/figma--bottom-toolbar--rest--light.json toolbar/figma--mode-switch--rest--light.json` (trimmed), plus the Figma tool captures:

| slot · property | area · default · light | area · default · dark | figma · toolbelt | figma · mode switch |
|---|---|---|---|---|
| **shell** size | 387 × 48 | 387 × 48 | 512 × 48 | 138 × 48 (incl. 8 inset) |
| **shell** padding / gap | 8 / 8 | 8 / 8 | row 8 / 8 | 8 |
| **shell** radius | 16px | 16px | 13px | — |
| **shell** background | rgb(255, 255, 255) | rgb(29, 29, 29) | rgb(255, 255, 255) | — |
| **shell** shadow | 0 0 0.5px 18%, 0 3px 8px 10%, 0 1px 3px 10% (ring transparent) | same, plus 1px inset rgb(40) ring | 0 0 0.5px 18%, 0 3px 8px 10%, 0 1px 3px 10% | — |
| **item** size / radius | 32 × 32 / 8 | 32 × 32 / 8 | 32 × 32 / 5 (padding 4, 24px icon) | options 28 × 28 / 3 |
| **item** hover | rgb(243) (`bg-component-hover`) | rgb(51) | rgb(245) (`figma--tool-group--hover`) | rgb(230) on the track |
| **selected** | rgb(255) + 0 0 0.5px 30%, 0 1px 3px 15% | rgb(63) + same shadow | tool: rgb(13, 153, 255) fill | rgb(255) + 0 0 0.5px 30%, 0 1px 3px 15% |
| **divider** | 1 × 32, rgb(226) | 1 × 32, rgb(51) | 1 × 48, rgb(230) | — |
| **track** size / padding / gap / fill | 122 × 32 / 2 / 2 / rgb(245) | same / rgb(40) | — | 122 × 32 / 2 / 2 / rgb(245) |

Hover and pressed values in the Area columns were read from computed styles with the real
pointer in Claude in Chrome (tool hover rgb 243; track option hover `bg-hover`, 5% ink over
rgb 245; the selected tool keeps its plate and shadow under the pointer); those two hover
captures were lost with a frozen tab and are not in the folder. Other tiles:
`area--content-formatting` 477 × 48 (selects 143 and 73 wide), `area--sizes` sm 177 × 44
(radius 14, items 28 / 6, track 80 × 28), `area--variant-plain` 201 × 32 (no inset),
`area--layout-vertical` 48 × 128.

## Decisions

| Slot · property | Area value | Basis | Reason when it differs from the basis |
|---|---|---|---|
| command size | Button tier (28 / 32 / 40) | Owner (prior decision, Primer); audit decision 18 | Figma's tools are 32 at its one size |
| command icon → label gap | Button's own, 6 at sm, md and lg; the toolbar no longer sets a child's `--_gap` (toolbar.css:47-55) | Peer: Button (audit S14) | Was the toolbar's gap tier, 4 / 8 / 8 |
| icon | 16 at md (Button's tier) | Button, Menu peers | Figma draws 24px icons in its 32 tools (4 padding); Area keeps the control icon ladder. Open: a canvas "tools" size |
| surface inset | **8** | Figma toolbelt (48 around 32); owner references | Was 4 (third pass) |
| surface radius | concentric: 16 at md | Radius rule, command radius + inset (Figma 13 = 5 + 8) | — |
| surface paint | `bg-surface`; Figma's shadow `0 0 0.5px 18%, 0 3px 8px 10%, 0 1px 3px 10%`; a 1px decorative inset ring in dark only | Figma toolbelt (light); the halo cannot draw on a dark page | Was a hairline and `shadow-1`. A raised bar is not the overlay lift (Menu, Popover), which stays deeper. Its four-layer recipe is its own (toolbar.css:33), a documented exception to `--area-shadow-float` (audit S10); a literal, so the Flat preset keeps it |
| spacing | **8** between commands, groups and separators | Figma tool row 8 and 8 either side of its divider | Was 2 in a group, 4 between groups |
| separator | 1px × **command height**, `border-divider` | Owner references (rule spans the controls) | Figma runs it the full 48 |
| hover | `bg-component-hover`, ink fixed | Shared rule; Figma #f5 | #f3 vs #f5: the shared plate wins |
| pressed toggle | **raised plate**: `bg-surface` + `0 0 0.5px 30%, 0 1px 3px 15%`; dark `bg-component-active`; kept under the pointer and while pressed | Figma's selected mode option; owner references (Bold) | Figma paints a selected *tool* in its blue accent; neutral by default (owner) |
| track group | groove the command height, #f5 (dark `bg-component`), 2 inset and gap, options 28, concentric 8 / 6, option hover `bg-hover`, chosen option raised | Figma mode switch (`figma--mode-switch--*`) | Figma radius 5 / 3 (radius axis) |
| fields | Select soft at the tier, as wide as its options | Owner references; Figma's type fields | Select's form default is 16rem |
| overflow lift | `--area-shadow-float`: `0 20px 24px shadow-color, 0 5px 8px shadow-color at 50%` (toolbar.css:76); `none` under the Flat preset | Audit floating-lift rule | A Surface axis role since audit S10 |
| overflow surface | radius-container 12, 1px `border-decorative`, 4px padding | Popover and Menu peers | — |

## States

| State | Slot · property changes | Evidence |
|---|---|---|
| command hover / pressed / disabled | Button's states (neutral ghost: #f3 / #ee / 50%) | [button.md](button.md) |
| command selected (toggle) | raised plate (above), kept under the pointer | `area--default--rest--*`; Chrome computed styles |
| track option hover | `bg-hover` over the groove | Chrome computed style |
| overflow trigger hover or open | `bg-component-hover` plate; ink fixed | `toolbar.css:46`; not captured |
| focus-visible | 2px focus ring on items, trigger and the toolbar root (`toolbar.css:47`) | not captured |
| overflow open | floating surface below (horizontal) or beside (vertical, `toolbar.css:51`) | earlier `area--default` capture with the overflow open |

## Behavior and accessibility

`role="toolbar"`, `aria-orientation`; the root is one tab stop that forwards focus to the
last-focused or first enabled item (`Toolbar.tsx:43-61`). Arrow keys (RTL-aware), Home and
End move without activating (`Toolbar.tsx:21-42`). `ToolbarItem` marks focusable children.
Separators have `role="separator"` with the cross orientation. Overflow is a native
`details` whose `summary` carries the accessible name ("More actions"); Escape and choosing
an item close it and return focus (`Toolbar.tsx:90-118`). Figma's mode switch is a
`fieldset` of radios with a visually hidden legend. Area's `ToolbarGroup variant="track"`
draws the same groove from toggle Buttons (`aria-pressed`), so its options stay toolbar items
on one Tab stop; a form value that must submit is a Segmented placed inside the Toolbar.

## Peers and consistency

| Peer | Shared role | Area value in peer | Toolbar | Match / reason |
|---|---|---|---|---|
| Menu, Popover, Select picker, Dialog, Toast, Calendar, ColorPicker, Command palette | floating lift | `--area-shadow-float` (0 20 24 / 0 5 8 `shadow-color`) over a 1px decorative border | overflow content same | match (audit rule); the surface bar keeps its own recipe |
| Menu / Popover | floating radius | `radius-container` 12 | 12 | match |
| Panel | docked surface | `shadow-2`, decorative edge | surface toolbar floats on Figma's bar shadow | the bar floats over a canvas; Panel docks |
| Button (neutral ghost) | transparent command hover | `bg-component-hover` | trigger same | match |
| Separator, Button group | divider paint | `border-divider` 1px | same | match (second pass) |
| Segmented | raised choice in a groove | 2px inset and gap, concentric radius, selected `light-dark(bg-surface, bg-component-active)` + hairline + `shadow-1` (segmented.css:94-100) | track: same geometry, raised plate with Figma's shadow; dark `bg-component-active` | dark fill matches since audit S15a; open: align Segmented's shadow |
| Button | pressed toggle | `bg-component-active` fill, kept on hover | raised plate inside a toolbar | a toolbar toggle rises, as Figma's and the owner's references do |

## Visual pass

Validated 2026-09-27 in Claude in Chrome: Area's gallery tab beside Figma's editor, both at
100%, zoomed screenshots of the same regions.

- **Against Figma (light):** bar height, inset, shadow and the concentric corner read as the
  same object; the raised plate and the track are indistinguishable from Figma's mode switch.
  Area's selected tool is a neutral raised plate where Figma's is blue (owner rule). Area's
  glyphs read smaller: Figma's toolbelt draws 24px icons, Area keeps its 16px control icons.
- **Against the owner's references:** the formatting bar (soft font and size fields, pressed
  Bold, alignment track) matches their structure in light and dark; in dark the pressed plate
  is `bg-component-active` (#3f) on the #1d bar, as the dark reference lifts with fill.
- **Defect found and fixed:** in the formatting tile the selects took Select's 16rem default
  and groups shrank below their content, so the alignment track overlapped the style group.
  Selects in a toolbar now hug their options and groups never shrink (`toolbar.css`).
- **Peers:** hover is the shared row plate (#f3), as on Button, Menu and Nav; the raised plate
  is Segmented's selected construction with Figma's stronger shadow. Open: whether Segmented
  adopts the same shadow (it uses `shadow-1`).

2026-09-27 re-check after the Segmented and SplitButton change (Claude in Chrome, Figma toolbelt
beside the gallery's Tools tile): tool and chevron plates, 8 between tools and one divider match;
Area's chosen tool is neutral where Figma's is blue (owner rule); Area's icons are 16 in 32
plates where Figma's are 24; the mode switch reads as the same object, with Area's selected edge.

## Settled questions

The third pass's kept values (4 inset, `shadow-1`, icon-height separator) are superseded by the
owner's redesign (2026-09-27, Owner decisions).

## Verification

Compared the redesigned `toolbar/area--*` tiles (light and dark) with the Figma toolbelt
captures; hover and pressed checked with the real pointer in Claude in Chrome. Build, manifest
parity, token references and the React tests pass. Unverified: Figma's dark theme (switching it
needs the owner), keyboard focus ring in the new track, a screen reader on toggle and track
semantics (toggles are `aria-pressed`; a track is not a radio group).

## Feedback log

- 2026-09-26 · cohesion audit → overflow content `shadow-2` → floating lift (0 20px 24px,
  0 5px 8px) → `toolbar/area--default` (open overflow) and the Notion popover capture.
- 2026-09-26 · second pass (Notion, Figma; owner: decide all open items) → separator
  `border-decorative` → `border-divider`; sizes tile added; surface elevation, inset and
  separator length recorded as open → `figma--bottom-toolbar`, `button/notion--toolbar-icon`,
  `area--{default,sizes}`.
- 2026-09-27 · third pass → open questions settled, values kept (4px inset, `shadow-1`,
  icon-height separator) → [cohesion audit](../research/cohesion-audit.md#third-pass-the-questions-the-evidence-left-open).
- 2026-09-27 · owner: "look at the figma toolbar, and redesign the toolbar" (three reference
  shots) → 8 inset, Figma's bar shadow, 8 spacing, command-height separators, raised pressed
  plate, `ToolbarGroup variant="track"`, selects hug their options; tiles Tools, Content / text
  formatting, Behavior / overflow → `figma--tool*`, `figma--mode-switch--*`, `area--*` light and
  dark; validated side by side in Claude in Chrome.
- 2026-09-27 · owner: shadow-only selected plate doesn't fit → pressed toggles use Button's
  selected fill; track = Segmented's paint (stroke on the chosen option) → headless Edge
  screenshot of the Tools tile. The Validated entry predates this change.
- 2026-09-27 · owner: segmented stroke, Figma's tool dropdowns, divider lengths → track removed for
  Segmented, split tools as ghost icon SplitButtons, one roving order across them → captures
  `figma--split-tool--*`, `figma--toolbelt-row`; keyboard checked (Move → Move tools → … → Dev
  Mode, Home, End wrap; ArrowDown opens a tool's menu).
- 2026-09-27 · owner: keep the separator's height, lighter stroke → `border-decorative` (was
  `border-divider`), the seam role Panel and Code block rules now use; Sizes split into one tile
  per size.
- 2026-09-30 · audit S10 (owner) → the overflow reads the Surface axis role `--area-shadow-float` (same recipe; `none` under Flat; toolbar.css:76); the surface bar keeps its own four-layer recipe as a documented exception (toolbar.css:33).
- 2026-09-30 · audit S14, S15a (owner) → a command's icon-to-label gap is Button's own 6; the toolbar no longer overrides `--_gap` (toolbar.css:47-55; was 4 / 8 / 8). Segmented's selected thumb takes `bg-component-active` in dark, the same fill as the toolbar's pressed plate (peer row).
