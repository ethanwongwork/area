# File page spec

**Status:** accepted · 2026-10-19 (round 48)
**Captures:** Finder's live document icons drawn at 512 with `NSWorkspace.shared.icon(forFile:)` (macOS 27.2) for
empty `.txt`, `.pdf`, `.docx`, `.png`, `.zip` and an unknown extension; no web captures.
**Peers:** Folder (same box, shadow and corner family), File tile (its host), the `@area/icons` file glyphs.

## Owner decisions

- 2026-10-18: "the icons for the other files that arent folders look way too thick and arent correctly positioned."
  (File tiles drew a 16px-grid glyph scaled to 40, a 2.5px line; and ListBox's grid centred tiles in their rows.)
- 2026-10-18, same message, for Folder and so for its sibling: "more round … more large … gradients, shadows, more soft
  and the colors brighter."
- 2026-10-18, later: "clean up the document illustration so it matches the folder illustration". Corners 54 (the same
  size on screen as Folder's 56), a larger fold rounded at its crease, lit from the top like the folder, no edge lines,
  Folder's shadow; and an outline variant to pair with Folder's.
- 2026-10-18, later: "the fold stroke for the document is doubled, for the outline version … i want the strokes to be
  thinner. the fold for the nonoutline version seems a bit off." The flap now shares the page's one diagonal (246,6 →
  354,114, rounded at both ends) and creases round at 32; the outline strokes only the page and the flap's two inner
  edges; edges are clamp(0.75px, 0.85% of the size, 2px); the solid flap shades from its lit edge (#fbfbfc) to its
  crease (#d9dde3).
- 2026-10-18, later: "the gradient on the normal document is a bit strong/too dark on the dark end … make the fold
  gradient darkest color much lighter … strokes are very inconsistent … the text size of the number and PNG should be
  more consistent". From the survey: the page near flat (#ffffff → #fbfbfc, about 1 L; Finder 0.7), the flap 4–5 L
  under it at its crease (#eceef1 → #f7f8f9), whole-pixel outline edges, corners 40 (Folder's 1.4× on screen, as
  Finder's 27 vs 14), the label in Folder's count type.
- 2026-10-18, later: "the fold stroke is still too thin for the document on the top. i want the gradient for the folded
  part to be even more subtle. the actual page part can have a slightly more obvious gradient. also the placement of the
  text and the icon can be more centered together. also is the text style for PNG and 5 the same?" The outline draws the
  diagonal again over the page's edge at 1.35× (a 45° line at one width reads lighter); page #ffffff → #f4f5f7 (3.5 L),
  flap #f0f1f4 → #f6f7f9 (2 L); glyph and label in one centred column (gap 6% of the box, nudged 6% down to clear the
  fold); the label's tracking removed, so it and Folder's count share font, size (13% of the box), weight (regular),
  leading and cap trim exactly.

- 2026-10-18, later: "the stroke is too thick now" (the diagonal at 1.35×): 1.15×. "make the outline appearance the
  default": `variant` defaults to outline; solid is the alternate.

- 2026-10-18, later: "i just want all the strokes to be the same weight." The heavier diagonal is gone, and the glyph's
  lines take the outline's edge (`--_edge`, a whole pixel) as a non-scaling stroke, so every line in the figure is one
  weight at every size.

- 2026-10-18, later: "does this look equal to you?" (the diagonal against the straight edges). No: measured in a 2×
  capture, the diagonal carried 1.6 device pixels of ink per pixel of length against 2.0 for the straight edges, because
  the flap's fill was painted over the page's edge and hid the inner half of the diagonal stroke. The outline now draws
  its edge (open at the fold), the crease and the diagonal after the flap, all at the one edge width: diagonal 2.17,
  crease 2.21, edges 2.0–2.3. (A wider overlay was tried and rejected: 1.05× already measured 2.3.)

## Job and boundaries

Draws a file as a figure for icon views at 48 and up: a page with its top corner folded, the file's type glyph and its
extension, or an image of the file filling the page. Decorative unless named. The 16px glyphs stay the icons for rows
and menus.

## Variants

| Axis | Value | Justification |
|---|---|---|
| size | sm 48 · md 64 · lg 96, unset follows `--area-folder-size` | Folder's sizes (Finder iconSize 64) |
| icon | any `@area/icons` glyph | Finder draws the type's glyph in the middle (text lines, picture, zip) |
| label | the extension | Finder prints it under the glyph (PDF, DOCX, PNG, ZIP) |
| preview | an image URL | Finder's previews fill the page; the Brand tab shows real images as plain tiles instead |

## Measurements

| Value | Area | Source |
|---|---|---|
| page in its box | 72 × 88%, centred (6% / 14% in) | Finder 344 × 454 of 512 (5.7% / 16.4% in), made fuller |
| fold | 108 of 360 along one shared diagonal, crease radius 32 | Finder: top edge cut from x 296 to the side by y ~160, 38% of the page |
| corners | 40 of 360 (11%; Folder's corner is 1.4× on screen) | Finder 4.3–4.8% and its folder 1.9× the page; outline sets 9–13% (survey) |
| paint | #ffffff → #f4f5f7 (3.5 L); no edge; flap #f0f1f4 at the crease → #f6f7f9 (2 L) | Finder: page ΔL 0.7, flap L92 on L96.5; Fluent flat; owner: page a little more, flap less |
| outline | `bg-subtle` page and fold, `border` edge, glyph and label #b0b0b6 | Folder's outline |
| shadow | Folder's: 0 2% 4.5% black 12% | Folder |
| glyph | 32% of the square, its line the outline's edge (1px to 191, non-scaling) | Finder's glyph 132 of 512 (26%), #b6b6b6; owner: one weight for every stroke |
| label | 13% of the box (cap ≈ 9%), regular, no tracking, under the glyph in one centred column (gap 6%); identical to Folder's count | Finder: cap 8–9% of the icon, regular, 7% up, ~22 L under the page |
| outline edge | max(1px, 1px per 96 of the size, whole pixels) | Fluent 1px at 48, 2px at 64–96 |

## Open

- Owner: whether the label shows at sm (it is about 5px there).

## Review note, 2026-10-18 (round 48)

- **What changed:** New. Files in an icon view get a page figure beside the Folder: a soft white page with a folded
  corner, the type glyph drawn thin (about 1.25px) in the middle and the extension under it. Cleaned up to match the
  folder after a survey of Finder, Fluent, Drive, Material, Lucide and Phosphor: near-flat page, a light flap, a corner
  a little smaller than the folder's (as Finder's), whole-pixel outline edges with one diagonal, and the extension in
  the same type as Folder's count.
- **Why:** The file glyphs were 16px icons scaled up (a 2.5px line) and sat lower than their neighbours. Finder draws a
  document as a page, so Area does too.
