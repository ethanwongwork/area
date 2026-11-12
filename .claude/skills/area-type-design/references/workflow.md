# Type design workflow

Adapted from Nicolas Massi's `type-design-workflows.md` (Apache-2.0; see NOTICE.md), rewritten for a face drawn in
code. Establish the design system first; tools second.

## Diagnose

Define use, sizes, scripts, weight and width range, and voice before drawing (the plan's brief does this for Area
Serif: interface text at 12–16 px first, display through optical size later). Inspect groups, not isolated glyphs:

- Core: `H O n o`
- Distinctive: `a g R Q S G &`
- Diagonals: `A V W X Y v w x y`
- Figures: `0 1 2 3 4 6 7 8 9`
- Texture: words, paragraphs, punctuation, mixed case, at 12, 13, 14 and 16 px

Classify before acting:

- **Structural:** skeleton, construction, proportions, width system, vertical metrics, stress.
- **Modulating:** weight, contrast, tension, counters, apertures, terminals, joins.
- **Textural:** spacing, rhythm, color, kerning behavior.
- **Production:** compatibility, components, anchors, features, naming, export.

## Core and families

`H O n o` define straight and round stems, overshoot, counters, proportions and sidebearings. Resolve them before
anything else. Measure stems, but judge optical weight and inside white: rounds need more weight than straights to
look equal (Area Serif: o 88 against n 80), diagonals and crowded joins need less.

Work by family, one representative first:

1. Core: `H O n o`
2. Round and spine: `c e s a g C G S Q`
3. Arch and stem: `h m u r b d p q`
4. Diagonal: `v w x y z A V W X Y`
5. Figures, punctuation, symbols, marks

Related glyphs inherit principles, not coordinates. Check construction pairs together: `b d p q`, `h n m u`, `O Q`,
`6 9`, `0 O`, `1 l I`, quotes and brackets. Similar is a constraint, not proof that widths must match.

## Spacing

Spacing makes the rhythm; kerning only fixes exceptions.

1. Straight references from `H` and `n`; round references from `O` and `o`.
2. Space every other glyph by edge type: straight, round, diagonal, open, irregular. A side borrows the value of the
   standard it resembles (left of b from n, right of b from o).
3. Test `nnonoo`, `HHOHOO`, then three-at-a-time strings, words and paragraphs at the target sizes.
4. Check word space, punctuation, figures and mixed case.

Compare apparent white, not sidebearing numbers. Keep ratios across masters rather than identical numbers. Text
sizes want a slightly open fit; the display master tightens it.

## Kerning

Only after spacing and groups are stable.

1. Groups from shared left and right edge behavior; accented letters join their base's group.
2. Preview `AV AT To Ta Va Yo LT P, r. f)` and punctuation pairs.
3. Group pairs first; glyph exceptions only where the shape truly differs.
4. Never kern tabular figures. No pair moves more than about 40% of a glyph's width.
5. Check every pair in every master: no sign flips, no jumps between instances.

Many exceptions mean unresolved spacing or grouping.

## Weight, color, curves

Color is outline mass, counters, spacing, word space and line spacing together. A glyph with a plausible density
number can still break a line. Judge it in strings.

Keep smooth joins intentional and handles economical. Judge how a curve accelerates into a straight, not node counts.
Rounds overshoot flat zones; points overshoot more. Junction thinning is a design choice, but related joins behave
alike. Clean joins can still clog at 12 px; check at size.

## Features

Area Serif's list is in the plan ("Alternates, ligatures and features"). Write feature code in `build.py` from named
glyphs only. Every stylistic set gets a `featureNames` name once final. Contextual features must never change
interface strings as they are typed (arrows and similar substitutions stay opt-in).

## Masters and the variable font

Before interpolating, verify matching contours, node counts and order, start points, node types, directions, anchors
and components. The kit's functions guarantee this only if every master runs the same code path: never branch a
glyph's structure on a master's value. Then look at intermediate instances, not only the masters.

Keep three questions apart: structural compatibility (fontTools `varLib.interpolatable`), interpolation quality (look),
and variable-table validity (fontbakery's variable checks). A compatibility pass answers only the first. Use feature
variations (alternate glyphs at a weight) only when interpolation cannot keep the construction, and test both sides of
the switch. Italic is its own font.

## Production checklist

Compatibility and interpolation; open paths, direction, overlaps, short segments; metrics, overshoots, vertical
metrics; names, Unicode values, components, anchors, coverage; spacing, groups, kerning across masters; features,
style linking, naming, weight classes; `.notdef`, spaces, figures, punctuation, ligatures, marks. Fix errors first, then
warnings, then polish.

## Visual validation

Compare before and after with the same strings and sizes (diffenator2 does this between builds). Stop propagating
when compatibility breaks, rhythm collapses, color goes uneven, or the change can no longer be explained.
