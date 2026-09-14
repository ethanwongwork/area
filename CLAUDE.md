# Area — working conventions

Area is a design system tuned along eight axes. Read this before changing anything in
`packages/`.

**Resuming work: read `.claude/HANDOFF.md` first.** It is written to be the only file you
need to pick up where the last session stopped — current state, what is in flight, what is
next, and the traps that session hit. `.claude/JOURNAL.md` is a reference rather than a
briefing: reach for it when a decision looks arbitrary and the handoff does not say why.

**Ending a session: run the `checkpoint` skill** rather than letting the context compact.
Compaction keeps the shape of a session and drops the specifics, which are the expensive
part. Offer a checkpoint unprompted once a session has run long enough that context pressure
is likely — a good signal is when you have stopped being able to recall earlier decisions
without re-reading files.

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

**A size tier is the control's outer height, on every component that has one.**
`--sm` is 28px whether it is a button, an input, a select, a slider, a chip or a segmented
control. Segmented broke this for a while by naming its *item* instead, which made the
track a tier taller than its own class said -- an `xs` segmented rendered 28px beside a
24px `xs` select -- and every call site had to know the offset and pick one tier down. The
item is derived now (`--_item`), and its inset is a flat 2px because scaling it put the
`sm` and `md` items at the same 24px once the track carried the tier.

Checkbox, radio and switch are the documented exceptions: they sit on the *icon* ramp, not
the control ramp, because they are glyphs rather than boxes. At the default density that
ramp is {12, 16, 16, 16, 24}, so their `sm`, `md` and `lg` are all 16px tall and differ
only in the switch's track width.

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
not a switch, a slider handle that is not a circle reads as a segment of its own track, and
the same goes for the status dot, the spinner, the chip's swatch and the selection rail — or
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
make, and it stays strongest whatever the brand axis is set to.

There were nine, and two of them were `primary` and `secondary` in an earlier sense: both
near-black, one rung apart, delivering none of the distinction the names promised. OpenAI separates
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

**Fluent System Icons, generated, with Stadium's marks vendored beside them.**
`apps/docs/src/icons.tsx`, `apps/docs/scripts/icons.generated.mjs`,
`apps/docs/scripts/icons.catalog.mjs` and the two sprites in `apps/docs/assets` are all
output of `gen-icons.mjs`, which reads `@fluentui/svg-icons` and the vendored files in
`assets/stadium-icons`. Never hand-edit any of them and never hand-draw a path: add the
export name and its Fluent id to the map, or drop the file in the directory, and re-run.
Use the 16px cut at 16px rather than scaling the 20 or 24, because they are optically
corrected per size.

**The rule is optical weight, not fill-versus-stroke.** This used to read "a stroke-based
icon dropped in beside them will not match at any weight", which was the right warning
attached to the wrong property. Fluent's marks are filled paths and Stadium's twenty-nine
are stroked, and they match — because Stadium fitted them by measurement: a 1-unit rule at
16, round terminals, and an ink box of 12 units for a rectilinear mark or 14 for a round
one, which is where Fluent's own square and round marks land. What will not match is a mark
that skipped that fitting, stroked or filled. Stadium's inner markup is therefore vendored
verbatim, stroke attributes and all; reducing it to a path list is what would break the fit.

**The browser documents the whole set, from sprites.** 1,739 marks is 711 KB of path data in
one style, which cannot be inlined per page, so `assets/icons.svg` and
`assets/icons-filled.svg` carry the geometry and a grid cell is a `<use>` reference.
Switching style rewrites one href prefix across the grid; the two files hold the same ids
under the same names.

## Colour

**Stadium owns lightness and chroma; Area owns hue.** `packages/tokens/src/color/palette.json`
is the Stadium palette exported verbatim — 14 families x 23 rungs — and its wall-anchored L
and C are what make contrast predictable, so they are never touched. `scale.ts` reads that
table and computes what it does not carry: each rung's translucent twin, which foreground it
takes, which rung is the solid fill, and which is the family's own quietest stroke.

The one thing Area may change is hue, through `HUE_ROTATION` in `curves.ts`. A family with no
entry ships its exported hex byte for byte. Still do not edit a hex: if a lightness or a
chroma is wrong it is wrong in the export; if a hue is wrong, rotate it.

**A rotation is not free, and how expensive it is depends entirely on where the family sits
in the gamut.** −4 on red cost 0.0003 of chroma and nothing else, which is where the old
claim that rotation is "close to free" came from. +14 on green costs **0.043 of chroma** at
the peak rungs and moves L by **0.009**, because green at hue 150 sits in a wide part of
sRGB and hue 161 does not — the mapper holds what it can and gives back the rest. Measure
the cost of a rotation against `palette.json` rather than assuming it; `contrast/report.ts`
then says what the luminance change did.

**Rotations are checked against adjacent-hue separation, never copied.** Matching a reference
exactly (red +10, orange −11) would have pulled red and orange to 14 degrees apart, half the
roughly 30 that keeps danger and warning from reading as one signal. `HUE_ROTATION` is empty
today — every family ships its export unchanged. Red carried −4 degrees toward pink for a
while and was reverted; the trade to weigh if it is tried again is red-to-orange widening from
35 to 39 against red-to-pink narrowing from 20 to 16.

**Chroma is trimmed at the light end, and only there.** `CHROMA_TRIM` in `curves.ts` is the
one place Area touches chroma, and it exists because Stadium's anchor and this one answer
different questions. The export pins a rung against *white* — a statement about one family,
which says nothing about that family beside its ten siblings at the same rung. At the dark
end that does not matter, because the gamut squeezes every hue into the same narrow band. At
the light end it does: sRGB holds far more chroma in a pale green than in a pale blue, so
the families that can be bright, are. Measured at rung 150, chroma ran 0.051 (orange) to
0.138 (lime) around a mean of 0.079 — lime and green at nearly twice their peers, which is
what makes a green tint read as a wash where a blue one reads as a tint.

Three families are trimmed: **lime 0.72, green 0.78, yellow 0.88**, and the trim tapers —
full strength at rung 200 and below, gone by 400. That taper is the whole argument: the
divergence is a light-end effect, and trimming the mid rungs would take the fill and the
solid down with the tint, which are the rungs the palette anchored deliberately. L is never
touched, so no wall moves; the spread at rung 150 closes from 0.087 to 0.054 and at 200 from
0.086 to 0.049. `scale.test.ts` bounds all four light rungs, so the trim cannot be dropped
quietly — remove it and four assertions fail.

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

**Tonal strokes are computed per family, not read from a shared rung.** `quietestStroke` in
`scale.ts` walks each family to the quietest rung that still clears the stroke tier, the same
shape `chooseSolid` and `chooseVivid` use. A rung is a lightness and hues do not share a
luminance at one: at rung 400 an indigo stroke measured 3.68:1 on white against a green's
1.80 — one token, twice the weight, and the loud end two and a half times heavier than the
neutral outline beside it. Walking per family lands all eleven between 1.30 and 1.45.

**This is the inverse of the foreground rule.** A foreground wants a shared rung, because the
goal there is comparable *chroma*. A stroke wants comparable *weight*, and a shared rung
cannot deliver it.

Tonal strokes are held to the **ambient** tier, not the resting one — the same reading the
neutral outline button gets. An outline control is identified by its label and its shape; the
stroke is definition, not the affordance.

**Four neutral foregrounds, not five.** `fg-default`, `fg-muted`, `fg-placeholder`,
`fg-disabled`. There was a fifth, `fg-subtle`, sitting one rung from muted and one from
placeholder — which put three tokens inside a 1.9:1 band on the light page (3.63, 4.48,
5.50) and earned the middle one 0.85:1 of separation from its neighbour. Everything that
used it wanted "quieter than body copy", which is what muted already means.

**Brand defaults to indigo, not blue.** `info` is pinned to blue, so a brand that also
defaulted to blue made the axis look like it did nothing. OpenAI never has this problem
because they have no brand hue at all: their brand is the neutral near-black button and
blue is reserved for info, links and the focus ring. The separation indigo buys is real but
modest — 17 degrees and an OKLab distance of 0.068, about three and a half JND. Purple
separates twice as well and is already `discovery`, so taking it would move the collision
rather than remove it.

**Syntax highlighting is pinned to level 500 in light themes.** The code block is white, and
white is exactly what the palette pins 500 against, so red, purple, blue and the default
indigo all clear AA there on their own. What remains waived is the glyph wall: green at
2.80 — 3.06 before its hue rotation — and whatever a consumer points the brand axis at. Both are in
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
system it documents instead of standing still while the components inside it shrink.

There is no page header. The two rails are each an `area-panel --xs --flush` carrying their
own bar, so the wordmark on the left and the panel title on the right derive the same height
from the same formula and sit on one line with the document between them. `--docs-chrome`
was retired with the header: a component's inset has to come from its own ramp, which is why
the panel's size tiers step on the *gutter* ramp rather than the flat spacing ramp — a
compact panel has to tighten like the controls inside it.

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

## Panel

**The inspector is a component, not a page layout.** `area-panel` is a titled surface of
rows that act on something beside it: Card presents content, Dialog interrupts, Panel sits
next to its subject and stays. It was `.docs-inspector` first, and everything in it turned
out to be a system decision rather than a site one — how a section is separated, how a bar
relates to a body, where a footer action sits — so it moved into the system and the docs
now use it like any other consumer. Both rails are `area-panel --flush`.

**A panel does not own its rows.** A row is `area-field --inline`, which is what gives every
control one left edge; the panel owns the container, the grouping and the seams. A control
that can fill its column does (`area-segmented --full-width` is the opt-in that puts a
segmented track's right edge on the select's above it); a switch or checkbox cannot fill and
sits at the column's start, so the left edge still holds.

**A section is a rule and a name, not a box.** Every inspector worth copying separates its
groups with a hairline rather than nesting each in a panel of its own, which is what keeps
eight groups from reading as eight cards inside one card. The last section drops its rule.

**Select is called Select.** A combobox is a text input with a list attached — filterable,
typeahead, `role="combobox"` — and this has no text entry, so the name would promise
behaviour that is not there. "Dropdown" names the popup's behaviour rather than the control,
and Menu already drops down. Radix, shadcn, Material, Primer, Ant, Chakra, Carbon and
Polaris all land on Select. If a searchable one is ever needed it is a *second* component
called Combobox, not a rename of this one.

## Docs CSS and the cascade

**`DOCS_CSS` lives in `area.base`, which loses to `area.components`.** The audit catches a
docs rule that names an `.area-*` class. It cannot catch one that names only a docs class on
an element that *also* carries an Area class — `.docs-sidebar` is an `area-panel`, and a
corner toggle is an `area-button`, so a `display` rule on either is just as dead. Both were
written that way first and both silently did nothing.

The sanctioned door is **`@layer area.utilities`**, which the layer order puts after
components precisely so a rule like this can win without `!important`. `DOCS_CSS` closes its
base layer and opens a small utilities block for exactly the rules that must beat a
component: rail visibility, and nothing else.

**A backtick anywhere inside `DOCS_CSS` or `DOCS_SCRIPT` ends the template literal** — a
comment quoting a class name is enough. Node then reports a syntax error on whatever word
follows, which says nothing about the cause. The dogfood audit now checks for this as text,
before it imports the file, because a file with this fault cannot be imported at all.

## The inspector

The docs' right rail is a persistent inspector, the way Figma and Framer both put controls
beside the thing they act on rather than in a drawer over it. It replaced a drop-down strip
of eight identical segmented controls, and it replaced the on-this-page column — an outline
is read once on arrival, where a panel of controls is returned to, so the outline became a
wrapping strip under the lede (`area-menu--inline --row`) and the rail went to the controls.

**Which control an axis gets is decided by the shape of its values, never by uniformity.**

| shape of the set | control | axes |
| --- | --- | --- |
| two states, one of them "on" | Switch | theme |
| short, unordered, tiny labels | Segmented | neutral, density |
| long and unordered | Chip | accent — eleven hues |
| labels that will not fit a track | Select | typography, surface, motion |
| an ordered ramp with a direction | Slider | radius — 0 to pill |

Eight segmented controls said every axis was the same kind of choice. They are not: radius
is a ramp you scrub, accent is a palette you pick from, and dark mode is a thing you turn on.

**Every control declares `data-axis` and every option `data-value`**, so one delegated
listener drives all five shapes and the shape is read off the markup — a `<select>`, an
input with `data-on`, one with `data-values`, or a group with `[data-value]` children. A
control can be swapped for another without touching the script. The customizer dialog is
handed the docked inspector's own body rather than a second set of controls, so an axis with
two controls on screen stays in sync through one `sync()`.

**The radius slider runs over preset indices, not over radius values.** The ramp ends in
`pill`, which is not a number, and the numeric steps are not evenly spaced either. An index
keeps every stop one notch apart, which is what a scrub should feel like.

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
