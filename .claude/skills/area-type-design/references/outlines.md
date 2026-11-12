# Outlines

The drawing rules behind `kit.py`, and what each `pathlint.py` message means. Concepts follow Glyphs' "Drawing good
paths" and the path-quality notes in Thierry Charbonnel's Glyphs MCP skills (see NOTICE.md); the checks are Area's own
code.

## Rules

- **Cubic sources, integer coordinates.** ufo2ft converts to quadratic TrueType at build. `Contour.draw()` rounds.
- **Nodes at extremes.** A node at every horizontal and vertical extreme of a curve longer than about 40 units, with
  handles exactly horizontal or vertical there. Not on very shallow curves.
- **Handles inside the triangle.** A curve's two handles point at a common meeting point; neither runs past it, or the
  curve bulges, kinks or loops.
- **Inflections only where the shape turns**, at the spine of `s S 2 5 8 § $ &`, placed at the true inflection.
- **Overlaps kept in sources.** Stems, bowls, serifs, ears and terminals are separate contours; the build removes
  overlaps for static fonts. Variable fonts keep overlaps and need the overlap flag.
- **Direction.** Sources: outer counter-clockwise, counters clockwise (`Contour.oriented()`). TrueType after overlap
  removal: the reverse.
- **Same structure in every master.** Same contours, order, node counts, node types and start points.
- **Rounded corners** (`Contour.rounded()`) need a straight or near-straight run on both sides longer than the radius.

## `pathlint.py` messages

| Class | Message | Meaning and usual fix |
|---|---|---|
| ERROR | open contour | A contour not closed. Close it. |
| ERROR | point off the integer grid | A source coordinate not rounded. Round in `Contour.draw()` or the glyph. |
| ERROR | winding is reversed for its nesting depth (built) | After overlap removal a contour runs the wrong way; something rendered as a hole or a fill by mistake. Fix the source contour's orientation. |
| WARNING | segment only N units long | Usually two nodes almost on top of each other. Merge them, unless it is a deliberate tiny cut. |
| WARNING | handle runs past the handles' meeting point | The curve may bump or loop. Shorten the handle or move the node. Sometimes intended at tight joins; say so. |
| WARNING | no node at x/y-extreme near (x, y) | Add a node there with a flat handle, or split the curve. Tails and terminals are the usual offenders. |
| INFO | N inflection(s) inside the curve | Fine on a spine; elsewhere it usually means a wobble. |
| INFO | zero-length handle | A curve with a retracted handle. Fine at a corner, a smell inside a smooth curve. |

Numbers are evidence, not verdicts. A WARNING kept on purpose gets a comment in the glyph saying why.
