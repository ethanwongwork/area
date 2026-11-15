# File page spec

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
  crease (#d9dde3). — superseded the same day (next entries): whole-pixel edges; flap #f0f1f4 → #f6f7f9.
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

Draws a file as a figure for icon views at 48 and up: a page with its top corner folded and one content mark for the
file's type (round 56: no extension text), or an image of the file filling the page. Decorative unless named. The 16px glyphs stay the icons for rows
and menus.

## Variants

| Axis | Value | Justification |
|---|---|---|
| size | sm 48 · md 64 · lg 96, unset follows `--area-folder-size` | Folder's sizes (Finder iconSize 64) |
| icon | one content mark per type (`text-align-left` for text and PDF, `table`, `presentation`, `image`, `play`, `code`, `archive`), never a `file-*` page icon; none for an unknown type | Finder's glyph; Drive, Fluent, Atlassian, ChatGPT: one mark per type (docs/research/file-figures-2026-10-19.md) |
| label | deprecated (round 56): the extension, still drawn if passed | Finder alone prints it; the tile's name shows it |
| preview | an image URL, clipped to the page, in place of the glyph and label | Finder's previews fill the page; the Brand tab shows real images as plain tiles instead |
| variant | outline (default): the page and flap flat in `bg-component`, one whole-pixel `border` edge (page edge, crease and diagonal drawn after the flap), no shadow · solid: the lit page with the shaded flap and Folder's shadow, no edge | owner 2026-10-18 ("make the outline appearance the default"); Folder's variants |

## Decisions

| Slot · property | Area value | Basis |
|---|---|---|
| page | a 360 × 440 drawing, 72% of the box wide, height 440/360 of that, both rounded to even pixels, centred (70 × 86 at 96, 46 × 56 at 64, 34 × 42 at 48) | Finder 344 × 454 of 512, made fuller |
| corners · fold | corners 40 of 360; the fold 108 along one diagonal (246,6 → 354,114), creasing round at 32 | owner 2026-10-18 |
| solid paint | page #ffffff → #f4f5f7; flap #f0f1f4 at the crease → #f6f7f9; Folder's shadow (0 2% 4.5% black 12%); fixed paint in both themes | owner 2026-10-18; coherence pass 2026-10-19 |
| outline | page and flap `bg-component`; edge `border`; glyph and label ink `fg-muted` mixed 45% toward the fill; no shadow | coherence pass 2026-10-19 (was `bg-subtle`, #b0b0b6) |
| edge | max(`stroke-width`, size / 96 rounded down to a whole pixel) | Folder's edge; coherence pass (was `max(1px, …)`) |
| glyph | 32% of the box (even pixels), its line the edge width as a non-scaling stroke, in both variants; solid ink #b4b4b8 | Finder's #b6b6b6, 26%; owner: one weight for every stroke |
| label | the extension in caps, 13% of the box (cap ≈ 9%), regular, line 1, cap-trimmed, no tracking: Folder's count type | owner 2026-10-18 |
| content | glyph over label, one centred column, gap 6% of the box, padded 6% down to clear the fold | owner 2026-10-18 ("more centered together") |

## Behavior and accessibility

Decorative by default (`aria-hidden`): the tile's name says what it is. With `aria-label` (or the deprecated `name`) it is `role="img"` with that name.
Forced colours drop the shadow, paint the page and flap Canvas with CanvasText lines, and the glyph and label CanvasText.

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

The outline and outline edge rows are superseded by the coherence pass (2026-10-19); Decisions holds the current values.

## Open

- Owner: whether the label shows at sm (it is about 5px there).

## Coherence pass, 2026-10-19

With Folder (docs/specs/folder.md, "Coherence pass"): the outline fill is `bg-component`, the glyph and label ink is muted
mixed 45% toward it, the edge builds on `--area-stroke-width`. The solid page stays an illustration in fixed paint, as
Finder's does in dark. Corners are part of the drawing (in proportion to the box), not the Radius setting, as icons.

## Review note, 2026-10-18 (round 48)

- **What changed:** New. Files in an icon view get a page figure beside the Folder: a soft white page with a folded
  corner, the type glyph drawn thin (about 1.25px) in the middle and the extension under it. Cleaned up to match the
  folder after a survey of Finder, Fluent, Drive, Material, Lucide and Phosphor: near-flat page, a light flap, a corner
  a little smaller than the folder's (as Finder's), whole-pixel outline edges with one diagonal, and the extension in
  the same type as Folder's count.
- **Why:** The file glyphs were 16px icons scaled up (a 2.5px line) and sat lower than their neighbours. Finder draws a
  document as a page, so Area does too.
- 2026-10-19 · design-system audit → `aria-label` names the figure (and a passed `aria-label` is no longer hidden by
  `aria-hidden`); `name` stays as a deprecated alias, since File tile's `name` is visible text.

## Review note, 2026-10-19 (round 56)

- **What changed:** The page shows one content mark per type and no extension text: lines for documents and PDF, a table for a spreadsheet, an image, and so on, centred on the page. `label` is deprecated. The demos no longer put a page icon inside the page.
- **Why:** You asked why the PDF had its letters inside the glyph and no text while the document had a glyph and text, and preferred just icons. The demos passed two kinds of glyph (a `file-*` page with letters, and a plain page plus a label). Every product surveyed except Finder draws one mark per type with no extension text (docs/research/file-figures-2026-10-19.md); the tile's name already shows the extension.

## Review note, 2026-10-19 (round 57)

- **What changed:** The page is blank by default; a content mark appears only where the page alone would not say what the file is (a spreadsheet in the gallery), and it sits in the middle of the page below the fold, not the middle of the whole page. Images now use the new File image.
- **Why:** You asked for the icon centred more in the lower part of the document and no icons when they aren't necessary. The tile's name already says a file is a PDF or a document; the fold takes the top 26% of the page, so the mark now centres in the 74% under it.

## Review note, 2026-10-19 (round 58)

- **What changed:** the lit solid page is archived; every page is the outline one. The old props are accepted and ignored.
- **Why:** you asked to remove the solid variant from every file figure and archive it
  (docs/archive/solid-file-figures-2026-10-19.md).
- 2026-11-11 · system evaluation A11.3 · the glyph snaps to a native size: 32 at 96 (was 30); 16 at 48 and 20 at 64 unchanged.

## Review note, 2026-11-11 (type rules, plan A9)

- **What changed:** the extension label is documented as artwork, as Folder's count: drawn to the page's scale, under the 10 px floor, inside the page's image (role img) or an aria-hidden page (plan A9.9, finding T22).
- **Why:** the system evaluation's type rules (docs/research/system-evaluation-2026-11-11, section 5, A9), owner-approved
  2026-11-11; the rules are in DESIGN_SYSTEM.md ("Ink and weight", "Size and shape", "Text pairs") and the type skill.
