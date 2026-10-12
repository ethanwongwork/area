# Area in a real product UI: gaps and proposed rules (2026-10-12)

The desktop gallery (`apps/desktop`) is the first product built only from Area components. This
records what the system did not cover while adding sorting, grouping, pinning, keyboard
movement and the hover / press pass.

**Status (2026-10-12):** the owner adopted the recommendations. The rules are now
[PRODUCT_UI.md](../PRODUCT_UI.md); gaps 1, 4, 5, 6, 11 and 12 are fixed (row pressed plates,
`MenuItem keepOpen`, `Menu tooltip`, Tooltip `describes`, icon-only Segmented tooltips, the
Typography empty state). The rest are listed there as open component gaps.

## What the app had to invent

| # | Gap | Where it showed | What the app did | Proposed fix |
|---|---|---|---|---|
| 1 | **Row components have no pressed plate.** DESIGN_SYSTEM.md ("Shared state paint") says pressed = `bg-component-active`, but Nav, Menu and Tree view only paint hover and current/selected; `:active` only zeroes the transition. | Sidebar rows, the Sort and group menu | Nothing (owner-approved components, not changed here) | Add `:active` → `bg-component-active` to Nav item, Menu item, Tree item and interactive Table rows, in one pass with spec notes |
| 2 | **No selectable card / tile.** The gallery Tile is app CSS; Card's linked hover exists, but no pressed or selected state for a card. | Every Canvas tile | Edge ladder: rest `border-decorative` → hover `edge-control-hover` (as linked Card) → press `border-hover` → selected `stroke-selected`; painted tiles use rings in their own ink (24% / 48% / 2px solid) | A "selectable surface" recipe in MOTION.md / DESIGN_SYSTEM.md, or a `Card selectable` state |
| 3 | **No 2-D collection.** Nothing gives arrow keys across a grid of items (icon sheet, swatches). | Icons, Color, Typography | `src/grid-keys.ts`: Left/Right in reading order, Up/Down to the nearest item by centre, Home/End, selection follows focus | A Grid list / Collection primitive (React Aria GridList) with roving focus and `aria-selected` |
| 4 | **Menu "stay open" is undocumented.** Radio rows close an anchored menu; the escape hatch is a `data-keep-open` attribute read in Overlays.tsx, not a MenuItem prop. | Sort and group menu | `data-keep-open=""` on each radio row | `MenuItem keepOpen` prop, and a rule: view-option menus stay open, command menus close |
| 5 | **Tooltip does not compose with a Menu trigger.** Both clone their trigger; nesting breaks. | Sort and group button | Native `title` kept on that one button | Let Menu (and Popover) take a `tooltip` prop, or make triggers composable |
| 6 | **Toggle buttons have two looks.** Button `selected` paints a plate; Cursor-style toggles (and the Titlebar) swap to a filled icon instead. | Titlebar panel toggles, Inspector pin | Filled icon + `aria-pressed`, no plate | Rule: icon-only toggles in chrome swap outline → filled; toggles with text use the plate |
| 7 | **Nav has no hover-revealed row actions.** `NavItem actions` are always visible; Notion and Cursor show them on hover/focus. | Pinning from the Sidebar | Right-click menu on the rows (`PinMenu`) | `actions` reveal on row hover / focus-within (Board card actions already do this) |
| 8 | **ContextMenu wraps one region, not items.** Menus for individual rows need the target worked out from the event. | PinMenu | `data-key` / `data-name` on rows, read in `onContextMenu` | A per-item `contextMenu` slot, or `ContextMenu` exposing its target |
| 9 | **Table has no first-baseline alignment.** Cells top-align, so a 72px example sits beside 14px tokens at their tops, not their first baselines (inset.css asks for first-line alignment). | Typography list | Not fixed (app CSS does not override `.area-*`) | `Table align="baseline"` |
| 10 | **No app-shell parts.** Titlebar height, macOS traffic-light inset, drag region, the 41px Canvas bar "rule for rule" with Panel's bar, section headings and ledes are all app CSS with hand calculations. | studio.css | Copied Panel's geometry by hand | `AppShell` / `Titlebar` / a Panel-bar export for centre regions; a Section heading part |
| 11 | **Counts look two ways.** Sidebar uses `Count`; Canvas bars and section titles use a muted tabular span. | Every tab | Left as is | Rule: a count beside a title is muted text; a count at the end of a row is `Count` |
| 12 | **Empty results look two ways.** Typography's Sidebar uses a `<p>` note; other tabs show `EmptyState` on the Canvas. | Search with no results | Left as is | Rule: one `EmptyState` on the Canvas; the Sidebar keeps All and shows no note |

## Proposed rules for product UI

1. **States land at once and leave on `fast`.** Hover, press, selection and focus are instant;
   only the leave fades (MOTION.md). No scale on press, no movement on hover, no animated theme.
2. **Hover and press change one thing: the plate or the edge.** Ink, size and position never
   move. Rows change their plate; cards and tiles change their edge; painted things change a
   ring in their own ink.
3. **Each state is one step firmer than the last**: rest → hover → press → selected, and
   selected survives hover and press.
4. **Every icon-only control has an Area Tooltip**, never the browser's `title`, with its
   shortcut as `Kbd` when it has one.
5. **Every collection is keyboard-complete**: Tab reaches it, arrows move inside it, selection
   follows focus where the Inspector shows the selection, Escape leaves overlays.
6. **Arrangement is a view option, kept per view**: sort, direction and grouping live in one
   menu at the end of the view's bar, persist across launches, and offer Reset only once changed.
   The Sidebar and the Canvas use the same order.
7. **Pinning is personal and additive**: pinned items appear in a Pinned group first and stay
   in their own group too; pin from the Inspector heading or a context menu.
8. **App CSS styles only app classes.** When a product needs a component to do something it
   cannot, that is a component gap to record here, not an override.
