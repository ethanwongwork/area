# Toolbar spec

**Status:** in review · 2026-09-26 (cohesion audit; second pass the same day)
**Captures:** `docs/research/captures/toolbar/` (Area tiles, `figma--bottom-toolbar`)
**Peers:** Button (the commands), Button group, Segmented (a mode switch inside a toolbar), Menu / Popover / Dialog / Toast (floating lift on the overflow), Separator, Panel (host surface)

## Owner decisions

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

## Sources

| Id | Type | What | Link / commit / path | License | Captures |
|---|---|---|---|---|---|
| figma | target product (primary for canvas tools, BASELINE) | Editor bottom toolbar ("toolbelt"): white bar with a lift, tool row, full-height divider, 4-option mode switch | figma.com editor, light, read-only, 2026-09-26 | evidence only | `figma--bottom-toolbar--rest--light` |
| notion | target product | View-toolbar icon button, 28px, 16px glyph, muted ink | app.notion.com, owner's workspace, 2026-09-26 | evidence only | `button/notion--toolbar-icon--rest--light` |
| notion | target product | Date-filter popover (floating lift geometry) | earlier Calendar pass | evidence only | `calendar/notion--search-date-filter-popover--rest--light` |
| chatgpt | target product | Profile menu surface (lift) | owner's session, 2026-09-26 | evidence only | `baseline/chatgpt--menu--rest--light` |
| primer | design system (source) | ActionBar sizing | link above (prior decision) | MIT | none |
| area | this system | Gallery tiles, re-taken after the second pass | localhost gallery | — | `toolbar/area--{default,plain,vertical,sizes}--rest--light` |

The Figma capture records the bar, divider and mode switch; the tool buttons in the left row
were not recorded (the row's children are absent from the file). Figma's inspector has no
toolbar; its alignment row is a joined group (`button-group/figma--align-group`). Untitled UI
has no toolbar component ([reference](../research/untitled-ui-reference.md)).

## Anatomy

```
figma      div.toolbelt 512 × 48, radius 13, white, lift (below)
  row      div, gap 8, 373 × 48 (tools; not recorded)
  divider  div 1 × 48, rgb(230), full height
  mode     fieldset 122 × 32 at 8px, rgb(245), radius 5, 2px padding and gap; items 28 × 28, radius 3
area       div.area-toolbar[role=toolbar]  owns: tier, inset (0 plain / 4 surface), radius, fill, edge ring, shadow
  group    div.area-toolbar__group[role=group]  gap 2 (toolbar.css:29)
    item   .area-button (ghost)  height/icon/text/radius from --_toolbar-* (toolbar.css:31-40)
  sep      span.area-toolbar__separator  1px × icon size, border-divider (toolbar.css:41-42)
  overflow details.area-toolbar__overflow
    trigger summary  square item, 2px dots ±4px (toolbar.css:44-49)
    content div  floating surface: 1px border-decorative, radius-container, 4px padding, 2px gap (toolbar.css:50)
```

Inset equation, surface: outer 40 = 32 command + 2 × 4 inset; radius = min(8 + 4, 40 × 0.4)
= 12 (concentric, `toolbar.css:17`). Figma: 48 = 32 mode switch + 2 × 8.

## Measurements

`node scripts/capture-compare.mjs --slots shell toolbar/*.json` plus item nodes:

| slot · property | area · default (surface) | area · plain | area · sizes (sm) | area · vertical | figma · bottom-toolbar |
|---|---|---|---|---|---|
| **shell** size | 185 × 40 | 195.13 × 32 | 132 × 36 | 40 × 108 | 512 × 48 |
| **shell** padding | 4 | 0 | 4 | 4 | 0 (switch sits 8 in) |
| **shell** radius | 12px | 8px | 10px | 12px | 13px |
| **shell** gap | 4px | 4px | 4px | 4px | row gap 8px |
| **shell** background | rgb(255, 255, 255) |  | rgb(255, 255, 255) | rgb(255, 255, 255) | rgb(255, 255, 255) |
| **shell** shadow | inset 1px rgb(243, 243, 243), rgba(0, 0, 0, 0.06) 0 0.5px 1px −0.5px |  | same | same | rgba(0, 0, 0, 0.18) 0 0 0.5px, rgba(0, 0, 0, 0.1) 0 3px 8px, rgba(0, 0, 0, 0.1) 0 1px 3px |
| item · size / radius | 32 × 32 / 8px, 2px apart | text buttons 32 high | 28 × 28 | 32 × 32 | switch items 28 × 28 / 3px, 2px apart |
| separator | 1 × 16, rgb(226, 226, 226) |  |  |  | 1 × 48, rgb(230, 230, 230) |

Overflow content (`toolbar.css:50`): radius 12, 4px below the trigger, sm items, the floating
lift. Reference lifts: Notion popover `rgba(25,25,25,.05) 0 20px 24px, rgba(25,25,25,.027) 0 5px
8px` + 7% ring (`calendar/notion--search-date-filter-popover`); ChatGPT menu `0 8px 16px −4px
.12` + 0.5px 10% ring (`baseline/chatgpt--menu--rest`).

## Decisions

| Slot · property | Area value | Basis | Reason when it differs from the basis |
|---|---|---|---|
| command size | Button tier (28 / 32 / 40) | Owner (prior decision, Primer); audit decision 18 | Figma's mode items are 28 in a 32 track, Notion's toolbar icons 28; density is the UI-scale axis |
| surface inset | 4 (`space-4`); plain 0 | Owner (prior decision) | Figma pads its bar 8; kept (third pass) |
| surface radius | concentric: 12 at md (`toolbar.css:17`) | Radius rule (nested = outer − inset) | Figma 13 |
| surface paint | `bg-surface`, inset 1px `border-decorative` #f3, `shadow-1` (`toolbar.css:22`) | Docked-in-canvas surface, like Panel | Figma's bar carries a real lift; kept (third pass): the floating lift is for overlays |
| group gap / toolbar gap | 2 / 4 | Area spacing | Figma tool row 8, mode items 2 |
| separator | **1px × icon height, `border-divider` #e2e2e2** (`toolbar.css:41-42`) | Second pass: rules between content take the divider role; Figma rgb(230) | Was `border-decorative` #f3. Length kept at the icon height (third pass); Figma runs it full height |
| overflow trigger hover | `bg-component-hover` (`toolbar.css:46`) | Audit row/transparent-control rule | — |
| overflow lift | `0 20px 24px shadow-color, 0 5px 8px shadow-color at 50%` (`toolbar.css:50`) | Audit floating-lift rule: Notion popover geometry | Was `shadow-2`; colour is the theme-aware `shadow-color` |
| overflow surface | radius-container 12, 1px `border-decorative`, 4px padding | Popover and Menu peers | — |

## States

| State | Slot · property changes | Evidence |
|---|---|---|
| command hover / pressed / selected / disabled | Button's states (neutral ghost: #f3 / #ee / selected fill / 50%) | [button.md](button.md) |
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
`fieldset` of radios with a visually hidden legend: a value choice, which in Area is a
Segmented placed inside a Toolbar, not a Toolbar item type.

## Peers and consistency

| Peer | Shared role | Area value in peer | Toolbar | Match / reason |
|---|---|---|---|---|
| Menu, Popover, Select picker, Dialog, Toast, Calendar, ColorPicker | floating lift | 0 20 24 / 0 5 8 `shadow-color` over a 1px decorative border | overflow content same | match (audit rule) |
| Menu / Popover | floating radius | `radius-container` 12 | 12 | match |
| Panel | docked surface | `shadow-2`, decorative edge | surface toolbar `shadow-1` + inset edge | both docked; toolbar is lighter |
| Button (neutral ghost) | transparent command hover | `bg-component-hover` | trigger same | match |
| Separator, Button group | divider paint | `border-divider` 1px | same | match (second pass) |
| Segmented | mode switch inside a bar | 2px inset and gap, concentric radius | — | Figma's switch has the same construction (2 / 2, radius 5 / 3) |

## Visual pass

The gallery shows the tiles in named groups: Default, Variants (`plain`), Sizes and Layout
(`vertical`). Beside Figma's toolbelt, Area's surface bar is flatter (a hairline and
`shadow-1` against a three-layer lift) and its separator stops at the icon height where
Figma's runs the full bar. Not inspected by this spec's author: the overflow in dark theme,
hover and focus in the browser.

## Settled questions

Kept in the third pass: the surface toolbar is in-flow, and the floating lift is for
overlays ([cohesion audit](../research/cohesion-audit.md#third-pass-the-questions-the-evidence-left-open)).

1. **Surface elevation.** Figma's bottom toolbar floats over the canvas with a lift (0.5px
   18% ring, 0 3px 8px 10%, 0 1px 3px 10%) and radius 13 (`figma--bottom-toolbar`). Area's
   surface toolbar keeps `shadow-1` and a decorative ring (`toolbar.css:22`).
2. **Inset and separator length.** Figma pads the bar 8px around its 32px control and runs
   its divider the full 48px height; Area keeps a 4px pad and a separator at the icon
   height (16 at md).

## Verification

Compared `toolbar/area--{default,plain,vertical,sizes}` with `figma--bottom-toolbar`,
`button/notion--toolbar-icon` and `calendar/notion--search-date-filter-popover--rest--light`.
Build and test results are in [the audit](../research/cohesion-audit.md#verification).
Unverified: hover and focus captures, Figma's tool buttons, dark theme.

## Feedback log

- 2026-09-26 · cohesion audit → overflow content `shadow-2` → floating lift (0 20px 24px,
  0 5px 8px) → `toolbar/area--default` (open overflow) and the Notion popover capture.
- 2026-09-26 · second pass (Notion, Figma; owner: decide all open items) → separator
  `border-decorative` → `border-divider`; sizes tile added; surface elevation, inset and
  separator length recorded as open → `figma--bottom-toolbar`, `button/notion--toolbar-icon`,
  `area--{default,sizes}`.
- 2026-09-27 · third pass → open questions settled, values kept (4px inset, `shadow-1`,
  icon-height separator) → [cohesion audit](../research/cohesion-audit.md#third-pass-the-questions-the-evidence-left-open).
