# Product UI rules

How Area is used to build a product, adopted by the owner on 2026-10-12 from the first product
built only from Area components (the desktop gallery, `apps/desktop`). Evidence and the gap list
are in [research/product-ui-gaps-2026-10-12.md](research/product-ui-gaps-2026-10-12.md). Motion
values are [MOTION.md](MOTION.md)'s; state colours are [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)'s
"Shared state paint".

## Rules

1. **States land at once and leave on `fast`.** Hover, press, selection and focus appear
   instantly; only the leave fades (`--area-transition`, 100ms ease-out). No scale on press, no
   movement on hover, no animated theme or density change.
2. **Hover and press change one thing: the plate or the edge.** Ink, size and position never
   move. Rows change their plate; cards and tiles change their edge; painted things (swatches,
   ramp steps) change a ring in their own ink.
3. **Each state is one step firmer than the last**: rest → hover → press → selected, and
   selected survives hover and press.
   - Rows (Nav, Menu, Tree view, interactive Table): `bg-component-hover` → `bg-component-active`
     held → `bg-component-active` selected / current.
   - Tiles and cards: Card's edge (`neutral-100`, 750 in dark) → `edge-control-hover` →
     `border-hover` held → `stroke-selected` (2px). A tile stands alone like a Card, so it is never
     on `border-decorative`, which is for rules inside a surface.
   - Painted (colour cards): their one outline, the swatch picker's 10% hairline, steps to the
     card's ink at 24% → 48% held → 2px solid selected. Never a second ring.
4. **Every icon-only control names itself in an Area Tooltip**, never the browser's `title`,
   with its shortcut as `Kbd` when it has one. When the tooltip repeats the accessible name, it
   only shows (`describes={false}`), and the shortcut reaches assistive tech as
   `aria-keyshortcuts`. Menu triggers use `Menu tooltip`; icon-only Segmented options get one
   on their own.
5. **Every collection is keyboard-complete.** Tab reaches it, arrows move inside it (grids move
   in two dimensions), selection follows focus where an Inspector shows the selection, and
   Escape leaves overlays.
6. **Icon-only toggles in chrome swap outline → filled** (a shown panel, a pin) and set
   `aria-pressed`; toggles with a text label use Button's `selected` plate.
7. **Arrangement is a view option, kept per view.** Sort, direction and grouping live in one
   menu at the end of the view's bar; its rows keep the menu open (`MenuItem keepOpen`), the
   choice persists across launches, and Reset appears only once something changed. The Sidebar
   and the Canvas use the same order. Menus of commands close on a choice.
8. **Pinning is personal and additive.** Pinned items appear in a Pinned group first and stay
   in their own group too; pin from the Inspector heading (a toggle, rule 6) or a context menu.
9. **Counts:** a count beside a title is muted tabular text; a count at the end of a row is
   `Count`.
10. **Empty results:** the Sidebar keeps All and its groups; the Canvas shows one `EmptyState`
    naming the query. No inline notes in the Sidebar.
11. **Containers and surfaces.** A thing that is a composition (a component specimen, a
    setting's preview, a colour) sits in a container on a grid; a thing that is its own figure
    (an icon, a line of type) sits straight on the surface, where a frame would only add a second
    edge (owner, 2026-10-12, after Cursor's icon gallery). On the surface, sheets of cells use the
    row plates (rule 3) and hang them into the margin so the figure, not its plate, sets the
    column; lists are flush Tables (`Table flush`), and rows mixing text sizes align on their
    first baseline (`Table baseline`). Details open in a hover window (Hover card) or the Inspector.
12. **Each panel's toggle sits at its own side** of the Titlebar: the Sidebar's first, after the
    window controls; the Inspector's at the end.
13. **App CSS styles only app classes.** When a product needs a component to do something it
    cannot, fix the component (with a spec note) or record a gap; never override `.area-*`.

## Open component gaps

Recorded, not yet built (each needs its own component pass). From the app audit of 2026-10-12:

- A Copy button with "Copied" feedback (the app borrows the docs site's `CopyButton`; Typography's
  icon-only copy gives assistive tech no feedback).
- An on-colour Badge (colour cards draw their contrast badge in app CSS; `Code onColor` exists).
- Roving focus for grids and lists (every icon cell is a Tab stop); one selection semantic
  (`aria-selected` in a grid) instead of `aria-pressed`, `data-selected` and `aria-current` mixed.
- Hover card that opens on pointer only, not on every arrow-key focus in a sheet.
- Table props for its fit and numeric cells (the app writes `area-table__cell--fit` by hand).

- A selectable card or tile state on Card (the gallery's Tile carries rule 3 in app CSS).
- A two-dimensional collection (grid list with roving focus and `aria-selected`); the gallery
  uses `apps/desktop/src/grid-keys.ts`.
- Nav row actions revealed on hover and focus-within, as Board card actions are.
- A per-item context-menu target (the gallery's `PinMenu` reads `data-key` from the event).
- App-shell parts: Titlebar (drag region, traffic-light inset), a Panel-style bar for centre
  regions, and a section heading.
