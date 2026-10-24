# How app shells separate regions and treat navigation, 2026-10-23

The owner asked how products separate regions: some with container layers, some with dividers, some with a change
of colour; some navs float, others sit on a backplate. This file measures that in public app shells whose regions are
real DOM. It adds to [chatgpt-desktop.md](chatgpt-desktop.md) (the layer container), [design-systems.md](design-systems.md)
(Floating and inset layers, read from source) and [consumer-feeds.md](consumer-feeds.md) (Spotify's panels). Those
products were not re-measured.

Confidence: every value is **M**, measured live in headless Edge with `getComputedStyle` / `getBoundingClientRect`
in a clean, signed-out profile, logged out, with no cookie banner touched. Colours are computed values converted to
hex; `#rrggbb/N%` is that colour at N% alpha. Widths are 1440 × 900 unless a row says otherwise. Dark mode is
`prefers-color-scheme` emulation where the page follows it (shadcn, Catalyst, reui), or the page's own switch where it
does not (Untitled: `dark-mode` class; Mantine: `data-mantine-color-scheme`). Linear's site is dark only.

## Terms

- **Ground**: the window's own fill, under everything.
- **Rule**: a 1px border or line between two regions.
- **Ground step**: two regions meet with different fills and nothing else.
- **Layer**: a region raised off the ground, inset from the window on some sides, with a radius and an edge.
- **Floating**: a region drawn as a card with a gap on every side.
- **Backplate**: a fill behind the selected nav row.

## Region boundaries

One row per shell. Light / dark values are separated by a slash.

| Shell | Ground | Nav ↔ content | Header ↔ content | Header ↔ nav | Content ↔ side panel |
|---|---|---|---|---|---|
| shadcn `sidebar` (01, 03, 07) | content `#ffffff` / `#0a0a0a` | rule 1px `#e5e5e5` / `#ffffff` 10%, **plus** a ground step: nav `#fafafa` / `#171717` | 01, 03: rule 1px `#e5e5e5`; 07: none | header starts beside the nav; no rule | — |
| shadcn `sidebar` + right panel (15) | as above | as above | none (sticky header, `#ffffff`) | — | rule 1px `#e5e5e5` + ground step (`#fafafa` panel), panel 256 |
| shadcn `sidebar` + site header (16) | as above | as above | rule 1px `#e5e5e5` | the same rule: the header spans the window (57 tall incl. rule) above both | — |
| shadcn `floating` (04) | page `#ffffff` / `#0a0a0a` | floating card: 8 from the window on every side, radius 10, border 1px `#e5e5e5` / `#ffffff` 10%, shadow `0 1 3 0 #000/10%, 0 1 2 -1 #000/10%`, fill `#fafafa` / `#171717`; content stays on the page | none | — | — |
| shadcn `inset` (08, dashboard-01) | `#fafafa` / `#171717` (the sidebar colour) | layer: content inset 8 top, right, bottom and 0 beside the nav; radius 14; no border; shadow as floating; fill `#ffffff` / `#0a0a0a` (in dark the layer is **darker** than the ground) | rule inside the layer: 1px `#e5e5e5` / `#ffffff` 10%, header 48 | the header is in the layer; the nav is on the ground | — |
| Catalyst SidebarLayout (≥1024) | `#f4f4f5` / `#09090b` | layer: content inset 8 top, right, bottom, 0 beside the nav; radius 8; ring `0 0 0 1px` zinc-950 5% / `#ffffff` 10% + `0 1 2 0 #000/5%`; fill `#ffffff` / `#18181b` (in dark the layer is **lighter**); padding 40 | no header bar; the page heading is inside the layer | nav header and footer blocks are split from the nav list by 1px zinc-950 5% / `#ffffff` 5% rules | — |
| Linear (home mockup, dark) | frame `#101112`, 1px `#ffffff` 8% edge, radius 12, padding 8 | layer: inset 8 top, right, bottom; radius 8; fill `#ffffff` 1% over the ground; border 1px `#ffffff` 5%; shadow `0 0 0 2px #000/20%` | rule inside the layer: 1px `#ffffff` 5%, header 44 | nav on the ground, header in the layer | floating: agent panel 400 × 520, 12 inside the layer's border on right and bottom, radius 12, fill `#161718`, border 1px `#ffffff` 12%, shadow `0 2 32 0 #000/25%` |
| reui app-shell-1 | `#ffffff` / `#0a0a0a` | rule 1px `#e5e5e5` / `#ffffff` 10% + ground step: nav `#fafafa` 60% / `#171717` 60% (translucent) | none, header 48 | — | — |
| reui app-shell-2 | `#ffffff` / `#0a0a0a` | floating card 8 from the window, width 240, radius 10, border 1px `#e5e5e5` 80% / `#ffffff` 8%, shadow ring + `0 1 2 0 #000/5%`, fill `#fafafa` / `#171717` | none, header 48 with 8 top padding | — | — |
| reui solution-files-1 | `#ffffff` / `#0a0a0a` | whole app in one card, 24 from the window, radius 14, ring 1px `#0a0a0a` 10% / `#f5f5f5` 10%; inside it nav ↔ content is a rule 1px `#e5e5e5`, same fill | rule 1px `#e5e5e5`, header 59 | the header rule spans nav and content | — |
| reui solution-users-1 (frame) | page `#ffffff` / `#0a0a0a` | — | backplate frame: tint `#f5f5f5` 50% / `#262626` 50%, border 1px `#e5e5e5` / `#ffffff` 10%, radius 14, padding 3; the header (50) sits on the tint; the panel below is a card, radius 10, border 1px, fill `#ffffff` / `#171717`, 3 below the header | — | — |
| Untitled simple, dual-tier; dashboards 01, 04, 05 | `#ffffff` / `#0a0a0a` | rule only: 1px `#e5e5e5` / `#262626`; nav and content share one fill | no desktop header | — | — |
| Untitled section-dividers, subheadings; dashboards 02, 03 | `#ffffff` / `#0a0a0a` | floating card 4 from the window (276 × 892), radius 12, inset ring 1px `#e5e5e5` / `#262626` + `0 1 2 0 #000/5%`, same fill as the page | no desktop header | — | — |
| Untitled slim | `#ffffff` / `#0a0a0a` | floating rail: 4 from the window, 64 wide, radius 12, inset ring 1px | — | — | — |
| Mantine AppShell (Basic, AltLayout) | `#ffffff` / `#242424` | rule 1px `#dee2e6` / `#424242`, same fill | rule 1px `#dee2e6` / `#424242`, header 60 | Basic: the header spans the window above the nav; AltLayout: the nav runs full height and the header sits between nav and aside | rule (1px, left edge of the 300 aside); footer 60 with a top rule |

Inside content, cards repeat the region language at a smaller scale: shadcn dashboard cards radius 14, border 1px
`#e5e5e5`, `0 1 2 0 #000/5%`; Untitled dashboard tables radius 12, fill `#fafafa`, ring 1px `#e5e5e5`; Linear cards
radius 9, border 1px `#ffffff` 8%, ring 1px `#000` 20%.

## Navigation

| Shell | Where the nav sits | Width (expanded / collapsed) | Padding | Row height, radius, inset | Groups |
|---|---|---|---|---|---|
| shadcn `sidebar` | own tinted panel, docked | 256 / 48 icon rail | header, groups and footer each 8 | 32 (sub-rows 28, large 48); radius 8; inset 8 from both panel edges (full width minus 16); 4 between rows | label 32 tall, 12/500, ink 70%; 24 between the last row and the next label; sub-items hang off a 1px `#e5e5e5` rule 14 from the row edge |
| shadcn `floating` | floating card | 304 incl. the 8 gutter (card 288) | as above | as above | as above |
| shadcn `inset` | on the window ground (the ground is the sidebar colour) | 288 incl. 8 padding (dashboard-01) | as above | 32; radius 8; 8 from the column edge | as above |
| Catalyst | on the window ground, no fill | 256 | 16 | 36; radius 8; 16 from the window edge; 2 between rows; icon gap 12; text 14/500 | label 12/24/500 `#71717b` / `#9f9fa9`, 4 below; sections 32 apart; header and footer blocks split by rules |
| Linear | on the frame ground, no fill | 232 | 8 top, 16 right, 16 bottom, 8 left | 28; radius 8; padding 0 7; 2 between rows; 13/510, ink `#d0d6e0` | header row 24, 12/510 `#62666d`, 16 above; no rules |
| reui app-shell-1 | own translucent panel, docked | 256 | 8 | 32; radius 8; 8 inset; 4 apart | as shadcn |
| reui app-shell-2 | floating card | 240 card, 256 incl. gutter | 8 | 32; radius 8; 9 from the card's outer edge (8 inside its border) | as shadcn; a 1px `#e5e5e5` rule above the footer, 13 in from the card edge |
| Untitled simple / dual-tier | docked, same fill as content | 280 | 20 top, 16 sides | 36; radius 6; 16 from the panel edges; 2 apart; text 14/600 `#404040` / `#d4d4d4` | subheadings 12/700 `#737373`; or 1px `#e5e5e5` / `#262626` dividers inset 18 from the card edges |
| Untitled slim | floating rail | 64 card (68 incl. 4 gutter) | 20 top, 14 sides | 36 × 36 icons; radius 6; 2 apart | — |
| Mantine | docked, same fill, rule | 300 (aside 300) | 16 | not part of AppShell | — |

## Selection

| Shell | Selected | Hover | Notes |
|---|---|---|---|
| shadcn (all variants) | backplate `#f5f5f5` / `#262626`, radius 8, inset 8; ink `#171717` / `#fafafa`; weight 500 (top rows), 400 (sub-rows) | the same fill as selected | selected and hover differ only by weight on top rows |
| Catalyst | **indicator bar** with no fill: 2 × 20, full radius, `#09090b` / `#ffffff`, at the window edge (16 left of the row); icon ink zinc-500 → zinc-950 | backplate zinc-950 5% / `#ffffff` 5%, radius 8 | the bar slides between rows (shared layout id) |
| Linear | backplate `#ffffff` 4%, radius 8; ink and weight unchanged | `#ffffff` 2% | the only cue is the 4% plate |
| reui app-shell-1 | backplate `#141414` 5% / `#ebebeb` 5%, weight 500 | the same fill | |
| reui app-shell-2 | **raised chip**: fill `#ffffff` / `#0a0a0a` (the content colour) on the tinted card, border 1px `#e4e4e4` 60% / `#ffffff` 6%, shadow `0 1 2 0 #000/5%`, weight 500; rest ink is 80% | ink only (80% → 100%), no fill | selection uses the content surface, like a segmented control |
| Untitled | backplate `#fafafa` / `#171717`, radius 6; ink `#262626` / `#e5e5e5` (rest `#404040` / `#d4d4d4`) | slim: the same fill (`#fafafa` / `#171717`) | weight stays 600 |
| Mantine | — | — | AppShell has no rows of its own |

## Headers

| Shell | Where | Height | Separation |
|---|---|---|---|
| shadcn 01, 03 | beside the nav, on the content | 64 | rule 1px |
| shadcn 07 | beside the nav | 64; 48 when the nav collapses to the rail | none |
| shadcn 15 | sticky, beside the nav | 56 | none (fill `#ffffff` covers content under it) |
| shadcn 16 | full width above nav and content | 57 incl. rule | rule 1px |
| shadcn inset / dashboard-01 | inside the layer | 48 | rule 1px inside the layer |
| Catalyst | none at ≥1024; 60 bar on the ground below 1024 | 60 | none |
| Linear | inside the layer | 44 | rule 1px `#ffffff` 5% |
| reui app-shells | beside the nav | 48 | none |
| reui files | inside the app card, across nav and content | 59 | rule 1px |
| Untitled | none on desktop; mobile only | 56 | rule 1px `#e5e5e5` |
| Mantine | above or between the side regions | 60 | rule 1px |

## Collapse

| Shell | 1024 × 768 | 390 × 844 |
|---|---|---|
| shadcn | unchanged (breakpoint 768): the inset layer, floating card and rule all stay | the nav becomes a sheet: 288 wide, fill `#fafafa`, right rule 1px, `shadow-lg` (`0 10 15 -3 #000/10%`, …), over a `#000` 50% scrim. The inset layer goes flat: content at 0,0, no margin, no radius; header 48 with its rule |
| Catalyst | unchanged (breakpoint 1024) | ground turns `#ffffff`, the layer goes flat (no radius or ring; padding 24 per its `p-6` class), a 60 header appears; the nav opens as a floating card in a dialog: 8 from the window, 304 wide, radius 8, ring 5% + `shadow-xs`, over `#000` 30%; rows grow to 44 at 16px |
| Linear mockup | fixed 1320 frame, cropped | not applicable |
| Untitled | unchanged (breakpoint 1024); the floating card is 4 from the window | the nav hides behind a 56 header with a bottom rule |
| Mantine | unchanged | the navbar slides in full width (390) below the 60 header, no scrim |

## Patterns

1. **Five separation methods recur**, and most shells combine two:
   - **Rule only, one fill**: Untitled docked, Mantine, reui files (inside its card).
   - **Rule plus ground step**: shadcn `sidebar`, reui app-shell-1. The nav is one step off the content (`#fafafa` on
     `#ffffff`, `#171717` on `#0a0a0a`) and keeps its rule.
   - **Layer on a ground**: shadcn `inset`, Catalyst, Linear (and ChatGPT desktop, Spotify per the earlier files). The
     nav sits unfilled on the ground; the content is the raised region. No rule between nav and content.
   - **Floating nav card**: shadcn `floating`, reui app-shell-2, Untitled section dividers / slim / dashboards 02–03.
     The content stays on the window ground.
   - **Frame (backplate) around a panel**: reui frame: a tinted plate with a header on it and a bordered panel inside.
2. **The layer's gutter is 8 on three sides and 0 beside the nav** in every layered shell measured here (shadcn,
   Catalyst, Linear). ChatGPT uses 4. Floating cards use 8 (shadcn, reui) or 4 (Untitled).
3. **Layer edges are faint**: a 1px ring at 5% (Catalyst, Linear's border) or a 1–3px shadow at 5–10% (shadcn).
   Larger shadows are kept for things that float over content (Linear's panel `0 2 32` 25%, shadcn's sheet).
4. **The layer's radius is larger than the row radius**: layer 8–14, rows 6–8, cards in content 9–14.
5. **The header follows the content.** In layered shells it sits inside the layer (shadcn inset, Linear) or is
   absent (Catalyst). In docked shells it sits beside the nav with a rule (shadcn 01) or none (shadcn 07, 15). A
   full-width header above the nav is the exception (shadcn 16, Mantine Basic).
6. **Dark mode flips differently.** In shadcn inset the layer is darker than the ground (`#0a0a0a` on `#171717`), as
   in ChatGPT. Catalyst and Linear keep the layer lighter (`#18181b` on `#09090b`; 1% white over `#101112`).
7. **A tinted nav panel carries a neutral backplate one step darker** (shadcn `#f5f5f5` on `#fafafa`); **a nav on a
   ground carries either a translucent plate** (Linear 4%, Catalyst hover 5%) **or no plate at all** (Catalyst's bar).
   reui app-shell-2 inverts it: the selected row takes the content colour as a raised chip.
8. **Hover and selected share one fill** in shadcn, reui and Untitled; Linear halves it for hover (2% vs 4%);
   Catalyst separates them by kind (hover plate, selected bar).
9. **Rows**: 28 (Linear), 32 (shadcn, reui), 36 (Catalyst, Untitled), inset 8–16 from the nav edge, 2–4 apart.
   Group labels are 12px at 500–700 in muted ink, with 16–32 of space before them; rules between groups are rarer
   (Untitled dividers, Catalyst's header and footer blocks, shadcn's right panel).
10. **On a phone every layer goes flat.** The ground disappears, the content fills the window, a header appears, and
    the nav becomes a sheet or a dialog card over a 30–50% black scrim (shadcn, Catalyst) or slides in under the
    header (Mantine).

## Not measured

- **The owner's mail reference** (plain sidebar, two bordered panel cards on a grey ground) is not among reui's public
  blocks. reui's templates (Atlas, Echo, Filebox and others) are paid and show only images. The nearest public shells
  are reui's frame (solution-users-1) and files card.
- **Linear `/features`** pages: only the homepage mockup was read. It is dark only and a fixed 1320 frame, so it has
  no light mode and no collapse.
- **Catalyst StackedLayout**: the demo uses only SidebarLayout.
- **Untitled dual-tier's second tier**: the demo shows only the first tier. Hover on Untitled's wide sidebar uses
  react-aria hover state, which a forced `:hover` does not trigger; hover was read on the slim rail only.
- **Untitled subheading ink in dark** and the colour of Mantine's aside rule were not read.
- **Vercel's chatbot demo**: it creates a guest session on load, so it was skipped.
- **Inset layer in its icon-collapsed state**: dashboard-01 collapses off-canvas; sidebar-07 (docked) was used for the rail.

## Sources

All M, read 2026-10-22/23. Profile: a fresh, signed-out headless Edge profile in the session scratchpad (not kept)
(no account, no extensions folder). Scripts: the same scratchpad, `scripts-treatments/`.

| URL | Used for |
|---|---|
| `https://ui.shadcn.com/view/new-york-v4/sidebar-01` | docked sidebar, header 64 + rule, selected row (500), group labels |
| `https://ui.shadcn.com/view/new-york-v4/sidebar-03` | header rule, selected sub-row (400) |
| `https://ui.shadcn.com/view/new-york-v4/sidebar-04` | `floating` card, selected sub-row light / dark |
| `https://ui.shadcn.com/view/new-york-v4/sidebar-07` | docked fills, rule, hover, icon rail 48, header 64 → 48 |
| `https://ui.shadcn.com/view/new-york-v4/sidebar-08` | `inset` layer: ground, margins, radius, shadow |
| `https://ui.shadcn.com/view/new-york-v4/sidebar-15` | right panel rule + ground step, sticky header 56 |
| `https://ui.shadcn.com/view/new-york-v4/sidebar-16` | full-width site header |
| `https://ui.shadcn.com/view/new-york-v4/dashboard-01` | inset layer with header rule, cards, 1024, 390 sheet |
| `https://catalyst-demo.tailwindui.com` | ground, layer, indicator bar, hover plate, labels, 1024, 390 dialog |
| `https://linear.app` (hero mockup, scrolled 500) | frame, layer, header, floating panel, rows, plates |
| `https://reui.io/preview/base/app-shell-1` | translucent docked nav, selected plate |
| `https://reui.io/preview/base/app-shell-2` | floating card, raised selected chip, ink-only hover |
| `https://reui.io/preview/base/solution-files-1` | app in one card, header and nav rules |
| `https://reui.io/preview/base/solution-users-1` | tinted frame with header and inner panel |
| `https://www.untitledui.com/react/iframe/sidebar-navigation/sidebar-navigation-simple-demo` | docked rule, rows |
| `https://www.untitledui.com/react/iframe/sidebar-navigation/sidebar-navigation-dual-tier-demo` | selected plate and ink, light / dark |
| `https://www.untitledui.com/react/iframe/sidebar-navigation/sidebar-navigation-slim-demo` | floating rail, hover |
| `https://www.untitledui.com/react/iframe/sidebar-navigation/sidebar-section-dividers-demo` | floating card, dividers |
| `https://www.untitledui.com/react/iframe/sidebar-navigation/sidebar-navigation-sections-subheadings-demo` | subheadings |
| `https://www.untitledui.com/react/iframe/dashboards/dashboard-01` … `-05` | docked vs floating, no layer, 1024, 390 |
| `https://mantine.dev/app-shell/?e=BasicAppShell`, `?e=AltLayout` | rules, header 60, dark, 390 |
