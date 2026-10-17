# Interaction polish, 2026-10-16

Owner: "the components dont feel super polished when using, clicking, hovering, etc. can you make sure the build
quality is real, professional. look at how notion and chatgpt make their components look and feel more real". Then:
"can you clean up and fix the underline on the link component, it doesnt look clean".

## What the products do (measured 2026-10-16, Claude in Chrome, read-only)

Timing was already right. Area's hover lands at once and fades out over 100ms. ChatGPT's rows are instant both ways;
its icon buttons fade a `::before` plate over 150ms `ease`. Notion's rows take 20ms and its buttons 100ms. The gap was
in what a press and a click show.

| | ChatGPT (web app) | Notion (web app) | Area before |
|---|---|---|---|
| ghost / row hover | 5% black (`--color-background-primary-ghost-hover`) | 5% of its warm black, `rgb(33 27 23 / 0.05)` (86 buttons, 16 tree rows, tabs, links) | `bg-component-hover`, L 0.964 (#f3) |
| ghost / row pressed | 12% black (`…-ghost-active`) | **10%**, twice the hover, on every button and row | `bg-component-active`, L 0.949 (#ee): 1.5% below hover |
| selected row | — | 5%, the hover's fill (selected tree row) | `bg-component-active`, the pressed fill |
| solid button | #0d → hover #30 → pressed #41 | — | #28 → hover #1d → pressed #1d (no step) |
| soft button | 12% → 16% alpha | — | 247 + 5% wash → 6.7% wash |
| `user-select` on controls | `none` on all 66 buttons and links | `none` on every button, row, tab and link | text selectable in Menu, Nav, Tabs, Segmented, Calendar, List box, Tree view, Accordion, Select triggers and 15 more |
| `cursor` | `pointer` on every control | `pointer` on every control | `pointer`, except Tree view's rows (`default`, a Figma choice, kept) |
| press scale | the Apps SDK Button has a `--scale` hook on its plate; unset in the product | none | none |

## What the sweep found

`docs/research/layers-2026-10-16/sweep/states.mjs` read the element, its parent and its grandparent. The copy used here
also reads every descendant and `::before` / `::after` (backgrounds, background images, edges, shadows, opacity, ink),
because Tabs, Breadcrumb, Stepper and Accordion paint their plates there. It also flags a press that paints the same as
the hover. Light 100 + 4, every family:

- **No press past hover:** solid Button (every family that uses it: Dialog, Drawer, Popover, Card, Composer and
  others), Segmented (and the Toolbar, Panel and Color picker that use it), Chip (filter, input and remove), Tag remove,
  Badge dismiss and the interactive Badge, Calendar days, Breadcrumb, Board cards, Command palette hints.
- **A press that never showed:** Prompt suggestions. The row's hover rule (`row:hover > item`) outranks `item:active`.
- **Pressed equal to selected everywhere else:** Menu, Nav, Tree view, Table, List box, Pagination, Stepper, Toggletip,
  Citation, field action buttons, Number field steppers, Token row, and neutral ghost and outline Buttons.
- **False positives, checked by hand:** Switch (its hover lights the track and its press stretches the thumb, on
  siblings of the input); fields (Input, Textarea, Select, Custom select and Date picker triggers focus rather than
  press, as native fields do); link-style text buttons (Code block line numbers and toggle, Description list "Show
  more", which underline as Link does).

## What changed

- **`bg-component-pressed`** (`packages/styles/src/layers.css`): the selected fill moved toward the ink, 3% in light
  and 7% in dark. At the defaults: light hover 0.964 → selected 0.949 → pressed 0.929 (Notion's #e9); dark 0.246 →
  0.292 → 0.338, the dark model's equal steps. It is restated on every ground that restates the fills, so it follows
  Layers, grounds and the neutral cast.
- **The bound.** The pressed fill never goes past the lightness at which the muted ink keeps 4.6:1, the model's text
  target, the bound its inks are already solved to on the selected fill. At the defaults it is far away. At dark 24 + 8
  the uncapped press left body ink at 4.27:1, so there the press stops at the bound.
- **`bg-pressed`**: the translucent twin. Light 10% black, Notion's press (hover 5%, selected 6.7%). Dark 19% white,
  the selected wash, a step past the 14% hover. A translucent plate can't be bounded by its ink, and 24% left muted day
  numbers at 4.43:1 at dark 24 + 8.
- **Rows and plates** press with `bg-component-pressed` (or `bg-pressed` on unknown grounds): Menu, Nav, Tree view,
  Table, List box grid, Pagination, Stepper, Toggletip, Citation, Token row, Command palette hints, Breadcrumb, Prompt
  suggestions, field and Number field buttons, neutral ghost and outline Buttons, Calendar's circle days. Segmented
  items and Calendar days press with `bg-pressed`; Accordion's chevron plate moved from 6.7% to Notion's 10%, as its
  spec comment already said. Board's add button went from 9% to 12% of a coloured column's colour.
- **Solid Button** gets a pressed step past hover in the same direction. Neutral goes 18% toward black in light
  (#1d → about #15) and to white in dark (#fa → #fff); the accent and every tone go 10% toward black. Neutral soft's
  press wash is now `bg-pressed`.
- **Chip** presses at `bg-component-pressed` (filter, assist), at 15.4% (the input chip's mark: 6%, 10.7%, 15.4%), or
  at `danger-surface-active` (invalid). A selected chip keeps its plate. Chip, Tag and Badge removes press at 20% of
  their ink (hover 12%). An interactive Badge lays the hover wash once more over its hover fill. Board cards press at
  `bg-component-active`, or 9% of the column's colour.
- **Two presses that never showed**, both because a hover rule outranked the press rule: Prompt suggestions
  (`row:hover > item`) and Nav rows with actions, as in the app's Sidebar (`row:has(…):hover`). Both presses are
  restated with enough weight.
- **Contrast on the firmer press** (the sweep's text check, light 100 + 4):
  - Menu's danger red came out 4.32:1 on the pressed row. It is now solved at the pressed fill's lightness instead of
    the selected fill's.
  - Muted labels on a press over a gray track came out 4.26:1 (Segmented) and 4.3:1 (Board's add button). In light those
    two press at 7.5% black, as firm as the muted label allows (4.53:1).
  - At dark 24 + 8, where the dark ground is lightest and layers are farthest apart, three dark presses were trimmed to
    the largest step that holds: Segmented 16.5% white, the input Chip 24%, a tinted Board card 7% of its colour.
- **After:** no text under 4.5:1 in any hover or pressed state at light 100 + 4, light 90 + 8, dark 8 + 4 or dark 24 + 8.
  That covers the 30 changed families; every family was swept at light 100 + 4 and dark 8 + 4.
- **`user-select: none`** on every control's base rule. Fields, prose links and editable text are unchanged.
- **Link's underline** sits at 0.25em, clear of descenders (`docs/specs/link.md`, "Underline clears descenders"). So do
  the peers that draw Link's line, and the app's section-title links.

## App responsiveness

Opening the Components tab blocked the main thread for 340 to 380ms in a production build (headless Edge, CPU profile).
About 270ms of that was `fitTiles` (`apps/desktop/src/gallery/fit.ts`). For each of about 90 tiles it wrote a width and
then read layout (`contentWidth` sets `max-content`, measures and restores; `truncates` reads every node's
`scrollWidth`), which forced a full layout of the canvas several times per tile. The first fit now runs in phases:
every tile's write, then every tile's read. Fit takes 29ms, and the switch blocks for 170 to 180ms; the rest is React
and the first layout of 94 live specimens. Every tile's width and group are identical; zoom differs only in the third
decimal, which also varies between two runs of the old build.

Clicks and arrow keys in the Icons and Color grids respond within two frames, with no long tasks. Color's 260ms tab
switch is the first layout of about 345 colour cards; it is not changed here.
