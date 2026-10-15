# Minimal elevation (2026-10-13)

Owner: "what is the shadow/elevation story looking like? can you develop an extremely subtle, very
minimal shadow system. look at chatgpt, notion, etc. i barely want to see any shadows or none if
necessary." The rule that came out of this is in DESIGN_SYSTEM.md, "Elevation". The review page
(Before / After, light and dark, every affected surface) is
https://claude.ai/artifact/7mmvZzP8CZCG8gpUxZR8fv.

## Before

One floating lift for everything over the page, Notion's popover geometry: `0 20px 24px` at 6% and
`0 5px 8px` at 3% (light), over `border-float` #f3f3f3. Card had a 3% halo, Panel `shadow-2`, Tooltip
`0 4px 12px -2px`, the floating Toolbar Figma's three layers with no edge in light, and Board card
Notion's card lift.

## Captures

Measured 2026-10-13 in the built-in browser, reading each open surface's computed `box-shadow`,
border, radius and background (the elevation layer of `area-capture.js`'s record, without its
structure and text metrics). ChatGPT logged out (chatgpt.com); Notion on a public page
(notion.notion.site, the app UI read-only); light and dark by `prefers-color-scheme` emulation, so no
product setting changed. Cursor from its app bundle, `workbench.desktop.main.css` (Cursor 3.23).

| Product | Surface | Shadow | Edge |
|---|---|---|---|
| ChatGPT | "+" menu, 220 × 277, radius 16 | `0 8px 12px` rgba(0,0,0,.08) | `0 0 1px` rgba(0,0,0,.62) (a shadow edge) |
| ChatGPT | Tooltip, radius 10 | none | 1px white 12% on oklch(0.159) |
| ChatGPT | Composer, radius 28 | `0 0 0 1px` 4%, `0 2px 8px` 4%, `0 4px 80px 8px` 2.4% | 1px black 10% |
| ChatGPT | Dialog, radius 20 (in the DOM, closed) | `0 24px 64px` 22%, `0 4px 16px` 12% | none |
| ChatGPT dark | Menu | `0 8px 16px` black 32%, inset `0 0 1px` white 20% | as light |
| ChatGPT dark | Composer | inset `0 0 1px` white 20% only | 1px white 15% |
| Notion | Page at rest | none on any element | — |
| Notion | "More actions" popover, 210 × 73, radius 10 | `0 20px 24px` rgba(25,25,25,.05), `0 5px 8px` .027 | ring 1px rgba(42,28,0,.07) |
| Notion | Small floating chip, 52 × 28, radius 6 | `0 8px 12px` .027, `0 2px 6px` .027 | same ring |
| Notion | Search dialog, radius 20 | `0 24px 48px` .24, `0 4px 12px` .14 | same ring |
| Notion dark | Popover | `0 14px 28px -6px` .2, `0 2px 4px -1px` .118 | ring #383836 |
| Notion dark | Small chip | `0 4px 12px -2px` rgba(25,25,25,.08) | ring #383836 |
| Notion dark | Search dialog | `0 24px 48px` .64, `0 4px 12px` .56 | ring #383836 |
| Cursor | `--cursor-box-shadow-sm` | `0 2px 8px` widget shadow at 60% | 1px widget border |

The 2026-09 baseline (BASELINE.md, "Shadow by elevation") recorded the same Notion popover and a
ChatGPT menu of `0 8px 16px -4px` at 12% with a 0.5px 10% ring.

## Reading

- Nothing rests on a shadow: Notion draws none at rest, ChatGPT none at rest except its composer.
- Tooltips need none: ChatGPT's has only an edge.
- Floating surfaces vary from ChatGPT's 8% to Notion's 5% / 2.7%. The lightest real lift is Notion's
  small floating chip, 2.7% on two short layers. With a firmer edge it is enough to say "on top".
- The edge carries separation: Notion's 7% ring and ChatGPT's shadow-drawn hairline are what read
  first. Area's floating edge was #f3f3f3 (decorative), lighter than either; it steps to #eeeeee,
  the nearest rung to Notion's ring over white (#efeeec).
- Dark: on a near-black page a shadow barely shows (ChatGPT's dark composer draws none); the edge
  (#4b4b4b, ChatGPT's 20% white hairline) does the work. One 8% layer, Notion's dark chip.

## Decision

- `shadow-card` (resting lift): `none` at Outlined, the default. Panel and Board card join Card on it.
- `shadow-float`: `0 8px 12px light-dark(rgb(25 25 25 / .027), rgb(25 25 25 / .08)), 0 2px 6px
  light-dark(rgb(25 25 25 / .027), transparent)` at Outlined. The floating Toolbar joins it, with the
  floating edge in both themes.
- Tooltip: no drop shadow; dark keeps its 5% white inner edge.
- `border-float` light: neutral 75 → 100.
- Raised and Elevated keep the previous recipes; Flat stays at none; `shadow-1` (thumb contact) and
  the colour picker's thumb lift (needed on a gradient) are unchanged.
