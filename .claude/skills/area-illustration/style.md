# The style

## Four drawings (`engine/abstract.css`)

**Line is the house style** (owner, 2026-11-04, after cosmetic product line art; measured in
`docs/research/illustrations-2026-11-04`): one ink (`--area-fg-muted`), one line exactly 1px on screen, no fills or
shadows. `engine/line.js` reads the components as Area paints them and marks each part: an edge stays an edge; a part
drawn only by a fill or shadow becomes its outline; a control-sized strong fill keeps a 14% tone of the ink; a dot (8px
or less) is solid ink; a picture is its box with a cross. A word is one rule its own width at the x-height's middle; a
heading's word is its cap height outlined. A sheet (the Illustrations page) lines parts up on one baseline with numbered
names and measured dimension lines. Bars, Real and Shapes below stay, to compare.

Line's choices are eight independent axes set on the stage (`data-af-stroke`, `-ink`, `-fill`, `-shadow`, `-text`,
`-detail`, `-pic`, `-accent`; abstract.css lists their values). A style is a value on each (the Illustrations page's
`STYLES`); line.js records what each part painted (`--af-c` its colour, `--af-k` how far it stood from the ground,
`--af-sh` its shadow, `af-raise` a raised layer), so an axis gives paint back without measuring again. All straight on.

| | Words | Buttons, badges, chips, counts | Icons | Everything else |
|---|---|---|---|---|
| **Bars** | A rounded bar: the word's width, 0.7em tall (cap height), in its own colour at `--af-ink` (20%) | Their colour alone | Kept | Area's own |
| **Real** | As written | As written | Kept | Area's own |
| **Shapes** | Gone | Their colour alone | Gone | Area's own |
| **Line** | One 1px rule (headings: cap height outlined) | Outlined; a strong fill keeps a light tone | Kept, strokes at 1px | Outlines only, no fills or shadows |

The bar is a pseudo-element behind the word, whose text goes clear. So a line keeps its
real spacing, a title is darker than body text (its colour is darker), and muted text is
lighter.

## Frames and scale (`engine/stage.js`)

One scale per kind of frame, by the page's Size (S / M / L):

| Frame | True size | Scale (M) |
|---|---|---|
| Desktop screen | 1024 × 576 | 0.31 |
| iPhone screen | 390 × 844 (type 16, density 36) | 0.31 |
| Vignette, gallery tile | 480 × 360 | 0.5 |

A figure is scaled as a whole with CSS `zoom` (never a transform: zoom lays it out at its drawn size, so lines land on
whole device pixels), shadows included, and centred on what it paints (its
painted bounds, cut to what its frame shows), never on a wrapper. A gallery tile holds one specimen with wide
margins: it fills at most 60% of the frame each way (vignettes 72%), a small one growing up to 1.8× the section's
scale (vignettes 1.15×) so components come out at similar sizes, a large one shrinking. A few variants sit close
together, 12px apart in a row (avatars, chips, presence), 10px in a column (badges), 14 × 18px in a tight grid (tags;
the tabs-and-pages vignette). The badges-and-chips vignette is a full grid, 4 × 3 equal cells 24 × 28px apart. A pair
overlaps (menus).

A composition (`figures/compositions.jsx`) is 4 to 6 parts the same width (200) in two columns, 18 × 24px apart, with
nothing around them (no cells, cards or frames), showing one theme setting so it can serve as that setting's visual
(Accent, Strokes, Corners, States, Status). It fills up to 86% of its frame. Name it for the setting, not its parts. The drawer fills the right side top to
bottom; the titlebar spans its tile at a 420px window's width. A tab row shows without its panel, in one line.

Strokes draw at exactly 1px at every size, as in the product: the figure sets `--area-stroke-width` to 1.04px ÷ its
zoom (the 4% keeps the browser's floor to device pixels from halving it), and `--area-border-width` to the Stroke width
setting × 1.04 ÷ zoom, so its options draw at exactly 0, 0.5, 1, 1.5 and 2px. Parts Area draws at half a stroke
(soft fields, the panel edge) stay half.
Screens and the theme settings' screens share one staging (`stageFrame` on the page), so they match.

Images in demos are blank media blocks in the soft fill. Text is shapes, one per word, on every label (owner,
2026-10-24: buttons, tags and badges too); a number is drawn digit by digit, each a numeral-wide block 0.05em in from
its neighbours with squarer corners, its separators (: . , / %) left as space. A field's value or placeholder can't hold
spans, so `stage.js` lays the same shapes over it in the field's font, the value in its colour and the placeholder
muted.

## States

Area's own hooks first: `data-highlighted` (menu row hover), `checked`, `selected`,
`aria-current`. Otherwise the forced-state classes, each Area's own paint held still:
`st-hover` (button, nav row), `st-press` (button, menu row), `st-focus` (button),
`st-hover-field`, `st-focus-field` (fields), `st-lift` (card). The pointer goes on the
element marked `data-af-pointer`. Ghost thumbs go on a Slider marked `data-af-ghosts`
(shares of its travel, or `ease:<n>`).

## The look

At every Size, light and dark:

1. It reads like the screens: real UI, nothing redrawn; beside Real, Bars differs only in its words.
2. A shape on every word, buttons and badges included; numbers as digits; no real text left (field values are shapes).
3. One scale in each section: a button is the same size in every tile.
4. One specimen per tile, centred both ways with wide margins, sizes close across tiles; strokes visible; a few close together only where variants are the
   point; nothing cut off unless meant (the drawer's bleed, a panel running off its vignette).
5. A setting's options are told apart on its screen.
6. No broken images; dark is near black; nothing glows.
