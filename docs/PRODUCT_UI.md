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
2. **Hover and press change one thing: the plate, the edge or the lift.** Ink, size and position never
   move. Rows change their plate; cards and tiles lift (owner, 2026-10-18: no edge change, a soft shadow that fades in,
   `docs/research/card-hover-2026-10-18.md`), and step their edge only at Elevation 0, where there is no shadow;
   painted things (swatches, ramp steps) change a ring in their own ink.
3. **Each state is one step firmer than the last**: rest → hover → selected → press, and
   selected survives hover. A press is the firmest, momentary step, so every click shows (owner,
   2026-10-16: "make sure the build quality is real"; Notion presses at twice its hover, ChatGPT
   more than twice).
   - Rows (Nav, Menu, Tree view, interactive Table, List box, Pagination): `bg-component-hover` →
     `bg-component-active` selected / current → `bg-component-pressed` held.
   - Tiles and cards (Area's Asset card, `docs/specs/asset-card.md`): no shadow at rest → the lift shadow fading in on
     `fast` (hover) → dropped at once (held) → the edge in `stroke-selected`, one line (selected); the edge
     (`neutral-100`, 750 in dark) stays, and steps to `edge-control-hover` only at Elevation 0 (owner, 2026-10-18). A tile stands alone like a Card, so it is never
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
      heading share one line, every region 14 in on all sides. A bar's controls are evenly inset
      instead (owner, 2026-10-18: "these controls are not evenly inset, theres too much space horizontally"): the
      Titlebar's, the Canvas header's and the Inspector's view pills sit as far from the side as from the top and the
      rule, 7 at the app's scale, 24 tall (Figma's panel tabs: 8 and 8).
    - The header, at its end, in this order: filters, Sort and group, how things are drawn (zoom,
      style, size), and the grid / list switch. Zoom is Zoom control's stepper (− Auto +, plates 2 apart): Auto, the default, shows
      specimens by size group, each group at most at one scale and never above 100% (by painted area: a control 90%,
      a field or small list 85%, a few rows or a dialog 80%, the largest, Code block, Board, Color picker, Command
      palette, Panel, 75%), shrunk further only to fit; Fit shows each specimen as large as its card allows, up to 200%;
      then 50, 75, 80, 90, 100, 110, 125, 150, 175 and 200% exactly, tiles growing with the zoom. − and + step through
      the percentages, from 100% when on Auto or Fit; the menu lists Auto, Fit and the percentages, nothing else
      (owner, 2026-10-14; 2026-10-18).
    - Components' All shows one tile per family, its default specimen; a family's variants are its
      own Canvas. Specimens sit in square cards at least 360 wide (owner, 2026-10-18), after Compass's gallery: the specimen 24 in, the
      title (the app's text, strong) and a Copy code button at the frame's top, cards 12 apart. Every tab's tiles are
      Asset cards, always square, the name, a value and controls in the frame's first row (owner, 2026-10-19, a trial;
      under the frame 2026-10-18, when the Compact hairline contact sheet went). Language lists the Inspector's own
      settings (src/gallery/controls.ts), its cards at least 200 wide, each setting one real component with real text,
      the one thing it changes (src/abstract.tsx; owner, 2026-10-19: "simple, and easy to recognize"), at its default
      size, scaled down (never up, at most 0.8x) to a share of the card, one scale for every preset of a setting so they compare;
      Type is the ramp of roles with their sizes; Ground and Layers are windows whose card frame stays put. The page previews
      one theme, Light by default, with a Light / Dark switch in the Canvas bar; every setting follows it, and the
      per-theme settings (ground, layers) show the previewed theme's own. A
      click on an All card opens its family's Stage (owner, 2026-10-14). A family's page is Area Tabs (owner,
      2026-10-18, `src/family-tabs.tsx`): Overview (the Stage, its code as a separate Code block under the frame, then
      the tiles), Documentation, API, Code and Spec. Information is tables wherever it can be (facts, props, classes,
      states, keys, ARIA, a spec's tables and its dated lists); prose stays prose only where it has no rows. Properties
      stay in the Inspector, on Overview only. A control that does not apply to the current view
      is left out; the order of the rest never changes. Fields in the app's chrome and Inspector
      are `soft` (filled), a set is a multi-select Custom select, and dropdown windows hug their
      rows (`--area-menu-min-inline-size`).
    - The Inspector, without a title, in three views chosen by pills in its bar (owner, 2026-10-18: "a figma style
      panel based on dev mode and the standard design panel … separate the current inspector to themes, design, and
      code"; `src/studio.tsx`, InspectorPanel): **Language** (Theme until 2026-10-19: the tab and the Inspector use one
      word), **Design**, **Code**, the Titlebar's Nav pills (Figma's
      Design | Prototype), the bar on the line the Canvas header shares. The chosen view holds across tabs and
      launches; a tab with nothing for a view leaves its pill out (Brand and the Materials lab have no Code). A fourth,
      **Chat**, is the app's rather than a tab's, so every tab offers it (`src/chat/chat.tsx`; owner, 2026-10-18): its
      transcript is the Panel's body, followed to the newest line while the reader is at the end, and its composer the
      Panel's footer with no rule above it; ⌘L opens it and focuses the composer, Esc stops a reply. Its head holds the
      conversation's title and New chat (the bar has no room beside four pills at 256).
      - Language: the Canvas settings under the registry's headings (`SETTING_GROUPS`: Color; Size: type, density;
        Shape: radius, pills; Stroke; Shadow; Effects; then Material), only those that change this tab's specimens.
      - Design: what is chosen, at its narrowest: a Canvas item, else the Sidebar's row, else the tab's overview. The
        tab's own display settings first (Display: Typography's sample text), then a component's Properties, then the
        chosen thing's preview (unless the Canvas already shows it at size) and its actions, then one flush facts Table:
        what it is and its values, status, purpose, source.
      - Code: how to use it, as Dev Mode: copy actions two to a row, then the import and the code in code wells (Code
        block `sm`, lines scrolling sideways), then facts Tables for how to reach it (name, token, class and its
        modifiers, attribute). A component on the Stage also gets its measured box (Box model, as Dev Mode's Layer
        properties) and its computed paint (type, ink, fill, edge, shadow, colours as hex), re-measured when a setting
        changes (`src/specimen-box.tsx`).
    - Nothing is chosen until the person chooses it: a tab opens on its overview, and the
      choice clears when the Sidebar's row changes.

## Open component gaps

Recorded, not yet built (each needs its own component pass). From the app audit of 2026-10-12:

None open: all built 2026-10-15 (Copy button, List box, Hover card `openOnFocus`, Table cells, Badge `onColor`,
Nav `revealActions`, Context menu `itemSelector`, Card selected, Titlebar and Section heading). Record new ones here.

