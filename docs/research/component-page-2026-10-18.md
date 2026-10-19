# Component page: tabs and tables (2026-10-18)

Owner: "i like the information that reactbits provides and i like how its organized into tables ... refine the
experience of clicking into a component, showing the component large, showing its variants in context, and showing all
information about the component, any and all data, code associated with it." Then: controls stay in the Inspector,
variants stay one tile per value, "tabs, but make sure one of the tabs is documentation", Button first; "make sure the
info is organized into tables ... the code is separated from the bottom of the frame of the main component container".

## Read (built-in browser, 1440 wide)

| Source | What it shows | Taken |
|---|---|---|
| React Bits, Jelly Radio (reactbits.dev/micro/jelly-radio) | Preview / Code toggle; a Customize grid of 3 columns under the preview; Props table (property, type, default, description); dependencies; related components; previous / next | the Props table's Description column, from the source |
| Astryx, Button (astryx.atmeta.com/components/Button) | Overview / Properties / Accessibility tabs; Usage; Anatomy table (element, description); Do / Don't table; one example card per idea with Description / Code; contrast requirements table per state | tabs; Anatomy with descriptions; Best practices as a Do / Don't table; Accessibility as tables |
| Astryx, Components (astryx.atmeta.com/components) | One card per family under category headings | already Area's All grid |
| tweakcn (tweakcn.com/editor/theme) | Grouped settings beside previews of whole screens (Cards, Dashboard); a Code dialog | not taken here; screens in context are the Testing tab's |

## Built

- `apps/desktop/src/family-tabs.tsx`: Documentation, API, Code and Spec, all tables where the data has rows.
  A small markdown reader renders a spec with Area components: its tables as Tables, a mostly dated list (Owner
  decisions, Feedback log) as a Date / Entry table, code fences as Code blocks.
- `apps/desktop/scripts/sources.mjs` (`virtual:component-sources`): every spec, stylesheet, React source and `*Props`
  JSDoc, read at build time.
- `apps/desktop/src/content/documentation.mjs`: Button's use-instead, Do / Don't, part, state, keyboard and ARIA rows,
  each restating its spec section.
- The Stage's code is its own framed Code block, 12 under the Stage (it was the frame's last row).
- Tables on the Canvas sit in Area's Scroll area: a flush Table draws past its box (its row plates), so a wide
  evidence table scrolled the whole Canvas.

## Open

- Documentation content exists for Button only; other families show what their manifest and spec already hold.
- Paragraph and list spacing in the Spec tab is app CSS (`.studio-doc`). A Prose component would own it in the
  system; not built (no owner request).
- Variants in context (tweakcn's screens) are not on the family page; the Testing tab's screens could link back.
