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
   menu in the view's bar, after its filters (rule 14); its rows keep the menu open (`MenuItem keepOpen`), the
   choice persists across launches, and Reset appears only once something changed. The Sidebar
   and the Canvas use the same order. Menus of commands close on a choice.
8. **Pinning is personal and additive.** Pinned items appear in a Pinned group first and stay
   in their own group too; pin from the Inspector heading (a toggle, rule 6) or a context menu.
   Only long lists pin (Components 85, Icons 808); a Sidebar of a dozen rows (settings, roles,
   scales) needs no shortcut (owner, 2026-10-12).
9. **Counts:** a count beside a title is muted tabular text; a count at the end of a row is
   `Count`. The Sidebar's All row counts what the tab holds; the Canvas draws no count of its own
   (owner, 2026-10-14: no titles over the Canvas or the Inspector).
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
14. **The Canvas's header sets how things are shown; the Inspector, what is chosen** (owner,
    2026-10-12; 2026-10-14: no titles, as Framer and Figma, but a header, not a floating toolbar).
    - No title over the Canvas or the Inspector: the Sidebar's selected row names what the Canvas
      shows. The Canvas header's controls, the Sidebar's first row and the Inspector's first
      heading share one line, every region 14 in on all sides.
    - The header, at its end, in this order: filters, Sort and group, how things are drawn (zoom,
      style, size), and the grid / list switch. Zoom is Zoom control's stepper (− Fit +): Fit shows
      specimens by size group, each group at one scale (one row of controls and a few rows 125%,
      taller ones 100% and shrunk only to fit; fields take their card's width), and a specimen
      whose content reads narrower than its box is laid out at its content's width and a fifth
      more, where the component gives way (src/gallery/fit.ts); 50% to 200% is an
      exact zoom, tiles and the Stage growing with it (owner, 2026-10-14).
    - Components' All shows one tile per family, its default specimen; a family's variants are its
      own Canvas. Specimens sit in square cards, after Compass's gallery: the specimen 28 in, the
      title (the app's text, strong) and a Copy code button in the card's foot, cards 12 apart. A
      click on an All card opens its family's Stage (owner, 2026-10-14). A control that does not apply to the current view
      is left out; the order of the rest never changes. Fields in the app's chrome and Inspector
      are `soft` (filled), a set is a multi-select Custom select, and dropdown windows hug their
      rows (`--area-menu-min-inline-size`).
    - The Inspector, without a title: the Canvas settings under headings by what they shape (Size:
      type, density; Shape: radius, pills; then Display, the tab's own settings, such as
      Typography's sample text), only those that change this tab's specimens, then the chosen thing at its
      narrowest: a Canvas item, else the Sidebar's row, else the tab's overview. A chosen thing
      gets its preview, unless the Canvas already shows it at size, and its copy actions two to a
      row (`src/inspector.tsx`), then one flush facts Table whose rows run: name and how to reach
      it (name, token, import), values, status, purpose, source.
    - Nothing is chosen until the person chooses it: a tab opens on its overview, and the
      choice clears when the Sidebar's row changes.

## Open component gaps

Recorded, not yet built (each needs its own component pass). From the app audit of 2026-10-12:

None open: all built 2026-10-15 (Copy button, List box, Hover card `openOnFocus`, Table cells, Badge `onColor`,
Nav `revealActions`, Context menu `itemSelector`, Card selected, Titlebar and Section heading). Record new ones here.

