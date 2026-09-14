# Area — working conventions

Area is a design system tuned along eight axes. Read this before changing anything in
`packages/`.

## The invariants

These are not preferences. Each one is enforced by a check that fails the build, and each
was arrived at by a specific failure — breaking one silently reintroduces that failure.

**Axes own disjoint custom-property namespaces.** No two axes may write the same property.
`packages/tokens/src/axes/registry.ts` throws otherwise. This is the only reason eight axes
are testable: it reduces ~10,000 combinations to eight independent checks. Where axes
genuinely interact — radius depends on control height — the dependent axis emits a unitless
multiplier and the relationship is written once, in `calc()`, in `emit/base.ts`.

**Derived tokens are never `@property`-registered.** A registered `<length>` computes at its
declaration site, so `--area-radius-control` would freeze at `:root`'s value and stop
responding to a nested `data-area-density`. The height changes, the radius does not, and
nothing in the source looks wrong. Register leaf tokens only.

**Derived tokens are re-emitted on every axis-bearing element.** A custom property is
substituted where it is declared and then inherits already-resolved, so a derivation on
`:root` bakes in `:root`'s inputs. The `[data-area-density], [data-area-radius], ...`
selector block in `emit/css.ts` is what makes subtree scoping correct.

**Every number in component CSS traces to a token.** A literal pixel value is a bug unless
it is a hairline (`1px`) or a mask geometry. If a value is not on a ramp, derive it with
`calc()` from values that are — or change the ramp.

**Contrast is a build gate.** `packages/tokens/src/contrast/` asserts every pairing a
component can render, across all 144 shipped themes, under WCAG 2.2 always and APCA as a
hard gate in dark themes. To change a colour, change `LEVELS` or `INVERSION` in
`color/curves.ts` and let the gate tell you what broke; `contrast/report.ts` groups
failures by assertion rather than printing them one theme at a time.

**The CSS and the React API cannot drift.** Both derive from `packages/styles/src/manifest.ts`.
`check-manifest-parity.mjs` fails if a declared variant has no selector, or a selector
exists that was never declared. Add the manifest entry in the same commit as the CSS.

**Documentation cannot lie.** Every docs preview is the real component rendered with
`react-dom/server`; every snippet is that demo's own source text. Never hand-write a code
sample.

**The documentation is built from the system.** `apps/docs/scripts/check-dogfood.mjs`
fails the build on a raw length, colour or font size in the docs stylesheet, and on any
inline style carrying a literal beyond a demo's own framing width. Five site-layout values
are allowlisted by name, each with a stated reason. If the docs need something the system
does not have, add it to the system.

**Docs CSS must never target an `.area-*` class.** `DOCS_CSS` lives in `area.base`, which
the cascade resolves *before* `area.components` — so such a rule silently does nothing.
The audit catches it. The fix is always a documented variant on the component
(`--inline`, `--flush`, `--wrap`), never an override.

## Component CSS shape

Follow `packages/styles/src/components/button.css`. Three rules:

- A variant sets local `--_*` properties. The base rule is the only place that consumes
  them, so a variant is three lines and a new tone is a copy-paste.
- A size tier sets nothing but tier tokens, all of which come from the density axis. No
  size block should ever contain a pixel value.
- Foreground does not change on hover — only background and border. A label that shifts
  colour under the cursor reads as a different control, and it makes contrast
  unverifiable, because the pair being measured stops being the pair being rendered.

State goes on `data-*` attributes, not classes, so the CSS works with plain HTML and with
headless primitives unchanged.

## Type

Weight is orthogonal to role. A role sets size, leading and tracking; it never sets
weight. That is what makes large text at a regular weight possible — a 20px paragraph
rather than a 20px heading — which a ramp with weight baked into the role cannot express.

Two weights only: regular 400, strong **500**, in every preset. Material's `emphasized`
scale is the same idea with a second full ramp instead of one token, and it is a uniform
one-step increase on the variable weight axis: 400→500 for large roles.

Strong was 550 on Geist and 600 on the system preset. Both read as heavier than the
contrast this system wants — the whole point of the two-weight rule is a *soft* step, and
550 against 400 is already most of the way to a semibold at UI sizes. 500 is also the one
value every platform font actually ships, so the variable and non-variable presets stop
disagreeing about what "strong" means.

Names are relative (xs..xl), unlike spacing and radius, because the type axis rescales the
whole ramp — `--area-text-14` would become a lie the moment someone picked the compact
preset. Spacing does not rescale, so there the pixel value is the honest name.

## Density

Two presets, each calibrated to a real product. **Default** puts medium at 32px, which
Primer, OpenAI and Vercel all agree on. **Compact** puts it at 28px, which is Notion's
measured in-app row height.

**The type steps down with the box.** Each compact tier sits exactly one stop below its
default counterpart on the size ramp, so medium goes 14px to 13px — the UI font size
VS Code, Cursor and Linear all ship. The two references disagree: VS Code's density layer
has zero `font-size` declarations because its base is already 13px, while Ant Design,
starting from 14, drops a step. Area starts at 14 and follows Ant Design.

**Chrome follows the density; content does not.** `--area-ui-size` / `--area-ui-leading`
carry the medium tier's type to anything scanned rather than read — tables, menu items,
field labels. Prose stays on the typography axis at 16px. That is Notion's split between
its 14px interface and its 16px documents. A component that renders UI chrome should use
`--area-ui-*`, not `--area-text-*`.

Control tiers point straight at the primitive size ramp rather than through a composite,
because the chrome scale needs a 13px step the content ramp deliberately does not carry.

Icon sizes are 12, 16 or 24 and nothing else. VS Code's design-token linter permits
exactly {16, 12} and comments that "a codicon at 13/14/15px is always a mistake for 12 or
16"; Octicons says the same with 24 for the large tier. Gap follows the tier: Primer ties
4px to xsmall and small, 8px to medium and large, with 6px as the step between.

**Radius presets are named by the button's own radius.** `data-area-radius="8"`, not
`="default"`. The old `sharp / subtle / default / rounded / soft` ladder needed a lookup
table to read and never said which of two names was rounder; every other primitive ramp in
Area is named by its value, and this is no different. Steps are 2px apart — the smallest
difference that reads on a 32px control — and the low end carries 0, 2 and 4 where it used
to carry two names. Within a preset every semantic radius is distinct; at `0` they are all
0, which is the point of that preset rather than a gap in it.

**A radius is capped against the box it lands on.** `--area-radius-cap` is a unitless 0.4
(0.5 at the pill preset) and every control-height radius reads
`min(radius, calc(height * cap))`. A radius is an absolute length and a control is not: the
browser clamps `border-radius` to half the shorter side, so the same 12px is a gentle round
at 48px and a pill at 20px. Measured before the cap, presets 10, 12 and pill all painted the
same 10px pill on a compact extra-small control — three choices, one result.

The cap does not make every preset distinct on every box, and nothing can short of scaling
radius with height, which this system deliberately does not do. What it does is bound the
failure: where a box is too small to tell 10 from 12, both render as the same rounded
rectangle rather than as the same lozenge. `pill` stays the one preset that reaches half.

**Concentric derivations are guarded at both ends.** `max(0px, outer - inset)` because the
sharp preset makes the subtraction negative, and the cap because the pill preset makes it
larger than the row can carry — which used to leave a "pill" menu whose items were the only
rectangles in it.

**`--area-radius-full` does not follow the axis, on purpose.** Every use is either
shape-defining — a radio that is not a circle is a checkbox, a switch that is not a pill is
not a switch, and the same goes for the status dot, the spinner and the selection rail — or
an explicit opt-in (`--pill`, `--circle`). An avatar wanting corners asks for
`.area-avatar--square`, which does follow the axis.

Radius has four semantic steps, not three. `row` sits between `control` and `container` for
a full-width backplate — a sidebar item, a table-of-contents entry, a nav link — because a
row has a control's height and a container's width and neither of the others fits it.

Radius does *not* move with density. An earlier version derived it as a proportion of
control height, which quietly made a compact button 5px — but Primer at 32, Vercel at 32,
Linear at 32 and Notion at 28 all ship exactly 6px. Radius is owned entirely by the radius
axis, flat at every tier. Area's default is one step rounder than that group at 8px, which
is shadcn/ui's number; the 6px preset is still there for anyone who wants the Primer look.

## Tones

Eight: neutral, accent, info, success, warning, caution, danger, discovery. `neutral` is not
a brand colour — a near-black button is the strongest call to action a neutral palette can
make, and it stays strongest whatever the accent axis is set to.

There were nine. `primary` and `secondary` shipped one rung apart, near-black against
near-black, which delivered none of the distinction the names promised. OpenAI separates
them properly — `primary-solid` is gray-900, `secondary-solid` is gray-500 carrying white —
but their *soft* variants are literally the same tokens, so the real difference is one fill
plus the strength of an outline's label. Area already spans that on the variant axis.
**Emphasis is the variant's job; the tone carries meaning.** A second neutral tone
re-expressed what solid / outline / ghost already said.

A tone repoints nine slots; a variant decides which it reads. Eight tones and four variants
is twelve CSS blocks, not thirty-two, and adding a tone costs one block. Never write a
`.area-button--{tone}.area-button--{variant}` pair.

Three warm roles is more than hue separation alone can carry — danger to warning is 30
degrees, short of the 50 that keeps two tones from reading as one signal. What separates
them is where each solid lands on the ladder: red can stay saturated at L 0.55 and carry
white text, while yellow cannot be both saturated and dark, so its fill sits at L 0.90 with
black text. A danger button and a caution button differ in weight, not only in hue. That is
the cost of eight tones and it is recorded in `color/presets.ts` rather than rediscovered.

## Icons

**Fluent System Icons, generated.** `apps/docs/src/icons.tsx` and
`apps/docs/scripts/icons.generated.mjs` are both output of `gen-icons.mjs`, which reads
`@fluentui/svg-icons`. Never hand-edit either, and never hand-draw a path: add the export
name and its Fluent id to the map and re-run. Fluent's icons are *filled* paths, so they
take `fill` and never `stroke-width` — a stroke-based icon dropped in beside them will not
match at any weight. Use the 16px cut at 16px rather than scaling the 20 or 24, because they
are optically corrected per size.

## Colour

**The palette is vendored, not generated.** `packages/tokens/src/color/palette.json` is the
Stadium palette exported verbatim: 14 families x 23 rungs. `scale.ts` reads that table and
computes only what the table does not carry — the translucent twin of each rung, which
foreground each rung takes, and which rung is the solid fill. Do not "fix" a hex here. If a
colour is wrong, it is wrong in the export, and the fix is a new export.

**A rung is an ordinal, not a measurement.** Higher is darker. An earlier ladder named each
level after its own lightness and asserted it; this one cannot, because Stadium anchors to
contrast instead — each family's 500 is pinned so a label clears its wall, which means the
hues deliberately sit at different lightnesses at a shared rung (spread peaks at 0.217 at
rung 350, closing to 0.007 at the ends). Both anchors are defensible and mutually exclusive.
Contrast is the one that is externally binding, so the ramp's guarantee is now the same
guarantee the gate checks. The cost is that swapping a tone can shift a layout's weight
slightly; `scale.test.ts` measures that rather than leaving it as a claim.

**There are two solid ladders and the code must find them by measuring.** blue, indigo,
pink, purple, red and the neutrals clear AA with white at 500 — the *label* wall. cyan,
green, lime, orange, teal and yellow are pinned at 3:1 there and only reach AA at 600 — the
*glyph* wall. Those six take a dark foreground at their chromatic peak instead, because
walking them down to 600 for white arrives somewhere muddy (yellow-600 is `#936b02`).
Nothing hardcodes the split: `chooseSolid` walks from peak chroma and measures.

**Tonal strokes sit deeper than neutral ones.** `tonalBorder` is a separate `INVERSION` slot
from `border`, and that is a luminance fact rather than a preference: at a shared rung a
luminous hue carries far more luminance than a grey, so green-250 measures 1.35:1 on the
light page where neutral-250 measures 1.57. One slot for both forces a choice between an
invisible green border and a neutral border heavy enough to read as a focus ring.

**Four neutral foregrounds, not five.** `fg-default`, `fg-muted`, `fg-placeholder`,
`fg-disabled`. There was a fifth, `fg-subtle`, sitting one rung from muted and one from
placeholder — which put three tokens inside a 1.9:1 band on the light page (3.63, 4.48,
5.50) and earned the middle one 0.85:1 of separation from its neighbour. Everything that
used it wanted "quieter than body copy", which is what muted already means.

**Accent defaults to indigo, not blue.** `info` is pinned to blue, so an accent that also
defaulted to blue made the axis look like it did nothing. OpenAI never has this problem
because they have no accent hue at all: their brand is the neutral near-black button and
blue is reserved for info, links and the focus ring. The separation indigo buys is real but
modest — 17 degrees and an OKLab distance of 0.068, about three and a half JND. Purple
separates twice as well and is already `discovery`, so taking it would move the collision
rather than remove it.

**Syntax highlighting is pinned to level 500 in light themes.** The code block is white, and
white is exactly what the palette pins 500 against, so red, purple, blue and the default
indigo all clear AA there on their own. What remains waived is the glyph wall: green at
3.06, and whatever a consumer points the accent axis at. Both are in
`contrast/exceptions.ts` with their measured numbers, the gate still counts them, and
`report.ts` prints them in their own section rather than folding them into the pass count.
Dark themes are *not* pinned — there 500 measures APCA Lc 28–31 against a floor of 60,
which is unreadable rather than marginal, so `chooseVivid` keeps walking.

**The page is white; a code block is one rung back from it.** That is what lets the block
read as a block without a stroke doing the work. Its edge still takes `--area-border-faint`,
a fainter stroke than `border-subtle`, measured at 1.24 on the page — where Tailwind, shadcn
and Vercel all put a container edge. In dark it lands on the same rung as `border-subtle`:
near black the ladder has no room for a fainter tier that is still a tier.

**A code block has no toolbar.** Copy rides at the top right of the code itself, centred on
the first line rather than on the block, so it belongs to the code and costs no row. The one
rule worth drawing is the line where an example's rendered component ends and its source
begins — two different kinds of thing sharing a container. Customize sits on the preview it
acts on; in a shared toolbar it was equidistant from the thing it changed and the thing it
did not.

**A level is a colour, not a job.** Which rung is a background and which is a border is a
decision the semantic layer makes, per theme, in one table — `INVERSION`. Never reach for a
numbered rung from component CSS; that is what the semantic tokens are for.

**Dark mode is the same ramp read from the other end.** One set of colours per family, not
two. `--area-blue-500` is byte-identical in both themes; only the rung each slot reads
changes.

**The neutral role owns `--area-neutral-*`, so the theme axis does not emit that family.**
Stadium overloads the name — `neutral` is both its achromatic cast and the alias a consumer
writes — and Area cannot, because two axes writing one property is what `checkAxisIntegrity`
forbids. The role wins the namespace; `cool` and `warm` keep their own primitive ramps.

**The documentation's own spacing comes from the density axis.** `--docs-pad` is
`--area-gutter-sm` and `--docs-gutter` is `--area-gutter-xl`, so the site tightens with the
system it documents instead of standing still while the components inside it shrink. The
header's height is derived from them too — control plus inset twice plus the hairline — which
is what makes its padding even on all four sides rather than merely close. Beware that a
segmented control's outer height is one tier above its name: its track adds a 2px inset at
each end, so an `xs` segmented and an `sm` button are both 28px.

## Token badges

**One badge, one size, everywhere a token name appears** — and inline code is the same badge
without a swatch. A tone name written in a paragraph and the same name written in a table are
the same kind of reference; styling them differently implies a distinction that is not there.

The size is the caption step, not the UI size, and that is the point: the badge has to sit
inside 14px table chrome *and* inside 16px running prose without having been set for either.
There is deliberately no size variant — a second size is a second decision at every call site.

The swatch is a rounded square, never a circle, and its radius is concentric with the badge's:
the badge's corner less the padding it is inset by, floored at 0 for the sharp preset. Its
ring is a translucent foreground rather than a border colour, because a fixed light stroke is
invisible on a pale swatch — the one case the ring exists for.

## Documentation sections

Every foundation section is built with `tokenSection()` in `apps/docs/scripts/layout.mjs`:
a heading, one sentence, and a table/grid pair generated from **one** list of rows. The
table is how you read values and compare a column; the grid is how you judge a scale by
eye and gives each entry room to show the thing itself. Because both views read the same
row objects, they cannot describe different data.

The segmented control sits at the left, above the content. Token names render as
`.area-token` chips, with a swatch where the token resolves to a colour.

Do not hand-write a `<table>` in the docs. Use `tokenSection()`, or `table()` for a
one-off that has no useful grid form.

## Reference style

Tables, code containers and segmented controls carry the original playground's visual
language deliberately: a fully ruled grid in a clipped rounded container; a code block
with a toolbar above it on a surface one step quieter than the page; a segmented track
whose radius is `inner + inset` with an inset ring rather than a border. The shapes are
the original's, the density and tokens are the current system's.

## Concentric corners

An inner radius is its container's radius less the container's padding. Applied per
component, because the inset differs per component — a menu pads 6px, a card pads 16px, so
no single shared token is correct. This is why a menu item is 6px inside a 12px panel,
which is where OpenAI (12 − 6) and Notion (10 − 4) both independently land.

## Verifying

```
npm test -w @area/tokens          # colour maths, gamut mapper, scales, contrast gate
npm run build                     # axis integrity, tokens, styles, parity
npm run lint:manifest -w @area/styles
npm run dev -w @area/docs         # docs at http://localhost:4321
node packages/tokens/src/color/preview.ts light   # ANSI swatches, for tuning curves
node packages/tokens/src/contrast/report.ts       # gate failures grouped by assertion
```

`packages/tokens/dist/fixture/axes.html` exposes `window.areaSweep()`, which flips every
preset of every axis and returns the computed values. That is how axis orthogonality is
checked in a real browser.

## What is not here

The previous system (`index.html`, `figma-sync.js`) is superseded. Its design rationale is
preserved in git at commit `c35ac15`. Figma sync was dropped deliberately.
