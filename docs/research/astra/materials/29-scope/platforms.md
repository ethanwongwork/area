# Platforms: how Apple, Microsoft and Google scope materials (checked 2026-10-16/17)

Research agent report, condensed. Apple quotes are from the HIG JSON (developer.apple.com/tutorials/data/design/
human-interface-guidelines/<page>.json); Fluent values from microsoft/fluentui `f02cfa8f`; Material 3 from
androidx/androidx `9a589fa6` (compose/material3/.../tokens).

## Treatment by component

none = no material or shadow · subtle = one step (1–4px blur, or tone) · strong = glass/acrylic or a large shadow ·
→ = a state change.

| Area family | Apple Liquid Glass (26) | Fluent 2 React [Windows 11] | Material 3 |
| --- | --- | --- | --- |
| Button (secondary, outline, ghost) | none in content; glass only inside bars | none [Win: elevation 2 + stroke; pressed 1] | outlined/text 0; filled/tonal 0 → hover 1; elevated 1 → 2 |
| Primary button | tinted glass, only as a toolbar's one prominent action | none; brand fill | filled 0 → hover 1 |
| Badge, chip, tag | none | none | flat 0; elevated chip 1 → 2 |
| Input, select, textarea | none | none (old shadow appearances deprecated) | none |
| Checkbox, radio | none | none | none |
| Switch, slider | knob turns glass only while dragged | none | none |
| Segmented, tabs | tab bar glass; nothing for in-content segmented | none | 0 |
| Card | none (content layer) | filled 4 → hover 8; outline none | elevated 1 → 2; filled/outlined 0 → 1 |
| Sidebar, nav | glass (more opaque) | [Mica base; acrylic only when overlaying] | rail 0; modal 1–2 |
| Titlebar, toolbar | glass | [Mica / Mica Alt] | top bar 0 → 2 on scroll |
| Menu, list box popup, combobox | glass | shadow16 [flyout 32 + acrylic] | L2, tonal 0 |
| Popover, hover card | glass (regular) | ~16 | rich tooltip L2 |
| Tooltip | macOS toolTip material | ~8 [Win 16] | plain 0; rich 2 |
| Dialog | glass (regular) | shadow64 + smoke scrim | 3 |
| Drawer, sheet | glass; more opaque at full height | shadow64 | sheet tonal L1, shadow 0 |
| Toast | n/a | shadow8 | snackbar 3 |
| Inline alert | none | none | n/a |
| Table, list, tree | none (content layer) | none | 0; dragged 4 |
| Progress, meter, kbd, code, breadcrumb, pagination | none | none | none |

## Stated restraint

- **Apple:**
  - Glass is "a distinct functional layer for controls and navigation elements … that floats above the content layer."
  - "Don't use Liquid Glass in the content layer." Only sliders and toggles take it, and only "when a person activates it."
  - "Use Liquid Glass effects sparingly." "Avoid … layering Liquid Glass elements on top of each other."
  - Colour: "reserve it for … status indicators or primary actions," with "only one primary action" per toolbar.
  - The vibrancy materials name only chrome, overlays and selection (titlebar, selection, menu, popover, sidebar,
    sheet, toolTip, …), never a control fill.
- **Microsoft:**
  - Acrylic is "on transient surfaces" (menu flyouts, combo boxes, suggest boxes).
  - Not on large backgrounds, not side by side, not layered, no accent text over it.
  - Mica is the app's base layer, applied once, never "to a UI element."
  - Shadows "purposefully — rather than decoratively"; "Windows uses strokes instead of key shadows."
  - Every material falls back to solid when transparency is off, in Battery Saver, in High Contrast, or when the window
    is inactive.
- **Material 3:** "To prevent shadow creep, only apply shadow elevation when absolutely necessary." Elevation moved to
  tone (surface containers). Recent defaults dropped shadows: the nav bar is L0 and the sheet's shadow is 0.

## Not verified

- The M3 site prose (it renders only with JavaScript).
- The surface-tint migration mapping (from a search summary).
- Fluent 2 per-component pairings (from a summariser of the Fluent site).
